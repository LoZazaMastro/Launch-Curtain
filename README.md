# Playhub | Launch Curtain

Launch Curtain is a Windows-only Decky Loader plugin that hides desktop flashes,
launchers, and awkward PC windows while a game starts from Steam Big Picture.

<img width="1500" height="844" alt="Screenshot2026-07-1023353" src="https://github.com/user-attachments/assets/8dcaf273-50da-4db1-ad2a-ca172f1627bd" />
<img width="3840" height="2160" alt="Screenshot 2026-07-10 233227" src="https://github.com/user-attachments/assets/ebffce09-8dc4-4c07-888d-ee0cf3da4f19" />
<img width="3840" height="2160" alt="Screenshot 2026-07-10 233250" src="https://github.com/user-attachments/assets/3e1b643a-ca99-4a30-8d46-3bb2729c2e5a" />
<img width="3840" height="2160" alt="Screenshot 2026-07-10 233311" src="https://github.com/user-attachments/assets/aca33002-3f6c-4371-9f78-ac7cf0b008ad" />
<img width="3840" height="2160" alt="Screenshot 2026-07-10 234043" src="https://github.com/user-attachments/assets/bd466719-61c5-4928-acea-f3144ce1a229" />

## Launch modes

- **Modern** (default): renders the curtain directly inside Steam's Big Picture UI.
  It supports Steam/controller input, a custom background, the game logo, optional
  launch-status text, and hands off when the game is ready.
- **Classic**: uses the external Windows overlay from the 1.5 series.
- **Off**: disables the curtain.

Both active modes are designed for Steam Big Picture. The same per-game appearance
settings are shared by Modern and Classic mode.

## Features

- Immediate in-Steam transition when a game starts.
- Automatic hand-off after the game reaches a settled fullscreen state.
- Manual close through Escape or controller input received by Steam.
- Per-game enable/disable, exit delay, logo visibility, position, scale, zoom,
  shadow, launch image, background opacity, plus independent background position and scale controls.
- **Soundbites**: assign a per-game launch jingle, preview iiDB results, download and
  apply a Soundbite, import a local audio file, and tune per-game volume. Runtime
  playback uses Steam Chromium, the same audio path used by the working in-plugin
  preview, so formats such as iiDB OGG do not depend on Windows WPF MediaPlayer codecs.
- Global Soundbite volume in the QAM is applied on top of each game's own saved
  volume, without changing the per-game value.
- Local Steam and SteamGridDB logo discovery with a bundled Playhub fallback.
- PlayStation Store search with selectable game matches and Full HD/4K background
- PlayStation bulk assignment now scores Store products by exact/base title, requested edition and Store classification so the automatic path favors the actual full game/edition instead of simply taking the first normalized-title match.
  extraction from the chosen product page.
- Background sources include PlayStation Store, IGDB, AlphaCoders, Nintendo Store,
- Nintendo background search supplements the regional EU 1600x800 H2x1 asset with safely title-matched official North-American 1920x1080 landscape artwork when available; no artificial 4K upscaling is requested.
  Xbox Store, iiDB Assets, and **SteamGridDB Heroes**. SteamGridDB integration is
  Hero-only: grids, logos, icons, and other SteamGridDB asset types are not queried.
- QAM bulk tools can fill missing iiDB Soundbites and Assets for installed games only, list games with/without
  Soundbites, manage auto-assignment exclusions, clean unused managed Soundbite files, and remove only iiDB-managed files.
- iiDB Asset bulk assignment preserves every game that already has a launch image, so
  PlayStation-managed and user-selected curtains are never overwritten.
- A gamepad-friendly context-menu entry and grouped, collapsible settings pages.
- Automatic interface translations for 11 languages in the main Decky panel.

## Install

Install `Launch-Curtain_Installer-2.5.0.zip` through Decky Loader, or copy the
contained `launch-curtain` folder into the Decky plugins directory.

Steam caches Decky frontends. After replacing or reinstalling the plugin, exit Steam
completely with **Steam > Exit** and reopen it; closing only the window is not enough.

## Development

The maintained source is in `src/`. Do not edit `dist/index.js` directly.

```powershell
node tools/build-local.mjs
node --check dist/index.js
python -m py_compile main.py
```

The dependency-free local builder is the supported reconstruction path for this
repository. A standard Decky build can also be run after installing dependencies:

```powershell
npm install
npm run test
npm run build
```

The installable plugin files are:

```text
plugin.json
package.json
main.py
dist/
helpers/
assets/
LICENSE
NOTICE
VERSION.txt
```


## Backup and restore

The QAM includes **Create backup** and **Restore backup** actions. Create backup opens
Decky's folder picker and creates a timestamped `Launch-Curtain-Backup-*` folder in the
chosen location. The backup contains the complete Launch Curtain data directory, settings,
managed launch images/Soundbites, and copies of referenced local logo/image/audio files that
live outside Launch Curtain's own data directory. Saved service settings, including the
SteamGridDB API key, are part of the settings snapshot.

Restore backup asks for a Launch Curtain backup folder, validates its manifest and settings
before touching the live data, creates an automatic temporary rollback copy, restores the
backup, and remaps backed-up local file paths into the current Launch Curtain data directory
so the restored configuration is portable. A failed restore rolls back to the previous data.


## SteamGridDB Hero integration

Launch Curtain can search **Hero artwork only** through the official SteamGridDB API v2.
A personal SteamGridDB API key is required and can be entered in the Launch Curtain QAM;
QAM provides a provider-style button with the SteamGridDB site icon that opens the personal API-key page directly;
the key is stored locally in Launch Curtain settings. Launch Curtain does not bundle an
API key.

For native Steam games, Launch Curtain first queries Heroes by Steam AppID. For non-Steam
shortcuts, or when an AppID lookup has no results, it uses SteamGridDB autocomplete to
resolve the game and then queries that game's Heroes.

- SteamGridDB: `https://www.steamgriddb.com/`
- API v2: `https://www.steamgriddb.com/api/v2`
- Personal API key: `https://www.steamgriddb.com/profile/preferences/api`
- Terms: `https://www.steamgriddb.com/terms`

## iiSU Database attribution

**Special thanks to the iiSU team and community** for creating iiDB and for the incredible work behind its growing collection of game artwork and soundbites. Their passion for presentation, preservation, and beautifully curated game assets has made Launch Curtain’s iiDB integration possible. Huge thanks for building such a valuable resource for the gaming community and for making these assets accessible to projects like this one.

Launch Curtain can retrieve Assets and Soundbites from the **iiSU Database (iiDB)**, provided by **iiSU Network**. iiSU/iiDB content is subject to the terms published at
`https://iisu.network/license`; Launch Curtain's MIT license does not relicense that
third-party content.

- iiSU Network: `https://iisu.network/`
- iiSU/iiDB license: `https://iisu.network/license`
