"""Production-linked COM identity admission without Decky imports or user assets."""
import ast
import asyncio
import os
import json
import re
import tempfile
import time
import unittest
from pathlib import Path
from types import SimpleNamespace
from typing import Any, Dict, List, Optional
from urllib.request import Request

SOURCE = Path(__file__).parents[1] / "main.py"

class VerifiedUwpTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        tree = ast.parse(SOURCE.read_text(encoding="utf-8-sig"))
        names = {"_is_transient_launch_process", "_verified_uwp_candidate", "_query_verified_uwp_session"}
        nodes = [n for n in tree.body if isinstance(n, ast.FunctionDef) and n.name in names]
        nodes += [n for n in tree.body if isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id.startswith("TRANSIENT_LAUNCH_PROCESS_") for t in n.targets)]
        methods = [n for c in tree.body if isinstance(c, ast.ClassDef) and c.name == "Plugin" for n in c.body if isinstance(n, ast.AsyncFunctionDef) and n.name == "_poll_verified_uwp_launch"]
        nodes.append(ast.ClassDef(name="Backend", bases=[], keywords=[], body=methods, decorator_list=[]))
        self.now = 10000.0
        self.calls = []
        self.started = []
        self.scope = dict(asyncio=asyncio, os=os, json=json, re=re, Request=Request,
                          Any=Any, Dict=Dict, List=List, Optional=Optional,
                          time=SimpleNamespace(time=lambda: self.now), _is_windows=lambda: True,
                          _log_info=lambda _: None, _process_started_at=lambda pid: self.now-1)
        exec(compile(ast.fix_missing_locations(ast.Module(body=nodes, type_ignores=[])), str(SOURCE), "exec"), self.scope)
        self.production_query = self.scope["_query_verified_uwp_session"]
        self.identity = dict(gamePid=7, gameBirth=int((self.now-1+11644473600)*10000000),
                             executable=r"C:\XboxGames\DOOM64\DOOM64_x64.exe", packageFamily="Bethesda_abc", aumid="Bethesda_abc!Game",
                             windows=[dict(pid=7, hwnd="123", process="DOOM64_x64.exe", title="DOOM64")])
        self.reply = [self.identity]
        def query(app):
            self.calls.append(app)
            return self.reply
        self.scope["_query_verified_uwp_session"] = query
        self.backend = self.scope["Backend"]()
        self.backend.current_launch_app_id = 12
        self.backend.launch_pending_until = self.now+75
        self.backend.launch_game_candidates = {}
        self.backend.active_game_pids = {}
        self.backend.launch_process_seen = False
        async def start(name, pid):
            self.started.append((name, pid))
            self.backend.launch_process_seen = True
        self.backend._start_curtain_for_detected_launch = start
        self.processes = {7: dict(pid=7, parent_pid=999, process="DOOM64_x64.exe")}

    async def test_verified_com_game_outside_steam_tree_is_admitted(self):
        await self.backend._poll_verified_uwp_launch(self.processes)
        self.assertEqual(self.started, [("DOOM64_x64.exe",7)])
        self.assertEqual(self.backend.launch_game_candidates[7]["verified_uwp_windows"], self.identity["windows"])

    async def test_idle_and_handoff_have_zero_queries(self):
        self.backend.launch_pending_until = 0
        await self.backend._poll_verified_uwp_launch(self.processes)
        self.assertEqual(self.calls, [])

    async def test_pending_poll_once_per_second(self):
        for _ in range(10): await self.backend._poll_verified_uwp_launch(self.processes)
        self.assertEqual(self.calls,[12])
        self.now += 1
        await self.backend._poll_verified_uwp_launch(self.processes)
        self.assertEqual(self.calls,[12,12])
        self.assertEqual(len(self.started),1)

    async def test_pid_reuse_rejects_returned_identity(self):
        self.identity["gameBirth"] += 10000000
        await self.backend._poll_verified_uwp_launch(self.processes)
        self.assertEqual(self.started,[])

    async def test_different_executable_rejected(self):
        self.processes[7]["process"]="other.exe"
        await self.backend._poll_verified_uwp_launch(self.processes)
        self.assertEqual(self.started,[])

    async def test_bootstrap_cannot_be_game_candidate(self):
        for name in ["gamingservicesui.exe","gamelaunchhelper.exe","playhub.gamesession.exe"]:
            self.assertTrue(self.scope["_is_transient_launch_process"](name))
        self.assertFalse(self.scope["_is_transient_launch_process"]("DOOM64_x64.exe"))

    async def test_missing_or_404_native_preserves_no_candidate(self):
        self.reply=[]
        await self.backend._poll_verified_uwp_launch(self.processes)
        self.assertEqual(self.started,[])
        self.assertEqual(self.backend.active_game_pids,{})

    async def test_cancellation_during_request_cannot_start_curtain(self):
        def query(app):
            self.backend.launch_pending_until=0
            return [self.identity]
        self.scope["_query_verified_uwp_session"]=query
        await self.backend._poll_verified_uwp_launch(self.processes)
        self.assertEqual(self.started,[])

    async def test_selected_app_change_discards_late_reply(self):
        def query(app):
            self.backend.current_launch_app_id=13
            return [self.identity]
        self.scope["_query_verified_uwp_session"]=query
        await self.backend._poll_verified_uwp_launch(self.processes)
        self.assertEqual(self.started,[])

    async def test_production_http_query_is_authenticated_and_404_is_optional(self):
        from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
        import threading
        observed=[]
        class Handler(BaseHTTPRequestHandler):
            def do_GET(inner):
                observed.append((inner.path, inner.headers.get("X-Playhub-Shell-Token")))
                if "appId=13" in inner.path:
                    inner.send_response(404); inner.end_headers(); return
                data=json.dumps(dict(appId=12,sessions=[self.identity])).encode()
                inner.send_response(200); inner.end_headers(); inner.wfile.write(data)
            def log_message(self,*args): pass
        server=ThreadingHTTPServer(("127.0.0.1",0),Handler)
        thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
        previous=os.environ.get("APPDATA")
        try:
            with tempfile.TemporaryDirectory() as directory:
                os.environ["APPDATA"]=directory
                config=Path(directory)/"GamingMode";config.mkdir()
                (config/"xbox-shell-token").write_text("A"*64)
                (config/"config.json").write_text(json.dumps(dict(safety=dict(apiPort=server.server_port))))
                self.assertEqual(self.production_query(12),[self.identity])
                self.assertEqual(self.production_query(13),[])
                self.assertEqual(observed[0],("/session/uwp?appId=12","A"*64))
                (config/"xbox-shell-token").write_text("bad")
                self.assertEqual(self.production_query(12),[])
                self.assertEqual(len(observed),2)
        finally:
            server.shutdown();server.server_close();thread.join(2)
            if previous is None: os.environ.pop("APPDATA",None)
            else: os.environ["APPDATA"]=previous

    async def test_missing_auth_file_is_optional_and_no_network(self):
        previous=os.environ.get("APPDATA")
        with tempfile.TemporaryDirectory() as directory:
            os.environ["APPDATA"]=directory
            try: self.assertEqual(self.production_query(12),[])
            finally:
                if previous is None: os.environ.pop("APPDATA",None)
                else: os.environ["APPDATA"]=previous

if __name__ == "__main__": unittest.main()
