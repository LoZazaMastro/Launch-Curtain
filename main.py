from __future__ import annotations

import asyncio
import base64
import ctypes
import html as html_lib
import json
import mimetypes
import os
import re
import subprocess
import sys
import time
import shutil
import uuid
from concurrent.futures import ThreadPoolExecutor, as_completed
from ctypes import wintypes
from urllib.parse import parse_qs, quote, unquote, urlencode, urlparse
from urllib.request import Request, urlopen
from typing import Any, Dict, List, Optional, Tuple

import decky


PLAYHUB_YELLOW = "#FCCC01"

DEFAULT_SETTINGS: Dict[str, Any] = {
    "settings_version": 12,
    "auto_mode": True,
    "timeout_enabled": False,
    "curtain_timeout": 50,
    "launch_curtain_max_seconds": 50,
    "min_visible_seconds": 0.5,
    "game_settle_seconds": 3.0,
    "show_logo": True,
    "logo_zoom_enabled": True,
    "logo_position_x": 50,
    "logo_position_y": 50,
    "logo_scale": 100,
    "fullscreen_image_path": "",
    "background_opacity": 100,
    "per_game": {},
    "game_cache": {},
    "title": "",
    "subtitle": "",
    "accent": PLAYHUB_YELLOW,
    "custom_logo_path": "",
    "launcher_processes": [
        "EpicGamesLauncher.exe",
        "EAConnect_microsoft.exe",
        "EABackgroundService.exe",
        "EACefSubProcess.exe",
        "EADesktop.exe",
        "EALauncher.exe",
        "EALocalHostSvc.exe",
        "Link2EA.exe",
        "Origin.exe",
        "OriginWebHelperService.exe",
        "upc.exe",
        "Uplay.exe",
        "UplayService.exe",
        "UplayWebCore.exe",
        "UbisoftConnect.exe",
        "UbisoftConnectWebCore.exe",
        "UbisoftExtension.exe",
        "UbisoftGameLauncher.exe",
        "UbisoftGameLauncher64.exe",
        "UplayCrashReporter.exe",
        "Battle.net.exe",
        "Agent.exe",
        "RockstarService.exe",
        "LauncherPatcher.exe"
    ]
}


SW_RESTORE = 9
PROCESS_QUERY_LIMITED_INFORMATION = 0x1000
TH32CS_SNAPPROCESS = 0x00000002
INVALID_HANDLE_VALUE = ctypes.c_void_p(-1).value
WM_CLOSE = 0x0010
MONITOR_DEFAULTTONEAREST = 0x00000002
FULLSCREEN_TOLERANCE = 18
APP_ID_MAX = 0x100000000

STEAM_PROCESS_NAMES = {
    "steam.exe",
    "steamwebhelper.exe",
    "steamservice.exe"
}

LAUNCHER_TITLE_HINTS = {
    "ea app",
    "electronic arts",
    "origin",
    "ubisoft connect",
    "uplay"
}

GOOGLE_IMAGE_RESOLUTIONS = {
    "1920x1080": (1920, 1080),
    "2560x1440": (2560, 1440),
    "3840x2160": (3840, 2160)
}

STORE_WALLPAPER_RESOLUTIONS = {
    "3840x2160": (3840, 2160),
    "1920x1080": (1920, 1080)
}

STORE_WALLPAPER_DIMENSIONS = set(STORE_WALLPAPER_RESOLUTIONS.values())
REMOTE_IMAGE_DIMENSION_CACHE: Dict[str, Optional[Tuple[int, int]]] = {}

IMAGE_CONTENT_EXTENSIONS = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/bmp": ".bmp",
    "image/gif": ".gif",
    "image/avif": ".avif"
}

LAUNCH_IMAGE_CONTENT_EXTENSIONS = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/bmp": ".bmp",
    "image/gif": ".gif",
    "image/avif": ".avif"
}

PREVIEW_IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".bmp",
    ".gif",
    ".ico",
    ".avif"
}

IGNORED_LAUNCH_CHILDREN = {
    "steam.exe",
    "steamwebhelper.exe",
    "steamservice.exe",
    "gameoverlayui.exe",
    "steamerrorreporter.exe",
    "steamerrorreporter64.exe",
    "crashhandler.exe",
    "crashpad_handler.exe",
    "cefsharp.browsersubprocess.exe",
    "conhost.exe",
    "cmd.exe",
    "powershell.exe",
    "pwsh.exe",
    "windowsterminal.exe",
    "explorer.exe",
    "rundll32.exe",
    "dllhost.exe",
    "msedgewebview2.exe",
    "applicationframehost.exe",
    "shellexperiencehost.exe",
    "startmenuexperiencehost.exe",
    "searchapp.exe"
}


class PROCESSENTRY32W(ctypes.Structure):
    _fields_ = [
        ("dwSize", wintypes.DWORD),
        ("cntUsage", wintypes.DWORD),
        ("th32ProcessID", wintypes.DWORD),
        ("th32DefaultHeapID", ctypes.c_size_t),
        ("th32ModuleID", wintypes.DWORD),
        ("cntThreads", wintypes.DWORD),
        ("th32ParentProcessID", wintypes.DWORD),
        ("pcPriClassBase", ctypes.c_long),
        ("dwFlags", wintypes.DWORD),
        ("szExeFile", wintypes.WCHAR * 260)
    ]


class MONITORINFO(ctypes.Structure):
    _fields_ = [
        ("cbSize", wintypes.DWORD),
        ("rcMonitor", wintypes.RECT),
        ("rcWork", wintypes.RECT),
        ("dwFlags", wintypes.DWORD)
    ]


SETTINGS_FILENAME = "launch-curtain.json"


def _settings_path() -> str:
    # Keep settings outside the plugin folder so Decky/plugin ZIP replacement does not
    # wipe per-game configuration between versions.
    settings_dir = _data_dir()
    os.makedirs(settings_dir, exist_ok=True)
    return os.path.join(settings_dir, SETTINGS_FILENAME)


def _legacy_settings_paths() -> List[str]:
    candidates: List[str] = []
    decky_settings_dir = str(getattr(decky, "DECKY_SETTINGS_DIR", "") or "").strip()
    if decky_settings_dir:
        candidates.append(os.path.join(decky_settings_dir, SETTINGS_FILENAME))
    candidates.append(os.path.join(os.path.dirname(__file__), SETTINGS_FILENAME))
    candidates.append(os.path.join(_homebrew_root_from_plugin_path(), SETTINGS_FILENAME))

    primary = os.path.normcase(os.path.abspath(_settings_path()))
    unique: List[str] = []
    seen = {primary}
    for candidate in candidates:
        if not candidate:
            continue
        normalized = os.path.normcase(os.path.abspath(os.path.normpath(candidate)))
        if normalized in seen:
            continue
        seen.add(normalized)
        unique.append(os.path.normpath(candidate))
    return unique


def _existing_settings_path() -> str:
    primary = _settings_path()
    if os.path.exists(primary):
        return primary
    for candidate in _legacy_settings_paths():
        if os.path.exists(candidate):
            return candidate
    return primary


def _launch_images_dir() -> str:
    images_dir = os.path.join(_data_dir(), "launch-images")
    os.makedirs(images_dir, exist_ok=True)
    return images_dir


def _homebrew_root_from_plugin_path() -> str:
    plugin_dir = os.path.dirname(__file__)
    plugins_dir = os.path.dirname(plugin_dir)
    if os.path.basename(plugins_dir).lower() == "plugins":
        return os.path.dirname(plugins_dir)
    return plugin_dir


def _data_dir() -> str:
    data_dir = os.path.join(_homebrew_root_from_plugin_path(), "data", "launch-curtain")
    os.makedirs(data_dir, exist_ok=True)
    return data_dir


def _legacy_launch_images_dirs() -> List[str]:
    candidates = [
        os.path.join(os.path.dirname(__file__), "launch-images")
    ]
    settings_dir = str(getattr(decky, "DECKY_SETTINGS_DIR", "") or "").strip()
    if settings_dir:
        candidates.append(os.path.join(settings_dir, "launch-images"))

    current_dir = os.path.normcase(os.path.abspath(_launch_images_dir()))
    unique: List[str] = []
    seen: set[str] = set()
    for candidate in candidates:
        normalized = os.path.normcase(os.path.abspath(os.path.normpath(candidate)))
        if normalized == current_dir or normalized in seen:
            continue
        unique.append(os.path.normpath(candidate))
        seen.add(normalized)
    return unique


def _path_is_inside(path: str, directory: str) -> bool:
    try:
        return os.path.commonpath([os.path.abspath(path), os.path.abspath(directory)]) == os.path.abspath(directory)
    except (OSError, ValueError):
        return False


def _migrate_launch_image_path(path: str) -> Tuple[str, bool]:
    normalized_path = os.path.normpath(str(path or "").strip())
    if not normalized_path:
        return "", False

    destination_dir = _launch_images_dir()
    basename = os.path.basename(normalized_path)
    if not basename:
        return normalized_path, False

    if os.path.isfile(normalized_path):
        for legacy_dir in _legacy_launch_images_dirs():
            if not _path_is_inside(normalized_path, legacy_dir):
                continue
            destination = os.path.join(destination_dir, basename)
            if os.path.normcase(os.path.abspath(destination)) == os.path.normcase(os.path.abspath(normalized_path)):
                return normalized_path, False
            if os.path.exists(destination):
                stem, extension = os.path.splitext(basename)
                destination = os.path.join(destination_dir, f"{stem}-{uuid.uuid4().hex[:6]}{extension}")
            try:
                shutil.copy2(normalized_path, destination)
                _log_info(f"Migrated launch image from {normalized_path} to {destination}")
                return destination, True
            except Exception as error:
                _log_warning(f"Could not migrate launch image {normalized_path}: {error}")
                return normalized_path, False
        return normalized_path, False

    destination = os.path.join(destination_dir, basename)
    if os.path.isfile(destination):
        return destination, True
    return normalized_path, False


def _log_dir() -> str:
    for attr in ("DECKY_PLUGIN_LOG_DIR", "DECKY_LOG_DIR"):
        base = str(getattr(decky, attr, "") or "").strip()
        if not base:
            continue
        if os.path.basename(base).lower() == "launch-curtain":
            return base
        return os.path.join(base, "launch-curtain")

    return os.path.join(_homebrew_root_from_plugin_path(), "logs", "launch-curtain")


def _log_path() -> str:
    log_dir = _log_dir()
    os.makedirs(log_dir, exist_ok=True)
    return os.path.join(log_dir, "launch-curtain.log")


def _write_debug_log(level: str, message: str) -> None:
    try:
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        with open(_log_path(), "a", encoding="utf-8") as file:
            file.write(f"[{timestamp}] [{level}] {message}\n")
    except Exception:
        pass


def _log_info(message: str) -> None:
    decky.logger.info(message)
    _write_debug_log("INFO", message)


def _log_warning(message: str) -> None:
    decky.logger.warning(message)
    _write_debug_log("WARN", message)


def _safe_filename_fragment(value: str, fallback: str = "image") -> str:
    fragment = re.sub(r"[^a-zA-Z0-9._-]+", "-", value.strip()).strip(".-")
    return fragment[:80] or fallback


def _normalize_google_resolution(value: str) -> str:
    resolution = str(value or "").strip()
    return resolution if resolution in GOOGLE_IMAGE_RESOLUTIONS else "1920x1080"


def _google_images_url(title: str, resolution: str, search_query: str = "") -> Tuple[str, str]:
    width, height = GOOGLE_IMAGE_RESOLUTIONS[_normalize_google_resolution(resolution)]
    raw_query = str(search_query or "").strip() or title.strip()
    # Launch Curtain is looking for full-screen launch backgrounds only.
    # The most reliable PlayStation Store path is a normal Google image query
    # scoped to store.playstation.com with an explicit imagesize operator, e.g.
    # "forza horizon 6 imagesize:3840x2160 site:store.playstation.com".
    query = raw_query
    if "imagesize:" not in query.lower():
        query = f"{query} imagesize:{width}x{height}".strip()
    if "site:store.playstation.com" not in query.lower():
        query = f"{query} site:store.playstation.com".strip()
    params = {
        "client": "firefox-b-d",
        "source": "lnt",
        "q": query,
        "udm": "2",
        "safe": "off",
        "hl": "en"
    }
    return f"https://www.google.com/search?{urlencode(params)}", query


def _store_image_url_with_resolution(image_url: str, resolution: str) -> str:
    width, height = GOOGLE_IMAGE_RESOLUTIONS[_normalize_google_resolution(resolution)]
    parsed = urlparse(image_url)
    base_url = image_url.split("?", 1)[0]
    host = parsed.netloc.lower()
    if "image.api.playstation.com" in host:
        # PlayStation CDN URLs often already point at the real wallpaper asset.
        # Adding ?w=... can downscale or return a square thumbnail on some assets,
        # so keep the direct file URL and verify the real dimensions afterwards.
        return base_url
    return image_url


def _store_image_score(image_url: str, title: str) -> int:
    lower = image_url.lower()
    score = 0
    if "image.api.playstation.com" in lower:
        score += 700
    if "w=480" in lower and "h=270" in lower:
        score += 500
    if any(token in lower for token in ("background", "hero", "screenshot", "superhero")):
        score += 300
    if "w=177" in lower and "h=265" in lower:
        score -= 500
    title_tokens = [token for token in re.split(r"[^a-z0-9]+", title.lower()) if len(token) >= 3]
    score += sum(10 for token in title_tokens if token in lower)
    return score


def _clean_store_image_url(raw_url: str, resolution: str) -> str:
    decoded = html_lib.unescape(str(raw_url or "")).replace("\\u0026", "&").replace("\\/", "/")
    decoded = _decode_google_url(decoded).strip()
    decoded = re.split(r"[\s\"'<>]", decoded, 1)[0]
    return _store_image_url_with_resolution(decoded, resolution)


def _extract_store_image_results(html: str, title: str, resolution: str, provider: str, limit: int = 18) -> List[Dict[str, Any]]:
    decoded_html = html_lib.unescape(html)
    candidates = re.findall(
        r'https?:\\?/\\?/image\.api\.playstation\.com[^"\'<>\x1f\s]*',
        decoded_html,
        re.IGNORECASE
    )

    candidate_urls: List[str] = []
    seen_candidates = set()
    for raw_url in sorted(candidates, key=lambda value: _store_image_score(value, title), reverse=True):
        for image_url in _store_image_url_variants(raw_url):
            parsed = urlparse(image_url)
            if parsed.scheme not in {"http", "https"} or not parsed.netloc:
                continue
            if not parsed.path or parsed.path == "/":
                continue
            key = image_url.split("?", 1)[0].lower()
            if key in seen_candidates:
                continue
            seen_candidates.add(key)
            candidate_urls.append(image_url)
            if len(candidate_urls) >= max(limit * 4, 24):
                break
        if len(candidate_urls) >= max(limit * 4, 24):
            break

    dimensions_by_url: Dict[str, Optional[Tuple[int, int]]] = {}
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(_fetch_remote_image_dimensions, url): url for url in candidate_urls}
        for future in as_completed(futures):
            url = futures[future]
            try:
                dimensions_by_url[url] = future.result()
            except Exception as error:
                dimensions_by_url[url] = None
                _log_warning(f"Could not verify PlayStation image dimensions url={url}: {error}")

    results: List[Dict[str, Any]] = []
    seen_results = set()
    for image_url in candidate_urls:
        key = image_url.split("?", 1)[0].lower()
        if key in seen_results:
            continue
        dimensions = dimensions_by_url.get(image_url)
        if not _store_image_has_exact_wallpaper_dimensions(dimensions):
            _log_info(
                "Store image rejected because the real size is not 3840x2160 or 1920x1080 "
                f"provider={provider} size={_dimension_label(dimensions, 'unknown')} url={image_url}"
            )
            continue

        seen_results.add(key)
        results.append({
            "id": f"{provider.lower().replace(' ', '-')}-{len(results) + 1}",
            "image_url": image_url,
            "thumbnail_url": image_url,
            "source": provider,
            "width": dimensions[0],
            "height": dimensions[1],
            "resolution": _dimension_label(dimensions)
        })
        if len(results) >= limit:
            break
    return results


def _decode_google_url(value: str) -> str:
    decoded = html_lib.unescape(str(value or "")).replace("\\/", "/")
    try:
        decoded = bytes(decoded, "utf-8").decode("unicode_escape")
    except Exception:
        pass
    decoded = unquote(decoded)
    parsed = urlparse(decoded)
    if parsed.netloc.endswith("google.com") and parsed.path.startswith("/imgres"):
        query = parse_qs(parsed.query)
        decoded = (query.get("imgurl") or query.get("url") or [decoded])[0]
    return decoded


def _image_dimensions_from_bytes(data: bytes) -> Optional[Tuple[int, int]]:
    try:
        if len(data) >= 24 and data.startswith(b"\x89PNG\r\n\x1a\n"):
            return int.from_bytes(data[16:20], "big"), int.from_bytes(data[20:24], "big")

        if len(data) >= 10 and data[:6] in {b"GIF87a", b"GIF89a"}:
            return int.from_bytes(data[6:8], "little"), int.from_bytes(data[8:10], "little")

        if len(data) >= 26 and data[:2] == b"BM":
            width = int.from_bytes(data[18:22], "little", signed=True)
            height = int.from_bytes(data[22:26], "little", signed=True)
            if width and height:
                return abs(width), abs(height)

        if len(data) >= 32 and data[:4] == b"RIFF" and data[8:12] == b"WEBP":
            offset = 12
            while offset + 8 <= len(data):
                chunk_type = data[offset:offset + 4]
                chunk_size = int.from_bytes(data[offset + 4:offset + 8], "little")
                chunk_start = offset + 8
                if chunk_start + chunk_size > len(data):
                    return None
                if chunk_type == b"VP8X" and chunk_size >= 10:
                    width = 1 + int.from_bytes(data[chunk_start + 4:chunk_start + 7], "little")
                    height = 1 + int.from_bytes(data[chunk_start + 7:chunk_start + 10], "little")
                    return width, height
                if chunk_type == b"VP8 " and chunk_size >= 10:
                    frame = data[chunk_start:chunk_start + chunk_size]
                    if len(frame) >= 10 and frame[3:6] == b"\x9d\x01\x2a":
                        width = int.from_bytes(frame[6:8], "little") & 0x3FFF
                        height = int.from_bytes(frame[8:10], "little") & 0x3FFF
                        return width, height
                if chunk_type == b"VP8L" and chunk_size >= 5:
                    b0, b1, b2, b3 = data[chunk_start + 1:chunk_start + 5]
                    width = 1 + (((b1 & 0x3F) << 8) | b0)
                    height = 1 + (((b3 & 0x0F) << 10) | (b2 << 2) | ((b1 & 0xC0) >> 6))
                    return width, height
                offset = chunk_start + chunk_size + (chunk_size % 2)

        if len(data) >= 16 and data[4:8] == b"ftyp":
            position = data.find(b"ispe")
            if position >= 4 and position + 16 <= len(data):
                width = int.from_bytes(data[position + 8:position + 12], "big")
                height = int.from_bytes(data[position + 12:position + 16], "big")
                if width and height:
                    return width, height

        if len(data) >= 4 and data[:2] == b"\xff\xd8":
            offset = 2
            while offset + 9 < len(data):
                if data[offset] != 0xFF:
                    offset += 1
                    continue
                while offset < len(data) and data[offset] == 0xFF:
                    offset += 1
                if offset >= len(data):
                    return None
                marker = data[offset]
                offset += 1
                if marker in {0xD8, 0xD9, 0x01} or 0xD0 <= marker <= 0xD7:
                    continue
                if offset + 2 > len(data):
                    return None
                segment_length = int.from_bytes(data[offset:offset + 2], "big")
                if segment_length < 2:
                    return None
                segment_start = offset + 2
                segment_end = offset + segment_length
                if segment_end > len(data):
                    return None
                if marker in {0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF}:
                    if segment_start + 5 <= len(data):
                        height = int.from_bytes(data[segment_start + 1:segment_start + 3], "big")
                        width = int.from_bytes(data[segment_start + 3:segment_start + 5], "big")
                        if width and height:
                            return width, height
                offset = segment_end
    except Exception:
        return None
    return None


def _dimension_label(dimensions: Optional[Tuple[int, int]], fallback: str = "") -> str:
    if dimensions:
        return f"{dimensions[0]}x{dimensions[1]}"
    return _normalize_google_resolution(fallback) if fallback else ""


def _fetch_remote_image_dimensions(image_url: str, max_bytes: int = 14 * 1024 * 1024) -> Optional[Tuple[int, int]]:
    cache_key = str(image_url or "").strip()
    if cache_key in REMOTE_IMAGE_DIMENSION_CACHE:
        return REMOTE_IMAGE_DIMENSION_CACHE[cache_key]

    parsed = urlparse(cache_key)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        REMOTE_IMAGE_DIMENSION_CACHE[cache_key] = None
        return None
    referer = "https://wall.alphacoders.com/" if "alphacoders.com" in parsed.netloc.lower() else "https://store.playstation.com/"
    request = Request(
        cache_key,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
            "Accept": "image/avif,image/webp,image/png,image/jpeg,image/bmp,image/gif,*/*;q=0.8",
            "Referer": referer,
            "Range": f"bytes=0-{max_bytes - 1}",
        }
    )
    data = bytearray()
    result: Optional[Tuple[int, int]] = None
    try:
        with urlopen(request, timeout=12) as response:
            while len(data) < max_bytes:
                chunk = response.read(1024 * 128)
                if not chunk:
                    break
                data.extend(chunk)
                result = _image_dimensions_from_bytes(bytes(data))
                if result:
                    break
    except Exception as error:
        _log_warning(f"Could not verify image dimensions url={cache_key}: {error}")
        REMOTE_IMAGE_DIMENSION_CACHE[cache_key] = None
        return None

    result = result or _image_dimensions_from_bytes(bytes(data))
    REMOTE_IMAGE_DIMENSION_CACHE[cache_key] = result
    if len(REMOTE_IMAGE_DIMENSION_CACHE) > 512:
        REMOTE_IMAGE_DIMENSION_CACHE.clear()
    return result


def _store_image_url_variants(raw_url: str) -> List[str]:
    variants: List[str] = []
    seen = set()
    for resolution in ("3840x2160", "1920x1080"):
        image_url = _clean_store_image_url(raw_url, resolution)
        key = image_url.strip()
        if key and key not in seen:
            seen.add(key)
            variants.append(image_url)
    return variants


def _store_image_has_exact_wallpaper_dimensions(dimensions: Optional[Tuple[int, int]]) -> bool:
    return bool(dimensions and dimensions in STORE_WALLPAPER_DIMENSIONS)


def _image_mime_type_from_bytes(data: bytes) -> str:
    if data.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if data.startswith((b"GIF87a", b"GIF89a")):
        return "image/gif"
    if data.startswith(b"BM"):
        return "image/bmp"
    if len(data) >= 12 and data[0:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp"
    if len(data) >= 12 and data[4:8] == b"ftyp" and data[8:12] in {b"avif", b"avis"}:
        return "image/avif"
    return ""


def _wpf_supported_image_path(path: str) -> bool:
    if not path or not os.path.isfile(path):
        return False
    try:
        with open(path, "rb") as file:
            header = file.read(32)
        mime_type = _image_mime_type_from_bytes(header) or mimetypes.guess_type(path)[0] or ""
        return mime_type.lower() in LAUNCH_IMAGE_CONTENT_EXTENSIONS
    except Exception:
        return False


def _looks_like_downloadable_image_url(url: str) -> bool:
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        return False
    lower = url.lower()
    blocked = ("google.com/search", "support.google.com", "schema.org", "gstatic.com/images/branding")
    if any(token in lower for token in blocked):
        return False
    image_tokens = (
        ".jpg", ".jpeg", ".png", ".webp", ".bmp", ".avif",
        "encrypted-tbn", "images?q=tbn", "image.php"
    )
    known_image_hosts = ("images.igdb.com",)
    return any(token in lower for token in image_tokens) or any(host in lower for host in known_image_hosts)


def _extract_google_image_results(html: str, limit: int = 18, resolution: str = "") -> List[Dict[str, Any]]:
    candidates: List[str] = []
    decoded_html = html_lib.unescape(html)
    patterns = [
        r'"ou"\s*:\s*"([^"]+)"',
        r'"tu"\s*:\s*"([^"]+)"',
        r'imgurl=([^&"\']+)',
        r'(https?:\\?/\\?/[^"\\]+?\.(?:jpg|jpeg|png|webp|bmp|avif)(?:\?[^"\\]*)?)',
        r'(https?:\\?/\\?/encrypted-tbn\d?\.gstatic\.com/[^"\\]+)'
    ]

    for pattern in patterns:
        for match in re.finditer(pattern, decoded_html, re.IGNORECASE):
            candidates.append(match.group(1))

    results: List[Dict[str, Any]] = []
    seen = set()
    for raw_url in candidates:
        image_url = _decode_google_url(raw_url).strip()
        # Keep only real PlayStation background assets, not covers, logos or thumbnails.
        lower = image_url.lower()
        if "image.api.playstation.com" not in lower:
            continue
        if any(token in lower for token in ("icon", "logo", "boxart", "box-art", "cover", "tile", "thumbnail", "avatar")):
            continue

        image_url = _clean_store_image_url(image_url, resolution)
        if not _looks_like_downloadable_image_url(image_url):
            continue
        key = image_url.split("?", 1)[0].split("#", 1)[0].lower()
        if key in seen:
            continue

        dimensions = _fetch_remote_image_dimensions(image_url)
        if not _store_image_has_exact_wallpaper_dimensions(dimensions):
            _log_info(
                "Google PlayStation image rejected because the real size is not 3840x2160 or 1920x1080 "
                f"size={_dimension_label(dimensions, 'unknown')} url={image_url}"
            )
            continue

        seen.add(key)
        results.append({
            "id": f"google-store-{len(results) + 1}",
            "image_url": image_url,
            "thumbnail_url": image_url,
            "source": "Google / PlayStation background",
            "width": dimensions[0],
            "height": dimensions[1],
            "resolution": _dimension_label(dimensions)
        })
        if len(results) >= limit:
            break
    return results


def _search_google_images_sync(title: str, resolution: str, search_query: str = "") -> Dict[str, Any]:
    google_url, query = _google_images_url(title, resolution, search_query)
    request = Request(
        google_url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Cookie": "CONSENT=YES+cb.20210328-17-p0.en+FX+410; SOCS=CAESHAgBEhIaAB"
        }
    )
    with urlopen(request, timeout=15) as response:
        html = response.read(1_500_000).decode("utf-8", "ignore")
    return {
        "query": query,
        "google_url": google_url,
        "results": _extract_google_image_results(html, resolution=resolution)
    }


def _search_playstation_images_sync(title: str, resolution: str) -> List[Dict[str, Any]]:
    url = f"https://store.playstation.com/en-us/search/{quote(title.strip())}"
    request = Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9"
        }
    )
    with urlopen(request, timeout=15) as response:
        html = response.read(1_500_000).decode("utf-8", "ignore")
    return _extract_store_image_results(html, title, resolution, "PlayStation Store", limit=14)


BACKGROUND_SERVICE_CONFIGS: Dict[str, Dict[str, str]] = {
    "igdb": {
        "label": "IGDB",
        "query_suffix": "artwork screenshot site:images.igdb.com/igdb/image/upload"
    },
    "alphacoders": {
        "label": "AlphaCoders",
        "query_suffix": "video game wallpaper site:alphacoders.com OR site:wall.alphacoders.com"
    }
}

BACKGROUND_BLOCKED_URL_TOKENS = (
    "boxart", "box-art", "cover", "covers", "poster", "portrait", "logo", "icon",
    "tile", "thumbnail", "thumb", "avatar", "banner", "marquee", "clearlogo"
)


def _json_request(url: str, payload: Any = None, method: str = "GET", timeout: int = 15) -> Any:
    data = None
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
        "Accept": "application/json,text/json,*/*;q=0.8"
    }
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"
        method = "POST"
    request = Request(url, data=data, headers=headers, method=method)
    with urlopen(request, timeout=timeout) as response:
        raw = response.read(2_500_000).decode("utf-8", "ignore")
    return json.loads(raw)


def _google_search_url_for_query(query: str) -> str:
    params = {
        "client": "firefox-b-d",
        "source": "lnt",
        "q": query,
        "udm": "2",
        "safe": "off",
        "hl": "en"
    }
    return f"https://www.google.com/search?{urlencode(params)}"


def _dimension_from_text(value: str) -> Optional[Tuple[int, int]]:
    match = re.search(r"(\d{3,5})\s*x\s*(\d{3,5})", str(value or ""), re.IGNORECASE)
    if not match:
        return None
    try:
        return int(match.group(1)), int(match.group(2))
    except Exception:
        return None


def _extract_generic_image_candidates_with_context(html: str) -> List[Tuple[str, str]]:
    decoded_html = html_lib.unescape(html).replace("\\u0026", "&").replace("\\/", "/")
    patterns = [
        r'"ou"\s*:\s*"([^"]+)"',
        r'"tu"\s*:\s*"([^"]+)"',
        r'imgurl=([^&"\']+)',
        r'(https?:\\?/\\?/[^"\'<>\s]+)'
    ]
    candidates: List[Tuple[str, str]] = []
    seen = set()
    for pattern in patterns:
        for match in re.finditer(pattern, decoded_html, re.IGNORECASE):
            candidate = _decode_google_url(match.group(1)).strip()
            candidate = re.split(r"[\s\"'<>]", candidate, 1)[0]
            if not candidate:
                continue
            key = candidate.split("#", 1)[0].lower()
            if key in seen:
                continue
            seen.add(key)
            context = decoded_html[max(0, match.start() - 320):min(len(decoded_html), match.end() + 320)]
            candidates.append((candidate, context))
    return candidates


def _normalize_background_service_image_url(image_url: str, service: str) -> str:
    decoded = html_lib.unescape(str(image_url or "")).replace("\\u0026", "&").replace("\\/", "/")
    decoded = _decode_google_url(decoded).strip()
    decoded = re.split(r"[\s\"'<>]", decoded, 1)[0]
    if decoded.startswith("//"):
        decoded = f"https:{decoded}"
    if service == "igdb" and "images.igdb.com/igdb/image/upload/" in decoded.lower():
        decoded = re.sub(r"/t_[^/]+/", "/t_1080p/", decoded)
    if service == "alphacoders" and "alphacoders.com" in decoded.lower():
        # AlphaCoders pages can expose preview URLs such as
        # /thumb-1920-123456.jpg, /thumb-1920-1080-123456.jpg,
        # or /thumbbig-123456.jpg. The full-size file normally lives at
        # /123456.jpg in the same directory.
        decoded = re.sub(r"/thumb(?:-[0-9]+){1,3}-([0-9]+)\.([a-z0-9]+)(?=($|[?#]))", r"/\1.\2", decoded, flags=re.IGNORECASE)
        decoded = re.sub(r"/thumbbig-([0-9]+)\.([a-z0-9]+)(?=($|[?#]))", r"/\1.\2", decoded, flags=re.IGNORECASE)
        decoded = re.sub(r"/thumb-([0-9]+)\.([a-z0-9]+)(?=($|[?#]))", r"/\1.\2", decoded, flags=re.IGNORECASE)
    return decoded


def _service_image_url_matches(image_url: str, service: str, context: str = "") -> bool:
    lower = unquote(str(image_url or "").lower())
    context_lower = unquote(str(context or "").lower())
    if any(token in lower for token in BACKGROUND_BLOCKED_URL_TOKENS):
        return False
    if service == "igdb":
        return "images.igdb.com/igdb/image/upload" in lower
    if service == "alphacoders":
        host = urlparse(image_url).netloc.lower()
        return host.endswith(".alphacoders.com") and bool(re.search(r"/\d+/\d+\.(?:jpg|jpeg|png|webp)(?:$|[?#])", lower))
    return False


def _looks_like_background_dimensions(dimensions: Optional[Tuple[int, int]]) -> bool:
    if not dimensions:
        return False
    width, height = dimensions
    if width < 600 or height < 300:
        return False
    ratio = width / max(1, height)
    return 1.20 <= ratio <= 2.60


def _result_for_background_image(service: str, image_url: str, dimensions: Optional[Tuple[int, int]], source: str = "") -> Optional[Dict[str, Any]]:
    config = BACKGROUND_SERVICE_CONFIGS.get(service)
    if not config or not _looks_like_background_dimensions(dimensions):
        return None
    return {
        "id": f"{service}-candidate",
        "image_url": image_url,
        "thumbnail_url": image_url,
        "preview_url": image_url,
        "source": source or f"{config['label']} background",
        "width": dimensions[0],
        "height": dimensions[1],
        "resolution": _dimension_label(dimensions)
    }


def _extract_background_service_results(html: str, service: str, limit: int = 16) -> List[Dict[str, Any]]:
    config = BACKGROUND_SERVICE_CONFIGS.get(service)
    if not config:
        return []
    results: List[Dict[str, Any]] = []
    seen = set()
    for raw_url, context in _extract_generic_image_candidates_with_context(html):
        image_url = _normalize_background_service_image_url(raw_url, service)
        parsed = urlparse(image_url)
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            continue
        if not _service_image_url_matches(image_url, service, context):
            continue
        if not _looks_like_downloadable_image_url(image_url):
            parsed_host = parsed.netloc.lower()
            known_host = "images.igdb.com" in parsed_host or parsed_host.endswith(".alphacoders.com")
            if not known_host:
                continue
        key = image_url.split("?", 1)[0].split("#", 1)[0].lower()
        if key in seen:
            continue
        context_dimensions = _dimension_from_text(context)
        candidate_urls = [image_url]
        result = None
        best_url = image_url
        best_dimensions = context_dimensions
        for candidate_url in candidate_urls:
            fetched_dimensions = _fetch_remote_image_dimensions(candidate_url)
            candidate_dimensions = fetched_dimensions or context_dimensions
            result = _result_for_background_image(service, candidate_url, candidate_dimensions, f"{config['label']} background")
            if result:
                best_url = candidate_url
                best_dimensions = candidate_dimensions
                if fetched_dimensions and fetched_dimensions[0] >= 900 and fetched_dimensions[1] >= 500:
                    break
        if not result:
            _log_info(
                "Background service image rejected because it is not a landscape background "
                f"service={config['label']} size={_dimension_label(best_dimensions, 'unknown')} url={best_url}"
            )
            continue
        seen.add(key)
        result["id"] = f"{service}-{len(results) + 1}"
        results.append(result)
        if len(results) >= limit:
            break
    return results


def _collect_int_values(value: Any, keys: Tuple[str, ...], limit: int = 8) -> List[int]:
    found: List[int] = []
    seen = set()
    def walk(item: Any, depth: int = 0) -> None:
        if len(found) >= limit or depth > 8:
            return
        if isinstance(item, dict):
            for key, inner in item.items():
                if str(key).lower() in keys:
                    try:
                        number = int(inner)
                    except Exception:
                        number = 0
                    if number > 0 and number not in seen:
                        seen.add(number)
                        found.append(number)
                        if len(found) >= limit:
                            return
                walk(inner, depth + 1)
        elif isinstance(item, list):
            for inner in item:
                walk(inner, depth + 1)
    walk(value)
    return found


def _collect_igdb_image_urls(value: Any, context: str = "", limit: int = 20) -> List[Tuple[str, Optional[Tuple[int, int]], str]]:
    results: List[Tuple[str, Optional[Tuple[int, int]], str, str]] = []
    seen = set()
    def add_url(url: str, item: Any, label: str) -> None:
        if len(results) >= limit:
            return
        image_url = _normalize_background_service_image_url(url, "igdb")
        if not image_url.startswith("http") or "images.igdb.com/igdb/image/upload" not in image_url.lower():
            return
        key = image_url.split("?", 1)[0].lower()
        if key in seen:
            return
        dimensions = None
        if isinstance(item, dict):
            try:
                width = item.get("width") or item.get("Width")
                height = item.get("height") or item.get("Height")
                if width and height:
                    dimensions = (int(width), int(height))
            except Exception:
                dimensions = None
        if not dimensions:
            dimensions = _fetch_remote_image_dimensions(image_url)
        if not _looks_like_background_dimensions(dimensions):
            return
        seen.add(key)
        results.append((image_url, dimensions, label))
    def walk(item: Any, path: str = context, depth: int = 0) -> None:
        if len(results) >= limit or depth > 8:
            return
        path_lower = path.lower()
        if any(blocked in path_lower for blocked in ("cover", "logo", "icon")) and not any(ok in path_lower for ok in ("artwork", "screenshot")):
            return
        label = "IGDB artwork" if "artwork" in path_lower else "IGDB screenshot" if "screenshot" in path_lower else "IGDB background"
        if isinstance(item, dict):
            image_id = item.get("image_id") or item.get("imageId") or item.get("ImageId")
            if isinstance(image_id, str) and image_id.strip():
                add_url(f"https://images.igdb.com/igdb/image/upload/t_1080p/{image_id.strip()}.jpg", item, label)
            url = item.get("url") or item.get("Url")
            if isinstance(url, str):
                add_url(url if url.startswith("http") else f"https:{url}" if url.startswith("//") else url, item, label)
            for key, inner in item.items():
                walk(inner, f"{path}/{key}", depth + 1)
        elif isinstance(item, list):
            for inner in item:
                walk(inner, path, depth + 1)
    walk(value)
    return results


def _search_igdb_playnite_images_sync(title: str, search_query: str = "") -> List[Dict[str, Any]]:
    raw_query = str(search_query or "").strip() or title.strip()
    base = "https://api2.playnite.link/api"
    search_payloads = [
        {"searchTerm": raw_query},
        {"SearchTerm": raw_query},
        {"SearchTerm": raw_query, "Language": "en"},
        {"Name": raw_query, "SearchTerm": raw_query}
    ]
    search_responses: List[Any] = []
    for payload in search_payloads:
        try:
            search_responses.append(_json_request(f"{base}/igdb/search", payload=payload, timeout=12))
            if search_responses[-1]:
                break
        except Exception as error:
            _log_warning(f"IGDB Playnite search failed payload={payload}: {error}")
    for url in (
        f"{base}/igdb/search?{urlencode({'searchTerm': raw_query})}",
        f"{base}/igdb/search?{urlencode({'SearchTerm': raw_query})}"
    ):
        if search_responses:
            break
        try:
            search_responses.append(_json_request(url, timeout=12))
        except Exception as error:
            _log_warning(f"IGDB Playnite search failed url={url}: {error}")
    game_ids: List[int] = []
    direct_images: List[Tuple[str, Optional[Tuple[int, int]], str]] = []
    for response in search_responses:
        for candidate in _collect_int_values(response, ("id", "gameid", "game_id"), limit=6):
            if candidate not in game_ids:
                game_ids.append(candidate)
        direct_images.extend(_collect_igdb_image_urls(response, "igdb/search"))
    raw_records: List[Any] = []
    for game_id in game_ids[:5]:
        for method, url, payload in (
            ("GET", f"{base}/igdb/game/{game_id}", None),
            ("POST", f"{base}/igdb/metadata", {"gameId": game_id}),
            ("POST", f"{base}/igdb/metadata", {"GameId": game_id, "Language": "en"})
        ):
            try:
                raw_records.append(_json_request(url, payload=payload, method=method, timeout=12))
                break
            except Exception as error:
                _log_warning(f"IGDB Playnite metadata failed game_id={game_id} url={url}: {error}")
    image_candidates = direct_images[:]
    for record in raw_records:
        image_candidates.extend(_collect_igdb_image_urls(record, "igdb/metadata"))
    results: List[Dict[str, Any]] = []
    seen = set()
    for image_url, dimensions, label in image_candidates:
        key = image_url.split("?", 1)[0].lower()
        if key in seen:
            continue
        seen.add(key)
        result = _result_for_background_image("igdb", image_url, dimensions, label)
        if result:
            result["id"] = f"igdb-direct-{len(results) + 1}"
            results.append(result)
        if len(results) >= 12:
            break
    return results




def _html_request(url: str, timeout: int = 15, referer: str = "") -> str:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
    }
    if referer:
        headers["Referer"] = referer
    request = Request(url, headers=headers)
    with urlopen(request, timeout=timeout) as response:
        return response.read(1_800_000).decode("utf-8", "ignore")


def _absolute_url(url: str, base: str) -> str:
    raw = html_lib.unescape(str(url or "")).replace("\\u0026", "&").replace("\\/", "/").strip()
    if not raw:
        return ""
    if raw.startswith("//"):
        return f"https:{raw}"
    if raw.startswith("/"):
        parsed = urlparse(base)
        return f"{parsed.scheme or 'https'}://{parsed.netloc}{raw}"
    return raw


def _extract_alphacoders_detail_urls(html: str, base_url: str, limit: int = 18) -> List[str]:
    decoded_html = html_lib.unescape(str(html or "")).replace("\\u0026", "&").replace("\\/", "/")
    candidates: List[str] = []
    candidates.extend(re.findall(r'https?:\\?/\\?/wall\.alphacoders\.com/big\.php\?i=\d+', decoded_html, re.IGNORECASE))
    for match in re.finditer(r'href=["\']([^"\']+)["\']', decoded_html, re.IGNORECASE):
        candidates.append(match.group(1))

    results: List[str] = []
    seen = set()
    for raw_url in candidates:
        url = _absolute_url(_decode_google_url(raw_url), base_url).split("#", 1)[0]
        parsed = urlparse(url)
        host = parsed.netloc.lower()
        if host not in {"wall.alphacoders.com", "www.wall.alphacoders.com"}:
            continue
        if parsed.path.lower() != "/big.php":
            continue
        query = parse_qs(parsed.query)
        image_id = (query.get("i") or [""])[0]
        if not image_id.isdigit():
            continue
        normalized = f"https://wall.alphacoders.com/big.php?i={image_id}"
        key = normalized.lower()
        if key in seen:
            continue
        seen.add(key)
        results.append(normalized)
        if len(results) >= limit:
            break
    return results


def _extract_alphacoders_category_urls(html: str, base_url: str, limit: int = 6) -> List[str]:
    decoded_html = html_lib.unescape(str(html or "")).replace("\\u0026", "&").replace("\\/", "/")
    candidates = re.findall(r'https?:\\?/\\?/(?:www\.)?alphacoders\.com/[^"\'<>\s]+', decoded_html, re.IGNORECASE)
    candidates.extend(re.findall(r'href=["\']([^"\']+)["\']', decoded_html, re.IGNORECASE))
    results: List[str] = []
    seen = set()
    for raw_url in candidates:
        url = _absolute_url(_decode_google_url(raw_url), base_url).split("#", 1)[0]
        parsed = urlparse(url)
        host = parsed.netloc.lower()
        path = parsed.path.strip("/").lower()
        if host not in {"alphacoders.com", "www.alphacoders.com"}:
            continue
        if not path or any(token in path for token in ("login", "register", "privacy", "terms", "dmca", "community")):
            continue
        if "wallpaper" not in path and "video-game" not in path:
            continue
        key = url.lower()
        if key in seen:
            continue
        seen.add(key)
        results.append(url)
        if len(results) >= limit:
            break
    return results


def _extract_alphacoders_image_urls(html: str, page_url: str, limit: int = 8) -> List[Tuple[str, Optional[Tuple[int, int]], str, str]]:
    decoded_html = html_lib.unescape(str(html or "")).replace("\\u0026", "&").replace("\\/", "/")
    page_dimensions = _dimension_from_text(decoded_html)
    candidates: List[str] = []
    for pattern in (
        r'https?:\\?/\\?/images\d*\.alphacoders\.com/[^"\'<>\s]+?\.(?:jpg|jpeg|png|webp)',
        r'(?:src|data-src|href)=["\']([^"\']*images\d*\.alphacoders\.com/[^"\']+)'
    ):
        for match in re.finditer(pattern, decoded_html, re.IGNORECASE):
            candidates.append(match.group(1) if match.lastindex else match.group(0))

    results: List[Tuple[str, Optional[Tuple[int, int]], str, str]] = []
    seen = set()
    for raw_url in candidates:
        preview_url = _absolute_url(raw_url, page_url)
        image_url = _normalize_background_service_image_url(preview_url, "alphacoders")
        if preview_url == image_url:
            preview_url = ""
        parsed = urlparse(image_url)
        if parsed.scheme not in {"http", "https"} or not parsed.netloc.lower().endswith(".alphacoders.com"):
            continue
        if not _service_image_url_matches(image_url, "alphacoders", decoded_html):
            continue
        key = image_url.split("?", 1)[0].lower()
        if key in seen:
            continue
        seen.add(key)
        dimensions = _fetch_remote_image_dimensions(image_url) or page_dimensions
        if not _looks_like_background_dimensions(dimensions):
            continue
        results.append((image_url, dimensions, "AlphaCoders background", preview_url))
        if len(results) >= limit:
            break
    return results


def _search_alphacoders_images_sync(title: str, search_query: str = "") -> List[Dict[str, Any]]:
    raw_query = str(search_query or "").strip() or title.strip()
    query = f"{raw_query} video game wallpaper".strip()
    detail_urls: List[str] = []
    seen_pages = set()
    last_error = ""

    slug = re.sub(r"[^a-z0-9]+", "-", raw_query.lower()).strip("-")
    if slug:
        direct_category_urls = [
            f"https://alphacoders.com/{slug}-wallpapers",
            f"https://alphacoders.com/{slug}",
        ]
        for category_url in direct_category_urls:
            try:
                category_html = _html_request(category_url, timeout=12, referer="https://alphacoders.com/")
            except Exception as error:
                last_error = str(error)
                continue
            for url in _extract_alphacoders_detail_urls(category_html, category_url):
                key = url.lower()
                if key not in seen_pages:
                    seen_pages.add(key)
                    detail_urls.append(url)
                if len(detail_urls) >= 12:
                    break
            if detail_urls:
                break

    # Fall back to Google for AlphaCoders result/category/detail pages. AlphaCoders'
    # own search UI is less stable for scraping than the public wallpaper/category pages.
    google_queries = [
        f"{query} site:wall.alphacoders.com/big.php",
        f"{query} site:alphacoders.com",
    ]
    for google_query in google_queries:
        try:
            html = _html_request(_google_search_url_for_query(google_query), timeout=12, referer="https://www.google.com/")
            for url in _extract_alphacoders_detail_urls(html, "https://wall.alphacoders.com/"):
                key = url.lower()
                if key not in seen_pages:
                    seen_pages.add(key)
                    detail_urls.append(url)
            if len(detail_urls) < 8:
                for category_url in _extract_alphacoders_category_urls(html, "https://alphacoders.com/"):
                    try:
                        category_html = _html_request(category_url, timeout=12, referer="https://alphacoders.com/")
                    except Exception as error:
                        last_error = str(error)
                        _log_warning(f"AlphaCoders category lookup failed url={category_url}: {error}")
                        continue
                    for url in _extract_alphacoders_detail_urls(category_html, category_url):
                        key = url.lower()
                        if key not in seen_pages:
                            seen_pages.add(key)
                            detail_urls.append(url)
                        if len(detail_urls) >= 12:
                            break
                    if len(detail_urls) >= 12:
                        break
            if detail_urls:
                break
        except Exception as error:
            last_error = str(error)
            _log_warning(f"AlphaCoders Google lookup failed query={google_query}: {error}")

    results: List[Dict[str, Any]] = []
    seen_images = set()
    for page_url in detail_urls[:12]:
        try:
            page_html = _html_request(page_url, timeout=12, referer="https://wall.alphacoders.com/")
        except Exception as error:
            last_error = str(error)
            _log_warning(f"AlphaCoders page lookup failed url={page_url}: {error}")
            continue
        for image_url, dimensions, label, preview_url in _extract_alphacoders_image_urls(page_html, page_url):
            key = image_url.split("?", 1)[0].lower()
            if key in seen_images:
                continue
            seen_images.add(key)
            result = _result_for_background_image("alphacoders", image_url, dimensions, label)
            if not result:
                continue
            result["id"] = f"alphacoders-{len(results) + 1}"
            result["page_url"] = page_url
            if preview_url:
                result["thumbnail_url"] = preview_url
                result["preview_url"] = image_url
            results.append(result)
            if len(results) >= 16:
                break
        if len(results) >= 16:
            break
    if not results and last_error:
        _log_warning(f"AlphaCoders search returned no images query={query}: {last_error}")
    return results

def _search_background_service_images_sync(title: str, service: str, search_query: str = "") -> Dict[str, Any]:
    config = BACKGROUND_SERVICE_CONFIGS[service]
    raw_query = str(search_query or "").strip() or title.strip()
    direct_results: List[Dict[str, Any]] = []
    if service == "igdb":
        direct_results = _search_igdb_playnite_images_sync(title, raw_query)
    elif service == "alphacoders":
        direct_results = _search_alphacoders_images_sync(title, raw_query)
    query = f"{raw_query} {config['query_suffix']}".strip()
    google_url = _google_search_url_for_query(query)
    google_results: List[Dict[str, Any]] = []
    try:
        request = Request(
            google_url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Cookie": "CONSENT=YES+cb.20210328-17-p0.en+FX+410; SOCS=CAESHAgBEhIaAB"
            }
        )
        with urlopen(request, timeout=15) as response:
            html = response.read(1_500_000).decode("utf-8", "ignore")
        google_results = _extract_background_service_results(html, service=service)
    except Exception as error:
        _log_warning(f"{config['label']} Google image fallback failed query={query}: {error}")
    combined_results: List[Dict[str, Any]] = []
    seen = set()
    for result in [*direct_results, *google_results]:
        key = str(result.get("image_url", "")).split("?", 1)[0].lower()
        if not key or key in seen:
            continue
        seen.add(key)
        result["id"] = f"{service}-{len(combined_results) + 1}"
        combined_results.append(result)
        if len(combined_results) >= 18:
            break
    return {"query": query, "google_url": google_url, "results": combined_results}

def _download_resolution_fragment(value: str) -> str:
    raw = str(value or "").strip()
    match = re.search(r"(\d{3,5})\s*x\s*(\d{3,5})", raw, re.IGNORECASE)
    if match:
        return f"{match.group(1)}x{match.group(2)}"
    return _normalize_google_resolution(raw)


def _download_image_sync(image_url: str, app_id: int, title: str, resolution: str) -> str:
    parsed = urlparse(image_url)
    if parsed.scheme not in {"http", "https"}:
        raise ValueError("Only http/https image URLs can be downloaded.")

    def fetch_image(url: str) -> Tuple[bytes, str]:
        fetch_host = urlparse(url).netloc.lower()
        fetch_referer = "https://wall.alphacoders.com/" if "alphacoders.com" in fetch_host else "https://www.google.com/"
        fetch_request = Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
                "Accept": "image/avif,image/webp,image/png,image/jpeg,image/bmp,image/gif,*/*;q=0.8",
                "Referer": fetch_referer
            }
        )
        with urlopen(fetch_request, timeout=25) as response:
            content_type = str(response.headers.get("Content-Type", "")).split(";", 1)[0].strip().lower()
            chunks = []
            total = 0
            while True:
                chunk = response.read(1024 * 128)
                if not chunk:
                    break
                total += len(chunk)
                if total > 35 * 1024 * 1024:
                    raise ValueError("Image is too large.")
                chunks.append(chunk)
        if not chunks:
            raise ValueError("Downloaded image is empty.")
        return b"".join(chunks), content_type

    data, content_type = fetch_image(image_url)
    dimensions = _image_dimensions_from_bytes(data)

    sniffed_type = _image_mime_type_from_bytes(data)
    effective_type = sniffed_type or content_type
    extension = LAUNCH_IMAGE_CONTENT_EXTENSIONS.get(effective_type)
    if not extension:
        raise ValueError(f"Unsupported image format for Launch Curtain: {effective_type or 'unknown'}.")

    host = parsed.netloc.lower()
    if "image.api.playstation.com" in host and not _store_image_has_exact_wallpaper_dimensions(dimensions):
        raise ValueError(
            "Store image rejected: real size is "
            f"{_dimension_label(dimensions, 'unknown')}, expected 3840x2160 or 1920x1080."
        )
    if dimensions:
        resolution = _dimension_label(dimensions)

    filename = (
        f"{app_id}-"
        f"{_safe_filename_fragment(title, 'game')}-"
        f"{_safe_filename_fragment(_download_resolution_fragment(resolution), 'image')}-"
        f"{uuid.uuid4().hex[:8]}{extension}"
    )
    destination = os.path.join(_launch_images_dir(), filename)
    with open(destination, "wb") as file:
        file.write(data)
    return destination


def _launch_image_reference_paths(settings: Dict[str, Any]) -> set[str]:
    references: set[str] = set()

    def add(value: Any) -> None:
        path = os.path.normpath(str(value or "").strip())
        if path:
            references.add(os.path.normcase(os.path.abspath(path)))

    add(settings.get("fullscreen_image_path"))
    per_game = settings.get("per_game", {})
    if isinstance(per_game, dict):
        for value in per_game.values():
            if isinstance(value, dict):
                add(value.get("fullscreen_image_path"))
    return references


def _cleanup_unused_launch_images_sync(settings: Dict[str, Any]) -> Dict[str, Any]:
    images_dir = _launch_images_dir()
    used_paths = _launch_image_reference_paths(settings)
    removed: List[str] = []
    kept = 0
    failed: List[str] = []
    if not os.path.isdir(images_dir):
        return {"ok": True, "removed": 0, "kept": 0, "failed": [], "message": "Launch images folder does not exist yet."}

    for name in os.listdir(images_dir):
        path = os.path.join(images_dir, name)
        if not os.path.isfile(path):
            continue
        extension = os.path.splitext(name)[1].lower()
        if extension not in PREVIEW_IMAGE_EXTENSIONS:
            kept += 1
            continue
        normalized = os.path.normcase(os.path.abspath(path))
        if normalized in used_paths:
            kept += 1
            continue
        try:
            os.remove(path)
            removed.append(path)
        except Exception as error:
            failed.append(f"{path}: {error}")
    message = f"Removed {len(removed)} unused launch image(s)."
    if failed:
        message += f" {len(failed)} file(s) could not be removed."
    return {"ok": not failed, "removed": len(removed), "kept": kept, "failed": failed, "message": message}


def _is_windows() -> bool:
    return sys.platform.startswith("win")


def _int_or_zero(value: Any) -> int:
    if value is None:
        return 0
    raw_value = getattr(value, "value", value)
    if raw_value is None:
        return 0
    try:
        return int(raw_value)
    except (TypeError, ValueError):
        return 0


def _process_snapshot() -> Dict[int, Dict[str, Any]]:
    if not _is_windows():
        return {}

    kernel32 = ctypes.windll.kernel32
    kernel32.CreateToolhelp32Snapshot.argtypes = [wintypes.DWORD, wintypes.DWORD]
    kernel32.CreateToolhelp32Snapshot.restype = wintypes.HANDLE
    kernel32.Process32FirstW.argtypes = [wintypes.HANDLE, ctypes.POINTER(PROCESSENTRY32W)]
    kernel32.Process32FirstW.restype = wintypes.BOOL
    kernel32.Process32NextW.argtypes = [wintypes.HANDLE, ctypes.POINTER(PROCESSENTRY32W)]
    kernel32.Process32NextW.restype = wintypes.BOOL
    kernel32.CloseHandle.argtypes = [wintypes.HANDLE]
    kernel32.CloseHandle.restype = wintypes.BOOL

    snapshot = kernel32.CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0)
    if not snapshot or snapshot == INVALID_HANDLE_VALUE:
        return {}

    processes: Dict[int, Dict[str, Any]] = {}
    try:
        entry = PROCESSENTRY32W()
        entry.dwSize = ctypes.sizeof(PROCESSENTRY32W)
        has_entry = kernel32.Process32FirstW(snapshot, ctypes.byref(entry))

        while has_entry:
            pid = int(entry.th32ProcessID)
            processes[pid] = {
                "pid": pid,
                "parent_pid": int(entry.th32ParentProcessID),
                "process": entry.szExeFile
            }
            has_entry = kernel32.Process32NextW(snapshot, ctypes.byref(entry))
    finally:
        kernel32.CloseHandle(snapshot)

    return processes


def _process_image_path(pid: int) -> str:
    pid = _int_or_zero(pid)
    if not _is_windows() or pid <= 0:
        return ""

    kernel32 = ctypes.windll.kernel32
    kernel32.OpenProcess.argtypes = [wintypes.DWORD, wintypes.BOOL, wintypes.DWORD]
    kernel32.OpenProcess.restype = wintypes.HANDLE
    kernel32.QueryFullProcessImageNameW.argtypes = [
        wintypes.HANDLE,
        wintypes.DWORD,
        wintypes.LPWSTR,
        ctypes.POINTER(wintypes.DWORD)
    ]
    kernel32.QueryFullProcessImageNameW.restype = wintypes.BOOL
    kernel32.CloseHandle.argtypes = [wintypes.HANDLE]
    kernel32.CloseHandle.restype = wintypes.BOOL

    handle = kernel32.OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, False, pid)
    if not handle:
        return ""

    try:
        buffer_size = wintypes.DWORD(32768)
        buffer = ctypes.create_unicode_buffer(buffer_size.value)
        ok = kernel32.QueryFullProcessImageNameW(handle, 0, buffer, ctypes.byref(buffer_size))
        if not ok:
            return ""
        return buffer.value
    finally:
        kernel32.CloseHandle(handle)


def _process_name(pid: int) -> str:
    image_path = _process_image_path(pid)
    return os.path.basename(image_path) if image_path else ""


def _window_title(hwnd: int) -> str:
    hwnd = _int_or_zero(hwnd)
    if hwnd <= 0:
        return ""

    user32 = ctypes.windll.user32
    user32.GetWindowTextLengthW.argtypes = [wintypes.HWND]
    user32.GetWindowTextLengthW.restype = ctypes.c_int
    user32.GetWindowTextW.argtypes = [wintypes.HWND, wintypes.LPWSTR, ctypes.c_int]
    user32.GetWindowTextW.restype = ctypes.c_int

    length = user32.GetWindowTextLengthW(hwnd)
    if length <= 0:
        return ""
    buffer = ctypes.create_unicode_buffer(length + 1)
    user32.GetWindowTextW(hwnd, buffer, length + 1)
    return buffer.value


def _window_pid(hwnd: int) -> int:
    hwnd = _int_or_zero(hwnd)
    if hwnd <= 0:
        return 0

    user32 = ctypes.windll.user32
    user32.GetWindowThreadProcessId.argtypes = [wintypes.HWND, ctypes.POINTER(wintypes.DWORD)]
    user32.GetWindowThreadProcessId.restype = wintypes.DWORD

    pid = wintypes.DWORD()
    user32.GetWindowThreadProcessId(hwnd, ctypes.byref(pid))
    return int(pid.value)


def _foreground_window() -> Dict[str, Any]:
    if not _is_windows():
        return {"hwnd": 0, "title": "", "pid": 0, "process": "", "platform": sys.platform}

    user32 = ctypes.windll.user32
    user32.GetForegroundWindow.argtypes = []
    user32.GetForegroundWindow.restype = wintypes.HWND

    hwnd = _int_or_zero(user32.GetForegroundWindow())
    if hwnd <= 0:
        return {"hwnd": 0, "title": "", "pid": 0, "process": "", "platform": sys.platform}

    pid = _window_pid(hwnd)
    return {
        "hwnd": hwnd,
        "title": _window_title(hwnd),
        "pid": pid,
        "process": _process_name(pid),
        "platform": sys.platform
    }


def _visible_windows(limit: int = 18) -> List[Dict[str, Any]]:
    if not _is_windows():
        return []

    user32 = ctypes.windll.user32
    user32.IsWindowVisible.argtypes = [wintypes.HWND]
    user32.IsWindowVisible.restype = wintypes.BOOL
    user32.EnumWindows.argtypes = [ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM), wintypes.LPARAM]
    user32.EnumWindows.restype = wintypes.BOOL

    windows: List[Dict[str, Any]] = []

    def callback(hwnd: int, _lparam: int) -> bool:
        hwnd = _int_or_zero(hwnd)
        if hwnd <= 0:
            return True
        if len(windows) >= limit:
            return False
        if not user32.IsWindowVisible(hwnd):
            return True

        title = _window_title(hwnd).strip()
        if not title:
            return True

        pid = _window_pid(hwnd)
        windows.append({
            "hwnd": hwnd,
            "title": title,
            "pid": pid,
            "process": _process_name(pid)
        })
        return True

    enum_proc = ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)(callback)
    user32.EnumWindows(enum_proc, 0)
    return windows


def _windows_for_pid(pid: int, limit: int = 24) -> List[int]:
    pid = _int_or_zero(pid)
    if not _is_windows() or pid <= 0:
        return []

    user32 = ctypes.windll.user32
    user32.IsWindowVisible.argtypes = [wintypes.HWND]
    user32.IsWindowVisible.restype = wintypes.BOOL
    user32.EnumWindows.argtypes = [ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM), wintypes.LPARAM]
    user32.EnumWindows.restype = wintypes.BOOL

    windows: List[int] = []

    def callback(hwnd: int, _lparam: int) -> bool:
        hwnd = _int_or_zero(hwnd)
        if hwnd <= 0:
            return True
        if len(windows) >= limit:
            return False
        if user32.IsWindowVisible(hwnd) and _window_pid(hwnd) == pid:
            windows.append(hwnd)
        return True

    enum_proc = ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)(callback)
    user32.EnumWindows(enum_proc, 0)
    return windows


def _window_rect(hwnd: int) -> Optional[wintypes.RECT]:
    hwnd = _int_or_zero(hwnd)
    if not _is_windows() or hwnd <= 0:
        return None

    user32 = ctypes.windll.user32
    user32.GetWindowRect.argtypes = [wintypes.HWND, ctypes.POINTER(wintypes.RECT)]
    user32.GetWindowRect.restype = wintypes.BOOL

    rect = wintypes.RECT()
    if not user32.GetWindowRect(hwnd, ctypes.byref(rect)):
        return None
    return rect


def _monitor_rect_for_window(hwnd: int) -> Optional[wintypes.RECT]:
    hwnd = _int_or_zero(hwnd)
    if not _is_windows() or hwnd <= 0:
        return None

    user32 = ctypes.windll.user32
    user32.MonitorFromWindow.argtypes = [wintypes.HWND, wintypes.DWORD]
    user32.MonitorFromWindow.restype = wintypes.HANDLE
    user32.GetMonitorInfoW.argtypes = [wintypes.HANDLE, ctypes.POINTER(MONITORINFO)]
    user32.GetMonitorInfoW.restype = wintypes.BOOL

    monitor = user32.MonitorFromWindow(hwnd, MONITOR_DEFAULTTONEAREST)
    if not monitor:
        return None

    info = MONITORINFO()
    info.cbSize = ctypes.sizeof(MONITORINFO)
    if not user32.GetMonitorInfoW(monitor, ctypes.byref(info)):
        return None
    return info.rcMonitor


def _window_is_fullscreen(hwnd: int) -> bool:
    rect = _window_rect(hwnd)
    monitor = _monitor_rect_for_window(hwnd)
    if rect is None or monitor is None:
        return False

    window_width = rect.right - rect.left
    window_height = rect.bottom - rect.top
    monitor_width = monitor.right - monitor.left
    monitor_height = monitor.bottom - monitor.top

    if window_width < monitor_width - FULLSCREEN_TOLERANCE:
        return False
    if window_height < monitor_height - FULLSCREEN_TOLERANCE:
        return False

    return (
        rect.left <= monitor.left + FULLSCREEN_TOLERANCE
        and rect.top <= monitor.top + FULLSCREEN_TOLERANCE
        and rect.right >= monitor.right - FULLSCREEN_TOLERANCE
        and rect.bottom >= monitor.bottom - FULLSCREEN_TOLERANCE
    )


def _pid_has_fullscreen_window(pid: int) -> bool:
    return any(_window_is_fullscreen(hwnd) for hwnd in _windows_for_pid(pid))


def _pid_has_visible_window(pid: int) -> bool:
    return bool(_windows_for_pid(pid, limit=4))


def _window_is_large_game_surface(hwnd: int) -> bool:
    rect = _window_rect(hwnd)
    monitor = _monitor_rect_for_window(hwnd)
    if rect is None or monitor is None:
        return False

    window_width = max(0, rect.right - rect.left)
    window_height = max(0, rect.bottom - rect.top)
    monitor_width = max(1, monitor.right - monitor.left)
    monitor_height = max(1, monitor.bottom - monitor.top)
    window_area = window_width * window_height
    monitor_area = monitor_width * monitor_height

    # Many launchers and games show a small centered splash screen before the real
    # render surface exists. Treat that as not-ready so Launch Curtain does not
    # disappear on a splash/logo window and reveal the messy transition behind it.
    return (
        window_width >= min(960, int(monitor_width * 0.70))
        and window_height >= min(540, int(monitor_height * 0.70))
        and window_area >= monitor_area * 0.45
    )


def _pid_has_large_game_window(pid: int) -> bool:
    return any(_window_is_large_game_surface(hwnd) for hwnd in _windows_for_pid(pid, limit=6))


def _post_close_to_process_windows(pid: int) -> bool:
    if not _is_windows() or pid <= 0:
        return False

    user32 = ctypes.windll.user32
    user32.PostMessageW.argtypes = [wintypes.HWND, wintypes.UINT, wintypes.WPARAM, wintypes.LPARAM]
    user32.PostMessageW.restype = wintypes.BOOL

    posted = False
    for hwnd in _windows_for_pid(pid, limit=12):
        if user32.PostMessageW(hwnd, WM_CLOSE, 0, 0):
            posted = True
    return posted


def _focus_window(hwnd: int) -> bool:
    hwnd = _int_or_zero(hwnd)
    if not _is_windows() or hwnd <= 0:
        return False

    user32 = ctypes.windll.user32
    user32.ShowWindow.argtypes = [wintypes.HWND, ctypes.c_int]
    user32.ShowWindow.restype = wintypes.BOOL
    user32.SetForegroundWindow.argtypes = [wintypes.HWND]
    user32.SetForegroundWindow.restype = wintypes.BOOL

    user32.ShowWindow(hwnd, SW_RESTORE)
    return bool(user32.SetForegroundWindow(hwnd))


def _find_steam_window() -> Optional[int]:
    for window in _visible_windows(limit=80):
        process = str(window.get("process", "")).lower()
        title = str(window.get("title", "")).lower()
        if process in {"steam.exe", "steamwebhelper.exe"} and ("steam" in title or "big picture" in title):
            return int(window["hwnd"])
    return None


def _steam_root_candidates(processes: Optional[Dict[int, Dict[str, Any]]] = None) -> List[str]:
    candidates: List[str] = []

    for process in (processes or _process_snapshot()).values():
        if str(process.get("process", "")).lower() != "steam.exe":
            continue
        image_path = _process_image_path(int(process.get("pid", 0)))
        if image_path:
            candidates.append(os.path.dirname(image_path))

    try:
        import winreg

        for root, subkey in (
            (winreg.HKEY_CURRENT_USER, r"Software\Valve\Steam"),
            (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\WOW6432Node\Valve\Steam")
        ):
            try:
                with winreg.OpenKey(root, subkey) as key:
                    for value_name in ("SteamPath", "InstallPath"):
                        try:
                            value, _value_type = winreg.QueryValueEx(key, value_name)
                            if value:
                                candidates.append(str(value))
                        except OSError:
                            pass
            except OSError:
                pass
    except Exception:
        pass

    candidates.extend([
        r"C:\Program Files (x86)\Steam",
        r"C:\Program Files\Steam"
    ])

    unique: List[str] = []
    seen: set[str] = set()
    for candidate in candidates:
        normalized = os.path.normpath(candidate)
        key = normalized.lower()
        if key not in seen and os.path.isdir(normalized):
            unique.append(normalized)
            seen.add(key)
    return unique


def _find_steam_app_logo_exact(app_id: Optional[int], processes: Optional[Dict[int, Dict[str, Any]]] = None) -> str:
    if not app_id:
        return ""

    app_id_text = str(app_id)
    custom_grid_names = [
        f"{app_id_text}_logo.png",
        f"{app_id_text}_logo.jpg",
        f"{app_id_text}_logo.jpeg",
        f"{app_id_text}_icon.png",
        f"{app_id_text}_icon.jpg",
        f"{app_id_text}_icon.ico"
    ]
    library_cache_names = [
        f"{app_id_text}_logo.png",
        f"{app_id_text}_logo.jpg",
        f"{app_id_text}_logo.jpeg",
        f"{app_id_text}_library_logo.png"
    ]
    extensions = (".png", ".jpg", ".jpeg", ".bmp", ".ico")

    for steam_root in _steam_root_candidates(processes):
        userdata_dir = os.path.join(steam_root, "userdata")
        grid_dirs: List[str] = []
        if os.path.isdir(userdata_dir):
            try:
                grid_dirs = [
                    os.path.join(userdata_dir, user_id, "config", "grid")
                    for user_id in os.listdir(userdata_dir)
                    if os.path.isdir(os.path.join(userdata_dir, user_id, "config", "grid"))
                ]
            except OSError:
                grid_dirs = []

        for grid_dir in grid_dirs:
            for name in custom_grid_names:
                path = os.path.join(grid_dir, name)
                if os.path.exists(path):
                    return path

            try:
                matches = [
                    os.path.join(grid_dir, name)
                    for name in os.listdir(grid_dir)
                    if _filename_is_logo_artwork(name, app_id_text, extensions)
                ]
            except OSError:
                matches = []

            if matches:
                def custom_art_priority(path: str) -> Tuple[int, str]:
                    basename = os.path.basename(path).lower()
                    stem, _extension = os.path.splitext(basename)
                    if "_logo" in stem:
                        return (0, basename)
                    if "_icon" in stem:
                        return (1, basename)
                    return (2, basename)

                matches.sort(key=custom_art_priority)
                return matches[0]

        cache_dir = os.path.join(steam_root, "appcache", "librarycache")
        if not os.path.isdir(cache_dir):
            continue

        for name in library_cache_names:
            path = os.path.join(cache_dir, name)
            if os.path.exists(path):
                return path

        nested_logo = _find_nested_steam_library_logo(cache_dir, app_id_text, extensions)
        if nested_logo:
            return nested_logo

        for grid_dir in grid_dirs:
            for extension in extensions:
                custom_logo_path = os.path.join(grid_dir, f"{app_id_text}{extension}")
                custom_logo_json = os.path.join(grid_dir, f"{app_id_text}.json")
                if os.path.exists(custom_logo_path) and _grid_json_has_logo_position(custom_logo_json):
                    return custom_logo_path

        try:
            matches = [
                os.path.join(cache_dir, name)
                for name in os.listdir(cache_dir)
                if _filename_is_logo_artwork(name, app_id_text, extensions)
            ]
        except OSError:
            matches = []

        if matches:
            matches.sort(key=lambda path: (
                "logo" not in os.path.basename(path).lower(),
                os.path.basename(path).lower()
            ))
            return matches[0]

    return ""


def _normalize_app_id(app_id: Any) -> Optional[int]:
    if app_id is None:
        return None

    try:
        normalized = int(app_id)
    except (TypeError, ValueError):
        return None

    if normalized < 0:
        normalized = ctypes.c_uint32(normalized).value
    elif normalized >= APP_ID_MAX:
        upper_app_id = (normalized >> 32) & 0xFFFFFFFF
        normalized = upper_app_id if upper_app_id >= 0x80000000 else 0

    if 0 < normalized < APP_ID_MAX:
        return normalized
    return None


def _grid_json_has_logo_position(path: str) -> bool:
    if not path or not os.path.isfile(path):
        return False
    try:
        with open(path, "r", encoding="utf-8") as file:
            data = json.load(file)
        logo_position = data.get("logoPosition") if isinstance(data, dict) else None
        return isinstance(logo_position, dict)
    except Exception:
        return False


def _find_nested_steam_library_logo(cache_dir: str, app_id_text: str, extensions: Tuple[str, ...]) -> str:
    app_dir = os.path.join(cache_dir, app_id_text)
    if not os.path.isdir(app_dir):
        return ""

    candidates: List[str] = []
    for root, dirs, files in os.walk(app_dir):
        dirs[:] = dirs[:12]
        for filename in files:
            lower = filename.lower()
            if lower == "logo.png" or lower == "logo.jpg" or lower == "logo.jpeg":
                candidates.append(os.path.join(root, filename))
            elif lower.startswith("logo.") and lower.endswith(extensions):
                candidates.append(os.path.join(root, filename))
        if len(candidates) >= 8:
            break

    candidates.sort(key=lambda path: (
        0 if os.path.basename(path).lower() == "logo.png" else 1,
        os.path.basename(path).lower()
    ))
    return candidates[0] if candidates else ""


def _app_id_candidates(app_id: Optional[int], include_shortcut_aliases: bool = False) -> List[int]:
    normalized = _normalize_app_id(app_id)
    if normalized is None:
        return []

    candidates = [normalized]
    if include_shortcut_aliases:
        if 0 < normalized < 0x80000000:
            candidates.append(normalized | 0x80000000)
        if normalized >= 0x80000000:
            candidates.append(normalized & 0x7FFFFFFF)

    unique: List[int] = []
    seen: set[int] = set()
    for candidate in candidates:
        if 0 < candidate < APP_ID_MAX and candidate not in seen:
            unique.append(candidate)
            seen.add(candidate)
    return unique


def _find_steam_app_logo(
    app_id: Optional[int],
    processes: Optional[Dict[int, Dict[str, Any]]] = None,
    include_shortcut_aliases: bool = False
) -> str:
    for candidate in _app_id_candidates(app_id, include_shortcut_aliases):
        logo = _find_steam_app_logo_exact(candidate, processes)
        if logo:
            return logo
    return ""


def _filename_belongs_to_app_id(filename: str, app_id_text: str, extensions: Tuple[str, ...]) -> bool:
    lower = filename.lower()
    if not lower.endswith(extensions):
        return False

    stem, _extension = os.path.splitext(lower)
    return (
        stem == app_id_text
        or stem == f"{app_id_text}p"
        or stem.startswith(f"{app_id_text}_")
        or stem.startswith(f"{app_id_text}-")
    )


def _filename_is_logo_artwork(filename: str, app_id_text: str, extensions: Tuple[str, ...]) -> bool:
    if not _filename_belongs_to_app_id(filename, app_id_text, extensions):
        return False

    stem, _extension = os.path.splitext(filename.lower())
    blocked_tokens = (
        "hero",
        "header",
        "capsule",
        "banner",
        "cover",
        "portrait",
        "library_hero",
        "library_600x900"
    )
    if stem in {app_id_text, f"{app_id_text}p"}:
        return False
    if any(token in stem for token in blocked_tokens):
        return False
    return "logo" in stem or "icon" in stem


def _source_looks_like_logo_artwork(source: str, app_id: Optional[int]) -> bool:
    if not source:
        return False

    lower = source.strip().strip('"').strip("'").lower()
    if not lower:
        return False

    blocked_tokens = (
        "_hero",
        "library_hero",
        "_header",
        "header.",
        "_capsule",
        "capsule_",
        "_banner",
        "banner.",
        "library_600x900"
    )
    if any(token in lower for token in blocked_tokens):
        return False

    app_ids = [str(candidate) for candidate in _app_id_candidates(app_id, True)]
    filename = os.path.basename(urlparse(lower).path.replace("\\", "/"))
    stem, _extension = os.path.splitext(filename)
    if any(stem in {app_id_text, f"{app_id_text}p"} for app_id_text in app_ids):
        if not (("config/grid" in lower or "config\\grid" in lower) and not stem.endswith("p")):
            return False

    if "logo" in lower or "icon" in lower:
        return True

    return (
        ("config/grid" in lower or "config\\grid" in lower)
        and not stem.endswith("p")
        and filename.lower().endswith((".png", ".jpg", ".jpeg"))
    )


def _local_path_from_logo_source(source: str) -> str:
    if not source:
        return ""

    source = source.strip().strip('"').strip("'")
    if source.startswith("url(") and source.endswith(")"):
        source = source[4:-1].strip().strip('"').strip("'")

    parsed = urlparse(source)
    if parsed.scheme == "file":
        path = unquote(parsed.path)
        if parsed.netloc:
            path = f"//{parsed.netloc}{path}"
        if len(path) >= 3 and path[0] == "/" and path[2] == ":":
            path = path[1:]
        path = path.replace("/", os.sep)
        return path if os.path.exists(path) else ""

    if parsed.scheme:
        return ""

    maybe_path = source.replace("/", os.sep)
    return maybe_path if os.path.exists(maybe_path) else ""


def _remote_logo_source(source: str) -> str:
    parsed = urlparse(source.strip()) if source else None
    if parsed and parsed.scheme in {"http", "https"}:
        return source.strip()
    return ""


def _remote_image_is_available(source: str) -> bool:
    remote = _remote_logo_source(source)
    if not remote:
        return False
    try:
        request = Request(
            remote,
            method="HEAD",
            headers={
                "User-Agent": "Mozilla/5.0",
                "Accept": "image/png,image/jpeg,image/bmp,image/gif,image/*,*/*;q=0.8"
            }
        )
        with urlopen(request, timeout=3) as response:
            status = getattr(response, "status", 200)
            content_type = response.headers.get("Content-Type", "")
            return int(status) < 400 and ("image" in content_type.lower() or not content_type)
    except Exception:
        return False


def _local_image_data_url(source: str) -> str:
    path = _local_path_from_logo_source(source) or os.path.normpath(str(source or "").strip())
    if not path or not os.path.isfile(path):
        return ""

    extension = os.path.splitext(path)[1].lower()
    if extension not in PREVIEW_IMAGE_EXTENSIONS:
        return ""

    size = os.path.getsize(path)
    if size <= 0 or size > 28 * 1024 * 1024:
        return ""

    with open(path, "rb") as file:
        data = file.read()
    mime_type = _image_mime_type_from_bytes(data) or mimetypes.guess_type(path)[0] or "image/png"
    encoded = base64.b64encode(data).decode("ascii")
    return f"data:{mime_type};base64,{encoded}"


class Plugin:
    def __init__(self) -> None:
        self.settings: Dict[str, Any] = dict(DEFAULT_SETTINGS)
        self.overlay_process: Optional[subprocess.Popen[Any]] = None
        self.black_cover_process: Optional[subprocess.Popen[Any]] = None
        self.black_cover_command_sequence = 0
        self.monitor_task: Optional[asyncio.Task[Any]] = None
        self.last_curtain_started_at = 0.0
        self.launch_pending_until = 0.0
        self.launch_request_started_at = 0.0
        self.game_seen_since = 0.0
        self.launch_black_bridge_until = 0.0
        self.launch_black_bridge_release_at = 0.0
        self.launch_process_seen = False
        self.current_launch_app_id: Optional[int] = None
        self.current_launch_logo_path = ""
        self.current_launch_logo_source = ""
        self.current_launch_show_logo = True
        self.current_launch_logo_zoom_enabled = True
        self.current_launch_logo_position_x = 50
        self.current_launch_logo_position_y = 50
        self.current_launch_logo_scale = 100
        self.current_launch_fullscreen_image_path = ""
        self.current_launch_background_opacity = 100
        self.current_launch_game_settle_seconds: Optional[float] = None
        self.launch_request_started_at = 0.0
        self.known_processes: Dict[int, Dict[str, Any]] = {}
        self.launch_chain_pids: Dict[int, float] = {}
        self.launch_game_candidates: Dict[int, Dict[str, float]] = {}
        self.launch_game_fullscreen_since: Dict[int, float] = {}
        self.stale_black_cover_cleanup_done = False

    async def _main(self) -> None:
        self.settings = self._load_settings()
        self._reset_process_tracking()
        if _is_windows():
            self._cleanup_stale_black_cover_helpers()
            self._start_black_cover()
        if self.settings.get("auto_mode"):
            self._ensure_monitor()
        _log_info(
            "Launch Curtain loaded "
            f"platform={sys.platform} "
            f"python={sys.version.split()[0]} "
            f"plugin_dir={os.path.dirname(__file__)} "
            f"log={_log_path()} "
            f"powershell={self._powershell_path()} "
            f"overlay_exists={os.path.exists(self._overlay_script())} "
            f"default_logo_exists={os.path.exists(self._default_logo_path())} "
            f"auto_mode={bool(self.settings.get('auto_mode'))} "
            f"timeout_enabled={bool(self.settings.get('timeout_enabled', True))} "
            f"timeout={self.settings.get('curtain_timeout')}"
        )

    async def _unload(self) -> None:
        await self.stop_auto_mode()
        await self.hide_curtain()
        self._stop_black_cover()
        _log_info("Launch Curtain unloaded")

    async def _uninstall(self) -> None:
        await self.hide_curtain()
        self._stop_black_cover()

    def _load_settings(self) -> Dict[str, Any]:
        path = _existing_settings_path()
        save_path = _settings_path()
        importing_legacy_settings = os.path.normcase(os.path.abspath(path)) != os.path.normcase(os.path.abspath(save_path))
        if not os.path.exists(path):
            _log_info(f"Settings file not found, using defaults: {save_path}")
            return dict(DEFAULT_SETTINGS)

        try:
            with open(path, "r", encoding="utf-8") as file:
                data = json.load(file)
            stored_settings_version = int(data.get("settings_version", 0) or 0)
            settings = dict(DEFAULT_SETTINGS)
            settings.update(data)
            if str(settings.get("accent", "")).lower() in {"", "#ffffff", "white"}:
                settings["accent"] = PLAYHUB_YELLOW
            raw_timeout_enabled = settings.get("timeout_enabled", DEFAULT_SETTINGS["timeout_enabled"])
            settings["timeout_enabled"] = (
                raw_timeout_enabled
                if isinstance(raw_timeout_enabled, bool)
                else str(raw_timeout_enabled).strip().lower() not in {"0", "false", "off", "no"}
            )
            stored_launchers = settings.get("launcher_processes", DEFAULT_SETTINGS["launcher_processes"])
            if not isinstance(stored_launchers, list):
                stored_launchers = DEFAULT_SETTINGS["launcher_processes"]
            merged_launchers: List[str] = []
            seen_launchers = set()
            for name in [*stored_launchers, *DEFAULT_SETTINGS["launcher_processes"]]:
                launcher_name = str(name).strip()
                if not launcher_name:
                    continue
                launcher_key = launcher_name.lower()
                if launcher_key in seen_launchers:
                    continue
                merged_launchers.append(launcher_name)
                seen_launchers.add(launcher_key)
            settings["launcher_processes"] = merged_launchers
            settings["show_logo"] = self._coerce_bool(settings.get("show_logo", DEFAULT_SETTINGS["show_logo"]))
            settings["logo_zoom_enabled"] = self._coerce_bool(settings.get("logo_zoom_enabled", DEFAULT_SETTINGS["logo_zoom_enabled"]))
            settings["fullscreen_image_path"] = str(settings.get("fullscreen_image_path", "") or "")
            settings["per_game"] = self._normalize_per_game_settings(settings.get("per_game", {}))
            settings["game_cache"] = self._normalize_game_cache(settings.get("game_cache", {}))
            settings_migrated = self._migrate_launch_image_settings(settings)
            default_timeout = int(DEFAULT_SETTINGS["curtain_timeout"])
            try:
                settings["curtain_timeout"] = int(settings.get("curtain_timeout", default_timeout))
            except (TypeError, ValueError):
                settings["curtain_timeout"] = default_timeout
            try:
                settings["launch_curtain_max_seconds"] = int(settings.get("launch_curtain_max_seconds", default_timeout))
            except (TypeError, ValueError):
                settings["launch_curtain_max_seconds"] = int(settings["curtain_timeout"])
            valid_timeouts = set(range(5, 65, 5))
            if settings["curtain_timeout"] not in valid_timeouts:
                settings["curtain_timeout"] = default_timeout
            if settings["launch_curtain_max_seconds"] not in valid_timeouts:
                settings["launch_curtain_max_seconds"] = int(settings["curtain_timeout"])
            if stored_settings_version < 2 and settings["curtain_timeout"] == 5 and settings["launch_curtain_max_seconds"] == 5:
                settings["curtain_timeout"] = 15
                settings["launch_curtain_max_seconds"] = 15
            if stored_settings_version < 3 and settings["curtain_timeout"] == 15 and settings["launch_curtain_max_seconds"] == 15:
                settings["curtain_timeout"] = default_timeout
                settings["launch_curtain_max_seconds"] = default_timeout
            if stored_settings_version < 5:
                settings["min_visible_seconds"] = DEFAULT_SETTINGS["min_visible_seconds"]
                settings["game_settle_seconds"] = DEFAULT_SETTINGS["game_settle_seconds"]
            try:
                settings["game_settle_seconds"] = int(float(settings.get("game_settle_seconds", DEFAULT_SETTINGS["game_settle_seconds"])))
            except (TypeError, ValueError):
                settings["game_settle_seconds"] = int(DEFAULT_SETTINGS["game_settle_seconds"])
            settings["game_settle_seconds"] = max(0, min(10, int(settings["game_settle_seconds"])))
            if stored_settings_version < 6:
                settings["game_settle_seconds"] = int(DEFAULT_SETTINGS["game_settle_seconds"])
            if stored_settings_version < 11:
                settings["timeout_enabled"] = bool(DEFAULT_SETTINGS["timeout_enabled"])
                settings["game_settle_seconds"] = int(DEFAULT_SETTINGS["game_settle_seconds"])
            settings["settings_version"] = int(DEFAULT_SETTINGS["settings_version"])
            if settings_migrated or importing_legacy_settings or stored_settings_version < int(DEFAULT_SETTINGS["settings_version"]):
                try:
                    os.makedirs(os.path.dirname(save_path), exist_ok=True)
                    with open(save_path, "w", encoding="utf-8") as file:
                        json.dump(settings, file, indent=2)
                    if importing_legacy_settings:
                        _log_info(f"Imported legacy settings from {path} to {save_path}")
                except Exception as error:
                    _log_warning(f"Could not save migrated settings to {save_path}: {error}")
            _log_info(
                "Settings loaded "
                f"path={path} "
                f"save_path={save_path} "
                f"auto_mode={bool(settings.get('auto_mode'))} "
                f"timeout_enabled={bool(settings.get('timeout_enabled', True))} "
                f"timeout={settings.get('curtain_timeout')} "
                f"exit_delay={settings.get('game_settle_seconds')} "
                f"custom_logo={bool(settings.get('custom_logo_path'))}"
            )
            return settings
        except Exception as error:
            _log_warning(f"Could not load settings from {path}: {error}")
            return dict(DEFAULT_SETTINGS)

    @staticmethod
    def _coerce_bool(value: Any, default: bool = True) -> bool:
        if isinstance(value, bool):
            return value
        if value is None:
            return default
        return str(value).strip().lower() not in {"0", "false", "off", "no", "disabled"}

    @staticmethod
    def _coerce_optional_int(value: Any, minimum: int = 0, maximum: int = 10) -> Optional[int]:
        if value is None or value == "":
            return None
        try:
            number = int(float(value))
        except (TypeError, ValueError):
            return None
        return max(minimum, min(maximum, number))

    def _normalize_per_game_settings(self, value: Any) -> Dict[str, Dict[str, Any]]:
        if not isinstance(value, dict):
            return {}

        normalized: Dict[str, Dict[str, Any]] = {}
        for raw_app_id, raw_settings in value.items():
            app_id = _normalize_app_id(raw_app_id)
            if app_id is None or not isinstance(raw_settings, dict):
                continue

            # Preserve unknown per-game keys so future/older plugin versions do not
            # silently discard game-specific settings during a version migration.
            entry: Dict[str, Any] = dict(raw_settings)
            if "enabled" in raw_settings:
                entry["enabled"] = self._coerce_bool(raw_settings.get("enabled"), True)
            if "show_logo" in raw_settings:
                entry["show_logo"] = self._coerce_bool(raw_settings.get("show_logo"), True)
            if "logo_zoom_enabled" in raw_settings:
                entry["logo_zoom_enabled"] = self._coerce_bool(raw_settings.get("logo_zoom_enabled"), True)
            logo_position_x = self._coerce_optional_int(raw_settings.get("logo_position_x"), 0, 100)
            if logo_position_x is not None:
                entry["logo_position_x"] = logo_position_x
            logo_position_y = self._coerce_optional_int(raw_settings.get("logo_position_y"), 0, 100)
            if logo_position_y is not None:
                entry["logo_position_y"] = logo_position_y
            logo_scale = self._coerce_optional_int(raw_settings.get("logo_scale"), 50, 200)
            if logo_scale is not None:
                entry["logo_scale"] = logo_scale
            image_path = str(raw_settings.get("fullscreen_image_path", "") or "").strip()
            if image_path:
                entry["fullscreen_image_path"] = image_path
            background_opacity = self._coerce_optional_int(raw_settings.get("background_opacity"), 0, 100)
            if background_opacity is not None:
                entry["background_opacity"] = background_opacity
            background_search_query = str(raw_settings.get("background_search_query", "") or "").strip()
            if background_search_query:
                entry["background_search_query"] = background_search_query[:180]
            exit_delay = self._coerce_optional_int(
                raw_settings.get("exit_delay_seconds", raw_settings.get("game_settle_seconds")),
                0,
                10
            )
            if exit_delay is not None:
                entry["exit_delay_seconds"] = exit_delay

            if entry:
                normalized[str(app_id)] = entry
        return normalized

    def _migrate_launch_image_settings(self, settings: Dict[str, Any]) -> bool:
        migrated = False
        image_path, did_migrate = _migrate_launch_image_path(str(settings.get("fullscreen_image_path", "") or ""))
        if did_migrate:
            settings["fullscreen_image_path"] = image_path
            migrated = True

        per_game = settings.get("per_game", {})
        if isinstance(per_game, dict):
            for raw_entry in per_game.values():
                if not isinstance(raw_entry, dict):
                    continue
                current_path = str(raw_entry.get("fullscreen_image_path", "") or "")
                next_path, did_migrate = _migrate_launch_image_path(current_path)
                if did_migrate:
                    raw_entry["fullscreen_image_path"] = next_path
                    migrated = True
        return migrated

    def _normalize_game_cache(self, value: Any) -> Dict[str, Dict[str, Any]]:
        if not isinstance(value, dict):
            return {}

        normalized: Dict[str, Dict[str, Any]] = {}
        for raw_app_id, raw_entry in value.items():
            app_id = _normalize_app_id(raw_app_id)
            if app_id is None or not isinstance(raw_entry, dict):
                continue
            logo_source = str(raw_entry.get("logo_source", "") or "").strip()
            cached_at = float(raw_entry.get("cached_at", 0) or 0)
            title = str(raw_entry.get("title", "") or "")
            if logo_source or title:
                normalized[str(app_id)] = {
                    "logo_source": logo_source,
                    "title": title,
                    "cached_at": cached_at
                }
        return normalized

    def _game_key(self, app_id: Any) -> str:
        normalized_app_id = _normalize_app_id(app_id)
        return str(normalized_app_id or "")

    def _raw_game_settings(self, app_id: Any) -> Dict[str, Any]:
        key = self._game_key(app_id)
        per_game = self.settings.get("per_game", {})
        if not key or not isinstance(per_game, dict):
            return {}
        raw = per_game.get(key, {})
        return raw if isinstance(raw, dict) else {}

    def _resolved_game_settings(self, app_id: Any) -> Dict[str, Any]:
        raw = self._raw_game_settings(app_id)
        logo_position_x = self._coerce_optional_int(raw.get("logo_position_x"), 0, 100)
        logo_position_y = self._coerce_optional_int(raw.get("logo_position_y"), 0, 100)
        logo_scale = self._coerce_optional_int(raw.get("logo_scale"), 50, 200)
        return {
            "enabled": self._coerce_bool(raw.get("enabled"), True),
            "show_logo": self._coerce_bool(raw.get("show_logo", self.settings.get("show_logo", True)), True),
            "logo_zoom_enabled": self._coerce_bool(raw.get("logo_zoom_enabled", self.settings.get("logo_zoom_enabled", True)), True),
            "logo_position_x": 50 if logo_position_x is None else logo_position_x,
            "logo_position_y": 50 if logo_position_y is None else logo_position_y,
            "logo_scale": 100 if logo_scale is None else logo_scale,
            "fullscreen_image_path": str(raw.get("fullscreen_image_path", self.settings.get("fullscreen_image_path", "")) or ""),
            "background_opacity": self._coerce_optional_int(raw.get("background_opacity", self.settings.get("background_opacity", 100)), 0, 100) or 0,
            "background_search_query": str(raw.get("background_search_query", "") or ""),
            "exit_delay_seconds": self._coerce_optional_int(
                raw.get("exit_delay_seconds", raw.get("game_settle_seconds", self.settings.get("game_settle_seconds", DEFAULT_SETTINGS["game_settle_seconds"]))),
                0,
                10
            )
        }

    def _cache_logo_source_for_app(self, app_id: int, include_shortcut_aliases: bool = False, title: str = "") -> Dict[str, Any]:
        logo_source = _find_steam_app_logo(app_id, self.known_processes, include_shortcut_aliases)
        if not logo_source and not include_shortcut_aliases:
            logo_source = f"https://cdn.cloudflare.steamstatic.com/steam/apps/{app_id}/logo.png"

        cache_entry = {
            "logo_source": logo_source,
            "title": title,
            "cached_at": time.time()
        }
        game_cache = self.settings.setdefault("game_cache", {})
        if isinstance(game_cache, dict):
            game_cache[str(app_id)] = cache_entry
        return cache_entry

    def _save_settings_to_disk(self) -> None:
        with open(_settings_path(), "w", encoding="utf-8") as file:
            json.dump(self.settings, file, indent=2)
        _log_info(
            "Settings saved "
            f"auto_mode={bool(self.settings.get('auto_mode'))} "
            f"timeout_enabled={bool(self.settings.get('timeout_enabled', True))} "
            f"timeout={self.settings.get('curtain_timeout')} "
            f"exit_delay={self.settings.get('game_settle_seconds')} "
            f"custom_logo={bool(self.settings.get('custom_logo_path'))} "
            f"per_game={len(self.settings.get('per_game', {}) if isinstance(self.settings.get('per_game'), dict) else {})}"
        )

    def _reset_process_tracking(self) -> None:
        self.known_processes = _process_snapshot()
        self.launch_chain_pids = {}
        self.launch_game_candidates = {}
        self.launch_game_fullscreen_since = {}

    def _is_curtain_running(self) -> bool:
        return self.overlay_process is not None and self.overlay_process.poll() is None

    def _black_cover_script(self) -> str:
        return os.path.join(os.path.dirname(__file__), "helpers", "black_cover.ps1")

    def _black_cover_command_path(self) -> str:
        log_dir = _log_dir()
        os.makedirs(log_dir, exist_ok=True)
        return os.path.join(log_dir, "black-cover-command.json")

    def _black_cover_ready_path(self) -> str:
        log_dir = _log_dir()
        os.makedirs(log_dir, exist_ok=True)
        return os.path.join(log_dir, "black-cover-ready.txt")

    def _cleanup_black_cover_process(self) -> None:
        if self.black_cover_process is not None and self.black_cover_process.poll() is not None:
            _log_info(
                f"Black pre-cover process exited pid={self.black_cover_process.pid} "
                f"code={self.black_cover_process.returncode}"
            )
            self.black_cover_process = None

    def _is_black_cover_running(self) -> bool:
        self._cleanup_black_cover_process()
        return self.black_cover_process is not None and self.black_cover_process.poll() is None

    def _write_black_cover_command(
        self,
        action: str,
        ttl_ms: int = 12000,
        extra: Optional[Dict[str, Any]] = None
    ) -> bool:
        self.black_cover_command_sequence += 1
        command_path = self._black_cover_command_path()
        payload = {
            "sequence": self.black_cover_command_sequence,
            "action": action,
            "ttl_ms": int(max(0, ttl_ms)),
            "written_at": time.time()
        }
        if extra:
            payload.update(extra)
        last_error: Optional[Exception] = None
        for attempt in range(10):
            tmp_path = f"{command_path}.{os.getpid()}.{self.black_cover_command_sequence}.{attempt}.tmp"
            try:
                os.makedirs(os.path.dirname(command_path), exist_ok=True)
                with open(tmp_path, "w", encoding="utf-8") as file:
                    json.dump(payload, file, separators=(",", ":"))
                os.replace(tmp_path, command_path)
                return True
            except Exception as error:
                last_error = error
                try:
                    if os.path.exists(tmp_path):
                        os.remove(tmp_path)
                except Exception:
                    pass
                time.sleep(0.025 + (attempt * 0.01))
        _log_warning(f"Could not write black pre-cover command action={action}: {last_error}")
        return False

    def _write_black_cover_command_reliable(
        self,
        action: str,
        ttl_ms: int = 12000,
        repeats: int = 3,
        extra: Optional[Dict[str, Any]] = None
    ) -> bool:
        ok = False
        reliable_repeats = max(repeats, 5) if action == "hide" else max(1, repeats)
        for index in range(reliable_repeats):
            ok = self._write_black_cover_command(action, ttl_ms=ttl_ms, extra=extra) or ok
            if action == "hide":
                if ok and index >= 1:
                    break
                time.sleep(0.025)
                continue
            if action != "show" or index >= repeats - 1:
                break
            time.sleep(0.035)
        return ok

    def _cleanup_stale_black_cover_helpers(self) -> None:
        if self.stale_black_cover_cleanup_done or not _is_windows():
            return
        self.stale_black_cover_cleanup_done = True

        script = self._black_cover_script().lower()
        script_name = os.path.basename(script)
        escaped_script_name = script_name.replace("'", "''")
        command = (
            "$current=$PID; "
            "Get-CimInstance Win32_Process | "
            "Where-Object { "
            "$_.ProcessId -ne $current -and "
            "$_.CommandLine -and "
            f"$_.CommandLine.ToLower().Contains('{escaped_script_name}') "
            "} | ForEach-Object { "
            "try { Stop-Process -Id $_.ProcessId -Force -ErrorAction Stop } catch {} "
            "}"
        )

        try:
            subprocess.run(
                [
                    self._powershell_path(),
                    "-NoLogo",
                    "-NoProfile",
                    "-NonInteractive",
                    "-ExecutionPolicy",
                    "Bypass",
                    "-Command",
                    command
                ],
                cwd=os.path.dirname(__file__),
                creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
                timeout=2.5,
                check=False
            )
            _log_info("Cleaned up stale black pre-cover helper processes")
        except Exception as error:
            _log_warning(f"Could not clean stale black pre-cover helpers: {error}")

    def _start_black_cover(self) -> bool:
        self._cleanup_black_cover_process()
        if not _is_windows():
            return False
        if self._is_black_cover_running():
            return True

        script = self._black_cover_script()
        if not os.path.exists(script):
            _log_warning(f"black pre-cover failed: helper not found: {script}")
            return False

        for stale_path in (self._black_cover_command_path(), self._black_cover_ready_path()):
            try:
                if os.path.exists(stale_path):
                    os.remove(stale_path)
            except Exception:
                pass

        args = [
            self._powershell_path(),
            "-NoLogo",
            "-NoProfile",
            "-NonInteractive",
            "-ExecutionPolicy",
            "Bypass",
            "-STA",
            "-WindowStyle",
            "Hidden",
            "-File",
            script,
            "-CommandPath",
            self._black_cover_command_path(),
            "-ReadyPath",
            self._black_cover_ready_path(),
            "-LogPath",
            _log_path()
        ]

        creationflags = getattr(subprocess, "CREATE_NO_WINDOW", 0)
        try:
            self.black_cover_process = subprocess.Popen(
                args,
                cwd=os.path.dirname(__file__),
                creationflags=creationflags
            )
            _log_info(f"Black pre-cover started pid={self.black_cover_process.pid if self.black_cover_process else 0}")
            return True
        except Exception as error:
            self.black_cover_process = None
            _log_warning(
                "black pre-cover failed to start "
                f"powershell={self._powershell_path()} script={script} error={error}"
            )
            return False

    def _stop_black_cover(self) -> None:
        if not self._is_black_cover_running() or self.black_cover_process is None:
            return

        pid = self.black_cover_process.pid
        self._write_black_cover_command("exit", ttl_ms=0)
        try:
            self.black_cover_process.wait(timeout=1.5)
        except subprocess.TimeoutExpired:
            _log_warning(f"black pre-cover exit timed out, terminating pid={pid}")
            self.black_cover_process.terminate()
            try:
                self.black_cover_process.wait(timeout=0.8)
            except subprocess.TimeoutExpired:
                _log_warning(f"black pre-cover terminate timed out, killing pid={pid}")
                self.black_cover_process.kill()

        self.black_cover_process = None

    async def show_black_cover(self, request: Any = None) -> Dict[str, Any]:
        if not _is_windows():
            return {"ok": False, "message": "Black pre-cover is Windows only."}
        if not self._start_black_cover():
            return {"ok": False, "message": "Could not start the black pre-cover."}
        ttl_ms = 12000
        if isinstance(request, dict):
            try:
                ttl_ms = int(request.get("ttl_ms", ttl_ms) or ttl_ms)
            except (TypeError, ValueError):
                ttl_ms = 12000

        ok = self._write_black_cover_command_reliable("show", ttl_ms=ttl_ms)
        return {"ok": ok, "message": "Black pre-cover visible." if ok else "Could not show black pre-cover."}

    async def hide_black_cover(self) -> Dict[str, Any]:
        ok = (
            self._write_black_cover_command_reliable("hide", ttl_ms=0, extra={"restore_cursor": True})
            if self._is_black_cover_running()
            else True
        )
        return {"ok": ok, "message": "Black pre-cover hidden."}

    def _overlay_script(self) -> str:
        return os.path.join(os.path.dirname(__file__), "helpers", "curtain_overlay.ps1")

    def _default_logo_path(self) -> str:
        return os.path.join(os.path.dirname(__file__), "assets", "base_logo.png")

    def _logo_path(self) -> str:
        if not self.current_launch_show_logo:
            return ""
        if self.current_launch_logo_path and os.path.exists(self.current_launch_logo_path):
            return self.current_launch_logo_path
        if self.current_launch_logo_source:
            return self.current_launch_logo_source

        custom_logo = str(self.settings.get("custom_logo_path", "")).strip()
        if custom_logo and os.path.exists(custom_logo):
            return custom_logo
        return self._default_logo_path()

    def _powershell_path(self) -> str:
        system_root = os.environ.get("SystemRoot", r"C:\Windows")
        system_powershell = os.path.join(
            system_root,
            "System32",
            "WindowsPowerShell",
            "v1.0",
            "powershell.exe"
        )
        if os.path.exists(system_powershell):
            return system_powershell
        return shutil.which("powershell.exe") or "powershell.exe"

    async def cleanup_unused_launch_images(self) -> Dict[str, Any]:
        result = await asyncio.to_thread(_cleanup_unused_launch_images_sync, self.settings)
        _log_info(
            "Unused launch image cleanup "
            f"removed={result.get('removed', 0)} "
            f"kept={result.get('kept', 0)} "
            f"failed={len(result.get('failed', []))}"
        )
        return result

    async def get_settings(self) -> Dict[str, Any]:
        settings = dict(self.settings)
        settings["default_logo_path"] = self._default_logo_path()
        return settings

    async def save_settings(self, settings: Dict[str, Any]) -> Dict[str, Any]:
        for key in DEFAULT_SETTINGS:
            if key in settings:
                self.settings[key] = settings[key]

        self._save_settings_to_disk()

        if self.settings.get("auto_mode"):
            self._ensure_monitor()
        else:
            await self.stop_auto_mode()

        return dict(self.settings)

    async def get_game_settings(self, request: Any) -> Dict[str, Any]:
        app_id = _normalize_app_id(request.get("app_id") if isinstance(request, dict) else request)
        if app_id is None:
            return {"ok": False, "message": "Invalid appid."}

        raw = dict(self._raw_game_settings(app_id))
        resolved = self._resolved_game_settings(app_id)
        is_shortcut = app_id >= 0x80000000
        cached_entry = self.settings.get("game_cache", {}).get(str(app_id), {}) if isinstance(self.settings.get("game_cache"), dict) else {}
        cached_logo = str(cached_entry.get("logo_source", "") or "") if isinstance(cached_entry, dict) else ""
        logo_source = (
            _find_steam_app_logo(app_id, self.known_processes, is_shortcut)
            or cached_logo
            or ("" if is_shortcut else f"https://cdn.cloudflare.steamstatic.com/steam/apps/{app_id}/logo.png")
        )
        return {
            "ok": True,
            "app_id": app_id,
            "settings": raw,
            "resolved": resolved,
            "logo_source": logo_source,
            "default_logo_path": self._default_logo_path(),
            "global_exit_delay_seconds": int(float(self.settings.get("game_settle_seconds", DEFAULT_SETTINGS["game_settle_seconds"])))
        }

    async def validate_launch_image_path(self, request: Any) -> Dict[str, Any]:
        raw_path = ""
        if isinstance(request, dict):
            raw_path = str(request.get("path", "") or "").strip()
        else:
            raw_path = str(request or "").strip()

        if not raw_path:
            return {"ok": False, "path": "", "is_file": False, "is_dir": False, "message": "No path selected."}

        normalized = os.path.normpath(raw_path)
        is_dir = os.path.isdir(normalized)
        is_file = os.path.isfile(normalized)
        if is_dir:
            return {
                "ok": False,
                "path": normalized,
                "is_file": False,
                "is_dir": True,
                "message": "Selected path is a folder."
            }
        if is_file:
            return {
                "ok": True,
                "path": normalized,
                "is_file": True,
                "is_dir": False,
                "message": "Selected path is a file."
            }
        return {
            "ok": False,
            "path": normalized,
            "is_file": False,
            "is_dir": False,
            "message": "Selected path does not exist."
        }

    async def get_image_preview(self, request: Any) -> Dict[str, Any]:
        source = ""
        fallback = ""
        if isinstance(request, dict):
            source = str(request.get("source", "") or "").strip()
            fallback = str(request.get("fallback", "") or "").strip()
        else:
            source = str(request or "").strip()

        for candidate in (source, fallback):
            if not candidate:
                continue

            remote = _remote_logo_source(candidate)
            if remote:
                if not fallback or await asyncio.to_thread(_remote_image_is_available, remote):
                    return {"ok": True, "url": remote, "message": "Using remote image."}
                continue

            try:
                data_url = _local_image_data_url(candidate)
                if data_url:
                    return {"ok": True, "url": data_url, "message": "Using local preview image."}
            except Exception as error:
                _log_warning(f"Could not load preview image source={candidate}: {error}")

        return {"ok": False, "url": "", "message": "Preview image unavailable."}

    async def search_google_images(self, request: Any) -> Dict[str, Any]:
        title = ""
        resolution = "3840x2160"
        search_query = ""
        requested_services: List[str] = ["playstation", "igdb", "alphacoders"]
        if isinstance(request, dict):
            title = str(request.get("title", "") or "").strip()
            search_query = str(request.get("query", request.get("search_query", "")) or "").strip()
            resolution = _normalize_google_resolution(str(request.get("resolution", "") or resolution))
            raw_services = request.get("services", request.get("sources", requested_services))
            if isinstance(raw_services, list):
                requested_services = [str(item or "").strip().lower() for item in raw_services]

        valid_services = {"playstation", "igdb", "alphacoders"}
        requested_services = [service for service in requested_services if service in valid_services]
        if not title:
            return {"ok": False, "message": "Missing game title.", "results": []}
        if not requested_services:
            return {"ok": False, "message": "Select at least one background source.", "results": []}

        resolutions = ["3840x2160", "1920x1080"]
        if resolution in resolutions:
            resolutions.remove(resolution)
            resolutions.insert(0, resolution)

        all_results: List[Dict[str, Any]] = []
        first_google_url = ""
        used_queries: List[str] = []
        last_error = ""
        service_counts: Dict[str, int] = {}

        if "playstation" in requested_services:
            playstation_jobs = [
                asyncio.to_thread(_search_google_images_sync, title, target_resolution, search_query)
                for target_resolution in resolutions
            ]
            playstation_jobs.append(asyncio.to_thread(_search_playstation_images_sync, title, resolutions[0]))
            playstation_results = await asyncio.gather(*playstation_jobs, return_exceptions=True)

            google_count = 0
            store_count = 0
            for index, result in enumerate(playstation_results):
                if isinstance(result, Exception):
                    last_error = str(result)
                    _log_warning(f"PlayStation image search failed title={title}: {result}")
                    continue

                if index < len(resolutions):
                    google_results = result.get("results", [])
                    google_count += len(google_results)
                    if not first_google_url:
                        first_google_url = str(result.get("google_url", ""))
                    used_queries.append(str(result.get("query") or search_query or title))
                    all_results.extend(google_results)
                else:
                    store_results = result if isinstance(result, list) else []
                    store_count += len(store_results)
                    all_results.extend(store_results)

            combined_count = google_count + store_count
            service_counts["PlayStation"] = service_counts.get("PlayStation", 0) + combined_count
            _log_info(
                "Image search "
                f"service=PlayStation "
                f"title={title} "
                f"resolutions={'/'.join(resolutions)} "
                f"google_results={google_count} "
                f"playstation_results={store_count}"
            )

        for service in ("igdb", "alphacoders"):
            if service not in requested_services:
                continue
            label = BACKGROUND_SERVICE_CONFIGS[service]["label"]
            try:
                result = await asyncio.to_thread(_search_background_service_images_sync, title, service, search_query)
                service_results = result.get("results", [])
                if not first_google_url:
                    first_google_url = str(result.get("google_url", ""))
                used_queries.append(str(result.get("query") or search_query or title))
                all_results.extend(service_results)
                service_counts[label] = service_counts.get(label, 0) + len(service_results)
                _log_info(
                    "Image search "
                    f"service={label} "
                    f"title={title} "
                    f"query={result.get('query')} "
                    f"results={len(service_results)}"
                )
            except Exception as error:
                last_error = str(error)
                _log_warning(f"{label} image search failed title={title}: {error}")

        unique_results: List[Dict[str, Any]] = []
        seen = set()
        for result in all_results:
            key = str(result.get("image_url", "")).split("?", 1)[0].lower()
            if not key or key in seen:
                continue
            seen.add(key)
            result["id"] = f"background-{len(unique_results) + 1}"
            unique_results.append(result)

        count_summary = ", ".join(f"{source}: {count}" for source, count in service_counts.items())
        return {
            "ok": bool(unique_results),
            "title": title,
            "resolution": "selected sources",
            "query": " | ".join(used_queries) or search_query or title,
            "google_url": first_google_url,
            "results": unique_results,
            "message": (
                f"Images found. {count_summary}".strip()
                if unique_results
                else (f"No background images found in the selected sources. {last_error}".strip())
            )
        }

    async def download_google_image(self, request: Any) -> Dict[str, Any]:
        if not isinstance(request, dict):
            return {"ok": False, "message": "Invalid request."}

        app_id = _normalize_app_id(request.get("app_id"))
        image_url = str(request.get("image_url", "") or "").strip()
        title = str(request.get("title", "") or "").strip()
        resolution = str(request.get("resolution", "") or "3840x2160").strip()
        if app_id is None:
            return {"ok": False, "message": "Invalid appid."}
        if not image_url:
            return {"ok": False, "message": "Missing image URL."}

        try:
            path = await asyncio.to_thread(_download_image_sync, image_url, app_id, title or f"App {app_id}", resolution)
            per_game = self.settings.setdefault("per_game", {})
            if not isinstance(per_game, dict):
                per_game = {}
                self.settings["per_game"] = per_game
            current = dict(per_game.get(str(app_id), {}) if isinstance(per_game.get(str(app_id)), dict) else {})
            current["fullscreen_image_path"] = path
            per_game[str(app_id)] = current
            self._save_settings_to_disk()
            _log_info(
                "Google image downloaded "
                f"app_id={app_id} "
                f"resolution={resolution} "
                f"path={path}"
            )
            game_settings = await self.get_game_settings(app_id)
            game_settings.update({"ok": True, "path": path, "message": "Launch image downloaded."})
            return game_settings
        except Exception as error:
            _log_warning(f"Google image download failed app_id={app_id} url={image_url}: {error}")
            return {"ok": False, "message": f"Could not download image: {error}"}

    async def save_game_settings(self, request: Dict[str, Any]) -> Dict[str, Any]:
        app_id = _normalize_app_id(request.get("app_id") if isinstance(request, dict) else None)
        if app_id is None:
            return {"ok": False, "message": "Invalid appid."}

        values = request.get("settings", {}) if isinstance(request, dict) else {}
        if not isinstance(values, dict):
            values = {}

        per_game = self.settings.setdefault("per_game", {})
        if not isinstance(per_game, dict):
            per_game = {}
            self.settings["per_game"] = per_game

        current = dict(per_game.get(str(app_id), {}) if isinstance(per_game.get(str(app_id)), dict) else {})
        for key in ("enabled", "show_logo", "logo_zoom_enabled"):
            if key in values:
                current[key] = self._coerce_bool(values.get(key), True)

        for key, minimum, maximum in (
            ("logo_position_x", 0, 100),
            ("logo_position_y", 0, 100),
            ("logo_scale", 50, 200)
        ):
            if key in values:
                number = self._coerce_optional_int(values.get(key), minimum, maximum)
                if number is None:
                    current.pop(key, None)
                else:
                    current[key] = number

        if "fullscreen_image_path" in values:
            image_path = str(values.get("fullscreen_image_path", "") or "").strip()
            if image_path:
                normalized_image_path = os.path.normpath(image_path)
                if os.path.isfile(normalized_image_path):
                    current["fullscreen_image_path"] = normalized_image_path
            else:
                current.pop("fullscreen_image_path", None)

        if "background_opacity" in values:
            background_opacity = self._coerce_optional_int(values.get("background_opacity"), 0, 100)
            if background_opacity is None:
                current.pop("background_opacity", None)
            else:
                current["background_opacity"] = background_opacity

        if "background_search_query" in values:
            background_search_query = str(values.get("background_search_query", "") or "").strip()
            if background_search_query:
                current["background_search_query"] = background_search_query[:180]
            else:
                current.pop("background_search_query", None)

        if "exit_delay_seconds" in values or "game_settle_seconds" in values:
            exit_delay = self._coerce_optional_int(values.get("exit_delay_seconds", values.get("game_settle_seconds")), 0, 10)
            if exit_delay is None:
                current.pop("exit_delay_seconds", None)
            else:
                current["exit_delay_seconds"] = exit_delay

        if current:
            per_game[str(app_id)] = current
        else:
            per_game.pop(str(app_id), None)

        self._save_settings_to_disk()
        return await self.get_game_settings(app_id)

    async def reset_game_settings(self, request: Any) -> Dict[str, Any]:
        app_id = _normalize_app_id(request.get("app_id") if isinstance(request, dict) else request)
        if app_id is None:
            return {"ok": False, "message": "Invalid appid."}
        per_game = self.settings.setdefault("per_game", {})
        if isinstance(per_game, dict):
            per_game.pop(str(app_id), None)
        self._save_settings_to_disk()
        return await self.get_game_settings(app_id)

    async def build_game_cache(self, request: Any = None) -> Dict[str, Any]:
        app_entries = []
        if isinstance(request, dict):
            raw_apps = request.get("apps") or request.get("app_ids") or []
        else:
            raw_apps = request or []

        if isinstance(raw_apps, list):
            for entry in raw_apps:
                if isinstance(entry, dict):
                    app_id = _normalize_app_id(entry.get("app_id") or entry.get("appid"))
                    is_shortcut = bool(entry.get("is_shortcut"))
                    title = str(entry.get("title") or entry.get("name") or "")
                else:
                    app_id = _normalize_app_id(entry)
                    is_shortcut = False
                    title = ""
                if app_id is not None:
                    app_entries.append((app_id, is_shortcut, title))

        cached = 0
        found_logos = 0
        for app_id, is_shortcut, title in app_entries:
            entry = self._cache_logo_source_for_app(app_id, is_shortcut, title)
            cached += 1
            if entry.get("logo_source"):
                found_logos += 1

        if cached:
            self._save_settings_to_disk()

        return {
            "ok": True,
            "cached": cached,
            "found_logos": found_logos,
            "message": f"Cached {cached} games."
        }

    async def get_status(self) -> Dict[str, Any]:
        try:
            foreground = _foreground_window()
        except Exception as error:
            _log_warning(f"Could not read foreground window: {error}")
            foreground = {"hwnd": 0, "title": "", "pid": 0, "process": "", "platform": sys.platform}

        try:
            visible_windows = _visible_windows(limit=8)
        except Exception as error:
            _log_warning(f"Could not read visible windows: {error}")
            visible_windows = []

        return {
            "is_windows": _is_windows(),
            "curtain_running": self._is_curtain_running(),
            "auto_mode": bool(self.settings.get("auto_mode")),
            "foreground": foreground,
            "visible_windows": visible_windows
        }

    async def resolve_game_logo(self, app_id: int) -> Dict[str, Any]:
        include_shortcut_aliases = False
        raw_app_id: Any = app_id
        if isinstance(app_id, dict):
            raw_app_id = app_id.get("app_id") or app_id.get("appid")
            include_shortcut_aliases = bool(app_id.get("is_shortcut"))

        normalized_app_id = _normalize_app_id(raw_app_id)
        if normalized_app_id is None:
            return {"ok": False, "logo_source": "", "message": "Invalid appid."}

        cached_entry = self.settings.get("game_cache", {}).get(str(normalized_app_id), {}) if isinstance(self.settings.get("game_cache"), dict) else {}
        cached_logo = str(cached_entry.get("logo_source", "") or "") if isinstance(cached_entry, dict) else ""
        if cached_logo:
            return {"ok": True, "logo_source": cached_logo, "message": "Using cached logo."}

        logo_path = _find_steam_app_logo(normalized_app_id, self.known_processes, include_shortcut_aliases)
        if logo_path:
            return {"ok": True, "logo_source": logo_path, "message": "Found Steam grid logo."}

        if include_shortcut_aliases:
            return {
                "ok": False,
                "logo_source": "",
                "message": "No local SteamGridDB logo found for this non-Steam shortcut."
            }

        return {
            "ok": True,
            "logo_source": f"https://cdn.cloudflare.steamstatic.com/steam/apps/{normalized_app_id}/logo.png",
            "message": "Using Steam CDN logo."
        }

    async def show_curtain(self, timeout_override: Optional[int] = None) -> Dict[str, Any]:
        _log_info(f"show_curtain requested timeout_override={timeout_override}")
        if not _is_windows():
            _log_warning(f"show_curtain refused: unsupported platform={sys.platform}")
            return {"ok": False, "message": "Launch Curtain currently targets Windows only."}

        if self._is_curtain_running():
            _log_info(f"show_curtain ignored: already visible pid={self.overlay_process.pid if self.overlay_process else 0}")
            return {"ok": True, "message": "Curtain already visible."}

        script = self._overlay_script()
        if not os.path.exists(script):
            _log_warning(f"show_curtain failed: overlay helper not found: {script}")
            return {"ok": False, "message": f"Overlay helper not found: {script}"}

        timeout_value = timeout_override if timeout_override is not None else (
            self.settings.get("curtain_timeout", DEFAULT_SETTINGS["curtain_timeout"])
            if self.settings.get("timeout_enabled", DEFAULT_SETTINGS["timeout_enabled"])
            else 0
        )
        timeout = int(timeout_value)
        args = [
            self._powershell_path(),
            "-NoLogo",
            "-NoProfile",
            "-NonInteractive",
            "-ExecutionPolicy",
            "Bypass",
            "-STA",
            "-WindowStyle",
            "Hidden",
            "-File",
            script,
            "-Title",
            str(self.settings.get("title", DEFAULT_SETTINGS["title"])),
            "-Subtitle",
            str(self.settings.get("subtitle", DEFAULT_SETTINGS["subtitle"])),
            "-Accent",
            str(self.settings.get("accent", DEFAULT_SETTINGS["accent"])),
            "-Logo",
            self._logo_path(),
            "-ShowLogo",
            "1" if self.current_launch_show_logo else "0",
            "-ZoomLogo",
            "1" if self.current_launch_logo_zoom_enabled else "0",
            "-LogoPositionX",
            str(max(0, min(100, int(self.current_launch_logo_position_x)))),
            "-LogoPositionY",
            str(max(0, min(100, int(self.current_launch_logo_position_y)))),
            "-LogoScale",
            str(max(50, min(200, int(self.current_launch_logo_scale)))),
            "-BackdropImage",
            self.current_launch_fullscreen_image_path if _wpf_supported_image_path(self.current_launch_fullscreen_image_path) else "",
            "-BackdropOpacity",
            str(max(0, min(100, int(self.current_launch_background_opacity)))),
            "-Timeout",
            str(max(0, timeout)),
            "-LogPath",
            _log_path(),
            "-PreCoverCommandPath",
            self._black_cover_command_path()
        ]

        creationflags = getattr(subprocess, "CREATE_NO_WINDOW", 0)
        try:
            self.overlay_process = subprocess.Popen(
                args,
                cwd=os.path.dirname(__file__),
                creationflags=creationflags
            )
        except Exception as error:
            _log_warning(
                "show_curtain failed to start overlay "
                f"powershell={self._powershell_path()} script={script} error={error}"
            )
            return {"ok": False, "message": f"Could not start Launch Curtain overlay: {error}"}

        self.last_curtain_started_at = time.time()
        self.game_seen_since = 0.0
        _log_info(
            "show_curtain started overlay "
            f"pid={self.overlay_process.pid if self.overlay_process else 0} "
            f"timeout={timeout} "
            f"logo={self._logo_path()}"
        )
        return {"ok": True, "message": "Curtain visible."}

    async def launch_requested(self, request: Any = "steam") -> Dict[str, Any]:
        reason = "steam"
        app_id: Optional[int] = None
        logo_source = ""
        is_shortcut = False

        if isinstance(request, dict):
            reason = str(request.get("reason") or reason)
            is_shortcut = bool(request.get("is_shortcut"))
            confirmed_launch = bool(request.get("confirmed_launch"))
            raw_app_id = request.get("app_id") or request.get("appid")
            app_id = _normalize_app_id(raw_app_id)
            logo_source = str(request.get("logo_source") or request.get("logo_path") or "")
        elif isinstance(request, str):
            reason = request
            confirmed_launch = reason.startswith("SteamClient.Apps.")
        else:
            confirmed_launch = False

        _log_info(
            "launch_requested "
            f"reason={reason} "
            f"app_id={app_id or 0} "
            f"is_shortcut={is_shortcut} "
            f"confirmed={confirmed_launch} "
            f"logo_source_present={bool(logo_source)} "
            f"auto_mode={bool(self.settings.get('auto_mode'))}"
        )

        app_id_missing_is_allowed = (
            isinstance(request, dict)
            and not app_id
            and (
                reason.startswith("play button")
                or reason.startswith("SteamClient.Apps.")
            )
        )
        if isinstance(request, dict) and not app_id and not app_id_missing_is_allowed:
            _log_warning(f"launch_requested ignored: no appid reason={reason}")
            return {"ok": False, "message": "Launch ignored: no Steam game appid was provided."}

        game_settings = self._resolved_game_settings(app_id) if app_id else self._resolved_game_settings(None)
        if app_id and not game_settings.get("enabled", True):
            await self.hide_black_cover()
            _log_info(f"launch_requested ignored: disabled per-game app_id={app_id}")
            return {"ok": True, "message": "Launch Curtain disabled for this game."}

        if self.settings.get("auto_mode"):
            self._ensure_monitor()

        if self._is_curtain_running():
            overlay_age = max(0.0, time.time() - self.last_curtain_started_at)
            same_app = bool(app_id and self.current_launch_app_id == app_id)
            if same_app and overlay_age < 1.5:
                _log_info(
                    "launch_requested ignored: duplicate request while curtain just started "
                    f"app_id={app_id} overlay_age={overlay_age:.2f}"
                )
                return {"ok": True, "message": "Curtain already visible for this launch."}
            _log_info(
                "launch_requested replacing existing curtain overlay "
                f"previous_app_id={self.current_launch_app_id or 0} "
                f"next_app_id={app_id or 0} "
                f"overlay_age={overlay_age:.2f}"
            )
            await self._stop_overlay_process("new launch request")
            self._reset_launch_state()

        timeout = int(self.settings.get(
            "launch_curtain_max_seconds",
            self.settings.get("curtain_timeout", DEFAULT_SETTINGS["curtain_timeout"])
        ))
        pending_seconds = min(max(5, timeout), 60)
        timeout_enabled = bool(self.settings.get("timeout_enabled", DEFAULT_SETTINGS["timeout_enabled"]))
        self.launch_request_started_at = time.time()
        self.launch_pending_until = self.launch_request_started_at + (pending_seconds if timeout_enabled else 3600)
        self.game_seen_since = 0.0
        self.current_launch_app_id = app_id
        self.current_launch_show_logo = bool(game_settings.get("show_logo", True))
        self.current_launch_logo_zoom_enabled = bool(game_settings.get("logo_zoom_enabled", True))
        self.current_launch_logo_position_x = int(game_settings.get("logo_position_x", 50))
        self.current_launch_logo_position_y = int(game_settings.get("logo_position_y", 50))
        self.current_launch_logo_scale = int(game_settings.get("logo_scale", 100))
        fullscreen_image_path = str(game_settings.get("fullscreen_image_path", "") or "").strip()
        if fullscreen_image_path and os.path.exists(fullscreen_image_path) and _wpf_supported_image_path(fullscreen_image_path):
            self.current_launch_fullscreen_image_path = fullscreen_image_path
        else:
            if fullscreen_image_path:
                _log_warning(f"Ignoring unsupported or missing launch image: {fullscreen_image_path}")
            self.current_launch_fullscreen_image_path = ""
        background_opacity = self._coerce_optional_int(game_settings.get("background_opacity", 100), 0, 100)
        self.current_launch_background_opacity = 100 if background_opacity is None else background_opacity
        self.current_launch_game_settle_seconds = game_settings.get(
            "exit_delay_seconds",
            self.settings.get("game_settle_seconds", DEFAULT_SETTINGS["game_settle_seconds"])
        )
        request_logo_path = _local_path_from_logo_source(logo_source)
        if request_logo_path and not _source_looks_like_logo_artwork(request_logo_path, app_id):
            _log_info(f"Ignoring non-logo local artwork from launch request: {request_logo_path}")
            request_logo_path = ""

        request_remote_logo = _remote_logo_source(logo_source)
        if request_remote_logo and not _source_looks_like_logo_artwork(request_remote_logo, app_id):
            _log_info(f"Ignoring non-logo remote artwork from launch request: {request_remote_logo}")
            request_remote_logo = ""

        if self.current_launch_show_logo:
            cached_entry = self.settings.get("game_cache", {}).get(str(app_id), {}) if app_id and isinstance(self.settings.get("game_cache"), dict) else {}
            cached_logo = str(cached_entry.get("logo_source", "") or "") if isinstance(cached_entry, dict) else ""
            self.current_launch_logo_path = (
                request_logo_path
                or _local_path_from_logo_source(cached_logo)
                or _find_steam_app_logo(app_id, self.known_processes, is_shortcut)
            )
            self.current_launch_logo_source = "" if self.current_launch_logo_path else (request_remote_logo or _remote_logo_source(cached_logo))
        else:
            self.current_launch_logo_path = ""
            self.current_launch_logo_source = ""

        _log_info(
            "launch pending armed "
            f"app_id={app_id or 0} "
            f"timeout_enabled={timeout_enabled} "
            f"pending_seconds={pending_seconds} "
            f"local_logo={bool(self.current_launch_logo_path)} "
            f"remote_logo={bool(self.current_launch_logo_source)} "
            f"show_logo={self.current_launch_show_logo} "
            f"zoom={self.current_launch_logo_zoom_enabled} "
            f"logo_position={self.current_launch_logo_position_x},{self.current_launch_logo_position_y} "
            f"logo_scale={self.current_launch_logo_scale} "
            f"backdrop={bool(self.current_launch_fullscreen_image_path)} "
            f"background_opacity={self.current_launch_background_opacity} "
            f"exit_delay={self.current_launch_game_settle_seconds}"
        )

        # Speculative Play-button launches must release quickly so Steam prompts remain usable.
        # Confirmed SteamClient launches extend the same black cover instead of letting it expire
        # and then reappear when the actual process is detected.
        bridge_seconds = 6.5 if confirmed_launch else 2.8
        bridge_ms = int(bridge_seconds * 1000)
        self.launch_black_bridge_until = self.launch_request_started_at + bridge_seconds
        self.launch_black_bridge_release_at = self.launch_request_started_at + max(0.0, bridge_seconds - 0.15)
        self.launch_process_seen = False
        if _is_windows():
            self._start_black_cover()
            self._write_black_cover_command_reliable(
                "show",
                ttl_ms=bridge_ms,
                repeats=1,
                extra={"reason": f"backend {'confirmed' if confirmed_launch else 'speculative'} launch bridge {reason}"}
            )

        _log_info(f"launch armed, waiting for first launch process app_id={app_id or 0} reason={reason}")
        return {"ok": True, "message": f"Launch Curtain armed for launch: {reason}."}

    async def _stop_overlay_process(self, reason: str = "hide_curtain") -> None:
        if self._is_curtain_running() and self.overlay_process is not None:
            pid = self.overlay_process.pid
            _log_info(f"Stopping curtain overlay reason={reason} overlay_pid={pid}")
            if not _post_close_to_process_windows(pid):
                _log_warning(f"Curtain overlay WM_CLOSE failed, terminating pid={pid}")
                self.overlay_process.terminate()
            try:
                self.overlay_process.wait(timeout=1.4)
            except subprocess.TimeoutExpired:
                _log_warning(f"Curtain overlay close timed out, terminating pid={pid}")
                self.overlay_process.terminate()
                try:
                    self.overlay_process.wait(timeout=0.8)
                except subprocess.TimeoutExpired:
                    _log_warning(f"Curtain overlay close timed out again, killing pid={pid}")
                    self.overlay_process.kill()
        self.overlay_process = None

    def _reset_launch_state(self) -> None:
        self.launch_pending_until = 0.0
        self.launch_request_started_at = 0.0
        self.game_seen_since = 0.0
        self.launch_black_bridge_until = 0.0
        self.launch_black_bridge_release_at = 0.0
        self.launch_process_seen = False
        self.current_launch_app_id = None
        self.current_launch_logo_path = ""
        self.current_launch_logo_source = ""
        self.current_launch_show_logo = True
        self.current_launch_logo_zoom_enabled = True
        self.current_launch_logo_position_x = 50
        self.current_launch_logo_position_y = 50
        self.current_launch_logo_scale = 100
        self.current_launch_fullscreen_image_path = ""
        self.current_launch_background_opacity = 100
        self.current_launch_game_settle_seconds = None
        self.launch_game_candidates = {}
        self.launch_game_fullscreen_since = {}

    async def hide_curtain(self) -> Dict[str, Any]:
        await self.hide_black_cover()
        await self._stop_overlay_process("hide_curtain")
        self._reset_launch_state()
        return {"ok": True, "message": "Curtain hidden."}

    async def focus_steam(self) -> Dict[str, Any]:
        hwnd = _find_steam_window()
        if hwnd is None:
            return {"ok": False, "message": "Steam window not found."}

        focused = _focus_window(hwnd)
        return {
            "ok": focused,
            "message": "Steam focused." if focused else "Could not focus Steam.",
            "hwnd": hwnd
        }

    async def list_windows(self) -> List[Dict[str, Any]]:
        return _visible_windows(limit=30)

    async def start_auto_mode(self) -> Dict[str, Any]:
        _log_info("start_auto_mode requested")
        self.settings["auto_mode"] = True
        self._save_settings_to_disk()
        self._reset_process_tracking()
        self._ensure_monitor()
        return {"ok": True, "message": "Auto mode enabled."}

    async def stop_auto_mode(self) -> Dict[str, Any]:
        _log_info("stop_auto_mode requested")
        self.settings["auto_mode"] = False
        self._save_settings_to_disk()
        if self.monitor_task is not None:
            self.monitor_task.cancel()
            try:
                await self.monitor_task
            except asyncio.CancelledError:
                pass
            self.monitor_task = None
        return {"ok": True, "message": "Auto mode disabled."}

    def _ensure_monitor(self) -> None:
        if self.monitor_task is None or self.monitor_task.done():
            _log_info("Starting foreground/process monitor")
            self.monitor_task = asyncio.get_event_loop().create_task(self._monitor_foreground())


    async def _start_curtain_for_detected_launch(self, process_name: str, pid: int) -> None:
        if self._is_curtain_running():
            return
        if self.launch_pending_until <= 0 or time.time() >= self.launch_pending_until:
            return

        self.launch_process_seen = True
        self.launch_black_bridge_until = 0.0
        self.launch_black_bridge_release_at = 0.0

        # A real child process means Steam's preliminary dialogs have been cleared.
        # Make the already-running black pre-cover visible first, then start the WPF overlay.
        # Keep this path as short as possible: the prompt-safe mode depends on re-covering
        # the game window quickly after the user dismisses Steam's native prompt/dialog.
        if _is_windows():
            self._start_black_cover()
            self._write_black_cover_command_reliable(
                "show",
                ttl_ms=12000,
                repeats=1,
                extra={"reason": f"detected launch process {process_name}"}
            )

        _log_info(f"Starting curtain after detected launch process={process_name} pid={pid}")
        await self.show_curtain(timeout_override=0)

    async def _monitor_process_launches(
        self,
        processes: Dict[int, Dict[str, Any]],
        launcher_names: set[str]
    ) -> None:
        if not processes:
            return

        now = time.time()
        self.launch_chain_pids = {
            pid: expires_at
            for pid, expires_at in self.launch_chain_pids.items()
            if expires_at > now and pid in processes
        }

        known_pids = set(self.known_processes.keys())
        new_processes = [
            process
            for pid, process in processes.items()
            if pid not in known_pids
        ]
        self.known_processes = processes

        if not new_processes:
            return

        if now >= self.launch_pending_until:
            return

        source_pids = {
            pid
            for pid, process in processes.items()
            if str(process.get("process", "")).lower() in STEAM_PROCESS_NAMES
            or str(process.get("process", "")).lower() in launcher_names
        }
        source_pids.update(self.launch_chain_pids.keys())

        for process in sorted(new_processes, key=lambda item: int(item.get("pid", 0))):
            pid = int(process.get("pid", 0))
            parent_pid = int(process.get("parent_pid", 0))
            process_name = str(process.get("process", "")).lower()
            parent_name = str(processes.get(parent_pid, {}).get("process", "")).lower()
            parent_is_launch_source = (
                parent_pid in source_pids
                or parent_name in STEAM_PROCESS_NAMES
                or parent_name in launcher_names
            )

            if not parent_is_launch_source:
                continue

            self.launch_chain_pids[pid] = now + 45

            if process_name in IGNORED_LAUNCH_CHILDREN:
                continue

            if process_name in launcher_names:
                _log_info(
                    "Detected launcher bridge "
                    f"process={process_name} "
                    f"pid={pid} "
                    f"parent={parent_name} "
                    f"parent_pid={parent_pid}"
                )
                continue

            self.game_seen_since = 0.0
            self.launch_game_candidates[pid] = {"first_seen": now}
            _log_info(
                "Detected launch child "
                f"process={process_name} "
                f"pid={pid} "
                f"parent={parent_name} "
                f"parent_pid={parent_pid} "
                "candidate=True"
            )
            await self._start_curtain_for_detected_launch(process_name, pid)
            return

    async def _hide_for_settled_process_candidate(self, processes: Dict[int, Dict[str, Any]]) -> None:
        if not self._is_curtain_running():
            return

        now = time.time()
        game_settle = float(self.settings.get("game_settle_seconds", DEFAULT_SETTINGS["game_settle_seconds"]))
        min_visible = float(self.settings.get("min_visible_seconds", 2))
        visible_long_enough = now - self.last_curtain_started_at >= min_visible

        self.launch_game_candidates = {
            pid: data
            for pid, data in self.launch_game_candidates.items()
            if pid in processes and now - float(data.get("first_seen", now)) <= 30
        }
        self.launch_game_fullscreen_since = {
            pid: fullscreen_since
            for pid, fullscreen_since in self.launch_game_fullscreen_since.items()
            if pid in self.launch_game_candidates
        }

        for pid, data in self.launch_game_candidates.items():
            first_seen = float(data.get("first_seen", now))
            if now - first_seen < 0.4:
                continue

            has_fullscreen_window = _pid_has_fullscreen_window(pid)
            if has_fullscreen_window:
                if pid not in self.launch_game_fullscreen_since:
                    self.launch_game_fullscreen_since[pid] = now
                fullscreen_long_enough = now - self.launch_game_fullscreen_since[pid] >= game_settle
            else:
                self.launch_game_fullscreen_since.pop(pid, None)
                fullscreen_long_enough = False

            # Some Windows games use borderless/windowed modes that fail the strict fullscreen
            # rectangle check while the launch curtain is topmost. Only accept a sizeable
            # render surface as ready: small centered splash windows should not dismiss the
            # curtain before the actual game window exists.
            visible_window_ready = (
                not has_fullscreen_window
                and _pid_has_large_game_window(pid)
                and now - first_seen >= max(6.0, game_settle)
            )

            if visible_long_enough and (fullscreen_long_enough or visible_window_ready):
                reason = "process candidate reached fullscreen" if fullscreen_long_enough else "process candidate opened a visible game window"
                _log_info(
                    f"Hiding curtain: {reason} "
                    f"pid={pid} "
                    f"settle_seconds={game_settle} "
                    f"visible_seconds={now - self.last_curtain_started_at:.2f}"
                )
                self.launch_pending_until = 0.0
                self.game_seen_since = 0.0
                self.launch_game_candidates = {}
                self.launch_game_fullscreen_since = {}
                await self.hide_curtain()
                return

    async def _hide_expired_launch_curtain(self) -> None:
        if not self.settings.get("timeout_enabled", DEFAULT_SETTINGS["timeout_enabled"]):
            return

        if not self._is_curtain_running() or self.launch_pending_until <= 0:
            return

        if time.time() >= self.launch_pending_until:
            _log_info("Hiding curtain: timeout reached")
            self.launch_pending_until = 0.0
            self.game_seen_since = 0.0
            self.launch_game_candidates = {}
            self.launch_game_fullscreen_since = {}
            await self.hide_curtain()

    async def _release_black_bridge_if_no_process(self) -> None:
        if self.launch_black_bridge_until <= 0:
            return
        if self._is_curtain_running() or self.launch_process_seen:
            return
        now = time.time()
        if now < self.launch_black_bridge_release_at:
            return
        if now >= self.launch_black_bridge_until or not self.launch_game_candidates:
            _log_info("Black launch bridge released: no real launch process detected yet")
            self.launch_black_bridge_until = 0.0
            self.launch_black_bridge_release_at = 0.0
            await self.hide_black_cover()

    async def _monitor_foreground(self) -> None:
        launcher_names = {
            str(name).lower()
            for name in self.settings.get("launcher_processes", DEFAULT_SETTINGS["launcher_processes"])
        }
        _log_info(f"Monitor loop started launcher_names={sorted(launcher_names)}")

        while bool(self.settings.get("auto_mode")):
            try:
                processes = _process_snapshot()
                if _is_windows() and self.settings.get("auto_mode"):
                    self._cleanup_stale_black_cover_helpers()
                    self._start_black_cover()

                if not self._is_curtain_running() and self.launch_pending_until <= 0:
                    await self.hide_black_cover()
                await self._monitor_process_launches(processes, launcher_names)
                await self._release_black_bridge_if_no_process()
                await self._hide_for_settled_process_candidate(processes)
                await self._hide_expired_launch_curtain()

                foreground = _foreground_window()
                process = str(foreground.get("process", "")).lower()
                title = str(foreground.get("title", "")).lower()
                foreground_hwnd = int(foreground.get("hwnd", 0) or 0)

                title_matches_launcher = any(hint in title for hint in LAUNCHER_TITLE_HINTS)
                is_launcher = process in launcher_names or title_matches_launcher
                is_overlay = process in {"powershell.exe", "pwsh.exe"} and "launch curtain" in title
                is_steam = process in {"steam.exe", "steamwebhelper.exe"}
                looks_like_game = bool(process) and not is_launcher and not is_overlay and not is_steam
                is_fullscreen_game = looks_like_game and _window_is_fullscreen(foreground_hwnd)
                min_visible = float(self.settings.get("min_visible_seconds", 2))
                game_settle = float(self.current_launch_game_settle_seconds if self.current_launch_game_settle_seconds is not None else self.settings.get("game_settle_seconds", DEFAULT_SETTINGS["game_settle_seconds"]))

                if self._is_curtain_running() and is_fullscreen_game:
                    if self.game_seen_since <= 0:
                        self.game_seen_since = time.time()

                    game_is_settled = time.time() - self.game_seen_since >= game_settle
                    curtain_was_visible = time.time() - self.last_curtain_started_at >= min_visible
                    if game_is_settled and curtain_was_visible:
                        _log_info(
                            "Hiding curtain: foreground fullscreen game settled "
                            f"process={process} "
                            f"title={foreground.get('title', '')} "
                            f"hwnd={foreground_hwnd}"
                        )
                        self.launch_pending_until = 0.0
                        self.game_seen_since = 0.0
                        self.launch_game_candidates = {}
                        self.launch_game_fullscreen_since = {}
                        await self.hide_curtain()
                else:
                    self.game_seen_since = 0.0
            except Exception as error:
                _log_warning(f"Monitor tick failed: {error}")

            pending_without_overlay = self.launch_pending_until > time.time() and not self._is_curtain_running()
            # Prompt-safe launches need very quick re-coverage once the user dismisses
            # Steam's native dialog and the real game process finally appears. Use a
            # faster poll only while armed and overlay-less; keep the normal cadence
            # everywhere else to avoid needless CPU use.
            sleep_seconds = 0.05 if pending_without_overlay else 0.5
            await asyncio.sleep(sleep_seconds)

        _log_info("Monitor loop stopped")
