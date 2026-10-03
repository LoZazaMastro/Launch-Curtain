"""Exercise the production monitor with deterministic Steam/Windows boundaries."""
import ast
import asyncio
import unittest
from pathlib import Path
from types import SimpleNamespace

SOURCE = Path(__file__).parents[1] / "main.py"


class IdleMonitorTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        names = {"__init__", "_ensure_monitor", "_monitor_has_work", "_monitor_exit_tracking_only", "_monitor_foreground",
                 "_is_curtain_running", "get_status", "_monitor_process_launches", "_restore_steam_focus_after_game_exit",
                 "_release_unconfirmed_modern_launch", "launch_requested"}
        tree = ast.parse(SOURCE.read_text(encoding="utf-8-sig"))
        methods = [node for cls in tree.body if isinstance(cls, ast.ClassDef) and cls.name == "Plugin"
                   for node in cls.body if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name in names]
        self.assertEqual(len(methods), len(names))
        self.snapshots = 0
        self.windows = 0
        self.now = 10000.0
        def snapshot():
            self.snapshots += 1
            raise asyncio.CancelledError()
        def window():
            self.windows += 1
            return {"hwnd": 10}
        scope = {"asyncio": asyncio, "time": SimpleNamespace(time=lambda: self.now),
                 "sys": SimpleNamespace(platform="win32"), "DEFAULT_SETTINGS": {"auto_mode": True, "launcher_processes": []},
                 "_log_info": lambda text: None, "_log_warning": lambda text: self.fail(text),
                 "MODERN_SPECULATIVE_SECONDS": 2.5, "_normalize_app_id": lambda value: int(value) if value else None,
                 "_process_snapshot": snapshot, "_foreground_window": window,
                 "_visible_windows": lambda limit: [window()], "_is_windows": lambda: True,
                 "STEAM_PROCESS_NAMES": {"steam.exe"}, "IGNORED_LAUNCH_CHILDREN": set(),
                 "_is_transient_launch_process": lambda name: False,
                 "_process_started_at": lambda pid: {2: self.now - 600, 3: self.now - .5}.get(pid, 0)}
        module = ast.Module(body=[ast.ImportFrom(module="__future__", names=[ast.alias(name="annotations")], level=0),
                                 ast.ClassDef(name="Backend", bases=[], keywords=[], body=methods, decorator_list=[])], type_ignores=[])
        exec(compile(ast.fix_missing_locations(module), str(SOURCE), "exec"), scope)
        self.scope = scope
        self.backend = scope["Backend"]()
        self.backend._soundbite_is_playing = lambda: False

    async def asyncTearDown(self):
        task = self.backend.monitor_task
        if task:
            task.cancel()
            await asyncio.gather(task, return_exceptions=True)

    async def test_idle_monitor_waits_without_process_scans_or_timer_wakeups(self):
        self.backend._ensure_monitor()
        for _ in range(10):
            await asyncio.sleep(0)
        self.assertEqual(self.snapshots, 0)
        self.assertFalse(self.backend.monitor_task.done())
        self.assertFalse(self.backend.monitor_wake.is_set())

    async def test_launch_wakes_existing_monitor_immediately(self):
        self.backend._ensure_monitor()
        await asyncio.sleep(0)
        task = self.backend.monitor_task
        self.backend.modern_active = True
        self.backend._ensure_monitor()
        await asyncio.sleep(0)
        self.assertIs(self.backend.monitor_task, task)
        self.assertEqual(self.snapshots, 1)

    async def test_regular_status_has_no_window_enumeration(self):
        for _ in range(100):
            status = await self.backend.get_status()
            self.assertFalse(status["game_running"])
        self.assertEqual(self.windows, 0)
        await self.backend.get_status(True)
        self.assertEqual(self.windows, 2)

    async def test_active_game_and_refocus_keep_monitor_awake(self):
        self.assertFalse(self.backend._monitor_has_work())
        self.backend.active_game_pids[3] = self.now
        self.assertTrue(self.backend._monitor_has_work())
        self.backend.active_game_pids.clear()
        self.backend.pending_steam_refocus_until = self.now + 4
        self.assertTrue(self.backend._monitor_has_work())

    async def test_idle_gap_ignores_old_children_but_keeps_just_launched_game(self):
        self.backend.launch_request_started_at = self.now
        self.backend.launch_pending_until = self.now + 20
        started = []
        async def launch(name, pid):
            started.append(pid)
        self.backend._start_curtain_for_detected_launch = launch
        processes = {1: {"pid": 1, "parent_pid": 0, "process": "steam.exe"},
                     2: {"pid": 2, "parent_pid": 1, "process": "old-helper.exe"},
                     3: {"pid": 3, "parent_pid": 1, "process": "game.exe"}}
        await self.backend._monitor_process_launches(processes, set())
        self.assertEqual(started, [3])
        self.assertEqual(list(self.backend.active_game_pids), [3])

    async def test_handed_off_game_keeps_exit_checks_without_launch_or_window_probes(self):
        self.backend.settings["curtain_mode"] = "modern"
        self.backend.active_game_pids[7] = self.now - 20
        calls = {"process": 0, "exit": 0, "launch": 0, "fullscreen": 0}
        def snapshot():
            calls["process"] += 1
            return {7: {"pid": 7, "process": "game.exe"}}
        async def restore(processes):
            calls["exit"] += 1
            self.assertIn(7, processes)
        async def launch(*args):
            calls["launch"] += 1
        async def sleep(delay):
            self.assertEqual(delay, .5)
            if calls["exit"] == 3:
                raise asyncio.CancelledError()
        self.scope["_process_snapshot"] = snapshot
        self.scope["asyncio"] = SimpleNamespace(sleep=sleep)
        self.backend._restore_steam_focus_after_game_exit = restore
        self.backend._monitor_process_launches = launch
        self.backend._find_fullscreen_game_window = lambda *args: calls.__setitem__("fullscreen", calls["fullscreen"] + 1)
        with self.assertRaises(asyncio.CancelledError):
            await self.backend._monitor_foreground()
        self.assertEqual(calls, {"process": 3, "exit": 3, "launch": 0, "fullscreen": 0})
        self.assertEqual(self.windows, 0)

    async def test_real_exit_restores_steam_once_then_monitor_returns_to_quiet_wait(self):
        self.backend.settings["curtain_mode"] = "modern"
        self.backend.active_game_pids[7] = self.now - 20
        calls = {"snapshots": 0, "focus": 0, "schedules": 0}
        def snapshot():
            calls["snapshots"] += 1
            return {7: {"pid": 7}} if calls["snapshots"] == 1 else {}
        def schedule(reason):
            calls["schedules"] += 1
            self.backend.pending_steam_refocus_until = self.now + 4
            self.backend.pending_steam_refocus_not_before = self.now
        self.scope["_process_snapshot"] = snapshot
        self.scope["_pid_has_visible_window"] = lambda pid: True
        self.scope["_find_steam_window"] = lambda: 99
        self.scope["_focus_window"] = lambda hwnd: (calls.__setitem__("focus", calls["focus"] + 1), True)[1]
        self.backend._visible_fullscreen_non_steam_window_exists = lambda: False
        self.backend._schedule_steam_refocus = schedule
        async def sleep(delay):
            self.now += delay
            await asyncio.sleep(0)
        self.scope["asyncio"] = SimpleNamespace(sleep=sleep)
        task = asyncio.create_task(self.backend._monitor_foreground())
        for _ in range(10):
            await asyncio.sleep(0)
        task.cancel()
        await asyncio.gather(task, return_exceptions=True)
        self.assertEqual(calls, {"snapshots": 2, "focus": 1, "schedules": 1})
        self.assertEqual(self.backend.active_game_pids, {})
        self.assertEqual(self.backend.pending_steam_refocus_until, 0)
        self.assertEqual(self.windows, 1, "foreground lookup occurs on real exit only")
        self.assertFalse(self.backend.monitor_wake.is_set())

    async def test_exit_fast_path_does_not_interrupt_new_launch_or_unreleased_cover(self):
        self.backend.active_game_pids[7] = self.now - 20
        self.assertTrue(self.backend._monitor_exit_tracking_only())
        for key, value in [("modern_active", True), ("modern_release_after", self.now + .5),
                           ("launch_pending_until", self.now + 20), ("modern_steam_topmost_hwnd", 99),
                           ("modern_hidden_launcher_windows", {11: True}), ("launch_black_bridge_until", self.now + 1)]:
            previous = getattr(self.backend, key)
            setattr(self.backend, key, value)
            self.assertFalse(self.backend._monitor_exit_tracking_only(), key)
            setattr(self.backend, key, previous)

    async def test_unconfirmed_prediction_releases_within_three_seconds(self):
        self.backend.modern_active = True
        self.backend.launch_request_started_at = self.now
        closes = []
        async def close():
            closes.append(self.now)
            self.backend.modern_active = False
        self.backend.hide_curtain = close
        self.now += 2.49
        self.assertFalse(await self.backend._release_unconfirmed_modern_launch())
        self.now += .02
        self.assertTrue(await self.backend._release_unconfirmed_modern_launch())
        self.assertEqual(len(closes), 1)
        self.assertFalse(await self.backend._release_unconfirmed_modern_launch())

    async def test_confirmed_slow_launch_and_real_evidence_keep_cover(self):
        self.backend.modern_active = True
        self.backend.launch_request_started_at = self.now - 30
        async def close():
            self.fail("Real launch must not use speculative expiry")
        self.backend.hide_curtain = close
        for key, value in [("launch_request_confirmed", True), ("launch_action_started_at", self.now - 20),
                           ("launch_process_seen", True), ("launch_game_candidates", {7: {}}), ("native_prompt_visible", True)]:
            previous = getattr(self.backend, key)
            setattr(self.backend, key, value)
            self.assertFalse(await self.backend._release_unconfirmed_modern_launch(), key)
            self.assertTrue((await self.backend.get_status())["modern_launch_confirmed"], key)
            setattr(self.backend, key, previous)

    async def test_duplicate_confirmed_request_promotes_speculative_launch(self):
        self.backend.current_launch_app_id = 123
        self.backend.modern_active = True
        self.backend.launch_request_started_at = self.now - .5
        self.backend._launch_response = lambda message: {"ok": True, "message": message}
        result = await self.backend.launch_requested({"app_id": 123, "reason": "SteamClient.Apps.RunGame", "confirmed_launch": True})
        self.assertTrue(result["ok"])
        self.assertTrue(self.backend.launch_request_confirmed)
        self.assertEqual(self.backend.launch_request_started_at, self.now - .5)
        self.now += 30
        self.assertFalse(await self.backend._release_unconfirmed_modern_launch())


if __name__ == "__main__":
    unittest.main()
