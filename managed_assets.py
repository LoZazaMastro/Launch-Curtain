"""Managed asset ownership, transactional writes and on-demand Steam inventory."""
import asyncio
import copy
import functools
import os
import re
import uuid
from pathlib import Path


def serialized(function):
    @functools.wraps(function)
    async def call(self, *args, **kwargs):
        task = asyncio.current_task()
        if getattr(self, "_asset_owner", None) is task:
            return await function(self, *args, **kwargs)
        if not hasattr(self, "_asset_lock"):
            self._asset_lock = asyncio.Lock()
        async with self._asset_lock:
            operation = asyncio.create_task(function(self, *args, **kwargs))
            self._asset_owner = operation
            cancelled = False
            try:
                while True:
                    try:
                        result = await asyncio.shield(operation)
                        if cancelled:
                            raise asyncio.CancelledError()
                        return result
                    except asyncio.CancelledError:
                        cancelled = True
                        if operation.done():
                            raise
            finally:
                self._asset_owner = None
    return call


def guarded(path):
    target = Path(os.path.abspath(path))
    for part in (target, *target.parents):
        if part.exists() or part.is_symlink():
            info = part.lstat()
            if part.is_symlink() or getattr(info, "st_file_attributes", 0) & 0x400:
                raise ValueError("Managed assets cannot follow a link or junction")
    return target


def atomic_write(path, data):
    target = guarded(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = target.with_name(target.name + "." + uuid.uuid4().hex + ".part")
    try:
        with temporary.open("xb") as output:
            output.write(data)
            output.flush()
            os.fsync(output.fileno())
        guarded(target)
        os.replace(temporary, target)
    finally:
        if temporary.exists():
            temporary.unlink()


def audio_extension(data):
    if data[:3] == b"ID3":
        return ".mp3"
    if len(data) >= 4 and data[0] == 0xFF:
        if data[1] & 0xF6 == 0xF0:
            return ".aac"
        if data[1] & 0xE0 == 0xE0 and data[1] & 0x06 and data[2] & 0xF0 not in (0, 0xF0):
            return ".mp3"
    if data[:4] == b"RIFF" and data[8:12] == b"WAVE":
        return ".wav"
    if data[:4] == b"OggS":
        return ".ogg"
    if data[4:8] == b"ftyp":
        return ".m4a"
    if data[:4] == b"fLaC":
        return ".flac"
    if data[:4] == b"\x1a\x45\xdf\xa3":
        return ".webm"
    raise ValueError("iiDB did not return a supported audio file")


def shortcut_ids(data):
    if len(data) > 16 * 1024 * 1024:
        raise ValueError("Shortcut inventory exceeds the limit")
    position = 0
    def string():
        nonlocal position
        end = data.find(b"\0", position)
        if end < 0:
            raise ValueError("Incomplete shortcut string")
        value = data[position:end].decode("utf-8", "strict")
        position = end + 1
        return value
    def read(depth=0):
        nonlocal position
        if depth > 16:
            raise ValueError("Invalid shortcut nesting")
        result = {}
        while position < len(data):
            kind = data[position]; position += 1
            if kind == 8:
                return result
            key = string().lower()
            if key in result:
                raise ValueError("Duplicate shortcut key")
            if kind == 0:
                result[key] = read(depth + 1)
            elif kind == 1:
                result[key] = string()
            elif kind in (2, 7):
                size = 4 if kind == 2 else 8
                if position + size > len(data):
                    raise ValueError("Incomplete shortcut value")
                result[key] = int.from_bytes(data[position:position + size], "little")
                position += size
            else:
                raise ValueError("Unsupported shortcut value")
        raise ValueError("Incomplete shortcut object")
    root = read()
    entries = root.get("shortcuts")
    if not isinstance(entries, dict) or position != len(data):
        raise ValueError("Invalid shortcut inventory")
    result = set()
    for entry in entries.values():
        if not isinstance(entry, dict) or not isinstance(entry.get("appid"), int):
            raise ValueError("Shortcut has no explicit identity")
        app_id = entry["appid"]
        if not 0x80000000 <= app_id <= 0xFFFFFFFF:
            raise ValueError("Shortcut identity is outside the non-Steam range")
        result.add(app_id)
    return result


def text_vdf(text):
    if len(text) > 4 * 1024 * 1024:
        raise ValueError("Steam inventory exceeds the limit")
    tokens = []
    position = 0
    pattern = re.compile(r'\s+|//[^\n]*|"((?:\\.|[^"\\])*)"|([{}])')
    while position < len(text):
        match = pattern.match(text, position)
        if not match:
            raise ValueError("Malformed Steam inventory")
        position = match.end()
        if match[1] is not None:
            tokens.append(("string", match[1].replace("\\\\", "\\").replace('\\"', '"')))
        elif match[2]:
            tokens.append((match[2], match[2]))
    position = 0
    def read(nested=False, depth=0):
        nonlocal position
        if depth > 16:
            raise ValueError("Invalid Steam inventory nesting")
        result = {}
        while position < len(tokens):
            kind, key = tokens[position]; position += 1
            if kind == "}":
                if nested:
                    return result
                raise ValueError("Unexpected Steam inventory closing brace")
            if kind != "string" or key.lower() in result or position >= len(tokens):
                raise ValueError("Invalid Steam inventory key")
            kind, value = tokens[position]; position += 1
            if kind == "{":
                value = read(True, depth + 1)
            elif kind != "string":
                raise ValueError("Invalid Steam inventory value")
            result[key.lower()] = value
        if nested:
            raise ValueError("Incomplete Steam inventory")
        return result
    return read()


def read_inventory(path, maximum):
    with path.open("rb") as file:
        data = file.read(maximum + 1)
    if len(data) > maximum:
        raise ValueError("Steam inventory exceeds the limit")
    return data


def inventory(roots):
    installed, shortcuts = set(), set()
    steam_complete = shortcuts_complete = bool(roots)
    libraries = set()
    for item in roots:
        root = Path(item)
        libraries.add(root / "steamapps")
        try:
            data = text_vdf(read_inventory(root / "steamapps" / "libraryfolders.vdf", 4 * 1024 * 1024).decode("utf-8-sig"))
            folders = data.get("libraryfolders")
            if not isinstance(folders, dict):
                raise ValueError("Missing library list")
            for key, value in folders.items():
                if not key.isdigit():
                    continue
                if not isinstance(value, dict) or not value.get("path") or not isinstance(value["path"], str):
                    raise ValueError("Missing library path")
                libraries.add(Path(value["path"]) / "steamapps")
        except (OSError, ValueError):
            steam_complete = False
        try:
            accounts = [p for p in (root / "userdata").iterdir() if p.name.isdigit() and p.is_dir()]
            if not accounts:
                shortcuts_complete = False
            for account in accounts:
                config = account / "config"
                if not config.is_dir():
                    shortcuts_complete = False
                    continue
                file = config / "shortcuts.vdf"
                if file.exists():
                    shortcuts.update(shortcut_ids(read_inventory(file, 16 * 1024 * 1024)))
        except (OSError, ValueError):
            shortcuts_complete = False
    for library in libraries:
        try:
            if not library.is_dir():
                steam_complete = False
                continue
            for manifest in library.glob("appmanifest_*.acf"):
                data = text_vdf(read_inventory(manifest, 4 * 1024 * 1024).decode("utf-8-sig"))
                state = data.get("appstate")
                app_id = state.get("appid") if isinstance(state, dict) else None
                if not isinstance(app_id, str) or not app_id.isdigit() or not 0 < int(app_id) < 0x80000000 or manifest.name.lower() != f"appmanifest_{int(app_id)}.acf":
                    steam_complete = False
                else:
                    installed.add(int(app_id))
        except (OSError, ValueError):
            steam_complete = False
    return installed, shortcuts, steam_complete, shortcuts_complete


def managed(path, root, kind):
    try:
        candidate, directory = guarded(path), guarded(root)
        relative = candidate.relative_to(directory)
        if kind == "soundbite":
            return len(relative.parts) == 2 and relative.parts[0].isdigit() and bool(re.fullmatch(r"iidb-[0-9a-f]{12}\.(mp3|wav|ogg|m4a|aac|flac|webm)", candidate.name, re.I))
        return len(relative.parts) == 1 and bool(re.fullmatch(r"[0-9]+-.+-[0-9a-f]{8}\.(jpg|jpeg|png|webp|avif|bmp|gif)", candidate.name, re.I))
    except (OSError, ValueError):
        return False


def cleanup(settings, root, kind, roots, save, active_paths=(), dry_run=False):
    if dry_run:
        settings = copy.deepcopy(settings)
    directory = guarded(root)
    installed, shortcuts, steam_ok, shortcut_ok = inventory(roots)
    field = "soundbite_path" if kind == "soundbite" else "fullscreen_image_path"
    active = {os.path.normcase(os.path.abspath(str(p))) for p in active_paths if p}
    orphan_fields = []
    per_game = settings.get("per_game", {})
    if isinstance(per_game, dict):
        for key, entry in per_game.items():
            if not isinstance(entry, dict) or not entry.get(field):
                continue
            app_id = int(key) & 0xFFFFFFFF if str(key).lstrip("-").isdigit() else 0
            missing = (app_id >= 0x80000000 and shortcut_ok and app_id not in shortcuts) or (0 < app_id < 0x80000000 and steam_ok and app_id not in installed)
            assignment_owned = entry.get("iidb_soundbite_managed") is True if kind == "soundbite" else any(entry.get(flag) is True for flag in ("iidb_asset_managed", "playstation_asset_managed", "launch_image_managed"))
            owned = managed(entry[field], directory, kind) and assignment_owned
            if missing and owned and os.path.normcase(os.path.abspath(str(entry[field]))) not in active:
                orphan_fields.append((entry, dict(entry)))
    related = ("soundbite_path", "soundbite_source", "soundbite_title", "iidb_soundbite_managed") if kind == "soundbite" else ("fullscreen_image_path", "iidb_asset_managed", "playstation_asset_managed", "launch_image_managed")
    for entry, _ in orphan_fields:
        for key in related:
            entry.pop(key, None)
    if orphan_fields and not dry_run:
        try:
            save()
        except Exception:
            for entry, old in orphan_fields:
                entry.clear(); entry.update(old)
            raise
    protected = set(active)
    references = [settings.get(field)] + [entry.get(field) for entry in per_game.values() if isinstance(entry, dict)] if isinstance(per_game, dict) else [settings.get(field)]
    protected.update(os.path.normcase(os.path.abspath(str(p))) for p in references if p)
    removed = kept = planned = planned_bytes = 0
    failed = []
    if directory.is_dir():
        for parent, subdirs, names in os.walk(directory, followlinks=False):
            subdirs[:] = [name for name in subdirs if _walkable(Path(parent, name))]
            for name in names:
                path = Path(parent, name)
                if not managed(path, directory, kind) or os.path.normcase(os.path.abspath(path)) in protected:
                    kept += 1
                    continue
                try:
                    planned += 1
                    planned_bytes += path.stat().st_size
                    if not dry_run:
                        path.unlink(); removed += 1
                except OSError as error:
                    failed.append(str(error))
    return {"ok": not failed, "dry_run": dry_run, "planned_files": planned, "planned_bytes": planned_bytes,
            "planned_assignments": len(orphan_fields), "removed": removed, "removed_assignments": 0 if dry_run else len(orphan_fields), "kept": kept, "failed": failed,
            "inventory_complete": {"steam": steam_ok, "shortcuts": shortcut_ok}, "message": f"Found {planned} unused managed file(s)." if dry_run else f"Removed {removed} unused managed file(s)."}


def _walkable(path):
    try:
        guarded(path)
        return True
    except (OSError, ValueError):
        return False
