# Playhub | Launch Curtain

Current version: **2.0.0**

Launch Curtain is a Windows-only Decky Loader plugin that hides desktop flashes,
launchers, and awkward PC windows while a game starts from Steam Big Picture.

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
  shadow, launch image, and background opacity.
- Local Steam and SteamGridDB logo discovery with a bundled Playhub fallback.
- PlayStation Store search with selectable game matches and Full HD/4K background
  extraction from the chosen product page.
- Additional IGDB and AlphaCoders background sources.
- A gamepad-friendly context-menu entry and grouped, collapsible settings pages.
- Automatic interface translations for 11 languages in the main Decky panel.

## Install

Install `Launch-Curtain_Installer-2.0.0.zip` through Decky Loader, or copy the
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
