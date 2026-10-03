"""Real backend methods and physical fixtures; no installed data or Steam changes."""
import ast
import asyncio
import hashlib
import io
import json
import os
import re
import sys
import tempfile
import threading
import time
import unittest
from pathlib import Path
from typing import Any, Dict, List, Optional
from unittest.mock import patch
from urllib.parse import urlparse, unquote
from urllib.request import Request

sys.path.insert(0, str(Path(__file__).parents[1]))
import managed_assets as assets

SOURCE = Path(__file__).parents[1] / "main.py"
URL = "https://assets.iisu.network/games/171040/soundbite/Y34XdIqp.mp3"
AUDIO = b"ID3\x03\x00\x00\x00\x00\x00\x00" + b"sample" * 20


def backend_scope(root):
    tree = ast.parse(SOURCE.read_text(encoding="utf-8-sig"))
    names = {"_download_soundbite_sync", "_iidb_is_probable_media_url", "_soundbite_reference_paths"}
    nodes = [n for n in tree.body if isinstance(n, ast.FunctionDef) and n.name in names]
    methods = {"download_iidb_soundbite", "_delete_managed_soundbite_file", "remove_iidb_soundbite", "clear_soundbite", "_save_settings_to_disk", "cleanup_unused_soundbites", "cleanup_unused_launch_images", "reset_game_settings"}
    nodes.append(ast.ClassDef(name="Backend", bases=[], keywords=[], decorator_list=[], body=[n for cls in tree.body if isinstance(cls, ast.ClassDef) and cls.name == "Plugin" for n in cls.body if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef)) and n.name in methods]))
    scope = dict(os=os, re=re, asyncio=asyncio, hashlib=hashlib, json=json, time=time,
                 Any=Any, Dict=Dict, List=List, Optional=Optional, Request=Request,
                 urlparse=urlparse, unquote=unquote, _managed_assets=assets,
                 IIDB_BASE_URL="https://iidb.iisu.network", IIDB_AUDIO_EXTENSIONS={".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac", ".webm"},
                 _soundbites_dir=lambda: str(root / "soundbites"), _launch_images_dir=lambda: str(root / "launch-images"),
                 _settings_path=lambda: str(root / "settings.json"), _log_info=lambda _: None, _log_warning=lambda _: None,
                 _normalize_app_id=lambda x: int(x) if x else None, _steam_root_candidates=lambda _: [str(root / "steam")])
    exec(compile(ast.fix_missing_locations(ast.Module(body=nodes, type_ignores=[])), str(SOURCE), "exec"), scope)
    return scope


class Response(io.BytesIO):
    def __init__(self, data=AUDIO, mime="audio/mpeg", url=URL):
        super().__init__(data); self.headers={"Content-Type": mime}; self.url=url
    def geturl(self): return self.url


def shortcut(appid):
    return b"\x00shortcuts\0\x000\0\x02appid\0" + appid.to_bytes(4, "little") + b"\x08\x08\x08"


class AssetTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="LC-managed-fixture-")
        self.root = Path(self.temp.name)
        self.scope = backend_scope(self.root)
        self.scope["urlopen"] = lambda *a, **k: Response()
        self.backend = self.scope["Backend"](); self.backend.settings={"per_game": {}}
        async def get(app): return {"settings": self.backend.settings["per_game"].get(str(app), {})}
        self.backend.get_game_settings = get
        self.backend._raw_game_settings = lambda app: self.backend.settings["per_game"].get(str(app), {})
        self.steam = self.root / "steam"; (self.steam / "steamapps").mkdir(parents=True)
        (self.steam / "steamapps" / "libraryfolders.vdf").write_text('"libraryfolders" { }')
        self.config = self.steam / "userdata" / "123" / "config"; self.config.mkdir(parents=True)
        (self.config / "shortcuts.vdf").write_bytes(shortcut(0x80000001))
        (self.steam / "steamapps" / "appmanifest_42.acf").write_text('"AppState" { "appid" "42" }')
    async def asyncTearDown(self): self.temp.cleanup()
    def media(self, app=42, digest="123456abcdef"):
        p=self.root / "soundbites" / str(app) / ("iidb-" + digest + ".mp3")
        p.parent.mkdir(parents=True, exist_ok=True); p.write_bytes(AUDIO); return str(p)
    def assignment(self, app, path, local=False):
        self.backend.settings["per_game"][str(app)]={"soundbite_path":path, "iidb_soundbite_managed":not local, "soundbite_source":"local" if local else "iidb", "volume":53}
    async def test_actual_download_publishes_audio_and_durable_assignment(self):
        result=await self.backend.download_iidb_soundbite({"app_id":42,"audio_url":URL})
        self.assertTrue(result["ok"]); self.assertEqual(Path(result["path"]).read_bytes(), AUDIO)
        self.assertEqual(json.loads((self.root/"settings.json").read_text())["per_game"]["42"]["soundbite_path"], result["path"])
        self.assertEqual(list(self.root.rglob("*.part")), [])
    async def test_download_failure_preserves_local_assignment_and_file(self):
        local=self.media(); self.assignment(42,local,True)
        self.scope["urlopen"]=lambda *a,**k: Response(b"<html>error</html>","text/html")
        result=await self.backend.download_iidb_soundbite({"app_id":42,"audio_url":URL})
        self.assertFalse(result["ok"]); self.assertEqual(self.backend.settings["per_game"]["42"]["soundbite_path"],local); self.assertTrue(Path(local).exists())
    async def test_false_audio_mime_is_not_success(self):
        self.scope["urlopen"]=lambda *a,**k: Response(b"{\"error\":true}")
        self.assertFalse((await self.backend.download_iidb_soundbite({"app_id":42,"audio_url":URL}))["ok"])
        self.assertEqual(self.backend.settings["per_game"],{})
    async def test_network_failure_has_no_assignment_or_partial_file(self):
        def fail(*a,**k): raise TimeoutError("fixture timeout")
        self.scope["urlopen"]=fail
        self.assertFalse((await self.backend.download_iidb_soundbite({"app_id":42,"audio_url":URL}))["ok"])
        self.assertEqual(self.backend.settings["per_game"],{}); self.assertEqual(list(self.root.rglob("*.part")),[])
    async def test_redirect_to_html_supporter_is_rejected(self):
        self.scope["urlopen"]=lambda *a,**k: Response(url="https://ko-fi.com/iisu")
        self.assertFalse((await self.backend.download_iidb_soundbite({"app_id":42,"audio_url":URL}))["ok"])
    async def test_failed_settings_save_rolls_back_assignment(self):
        self.assignment(42,self.media(),True); original=dict(self.backend.settings["per_game"]["42"])
        def fail(): raise OSError("fixture locked settings")
        self.backend._save_settings_to_disk=fail
        self.assertFalse((await self.backend.download_iidb_soundbite({"app_id":42,"audio_url":URL}))["ok"])
        self.assertEqual(self.backend.settings["per_game"]["42"],original)
    async def test_remove_iidb_does_not_remove_local_false_assignment(self):
        path=self.media(); self.assignment(42,path,True)
        result=await self.backend.remove_iidb_soundbite({"app_id":42})
        self.assertTrue(result["local_preserved"]); self.assertTrue(Path(path).exists()); self.assertIn("soundbite_path",self.backend.settings["per_game"]["42"])
    async def test_replacement_preserves_shared_reference(self):
        path=self.media(); self.assignment(42,path); self.assignment(43,path)
        self.assertTrue((await self.backend.download_iidb_soundbite({"app_id":42,"audio_url":URL}))["ok"])
        self.assertTrue(Path(path).exists())
    async def test_missing_games_removed_active_shared_local_and_unknown_preserved(self):
        missing=self.media(99); self.assignment(99,missing)
        present=self.media(42); self.assignment(42,present)
        shared=self.media(43); self.assignment(43,shared); self.assignment(42,shared)
        local=self.media(98); self.assignment(98,local,True)
        current=self.media(97); self.assignment(97,current); self.backend.current_launch_soundbite_path=current
        orphan=self.media(96); unknown=Path(orphan).with_name("my-local.mp3"); unknown.write_bytes(AUDIO)
        result=await self.backend.cleanup_unused_soundbites()
        self.assertTrue(result["ok"]); self.assertFalse(Path(missing).exists()); self.assertFalse(Path(orphan).exists())
        for p in (shared,local,current,str(unknown)): self.assertTrue(Path(p).exists(),p)
        self.assertEqual(self.backend.settings["per_game"]["99"],{"volume":53})
    async def test_dry_run_preserves_settings_and_physical_assets(self):
        path=self.media(99); self.assignment(99,path)
        original=json.dumps(self.backend.settings,sort_keys=True)
        result=await self.backend.cleanup_unused_soundbites({"dry_run":True})
        self.assertEqual(result["removed"],0); self.assertEqual(result["planned_files"],1)
        self.assertEqual(result["planned_bytes"],len(AUDIO)); self.assertEqual(result["planned_assignments"],1)
        self.assertEqual(json.dumps(self.backend.settings,sort_keys=True),original); self.assertTrue(Path(path).exists())
        self.assertFalse((self.root/"settings.json").exists())
    async def test_disconnected_library_keeps_missing_native_assignment(self):
        p=self.media(99); self.assignment(99,p)
        (self.steam/"steamapps"/"libraryfolders.vdf").write_text('"libraryfolders" { "1" { "path" "'+str(self.root/"offline").replace('\\','\\\\')+'" } }')
        result=await self.backend.cleanup_unused_soundbites()
        self.assertFalse(result["inventory_complete"]["steam"]); self.assertTrue(Path(p).exists())
    async def test_malformed_shortcuts_keep_missing_shortcut_assignment(self):
        p=self.media(0x80000002); self.assignment(0x80000002,p)
        (self.config/"shortcuts.vdf").write_bytes(b"\x00shortcuts\0\x000\0\x02appid")
        result=await self.backend.cleanup_unused_soundbites()
        self.assertFalse(result["inventory_complete"]["shortcuts"]); self.assertTrue(Path(p).exists())
    async def test_invalid_shortcut_identity_preserves_assigned_assets(self):
        path=self.media(0x80000002); self.assignment(0x80000002,path)
        for app_id in (0,42):
            (self.config/"shortcuts.vdf").write_bytes(shortcut(app_id))
            result=await self.backend.cleanup_unused_soundbites()
            self.assertFalse(result["inventory_complete"]["shortcuts"]); self.assertTrue(Path(path).exists())
    async def test_invalid_native_identity_preserves_assigned_assets(self):
        path=self.media(99); self.assignment(99,path)
        for app_id in (0,0x80000001):
            manifest=self.steam/"steamapps"/f"appmanifest_{app_id}.acf"
            manifest.write_text(f'"AppState" {{ "appid" "{app_id}" }}')
            result=await self.backend.cleanup_unused_soundbites()
            self.assertFalse(result["inventory_complete"]["steam"]); self.assertTrue(Path(path).exists())
    async def test_balanced_but_malformed_manifest_keeps_assignment(self):
        p=self.media(99); self.assignment(99,p)
        (self.steam/"steamapps"/"appmanifest_42.acf").write_text('garbage { "appid" "42" }')
        result=await self.backend.cleanup_unused_soundbites()
        self.assertFalse(result["inventory_complete"]["steam"]); self.assertTrue(Path(p).exists())
    async def test_no_inventory_proof_keeps_assigned_game(self):
        p=self.media(99); self.assignment(99,p)
        self.scope["_steam_root_candidates"]=lambda _: []
        result=await self.backend.cleanup_unused_soundbites()
        self.assertFalse(result["inventory_complete"]["steam"]); self.assertTrue(Path(p).exists())
    @unittest.skipUnless(sys.platform == "win32", "Windows junction fixture")
    async def test_junction_root_and_child_preserve_external_files(self):
        import _winapi
        outside=self.root/"outside"; outside.mkdir()
        sentinel=outside/"iidb-123456abcdef.mp3"; sentinel.write_bytes(AUDIO)
        linked=self.root/"linked"
        _winapi.CreateJunction(str(outside),str(linked))
        try:
            with self.assertRaises(ValueError): assets.cleanup({},linked,"soundbite",[],lambda:None)
            managed=self.root/"soundbites"; managed.mkdir()
            child=managed/"123"; _winapi.CreateJunction(str(outside),str(child))
            try:
                await self.backend.cleanup_unused_soundbites()
                self.assertEqual(sentinel.read_bytes(),AUDIO)
            finally: os.rmdir(child)
        finally: os.rmdir(linked)
    async def test_oversized_audio_cannot_publish(self):
        self.scope["urlopen"]=lambda *a,**k: Response(AUDIO+b"a"*(30*1024*1024))
        result=await self.backend.download_iidb_soundbite({"app_id":42,"audio_url":URL})
        self.assertFalse(result["ok"]); self.assertEqual(self.backend.settings["per_game"],{})
    async def test_credentials_noncdn_and_wrong_family_never_reach_network(self):
        def unexpected(*a,**k): self.fail("invalid URL performed a request")
        self.scope["urlopen"]=unexpected
        for url in ["https://assets.iisu.network@evil.invalid/games/1/soundbite/a.mp3", "https://user:password@assets.iisu.network/games/1/soundbite/a.mp3", "https://assets.iisu.network/games/1/banner/a.jpg"]:
            self.assertFalse((await self.backend.download_iidb_soundbite({"app_id":42,"audio_url":url}))["ok"])
    async def test_second_user_shortcut_preserved(self):
        config=self.steam/"userdata"/"456"/"config"; config.mkdir(parents=True)
        (config/"shortcuts.vdf").write_bytes(shortcut(0x80000002))
        p=self.media(0x80000002); self.assignment(0x80000002,p)
        await self.backend.cleanup_unused_soundbites(); self.assertTrue(Path(p).exists())
    async def test_cleanup_save_failure_does_not_delete_physical_assets(self):
        p=self.media(99); self.assignment(99,p); before=dict(self.backend.settings["per_game"]["99"])
        def fail(): raise OSError("fixture failed settings")
        self.backend._save_settings_to_disk=fail
        with self.assertRaises(OSError): await self.backend.cleanup_unused_soundbites()
        self.assertTrue(Path(p).exists()); self.assertEqual(self.backend.settings["per_game"]["99"],before)
    async def test_images_global_active_shared_unknown_and_outside_preserved(self):
        folder=self.root/"launch-images"; folder.mkdir()
        def image(n): p=folder/(str(n)+"-Game-1920x1080-1234abcd.png"); p.write_bytes(b"png"); return str(p)
        old=image(99); active=image(97); global_path=image(96); shared=image(94); local=folder/"user-photo.png"; local.write_bytes(b"png")
        self.backend.settings.update(fullscreen_image_path=global_path,per_game={"99":{"fullscreen_image_path":old,"iidb_asset_managed":True},"94":{"fullscreen_image_path":shared},"42":{"fullscreen_image_path":shared}})
        self.backend.current_launch_fullscreen_image_path=active
        result=await self.backend.cleanup_unused_launch_images()
        self.assertFalse(Path(old).exists())
        for p in (active,global_path,shared,str(local)): self.assertTrue(Path(p).exists())
        self.assertEqual(result["removed"],1)
    async def test_local_image_selection_with_generated_filename_is_preserved(self):
        folder=self.root/"launch-images"; folder.mkdir()
        path=folder/"99-Game-1920x1080-1234abcd.png"; path.write_bytes(b"local")
        self.backend.settings["per_game"]["99"]={"fullscreen_image_path":str(path)}
        result=await self.backend.cleanup_unused_launch_images()
        self.assertEqual(result["removed"],0); self.assertTrue(path.exists())
        self.assertEqual(self.backend.settings["per_game"]["99"]["fullscreen_image_path"],str(path))
    async def test_reset_waits_for_actual_download_transaction(self):
        loop=asyncio.get_running_loop(); started=asyncio.Event(); release=threading.Event()
        def response(*a,**k):
            loop.call_soon_threadsafe(started.set)
            if not release.wait(2): raise TimeoutError("fixture download was not released")
            return Response()
        self.scope["urlopen"]=response
        download=asyncio.create_task(self.backend.download_iidb_soundbite({"app_id":42,"audio_url":URL}))
        await started.wait()
        reset=asyncio.create_task(self.backend.reset_game_settings({"app_id":42}))
        await asyncio.sleep(0); self.assertFalse(reset.done())
        release.set(); self.assertTrue((await download)["ok"]); await reset
        self.assertNotIn("42",self.backend.settings["per_game"])
    async def test_atomic_failure_preserves_old_file_and_cleans_temporary(self):
        p=self.root/"file.json"; p.write_bytes(b"old")
        with patch.object(assets.os,"replace",side_effect=OSError("fixture fail")):
            with self.assertRaises(OSError): assets.atomic_write(p,b"new")
        self.assertEqual(p.read_bytes(),b"old"); self.assertEqual(list(self.root.glob("*.part")),[])
    async def test_cancelled_request_keeps_transaction_until_worker_finishes(self):
        started=asyncio.Event(); release=asyncio.Event(); order=[]
        class Owner:
            @assets.serialized
            async def operation(self, wait=False):
                order.append("start"); started.set()
                if wait: await release.wait()
                order.append("finish")
        owner=Owner(); first=asyncio.create_task(owner.operation(True)); await started.wait(); first.cancel()
        second=asyncio.create_task(owner.operation()); await asyncio.sleep(0)
        self.assertEqual(order,["start"]); release.set()
        with self.assertRaises(asyncio.CancelledError): await first
        await second; self.assertEqual(order,["start","finish","start","finish"])


if __name__ == "__main__": unittest.main()
