# Playhub | Launch Curtain

Launch Curtain is a Decky Loader plugin for Windows.

This plugin is a Windows exclusive, so if you are on Linux it's not gonna work.

It shows a clean fullscreen loading screen when you start a game from Steam Big
Picture, so desktop flashes, launchers, and awkward PC windows stay out of the
way.

The goal is simple: make launching PC games feel a little more like using a
console.

- To force the screen to disappear, just press ESC on your keyboard.

## Features

- Starts a loading curtain when Steam launches a game.
- Shows the game's Steam logo when possible, including Steam custom artwork
  and SteamGridDB logos exposed by Steam, including non-Steam shortcuts.
- Uses a black screen with a centered logo and a soft fade.
- Includes a short in-Steam transition so the curtain appears immediately.
- Adds a Windows fullscreen overlay for the messy launcher part.
- Hides itself after the real game window reaches fullscreen or after a short
  safety timeout.
- Can be dismissed with Escape or the close/back face button on common
  controllers.
- Keeps the Decky panel focused on settings, logo, and launch timeout only.
- Lets you choose your own logo instead of the default Playhub logo.
- Lets you adjust how long the curtain stays visible after the game is ready.
- Automatically follows the Steam/Decky UI language when possible.

## Languages

The Decky panel includes automatic translations for:

- English
- Italian
- French
- Spanish
- Portuguese
- Brazilian Portuguese
- German
- Dutch
- Ukrainian
- Chinese
- Japanese

## Custom Logo

Open Launch Curtain in Decky, go to `Logo`, and choose a PNG/JPG/WebP/BMP file.
The selected image is used in the center of the loading screen.

You can switch back to the default Playhub logo at any time.

When a Steam game logo is detected for a launch, that game logo is used first.
Your custom logo and the Playhub logo remain fallbacks.

## Install

Download the latest release zip, extract it, and copy the `launch-curtain` folder
to your Decky Loader plugins folder.

Restart Decky Loader after replacing the folder.

## Notes

Launch Curtain does not enable or change Steam Overlay settings.

It also does not close launchers, edit Steam shortcuts, or change Windows system
settings. It only displays and hides a loading screen around game launches.

## Development

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
```
