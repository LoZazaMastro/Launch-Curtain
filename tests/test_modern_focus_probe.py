"""Run the actual backend methods without Windows calls or Decky import side effects."""
import ast
import unittest
from pathlib import Path
from types import SimpleNamespace

SOURCE = Path(__file__).parents[1] / "main.py"

class FocusProbeTests(unittest.TestCase):
    def setUp(self):
        tree = ast.parse(SOURCE.read_text(encoding="utf-8-sig"))
        methods = [node for cls in tree.body if isinstance(cls, ast.ClassDef) for node in cls.body
                   if isinstance(node, ast.FunctionDef) and node.name in {"_modern_candidate_focus_probe", "_protect_modern_curtain"}]
        self.assertEqual(len(methods), 2)
        self.now = 10.0
        self.calls = []
        self.windows = [11]
        self.auxiliary = False
        self.focused = True
        self.large_surface = True
        scope = {"time": SimpleNamespace(time=lambda: self.now), "_is_windows": lambda: True,
                 "_windows_for_pid": lambda pid, limit=12: self.windows,
                 "_window_is_auxiliary_game_surface": lambda hwnd: self.auxiliary,
                 "_window_is_process_ready_game_surface": lambda hwnd: self.large_surface,
                 "_visible_windows": lambda limit=140: [], "LAUNCHER_TITLE_HINTS": [],
                 "STEAM_PROCESS_NAMES": {"steam.exe"}, "_log_info": lambda message: None,
                 "_log_warning": lambda message: self.fail(message),
                 "_focus_window": lambda hwnd: (self.calls.append(("focus", hwnd)), self.focused)[1],
                 "_set_window_topmost": lambda hwnd, value: self.calls.append(("topmost", hwnd, value))}
        module = ast.Module(body=[ast.ImportFrom(module="__future__", names=[ast.alias(name="annotations")], level=0), ast.ClassDef(name="Backend", bases=[], keywords=[], body=methods, decorator_list=[])], type_ignores=[])
        exec(compile(ast.fix_missing_locations(module), str(SOURCE), "exec"), scope)
        self.backend = scope["Backend"]()
        self.backend.modern_active = True
        self.backend.modern_release_after = 0
        self.backend.last_modern_cover_refocus_at = 0
        self.backend.last_modern_cover_refocus_log_at = 0
        self.backend.launch_game_candidates = {7: {"first_seen": 1, "protected_hwnd": 11, "protected_process": "rap64.exe", "protected_title": "Game", "surfaces": {"11": {"first_seen": 2, "last_geometry_change": 2}}}}
        self.backend._pin_steam_for_modern_curtain = lambda: (self.calls.append(("pin", 99)), 99)[1]
        self.processes = {7: {}}

    def protect(self):
        self.backend._protect_modern_curtain({"process": "rap64.exe"}, set(), self.processes)

    def test_probe_keeps_existing_cover_and_does_not_refocus_or_demote(self):
        self.protect()
        self.assertEqual(self.calls, [("pin", 99), ("focus", 11)])
        self.calls.clear(); self.now += .4; self.protect()
        self.assertEqual(self.calls, [], "no Steam activation or game demotion during probe")

    def test_deadline_restores_protection_and_does_not_repeat_same_hwnd(self):
        self.protect(); self.calls.clear(); self.now += .9; self.protect()
        self.assertEqual(self.calls, [("pin", 99), ("focus", 99)])
        self.calls.clear(); self.now += .2; self.protect()
        self.assertNotIn(("focus", 11), self.calls)

    def test_destroyed_hwnd_cancels_probe_immediately(self):
        self.protect(); self.windows = []; self.calls.clear(); self.now += .1; self.protect()
        self.assertIn(("focus", 99), self.calls)

    def test_auxiliary_or_unstable_surface_never_gets_probe(self):
        self.auxiliary = True; self.protect(); self.assertNotIn(("focus", 11), self.calls)
        self.auxiliary = False; self.calls.clear()
        self.backend.launch_game_candidates[7]["surfaces"]["11"]["last_geometry_change"] = self.now
        self.protect(); self.assertNotIn(("focus", 11), self.calls)

    def test_failed_focus_returns_to_protection_in_same_tick(self):
        self.focused = False; self.protect()
        self.assertEqual(self.calls, [("pin", 99), ("focus", 11), ("pin", 99), ("focus", 99)])

    def test_rap64_initial_render_window_on_4k_gets_probe_but_small_splash_does_not(self):
        self.large_surface = False
        candidate = self.backend.launch_game_candidates[7]
        candidate["protected_process"] = "raproject64.exe"
        surface = candidate["surfaces"]["11"]
        surface["geometry"] = (0, 0, 300, 100)
        self.protect()
        self.assertNotIn(("focus", 11), self.calls)
        self.calls.clear()
        surface["geometry"] = (0, 0, 711, 576)
        self.protect()
        self.assertIn(("focus", 11), self.calls)

    def test_fade_handoff_does_not_start_a_probe(self):
        self.backend.modern_release_after = 11; self.protect()
        self.assertNotIn(("focus", 11), self.calls)

if __name__ == "__main__":
    unittest.main()
