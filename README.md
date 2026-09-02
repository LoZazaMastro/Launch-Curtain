<div align="center">

# Launch Curtain

### From the menu to the game, without out-of-place windows.

Hides the desktop, launchers, and unpolished transitions behind a startup screen built for Steam Big Picture.

[![Release](https://img.shields.io/github/v/release/LoZazaMastro/Launch-Curtain?style=for-the-badge&label=Release&labelColor=111111&color=ffffff)](https://github.com/LoZazaMastro/Launch-Curtain/releases/latest)
[![Licenza MIT](https://img.shields.io/badge/Licenza-MIT-ffffff?style=for-the-badge&labelColor=111111)](LICENSE)

</div>

<img width="100%" alt="Launch Curtain in Steam Big Picture" src="https://github.com/user-attachments/assets/8dcaf273-50da-4db1-ad2a-ca172f1627bd" />

## A console-like boot experience even on Windows

Launch Curtain covers the moments when a game opens launchers, intermediate windows, or the desktop. The transition starts inside Steam, remains controllable via gamepad, and closes once the game reaches a stable full-screen state.

You can choose from three modes:

- **Modern:** draws the screen directly within the Big Picture interface; this is the default mode.
- **Classic:** uses the external Windows overlay from the 1.5 series.
- **Disabled:** leaves the original startup process.

Aesthetic settings per game are shared between Modern and Classic modes.

## What you can customize

- activation, exit delay, and behavior for each game;
- background, opacity, position, scale, and zoom;
- game logo, position, size, and shadow;
- startup status text;
- manual closing via controller or keyboard;
- local images, Steam logo, Playhub fallback, and results from supported providers;
- **Soundbites** per game, featuring previews, local importing, and dedicated volume;
- global Soundbite volume in the QAM, applied without changing individual title values.

## Sources and bulk operations

Backgrounds can be fetched from PlayStation Store, IGDB, AlphaCoders, Nintendo Store, Xbox Store, iiDB Assets, and SteamGridDB Heroes. SteamGridDB is queried exclusively for Heroes and requires a [personal API key](https://www.steamgriddb.com/profile/preferences/api).

The QAM can fill in missing Soundbites and iiDB Assets for installed games, manage exclusions, show titles with or without Soundbites, and clean up only the files managed by the plugin. Manually chosen artwork and audio files are never overwritten or deleted by automatic tasks.

## Backup and restore

**Create backup** saves settings, managed assets, and copies of referenced local files into a `Launch-Curtain-Backup-*` folder. **Restore backup** validates the content before touching active data, creates a rollback copy, and remaps local paths, making the backup transferable.

## Installation

You can install and update Launch Curtain from the [Playhub](https://github.com/LoZazaMastro/Playhub) Plugin Store, or manually:

1. download `Launch-Curtain_Installer-2.5.1.zip` from the [latest release](https://github.com/LoZazaMastro/Launch-Curtain/releases/latest);
2. enable Decky's developer mode;
3. choose **Decky → Settings → Developer → Install plugin from ZIP**;
4. after a manual replacement, completely exit Steam and reopen it: simply closing the window will not clear the frontend cache.

## Development

The maintained source is in `src/`; `dist/index.js` is a build artifact.

```powershell
node tools/build-local.mjs
node --check dist/index.js
python -m py_compile main.py
```

With dependencies installed, `npm run test`, `npm run build`, and `package-win.ps1` are also available.

## License and credits

Launch Curtain is distributed under the [MIT](LICENSE) license. Dependencies and attributions are collected in [NOTICE](NOTICE). Assets obtained from iiDB remain subject to the [iiSU Network license](https://iisu.network/license); the integration does not republish them under MIT.

Special thanks to the iiSU team and community for iiDB, its artwork, and the Soundbites.

<div align="center">

Created and maintained by **[LoZazaMastro](https://github.com/LoZazaMastro)**.

</div>
