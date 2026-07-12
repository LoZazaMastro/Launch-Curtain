import { SP_REACT, SP_JSX, DFL, toaster, openFilePicker } from "./decky";
import { I18N, getStrings } from "./strings";
import { playButtonHook } from "./PlayButtonLaunchHook";
import { getSettings, saveSettings, getStatus, getGameSettings, saveGameSettings, resetGameSettings, validateLaunchImagePath, getImagePreview, searchPlayStationGames, getPlayStationBackgrounds, applyPlayStationAsset, removePlayStationAsset, searchGoogleImages, downloadGoogleImage, buildGameCache, cleanupUnusedLaunchImages, startAutoMode, stopAutoMode, FILE_SELECTION_FILE } from "./backend";

// UI impostazioni + per-gioco + menu contestuale + rotte. Ricostruito dal dist.
const rowTextStyle = {
    fontSize: "12px",
    lineHeight: "16px",
    color: "var(--decky-text-color-secondary, #b8c0cc)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
};
function LaunchCurtainPageStyles() {
    return SP_JSX.jsx("style", { children: `
      .lc-settings-page { color: #fff; height: 100%; min-height: 0; }
      .lc-settings-page .lc-card { min-width: 0; box-sizing: border-box; padding: 14px 16px; margin: 0 0 12px; border-radius: 10px; background: rgba(255,255,255,.045); border: 1px solid rgba(255,255,255,.08); overflow: hidden; }
      .lc-settings-page .lc-card__header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 10px; min-width: 0; }
      .lc-settings-page .lc-card__heading { flex: 1; min-width: 0; }
      .lc-settings-page .lc-card__title { font-size: 15px; font-weight: 700; }
      .lc-settings-page .lc-card__desc { margin-top: 4px; font-size: 12px; line-height: 1.4; opacity: .66; overflow-wrap: anywhere; }
      .lc-settings-page .lc-card__body { display: flex; flex: 1 1 auto; min-width: 0; flex-direction: column; gap: 8px; }
      .lc-settings-page .lc-scraper-tabs { display: flex; gap: 8px; margin-bottom: 12px; min-width: 0; }
      .lc-settings-page .lc-scraper-tab { flex: 1 1 0; min-width: 0 !important; color: #fff !important; border: 1px solid rgba(255,255,255,.08) !important; background: rgba(255,255,255,.045) !important; }
      .lc-settings-page .lc-scraper-tab:hover,
      .lc-settings-page .lc-scraper-tab:focus,
      .lc-settings-page .lc-scraper-tab:focus-visible,
      .lc-settings-page .lc-scraper-tab:focus-within,
      .lc-settings-page .lc-scraper-tab.gpfocus,
      .lc-settings-page .lc-scraper-tab.focus,
      .lc-settings-page .lc-scraper-tab[data-focus-visible-added],
      .lc-settings-page .lc-scraper-tab--focused { color: #fff !important; opacity: 1 !important; background: rgba(255,255,255,.19) !important; border-color: rgba(255,255,255,.92) !important; outline: 3px solid rgba(255,255,255,.88) !important; outline-offset: -3px !important; box-shadow: 0 0 0 2px rgba(80,150,255,.7), inset 0 0 0 1px rgba(120,180,255,.5) !important; transform: translateY(-1px); }
      .lc-settings-page .lc-scraper-tab--active { color: #fff !important; background: rgba(255,255,255,.18) !important; border-color: rgba(255,255,255,.26) !important; }
      .lc-settings-page .lc-selected-game { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 12px; align-items: center; width: 100%; min-width: 0; box-sizing: border-box; padding: 10px; border-radius: 8px; background: rgba(255,255,255,.055); border: 1px solid rgba(255,255,255,.09); overflow: hidden; }
      .lc-settings-page .lc-appearance-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; align-items: stretch; width: 100%; min-width: 0; margin-bottom: 12px; }
      .lc-settings-page .lc-appearance-grid > .lc-card { display: flex; flex-direction: column; height: 100%; margin: 0; }
      .lc-settings-page .lc-results-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; width: 100%; min-width: 0; }
      .lc-settings-page .lc-background-result,
      .lc-settings-page .lc-playstation-result { width: 100% !important; max-width: 100%; min-width: 0; box-sizing: border-box; overflow: hidden; }
      .lc-settings-page .lc-background-result > *,
      .lc-settings-page .lc-playstation-result > * { min-width: 0; }
      .lc-settings-page .lc-close-button { width: 100%; margin: 8px 0 0; }
      .lc-editor-page .lc-card { margin: 0; }
      .lc-editor-page .lc-editor-layout { display: grid; grid-template-columns: minmax(0,1fr) 410px; gap: 16px; align-items: center; width: 100%; min-width: 0; }
      .lc-editor-page .lc-editor-preview { position: relative; width: 100%; min-width: 0; aspect-ratio: 16 / 9; overflow: hidden; border-radius: 9px; background: #000; border: 1px solid rgba(255,255,255,.14); box-sizing: border-box; }
      .lc-editor-page .lc-editor-preview__backdrop { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
      .lc-editor-page .lc-editor-preview__logo { position: absolute; width: 42%; max-height: 20%; object-fit: contain; transform-origin: center center; }
      .lc-editor-page .lc-editor-controls { width: 410px; max-width: 410px; min-width: 0; display: flex; flex-direction: column; gap: 8px; }
      .lc-editor-page .lc-editor-button-row { display: flex; gap: 8px; justify-content: stretch; min-width: 0; }
      .lc-editor-page .lc-editor-button-row > * { flex: 1 1 0; min-width: 0 !important; }
      .lc-editor-page .lc-editor-button-row--center > * { flex: 0 1 100%; }
      @media (max-width: 1180px) {
        .lc-editor-page .lc-editor-layout { grid-template-columns: 1fr; }
        .lc-editor-page .lc-editor-controls { width: 100%; max-width: none; }
      }
      @media (max-width: 1050px) {
        .lc-settings-page .lc-appearance-grid,
        .lc-settings-page .lc-results-grid { grid-template-columns: 1fr; }
      }
    ` });
}
function SettingsCard({ title, description, children, trailing, className = "" }) {
    return SP_JSX.jsxs(DFL.Focusable, { "flow-children": "vertical", className: `lc-card${className ? ` ${className}` : ""}`, children: [
        title || description || trailing ? SP_JSX.jsxs("div", { className: "lc-card__header", children: [
                SP_JSX.jsxs("div", { className: "lc-card__heading", children: [
                        title ? SP_JSX.jsx("div", { className: "lc-card__title", children: title }) : null,
                        description ? SP_JSX.jsx("div", { className: "lc-card__desc", children: description }) : null
                    ] }),
                trailing || null
            ] }) : null,
        SP_JSX.jsx("div", { className: "lc-card__body", children: children })
    ] });
}
function notify(result, strings) {
    toaster.toast({
        title: result.ok ? strings.toastTitle : strings.toastAttention,
        body: result.message
    });
}
function Content() {
    const strings = getStrings();
    const [settings, setSettings] = SP_REACT.useState(undefined);
    const [, setStatus] = SP_REACT.useState(undefined);
    const [busy, setBusy] = SP_REACT.useState(false);
    const [playStationBulkStatus, setPlayStationBulkStatus] = SP_REACT.useState(undefined);
    const refresh = async () => {
        try {
            const nextStatus = await getStatus();
            setStatus(nextStatus);
        }
        catch (error) {
            console.warn("Launch Curtain could not refresh status", error);
        }
    };
    SP_REACT.useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const nextSettings = await getSettings();
                if (mounted) {
                    playButtonHook.setSettingsCache(nextSettings);
                    playButtonHook.setLogoPath(nextSettings.custom_logo_path ?? "");
                    playButtonHook.setDefaultLogoPath(nextSettings.default_logo_path ?? "");
                    setSettings(nextSettings);
                }
            }
            catch (error) {
                console.warn("Launch Curtain could not load settings", error);
            }
            try {
                const nextStatus = await getStatus();
                if (mounted) {
                    setStatus(nextStatus);
                }
            }
            catch (error) {
                console.warn("Launch Curtain could not load status", error);
            }
        };
        load();
        const timer = window.setInterval(() => {
            refresh();
        }, 2000);
        return () => {
            mounted = false;
            window.clearInterval(timer);
        };
    }, []);
    const setAutoMode = async (checked) => {
        if (!settings) {
            return;
        }
        setBusy(true);
        try {
            const result = checked ? await startAutoMode() : await stopAutoMode();
            notify(result, strings);
            const nextSettings = await getSettings();
            playButtonHook.setEnabled(Boolean(nextSettings.auto_mode));
            playButtonHook.setSettingsCache(nextSettings);
            playButtonHook.setLogoPath(nextSettings.custom_logo_path ?? "");
            playButtonHook.setDefaultLogoPath(nextSettings.default_logo_path ?? "");
            setSettings(nextSettings);
            await refresh();
        }
        catch (error) {
            console.warn("Launch Curtain could not change auto mode", error);
            toaster.toast({
                title: strings.toastAttention,
                body: "Could not change Launch Curtain settings."
            });
        }
        finally {
            setBusy(false);
        }
    };
    const setTimeoutValue = async (seconds) => {
        if (!settings) {
            return;
        }
        const nextSettings = await saveSettings({
            curtain_timeout: seconds,
            launch_curtain_max_seconds: seconds
        });
        playButtonHook.setSettingsCache(nextSettings);
        playButtonHook.setLogoPath(nextSettings.custom_logo_path ?? "");
        playButtonHook.setDefaultLogoPath(nextSettings.default_logo_path ?? "");
        setSettings(nextSettings);
        await refresh();
    };
    const setExitDelayValue = async (seconds) => {
        if (!settings) {
            return;
        }
        const nextSettings = await saveSettings({ game_settle_seconds: seconds });
        playButtonHook.setSettingsCache(nextSettings);
        playButtonHook.setLogoPath(nextSettings.custom_logo_path ?? "");
        playButtonHook.setDefaultLogoPath(nextSettings.default_logo_path ?? "");
        setSettings(nextSettings);
        await refresh();
    };
    const setTimeoutEnabled = async (enabled) => {
        if (!settings) {
            return;
        }
        const nextSettings = await saveSettings({ timeout_enabled: enabled });
        playButtonHook.setSettingsCache(nextSettings);
        playButtonHook.setLogoPath(nextSettings.custom_logo_path ?? "");
        playButtonHook.setDefaultLogoPath(nextSettings.default_logo_path ?? "");
        setSettings(nextSettings);
        await refresh();
    };
    const setCurtainMode = async (mode) => {
        if (!settings) {
            return;
        }
        setBusy(true);
        try {
            const nextSettings = await saveSettings({ curtain_mode: mode });
            playButtonHook.setEnabled(mode !== "off");
            playButtonHook.setSettingsCache(nextSettings);
            playButtonHook.setLogoPath(nextSettings.custom_logo_path ?? "");
            playButtonHook.setDefaultLogoPath(nextSettings.default_logo_path ?? "");
            setSettings(nextSettings);
            await refresh();
        }
        finally {
            setBusy(false);
        }
    };
    const setShowLaunchInfo = async (enabled) => {
        if (!settings) {
            return;
        }
        const nextSettings = await saveSettings({ show_launch_info: enabled });
        playButtonHook.setSettingsCache(nextSettings);
        playButtonHook.setLogoPath(nextSettings.custom_logo_path ?? "");
        playButtonHook.setDefaultLogoPath(nextSettings.default_logo_path ?? "");
        setSettings(nextSettings);
    };
    const chooseLogo = async () => {
        if (!settings) {
            return;
        }
        setBusy(true);
        try {
            const picked = await openFilePicker(FILE_SELECTION_FILE, settings.custom_logo_path || "C:\\", true, false, undefined, undefined, false, true);
            const logoPath = picked.realpath || picked.path;
            const nextSettings = await saveSettings({ custom_logo_path: logoPath });
            playButtonHook.setLogoPath(nextSettings.custom_logo_path ?? "");
            playButtonHook.setDefaultLogoPath(nextSettings.default_logo_path ?? "");
            setSettings(nextSettings);
            await refresh();
        }
        catch (error) {
            console.warn("Launch Curtain logo picker failed", error);
            toaster.toast({
                title: strings.toastAttention,
                body: strings.logoPickerError
            });
        }
        finally {
            setBusy(false);
        }
    };
    const useDefaultLogo = async () => {
        if (!settings) {
            return;
        }
        setBusy(true);
        try {
            const nextSettings = await saveSettings({ custom_logo_path: "" });
            playButtonHook.setLogoPath("");
            playButtonHook.setDefaultLogoPath(nextSettings.default_logo_path ?? "");
            setSettings(nextSettings);
            await refresh();
        }
        finally {
            setBusy(false);
        }
    };
    const timeoutOptions = Array.from({ length: 12 }, (_item, index) => (index + 1) * 5).map((seconds) => ({
        data: seconds,
        label: `${seconds} s`
    }));
    const selectedTimeout = timeoutOptions.some((option) => option.data === settings?.curtain_timeout)
        ? settings?.curtain_timeout
        : 50;
    const exitDelayOptions = Array.from({ length: 11 }, (_item, seconds) => ({
        data: seconds,
        label: `${seconds} s`
    }));
    const selectedExitDelay = exitDelayOptions.some((option) => option.data === settings?.game_settle_seconds)
        ? settings?.game_settle_seconds
        : 3;
    const createGameCache = async () => {
        setBusy(true);
        try {
            const apps = collectSteamAppsForCache();
            const result = await buildGameCache({ apps });
            const nextSettings = await getSettings();
            playButtonHook.setSettingsCache(nextSettings);
            setSettings(nextSettings);
            toaster.toast({ title: strings.toastTitle, body: result.message || `Cached ${result.cached ?? apps.length} games.` });
        }
        catch (error) {
            console.warn("Launch Curtain cache build failed", error);
            toaster.toast({ title: strings.toastAttention, body: "Could not create Launch Curtain cache." });
        }
        finally {
            setBusy(false);
        }
    };
    const cleanupLaunchImages = async () => {
        setBusy(true);
        try {
            const result = await cleanupUnusedLaunchImages();
            toaster.toast({
                title: result.ok ? strings.toastTitle : strings.toastAttention,
                body: result.message || `Removed ${result.removed ?? 0} unused launch image(s).`
            });
        }
        catch (error) {
            console.warn("Launch Curtain launch image cleanup failed", error);
            toaster.toast({ title: strings.toastAttention, body: "Could not clean unused launch images." });
        }
        finally {
            setBusy(false);
        }
    };
    const runPlayStationBulk = async (remove = false) => {
        const games = collectSteamAppsForCache()
            .filter((game) => !game.is_shortcut && game.title && !/^App \d+$/i.test(game.title))
            .sort((a, b) => String(a.title).localeCompare(String(b.title)));
        if (!games.length)
            return;
        setBusy(true);
        let applied = 0;
        let skipped = 0;
        let failed = 0;
        try {
            for (let index = 0; index < games.length; index += 1) {
                const game = games[index];
                setPlayStationBulkStatus({ title: game.title, current: index + 1, total: games.length, remove });
                const result = remove
                    ? await removePlayStationAsset({ app_id: game.app_id })
                    : await applyPlayStationAsset({ app_id: game.app_id, title: game.title });
                if (result?.ok && (remove ? result.removed : true))
                    applied += 1;
                else if (result?.skipped || (remove && result?.ok))
                    skipped += 1;
                else
                    failed += 1;
            }
            const nextSettings = await getSettings();
            playButtonHook.setSettingsCache(nextSettings);
            setSettings(nextSettings);
            toaster.toast({
                title: strings.toastTitle,
                body: `${remove ? strings.playStationBulkRemoved : strings.playStationBulkApplied}: ${applied}. ${strings.playStationBulkSkipped}: ${skipped}. ${strings.playStationBulkFailed}: ${failed}.`
            });
        }
        catch (error) {
            console.warn("Launch Curtain PlayStation bulk failed", error);
            toaster.toast({ title: strings.toastAttention, body: strings.playStationBulkError });
        }
        finally {
            setPlayStationBulkStatus(undefined);
            setBusy(false);
        }
    };
    const curtainModeOptions = [
        { data: "modern", label: strings.modeModern ?? I18N.en.modeModern ?? "Modern (in Steam UI)" },
        { data: "classic", label: strings.modeClassic ?? I18N.en.modeClassic ?? "Classic (overlay window)" },
        { data: "off", label: strings.modeOff ?? I18N.en.modeOff ?? "Off" }
    ];
    const selectedCurtainMode = settings?.curtain_mode ?? "modern";
    return SP_JSX.jsxs(SP_JSX.Fragment, { children: [
        SP_JSX.jsxs(DFL.PanelSection, { "flow-children": "column", title: strings.automation, children: [
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.DropdownItem, { label: strings.launchMode ?? I18N.en.launchMode ?? "Launch mode", rgOptions: curtainModeOptions, selectedOption: selectedCurtainMode, disabled: busy || !settings, onChange: (option) => {
                    if (typeof option.data === "string") void setCurtainMode(option.data);
                } }) }),
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ToggleField, { label: strings.launchInfo ?? I18N.en.launchInfo ?? "Launch info", checked: Boolean(settings?.show_launch_info), disabled: busy || !settings, onChange: (checked) => { void setShowLaunchInfo(checked); } }) }),
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ToggleField, { label: strings.timeoutEnabled ?? I18N.en.timeoutEnabled ?? "Enable timeout", checked: settings?.timeout_enabled ?? false, disabled: busy || !settings, onChange: (checked) => { void setTimeoutEnabled(checked); } }) }),
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx("div", { style: { ...rowTextStyle, whiteSpace: "normal" }, children: (settings?.timeout_enabled ?? false)
                    ? (strings.timeoutHelp ?? I18N.en.timeoutHelp ?? "How long the launch screen can stay visible while waiting for the game to become fullscreen.")
                    : (strings.timeoutDisabledHelp ?? I18N.en.timeoutDisabledHelp ?? "When disabled, the launch screen hides only after fullscreen detection or manual close.") }) }),
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.DropdownItem, { label: strings.timeout, rgOptions: timeoutOptions, selectedOption: selectedTimeout, disabled: busy || !settings || !(settings.timeout_enabled ?? false), onChange: (option) => {
                    if (typeof option.data === "number") void setTimeoutValue(option.data);
                } }) }),
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx("div", { style: { ...rowTextStyle, whiteSpace: "normal" }, children: strings.exitDelayHelp ?? I18N.en.exitDelayHelp ?? "How long Launch Curtain stays visible after detecting that the game is ready." }) }),
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.DropdownItem, { label: strings.exitDelay ?? I18N.en.exitDelay ?? "Exit delay", rgOptions: exitDelayOptions, selectedOption: selectedExitDelay, disabled: busy || !settings, onChange: (option) => {
                    if (typeof option.data === "number") void setExitDelayValue(option.data);
                } }) }),
            playStationBulkStatus ? SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsxs("div", { style: { ...rowTextStyle, whiteSpace: "normal", fontWeight: 650 }, children: [
                    `${playStationBulkStatus.remove ? strings.removingPlayStationAssets : strings.downloadingPlayStationAssets} (${playStationBulkStatus.current}/${playStationBulkStatus.total})`,
                    SP_JSX.jsx("div", { style: { color: "white", marginTop: 4 }, children: playStationBulkStatus.title })
                ] }) }) : null,
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: busy || !settings, onClick: () => { void runPlayStationBulk(false); }, children: strings.downloadPlayStationAssets }) }),
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: busy || !settings, onClick: () => { void runPlayStationBulk(true); }, children: strings.removePlayStationAssets }) })
        ] }),
        SP_JSX.jsxs(DFL.PanelSection, { "flow-children": "column", title: strings.logo, children: [
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx("div", { style: rowTextStyle, children: settings?.custom_logo_path ? `${strings.customLogo}: ${settings.custom_logo_path}` : strings.defaultLogo }) }),
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: busy || !settings, onClick: () => { void chooseLogo(); }, children: strings.chooseLogo }) }),
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: busy || !settings || !settings.custom_logo_path, onClick: () => { void useDefaultLogo(); }, children: strings.useDefaultLogo }) })
        ] }),
        SP_JSX.jsxs(DFL.PanelSection, { "flow-children": "column", title: strings.maintenance, children: [
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: busy || !settings, onClick: () => { void createGameCache(); }, children: strings.refreshGameCache }) }),
            SP_JSX.jsx(DFL.PanelSectionRow, { "flow-children": "row", children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", disabled: busy || !settings, onClick: () => { void cleanupLaunchImages(); }, children: strings.deleteUnusedImages }) })
        ] })
    ] });
}

const getAppOverviewSafe = (appId) => {
    try {
        return globalThis.appStore?.GetAppOverviewByAppID?.(appId) ?? globalThis.window?.appStore?.GetAppOverviewByAppID?.(appId) ?? null;
    }
    catch (_error) {
        return null;
    }
};
const appNameForId = (appId) => {
    const overview = getAppOverviewSafe(appId);
    return overview?.display_name || overview?.localized_name || overview?.name || `App ${appId}`;
};
const collectSteamAppsForCache = () => {
    const byId = new Map();
    const add = (entry) => {
        const appId = Number(entry?.appid ?? entry?.app_id ?? entry?.unAppID ?? entry?.nAppID ?? entry);
        if (!Number.isFinite(appId) || appId <= 0)
            return;
        const overview = getAppOverviewSafe(appId) || entry;
        byId.set(appId, {
            app_id: appId,
            title: overview?.display_name || overview?.localized_name || overview?.name || entry?.title || `App ${appId}`,
            is_shortcut: Boolean(overview?.BIsShortcut?.() || overview?.BIsModOrShortcut?.() || Number(overview?.app_type) === 1073741824 || appId >= 2147483648)
        });
    };
    try {
        globalThis.appStore?.allApps?.forEach?.(add);
        globalThis.appStore?.m_mapAppOverview?.forEach?.(add);
        globalThis.window?.appStore?.allApps?.forEach?.(add);
        globalThis.window?.appStore?.m_mapAppOverview?.forEach?.(add);
    }
    catch (_error) {
        // Steam changes these internals often; cache creation remains best effort.
    }
    return Array.from(byId.values());
};
const currentRouteAppId = () => {
    const paths = [
        globalThis.Router?.WindowStore?.GamepadUIMainWindowInstance?.m_history?.location?.pathname,
        globalThis.Router?.WindowStore?.GamepadUIMainWindowInstance?.m_history?.location?.hash,
        globalThis.window?.location?.pathname,
        globalThis.window?.location?.hash
    ];
    for (const path of paths) {
        const match = String(path || "").match(/launch-curtain\/(\d+)/i);
        if (match) {
            const appId = Number(match[1]);
            if (Number.isFinite(appId) && appId > 0)
                return appId;
        }
    }
    return 0;
};
const appIdFromRouteParams = (params) => {
    const appId = Number(params?.appid ?? params?.appId);
    return Number.isFinite(appId) && appId > 0 ? appId : 0;
};
const getLaunchCurtainRouteAppId = (pathname) => {
    const path = pathname || globalThis.window?.location?.pathname || "";
    const match = String(path || "").match(/\/launch-curtain\/(\d+)/);
    if (!match)
        return 0;
    return normalizeMenuAppId(match[1]);
};
const pageStyle = { padding: 24, paddingTop: 86, paddingBottom: 196, minHeight: "100%", width: "100%", minWidth: 0, boxSizing: "border-box", scrollPaddingTop: 86, scrollPaddingBottom: 196 };
const editorPageStyle = { ...pageStyle, minHeight: "calc(100vh - 282px)", display: "flex", flexDirection: "column", justifyContent: "center" };
const wallpaperResultsStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
};
const wallpaperResultRowStyle = {
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    overflow: "hidden",
    borderRadius: "0.4rem",
    padding: "0.6rem",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid transparent",
    display: "grid",
    gridTemplateColumns: "minmax(14.3rem, 36%) minmax(0, 1fr) minmax(7.25rem, auto)",
    gap: "0.6rem",
    alignItems: "center"
};
const wallpaperPreviewStyle = {
    width: "100%",
    aspectRatio: "16 / 9",
    objectFit: "cover",
    borderRadius: "0.35rem",
    background: "rgba(0,0,0,0.25)"
};
const playStationCoverStyle = {
    width: "100%",
    aspectRatio: "1 / 1",
    objectFit: "cover",
    borderRadius: "0.35rem",
    background: "rgba(0,0,0,0.25)"
};
const toFileUrlForUi = (path) => {
    if (!path?.trim?.())
        return "";
    const normalized = path.replace(/\\/g, "/");
    const prefixed = normalized.startsWith("/") ? normalized : `/${normalized}`;
    return `file://${encodeURI(prefixed)}`;
};
const focusTextInputWithSteamKeyboard = (element) => {
    if (!element)
        return;
    try {
        element.focus?.();
        element.select?.();
    }
    catch (_error) {
        // Best effort only.
    }
    try {
        const input = globalThis.SteamClient?.Input;
        const rect = element.getBoundingClientRect?.();
        if (input?.ShowFloatingGamepadTextInput && rect) {
            input.ShowFloatingGamepadTextInput(0, rect.left, rect.top, rect.width, rect.height);
            return;
        }
        if (input?.ShowGamepadTextInput) {
            input.ShowGamepadTextInput(0, 0, "", String(element.value || ""), 256);
            return;
        }
        globalThis.SteamClient?.System?.ShowVirtualKeyboard?.();
    }
    catch (error) {
        console.warn("Launch Curtain could not open Steam keyboard", error);
    }
};
const nativeTextFieldComponent = () => DFL.TextField || DFL.TextInput || DFL.TextEntry || DFL.TextBox || null;
const textValueFromChange = (eventOrValue) => {
    if (typeof eventOrValue === "string")
        return eventOrValue;
    return String(eventOrValue?.target?.value ?? eventOrValue?.currentTarget?.value ?? eventOrValue?.value ?? "");
};
function SearchQuerySteamField({ label, value, disabled, placeholder, inputRef, onChange, onBlur, openKeyboard }) {
    const NativeTextField = nativeTextFieldComponent();
    const handleChange = (eventOrValue) => onChange(textValueFromChange(eventOrValue));
    if (NativeTextField) {
        return SP_JSX.jsx(NativeTextField, { label: label, value: value, disabled: disabled, placeholder: placeholder, focusable: true, ref: inputRef, onChange: handleChange, onBlur: onBlur, onFocus: () => {}, onClick: openKeyboard, onOKButton: openKeyboard, onSubmit: openKeyboard });
    }
    return SP_JSX.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "0.35rem", width: "100%" }, children: [
        SP_JSX.jsx("div", { style: { ...rowTextStyle, whiteSpace: "normal" }, children: label }),
        SP_JSX.jsx(DFL.Focusable, { focusable: true, "flow-children": "row", noFocusRing: false, onClick: openKeyboard, onPointerDown: openKeyboard, onOKButton: openKeyboard, onKeyDown: (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openKeyboard();
                }
            }, style: { width: "100%" }, children: SP_JSX.jsx("input", { ref: inputRef, tabIndex: 0, value: value, disabled: disabled, placeholder: placeholder, inputMode: "text", onFocus: () => {}, onClick: openKeyboard, onPointerDown: openKeyboard, onChange: handleChange, onBlur: onBlur, style: {
                    width: "100%",
                    boxSizing: "border-box",
                    borderRadius: "0.35rem",
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "rgba(0,0,0,0.25)",
                    color: "white",
                    padding: "0.55rem 0.65rem",
                    fontSize: "0.9rem"
                } }) })
    ] });
}
const fallbackWallpaperPreview = (event, result) => {
    const image = event.currentTarget;
    const current = String(image.getAttribute?.("src") || image.src || "");
    const candidates = [result?.preview_url, result?.image_url, result?.thumbnail_url]
        .filter((url, index, all) => Boolean(url) && all.indexOf(url) === index);
    const next = candidates.find((url) => url !== current && url !== image.src);
    if (next) {
        image.src = next;
        return;
    }
    image.style.opacity = "0.35";
};
const numericDropdownValue = (option) => {
    const candidate = option?.data ?? option?.value ?? option;
    const value = Number(candidate);
    return Number.isFinite(value) ? value : undefined;
};
const logoShadowFilter = (opacityPercent, blurPercent, scale) => {
    const opacity = Math.max(0, Math.min(100, Number(opacityPercent) || 0)) / 100;
    if (!(opacity > 0)) return "none";
    const bl = Math.max(0, Math.min(100, Number(blurPercent) || 0));
    const s = typeof scale === "number" ? scale : 1;
    const blurPx = Math.round((3 + (bl / 100) * 55) * s);
    const offPx = Math.max(1, Math.round(8 * s));
    const one = `drop-shadow(0 ${offPx}px ${blurPx}px rgba(0,0,0,${opacity}))`;
    return one + " " + one;
};
function LogoEditorSurface({ backdropPath, logoSource, fallbackLogoPath, initial, onSave, onClose, strings }) {
    const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, Math.round(Number(value))));
    const [draft, setDraft] = SP_REACT.useState({
        logo_position_x: clamp(initial?.logo_position_x ?? 50, 0, 100),
        logo_position_y: clamp(initial?.logo_position_y ?? 50, 0, 100),
        logo_scale: clamp(initial?.logo_scale ?? 100, 50, 200),
        background_opacity: clamp(initial?.background_opacity ?? 100, 0, 100),
        logo_shadow_opacity: clamp(initial?.logo_shadow_opacity ?? 0, 0, 100),
        logo_shadow_blur: clamp(initial?.logo_shadow_blur ?? 40, 0, 100)
    });
    const draftRef = SP_REACT.useRef(draft);
    const closingRef = SP_REACT.useRef(false);
    const [backdropUrl, setBackdropUrl] = SP_REACT.useState("");
    const [logoUrl, setLogoUrl] = SP_REACT.useState("");
    const [saving, setSaving] = SP_REACT.useState(false);
    const updateDraft = (partial) => setDraft((current) => {
        const next = { ...current, ...partial };
        draftRef.current = next;
        return next;
    });
    SP_REACT.useEffect(() => {
        draftRef.current = draft;
    }, [draft]);
    SP_REACT.useEffect(() => () => {
        if (!closingRef.current) {
            closingRef.current = true;
            void onSave(draftRef.current).catch((error) => console.warn("Launch Curtain editor unmount autosave failed", error));
        }
    }, []);
    const move = (dx, dy) => updateDraft({
        logo_position_x: clamp(draftRef.current.logo_position_x + dx, 0, 100),
        logo_position_y: clamp(draftRef.current.logo_position_y + dy, 0, 100)
    });
    const resize = (delta) => updateDraft({ logo_scale: clamp(draftRef.current.logo_scale + delta, 50, 200) });
    const reset = () => updateDraft({ logo_position_x: 50, logo_position_y: 50, logo_scale: 100 });
    const saveAndClose = async () => {
        if (closingRef.current)
            return;
        closingRef.current = true;
        setSaving(true);
        try {
            await onSave(draftRef.current);
        }
        catch (error) {
            closingRef.current = false;
            console.warn("Launch Curtain editor autosave failed", error);
            toaster.toast({ title: strings.toastAttention, body: strings.editorSaveFailed || "Could not save the editor settings." });
            return;
        }
        finally {
            setSaving(false);
        }
        onClose();
    };
    const buttonStyle = { minWidth: "5.5rem" };
    const backgroundOpacityOptions = Array.from({ length: 11 }, (_item, index) => index * 10).map((value) => ({ data: value, label: `${value}%` }));
    const logoShadowOpacityOptions = Array.from({ length: 11 }, (_item, index) => index * 10).map((value) => ({ data: value, label: `${value}%` }));
    const logoShadowBlurOptions = Array.from({ length: 11 }, (_item, index) => index * 10).map((value) => ({ data: value, label: `${value}%` }));
    SP_REACT.useEffect(() => {
        let cancelled = false;
        const loadPreview = async () => {
            try {
                const [backdrop, logo] = await Promise.all([
                    getImagePreview({ source: backdropPath || "" }),
                    getImagePreview({ source: logoSource || "", fallback: fallbackLogoPath || "" })
                ]);
                if (cancelled)
                    return;
                setBackdropUrl(backdrop?.url || "");
                setLogoUrl(logo?.url || "");
            }
            catch (error) {
                console.warn("Launch Curtain logo placement preview failed", error);
                if (!cancelled) {
                    setBackdropUrl(toFileUrlForUi(backdropPath || ""));
                    setLogoUrl(logoSource ? playButtonHook.normalizeLogoSource(logoSource) : toFileUrlForUi(fallbackLogoPath || ""));
                }
            }
        };
        void loadPreview();
        return () => { cancelled = true; };
    }, [backdropPath, logoSource, fallbackLogoPath]);
    const handlePreviewKeyDown = (event) => {
        switch (event.key) {
            case "ArrowUp": event.preventDefault(); move(0, -1); break;
            case "ArrowDown": event.preventDefault(); move(0, 1); break;
            case "ArrowLeft": event.preventDefault(); move(-1, 0); break;
            case "ArrowRight": event.preventDefault(); move(1, 0); break;
            default: break;
        }
    };
    return SP_JSX.jsxs(DFL.Focusable, { "flow-children": "vertical", noFocusRing: true, className: "launch-curtain-main lc-settings-page lc-editor-page", style: { position: "relative", height: "100%", minHeight: 0, display: "flex", flexDirection: "column" }, children: [
        SP_JSX.jsx(LaunchCurtainPageStyles, {}),
        SP_JSX.jsx(DFL.ScrollPanel, { children: SP_JSX.jsxs(DFL.Focusable, { "flow-children": "vertical", noFocusRing: true, style: editorPageStyle, children: [
            SP_JSX.jsx(SettingsCard, { title: strings.editorTitle, children: SP_JSX.jsxs("div", { className: "lc-editor-layout", children: [
                SP_JSX.jsx(DFL.Focusable, { focusable: true, noFocusRing: false, onKeyDown: handlePreviewKeyDown, className: "lc-editor-preview", children: [
                    backdropUrl ? SP_JSX.jsx("img", { src: backdropUrl, className: "lc-editor-preview__backdrop", style: { opacity: draft.background_opacity / 100 } }) : null,
                    logoUrl ? SP_JSX.jsx("img", { src: logoUrl, className: "lc-editor-preview__logo", style: {
                        left: `${draft.logo_position_x}%`,
                        top: `${draft.logo_position_y}%`,
                        transform: `translate(-50%, -50%) scale(${draft.logo_scale / 100})`,
                        filter: logoShadowFilter(draft.logo_shadow_opacity, draft.logo_shadow_blur, 0.32)
                    } }) : null
                ] }),
                SP_JSX.jsxs(DFL.Focusable, { "flow-children": "vertical", noFocusRing: true, className: "lc-editor-controls", children: [
                    SP_JSX.jsx(DFL.DropdownItem, { label: strings.backgroundOpacity, rgOptions: backgroundOpacityOptions, selectedOption: draft.background_opacity, onChange: (option) => { const value = numericDropdownValue(option); if (value !== undefined) updateDraft({ background_opacity: value }); } }),
                    SP_JSX.jsx(DFL.DropdownItem, { label: strings.logoShadowOpacity, rgOptions: logoShadowOpacityOptions, selectedOption: draft.logo_shadow_opacity, onChange: (option) => { const value = numericDropdownValue(option); if (value !== undefined) updateDraft({ logo_shadow_opacity: value }); } }),
                    SP_JSX.jsx(DFL.DropdownItem, { label: strings.logoShadowBlur ?? "Blur ombra del logo", rgOptions: logoShadowBlurOptions, selectedOption: draft.logo_shadow_blur, onChange: (option) => { const value = numericDropdownValue(option); if (value !== undefined) updateDraft({ logo_shadow_blur: value }); } }),
                    SP_JSX.jsx(DFL.Focusable, { "flow-children": "horizontal", noFocusRing: true, className: "lc-editor-button-row lc-editor-button-row--center", children: SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: () => move(0, -1), style: buttonStyle, children: strings.up }) }),
                    SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", noFocusRing: true, className: "lc-editor-button-row", children: [
                        SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: () => move(-1, 0), style: buttonStyle, children: strings.left }),
                        SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: reset, style: buttonStyle, children: strings.reset }),
                        SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: () => move(1, 0), style: buttonStyle, children: strings.right })
                    ] }),
                    SP_JSX.jsx(DFL.Focusable, { "flow-children": "horizontal", noFocusRing: true, className: "lc-editor-button-row lc-editor-button-row--center", children: SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: () => move(0, 1), style: buttonStyle, children: strings.down }) }),
                    SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", noFocusRing: true, className: "lc-editor-button-row", children: [
                        SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: () => resize(-10), style: buttonStyle, children: strings.smaller }),
                        SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: () => resize(10), style: buttonStyle, children: strings.bigger })
                    ] })
                ] })
            ] }) }),
            SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: saving, className: "lc-close-button", onClick: () => { void saveAndClose(); }, children: saving ? (strings.saving || "Saving...") : (strings.close || "Close") })
        ] }) })
    ] });
}
function LogoEditorPage() {
    const strings = getStrings();
    const routeParams = DFL.useParams();
    const appId = appIdFromRouteParams(routeParams) || currentRouteAppId();
    const [payload, setPayload] = SP_REACT.useState(undefined);
    SP_REACT.useEffect(() => {
        let cancelled = false;
        if (!appId)
            return () => { cancelled = true; };
        void getGameSettings({ app_id: appId }).then((next) => {
            if (!cancelled)
                setPayload(next);
        }).catch((error) => console.warn("Launch Curtain editor settings load failed", error));
        return () => { cancelled = true; };
    }, [appId]);
    if (!appId)
        return SP_JSX.jsx(DFL.ScrollPanel, { children: SP_JSX.jsx("div", { style: pageStyle, children: strings.noGameSelected }) });
    if (!payload)
        return SP_JSX.jsx(DFL.ScrollPanel, { children: SP_JSX.jsx("div", { style: pageStyle, children: strings.loading }) });
    const raw = payload.settings || {};
    const resolved = payload.resolved || {};
    const saveEditor = async (next) => {
        await saveGameSettings({ app_id: appId, settings: next });
        const allSettings = await getSettings();
        playButtonHook.setSettingsCache(allSettings);
    };
    const closeEditor = () => {
        try {
            if (typeof DFL.Navigation?.NavigateBack === "function") {
                DFL.Navigation.NavigateBack();
                return;
            }
        }
        catch (_error) {}
        DFL.Navigation?.Navigate?.(`/launch-curtain/${appId}`);
    };
    return SP_JSX.jsx(LogoEditorSurface, {
        backdropPath: resolved.fullscreen_image_path || raw.fullscreen_image_path || "",
        logoSource: payload.logo_source || payload.default_logo_path || "",
        fallbackLogoPath: payload.default_logo_path || "",
        initial: resolved,
        strings,
        onSave: saveEditor,
        onClose: closeEditor
    }, `launch-curtain-editor-${appId}`);
}
function GameSettingsPage() {
    const strings = getStrings();
    const routeParams = DFL.useParams();
    const paramsAppId = appIdFromRouteParams(routeParams);
    const [routePathname, setRoutePathname] = SP_REACT.useState(globalThis.window?.location?.pathname || "");
    const routePathAppId = getLaunchCurtainRouteAppId(routePathname);
    const appId = paramsAppId || routePathAppId || currentRouteAppId();
    const [payload, setPayload] = SP_REACT.useState(undefined);
    const [busy, setBusy] = SP_REACT.useState(false);
    const [imageResolution, setImageResolution] = SP_REACT.useState("3840x2160");
    const [imageSearchQuery, setImageSearchQuery] = SP_REACT.useState("");
    const [imageSearchBusy, setImageSearchBusy] = SP_REACT.useState(false);
    const [imageResults, setImageResults] = SP_REACT.useState([]);
    const [imageSearchMessage, setImageSearchMessage] = SP_REACT.useState("");
    const [selectedImageId, setSelectedImageId] = SP_REACT.useState("");
    const [playStationBusy, setPlayStationBusy] = SP_REACT.useState(false);
    const [playStationGames, setPlayStationGames] = SP_REACT.useState([]);
    const [playStationBackgrounds, setPlayStationBackgrounds] = SP_REACT.useState([]);
    const [playStationMessage, setPlayStationMessage] = SP_REACT.useState("");
    const [selectedPlayStationGameId, setSelectedPlayStationGameId] = SP_REACT.useState("");
    const [selectedPlayStationGame, setSelectedPlayStationGame] = SP_REACT.useState(undefined);
    const [activeScraper, setActiveScraper] = SP_REACT.useState("playstation");
    const [focusedScraper, setFocusedScraper] = SP_REACT.useState("");
    const [backdropPreviewUrl, setBackdropPreviewUrl] = SP_REACT.useState("");
    const exitDelayOptions = Array.from({ length: 11 }, (_item, seconds) => ({ data: seconds, label: `${seconds} s` }));
    const forceModeOptions = [
        { data: "auto", label: strings.modeAuto ?? I18N.en.modeAuto ?? "Auto" },
        { data: "classic", label: strings.modeClassic ?? I18N.en.modeClassic ?? "Classic (overlay window)" },
        { data: "modern", label: strings.modeModern ?? I18N.en.modeModern ?? "Modern (in Steam UI)" }
    ];
    const gameTimeoutOptions = Array.from({ length: 12 }, (_item, index) => (index + 1) * 5).map((seconds) => ({ data: seconds, label: `${seconds} s` }));
    const gameTitle = appNameForId(appId);
    const defaultSearchQuery = /^App \d+$/i.test(gameTitle) ? "" : `${gameTitle}`;
    const searchInputRef = SP_REACT.useRef(null);
    const playStationSearchInputRef = SP_REACT.useRef(null);
    const focusSearchInput = () => focusTextInputWithSteamKeyboard(searchInputRef.current);
    const focusPlayStationSearchInput = () => focusTextInputWithSteamKeyboard(playStationSearchInputRef.current);
    SP_REACT.useEffect(() => {
        let lastPath = globalThis.window?.location?.pathname || "";
        const timer = globalThis.window?.setInterval?.(() => {
            const currentPath = globalThis.window?.location?.pathname || "";
            if (currentPath !== lastPath) {
                lastPath = currentPath;
                setRoutePathname(currentPath);
            }
        }, 150);
        return () => {
            if (timer)
                globalThis.window?.clearInterval?.(timer);
        };
    }, []);
    SP_REACT.useEffect(() => {
        let cancelled = false;
        setPayload(undefined);
        setImageResults([]);
        setImageSearchMessage("");
        setSelectedImageId("");
        setPlayStationGames([]);
        setPlayStationBackgrounds([]);
        setPlayStationMessage("");
        setSelectedPlayStationGameId("");
        setSelectedPlayStationGame(undefined);
        setImageSearchQuery(defaultSearchQuery);
        if (!appId) {
            setBusy(false);
            return () => {
                cancelled = true;
            };
        }
        setBusy(true);
        void getGameSettings({ app_id: appId }).then((next) => {
            if (cancelled)
                return;
            setPayload(next);
            const savedQuery = String(next?.settings?.background_search_query || "").trim();
            setImageSearchQuery(savedQuery || defaultSearchQuery);
        }).finally(() => {
            if (!cancelled)
                setBusy(false);
        });
        return () => {
            cancelled = true;
        };
    }, [appId, defaultSearchQuery]);
    const raw = payload?.settings || {};
    const resolved = payload?.resolved || {};
    const selectedBackdropPath = resolved.fullscreen_image_path || raw.fullscreen_image_path || "";
    SP_REACT.useEffect(() => {
        let cancelled = false;
        setBackdropPreviewUrl("");
        if (!selectedBackdropPath) {
            return () => { cancelled = true; };
        }
        const loadPreview = async () => {
            try {
                const preview = await getImagePreview({ source: selectedBackdropPath });
                if (!cancelled) {
                    setBackdropPreviewUrl(preview?.url || toFileUrlForUi(selectedBackdropPath));
                }
            }
            catch (error) {
                console.warn("Launch Curtain selected backdrop preview failed", error);
                if (!cancelled) {
                    setBackdropPreviewUrl(toFileUrlForUi(selectedBackdropPath));
                }
            }
        };
        void loadPreview();
        return () => {
            cancelled = true;
        };
    }, [selectedBackdropPath]);
    const selectedServices = activeScraper === "playstation" ? [] : [activeScraper];
    const savePartial = async (partial) => {
        if (!appId)
            return;
        const currentAppId = appId;
        setBusy(true);
        try {
            const next = await saveGameSettings({ app_id: currentAppId, settings: partial });
            if ((currentRouteAppId() || paramsAppId || currentAppId) === currentAppId)
                setPayload(next);
            const allSettings = await getSettings();
            playButtonHook.setSettingsCache(allSettings);
        }
        finally {
            setBusy(false);
        }
    };
    const chooseBackdrop = async () => {
        setBusy(true);
        try {
            let startPath = raw.fullscreen_image_path || "C:\\";
            for (let attempts = 0; attempts < 8; attempts += 1) {
                const picked = await openFilePicker(FILE_SELECTION_FILE, startPath, true, false, undefined, undefined, false, true);
                const selectedPath = picked.realpath || picked.path || "";
                if (!selectedPath) {
                    return;
                }
                const validation = await validateLaunchImagePath({ path: selectedPath });
                if (validation.ok && validation.is_file) {
                    await savePartial({ fullscreen_image_path: validation.path || selectedPath });
                    return;
                }
                if (validation.is_dir && validation.path) {
                    startPath = validation.path;
                    continue;
                }
                toaster.toast({ title: strings.toastAttention, body: strings.chooseFileNotFolder });
                return;
            }
            toaster.toast({ title: strings.toastAttention, body: strings.chooseFileNotFolder });
        }
        catch (error) {
            console.warn("Launch Curtain backdrop picker failed", error);
            toaster.toast({ title: strings.toastAttention, body: strings.imagePickerFailed });
        }
        finally {
            setBusy(false);
        }
    };
    const searchImages = async () => {
        const title = /^App \d+$/i.test(gameTitle) ? "" : gameTitle;
        const query = imageSearchQuery.trim();
        if (!title || !query) {
            setImageSearchMessage(!title ? strings.gameTitleUnavailable : strings.enterSearchQuery);
            return;
        }
        setImageSearchBusy(true);
        setImageSearchMessage("");
        try {
            persistSearchQuery(query);
            const result = await searchGoogleImages({ title, query, resolution: imageResolution, services: selectedServices });
            const results = Array.isArray(result.results) ? result.results : [];
            setImageResults(results);
            setSelectedImageId(results[0]?.id || results[0]?.image_url || "");
            setImageSearchMessage(results.length ? strings.imagesFound : strings.noImagesFound);
        }
        catch (error) {
            console.warn("Launch Curtain background image search failed", error);
            setImageResults([]);
            setImageSearchMessage(strings.searchFailed);
        }
        finally {
            setImageSearchBusy(false);
        }
    };
    const searchPlayStationProducts = async () => {
        const query = imageSearchQuery.trim();
        if (!query) {
            setPlayStationMessage(strings.enterSearchQuery);
            return;
        }
        setPlayStationBusy(true);
        setPlayStationMessage("");
        setPlayStationBackgrounds([]);
        setSelectedPlayStationGameId("");
        setSelectedPlayStationGame(undefined);
        try {
            persistSearchQuery(query);
            const result = await searchPlayStationGames({ query });
            const results = Array.isArray(result?.results) ? result.results : [];
            setPlayStationGames(results);
            setPlayStationMessage(results.length ? strings.choosePlayStationGame : strings.noPlayStationGames);
        }
        catch (error) {
            console.warn("Launch Curtain PlayStation game search failed", error);
            setPlayStationGames([]);
            setPlayStationMessage(strings.searchFailed);
        }
        finally {
            setPlayStationBusy(false);
        }
    };
    const selectPlayStationGame = async (game) => {
        const resultId = game?.id || game?.product_id || game?.product_url || "";
        if (!resultId || !game?.product_url)
            return;
        setSelectedPlayStationGameId(resultId);
        setSelectedPlayStationGame(game);
        setPlayStationBusy(true);
        setPlayStationBackgrounds([]);
        setPlayStationMessage(`${strings.readingBackgrounds} ${game.title || ""}`.trim());
        try {
            const result = await getPlayStationBackgrounds({
                product_url: game.product_url,
                title: game.title || imageSearchQuery.trim() || gameTitle,
                resolution: imageResolution
            });
            const backgrounds = Array.isArray(result?.results) ? result.results : [];
            setPlayStationBackgrounds(backgrounds);
            setSelectedImageId(backgrounds[0]?.id || backgrounds[0]?.image_url || "");
            setPlayStationMessage(backgrounds.length ? strings.chooseBackground : strings.noBackgrounds);
        }
        catch (error) {
            console.warn("Launch Curtain PlayStation background lookup failed", error);
            setPlayStationMessage(strings.searchFailed);
        }
        finally {
            setPlayStationBusy(false);
        }
    };
    const persistSearchQuery = (value = imageSearchQuery) => {
        if (!appId || !payload)
            return;
        const query = String(value || "").trim();
        const storedQuery = query && query !== defaultSearchQuery ? query : "";
        void saveGameSettings({ app_id: appId, settings: { background_search_query: storedQuery } }).then((next) => {
            if ((currentRouteAppId() || paramsAppId || appId) === appId)
                setPayload(next);
        }).catch((error) => console.warn("Launch Curtain search query save failed", error));
    };
    const downloadImage = async (image) => {
        const title = /^App \d+$/i.test(gameTitle) ? "" : gameTitle;
        const imageUrl = image?.image_url || image?.thumbnail_url || "";
        if (!title || !imageUrl) {
            return;
        }
        setBusy(true);
        try {
            const next = await downloadGoogleImage({ app_id: appId, title, resolution: image?.resolution || imageResolution, image_url: imageUrl });
            if (next.ok) {
                setPayload(next);
                const allSettings = await getSettings();
                playButtonHook.setSettingsCache(allSettings);
                toaster.toast({ title: strings.toastTitle, body: strings.imageDownloaded });
            }
            else {
                toaster.toast({ title: strings.toastAttention, body: strings.imageDownloadFailed });
            }
        }
        catch (error) {
            console.warn("Launch Curtain background image download failed", error);
            toaster.toast({ title: strings.toastAttention, body: strings.imageDownloadFailed });
        }
        finally {
            setBusy(false);
        }
    };
    const openLogoPlacement = () => {
        DFL.Navigation?.Navigate?.(`/launch-curtain/${appId}/editor`);
    };
    if (!appId) {
        return SP_JSX.jsx(DFL.ScrollPanel, { children: SP_JSX.jsx("div", { style: pageStyle, children: strings.noGameSelected }) });
    }
    const selectedExitDelay = exitDelayOptions.some((option) => option.data === (raw.exit_delay_seconds ?? resolved.exit_delay_seconds)) ? (raw.exit_delay_seconds ?? resolved.exit_delay_seconds) : (payload?.global_exit_delay_seconds ?? 3);
    const renderBackgroundResults = (results, loading = false) => results.length ? SP_JSX.jsx(DFL.Focusable, { "flow-children": "horizontal", noFocusRing: true, className: "lc-results-grid", children: results.map((result) => {
        const resultId = result.id || result.image_url;
        return SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", noFocusRing: true, onFocus: () => setSelectedImageId(resultId), className: "lc-background-result", style: { ...wallpaperResultRowStyle, border: selectedImageId === resultId ? "1px solid rgba(120,180,255,.85)" : wallpaperResultRowStyle.border }, children: [
            SP_JSX.jsx("img", { src: result.thumbnail_url || result.preview_url || result.image_url, onError: (event) => fallbackWallpaperPreview(event, result), style: wallpaperPreviewStyle }),
            SP_JSX.jsxs("div", { style: { minWidth: 0, overflow: "hidden", display: "flex", flexDirection: "column", gap: 4 }, children: [
                SP_JSX.jsx("div", { style: { fontWeight: 650, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: result.source || strings.background }),
                SP_JSX.jsx("span", { style: { fontSize: 12, opacity: .72, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: result.resolution || result.size || (result.width && result.height ? `${result.width}x${result.height}` : imageResolution) })
            ] }),
            SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: busy || loading, onClick: () => { void downloadImage(result); }, style: { width: "100%", minWidth: "7.25rem", maxWidth: "9rem" }, children: strings.download })
        ] }, resultId);
    }) }) : null;
    const renderPlayStationGames = () => playStationGames.length ? SP_JSX.jsx(DFL.Focusable, { "flow-children": "vertical", noFocusRing: true, style: { display: "flex", flexDirection: "column", gap: 8, width: "100%", minWidth: 0 }, children: playStationGames.map((game) => {
        const resultId = game.id || game.product_id || game.product_url;
        const isSelected = selectedPlayStationGameId === resultId;
        return SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", noFocusRing: true, onFocus: () => setSelectedPlayStationGameId(resultId), className: "lc-playstation-result", style: { ...wallpaperResultRowStyle, gridTemplateColumns: "minmax(0,1fr) minmax(9rem,auto)", border: isSelected ? "1px solid rgba(120,180,255,.85)" : wallpaperResultRowStyle.border }, children: [
            SP_JSX.jsx("div", { style: { minWidth: 0, maxWidth: "100%", fontWeight: 650, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: game.title || strings.playStationGame }),
            SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: busy || playStationBusy, onClick: () => { void selectPlayStationGame(game); }, style: { width: "100%", minWidth: "9rem", maxWidth: "11rem" }, children: playStationBusy && isSelected ? strings.loading : strings.viewBackgrounds })
        ] }, resultId);
    }) }) : null;
    const scraperTabs = (items, current, onChange) => SP_JSX.jsx(DFL.Focusable, { "flow-children": "horizontal", noFocusRing: true, className: "lc-scraper-tabs", children: items.map((item) => {
        const focused = focusedScraper === item.id;
        return SP_JSX.jsx(DFL.DialogButton, { focusable: true, className: `lc-scraper-tab${current === item.id ? " lc-scraper-tab--active" : ""}${focused ? " lc-scraper-tab--focused" : ""}`, onFocus: () => setFocusedScraper(item.id), onBlur: () => setFocusedScraper((value) => value === item.id ? "" : value), onMouseEnter: () => setFocusedScraper(item.id), onMouseLeave: () => setFocusedScraper((value) => value === item.id ? "" : value), onClick: () => onChange(item.id), children: item.label }, item.id);
    }) });
    const scraperContent = activeScraper === "playstation" ? SP_JSX.jsxs(SP_REACT.Fragment, { children: [
        SP_JSX.jsx(SearchQuerySteamField, { label: strings.searchQuery, value: imageSearchQuery, disabled: busy || playStationBusy || !payload, placeholder: defaultSearchQuery || strings.playStationGame, inputRef: playStationSearchInputRef, onChange: setImageSearchQuery, onBlur: () => persistSearchQuery(), openKeyboard: focusPlayStationSearchInput }),
        SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: busy || playStationBusy || !payload || !imageSearchQuery.trim(), onClick: () => { void searchPlayStationProducts(); }, children: playStationBusy ? strings.searchingPlayStation : strings.searchPlayStation }),
        playStationMessage ? SP_JSX.jsx("div", { style: { ...rowTextStyle, whiteSpace: "normal" }, children: playStationMessage }) : null,
        selectedPlayStationGame ? SP_JSX.jsxs(SP_REACT.Fragment, { children: [
            SP_JSX.jsxs("div", { className: "lc-selected-game", children: [
                SP_JSX.jsx("div", { style: { minWidth: 0, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: selectedPlayStationGame.title || strings.playStationGame }),
                SP_JSX.jsx(DFL.DialogButton, { focusable: true, onClick: () => { setSelectedPlayStationGame(undefined); setSelectedPlayStationGameId(""); setPlayStationBackgrounds([]); setPlayStationMessage(strings.choosePlayStationGame); }, style: { minWidth: "10rem", maxWidth: "12rem" }, children: strings.backToResults })
            ] }),
            renderBackgroundResults(playStationBackgrounds, playStationBusy)
        ] }) : renderPlayStationGames()
    ] }) : SP_JSX.jsxs(SP_REACT.Fragment, { children: [
        SP_JSX.jsx(SearchQuerySteamField, { label: strings.searchQuery, value: imageSearchQuery, disabled: busy || imageSearchBusy || !payload, placeholder: defaultSearchQuery || strings.gameWallpaper, inputRef: searchInputRef, onChange: setImageSearchQuery, onBlur: () => persistSearchQuery(), openKeyboard: focusSearchInput }),
        SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: busy || imageSearchBusy || !payload || /^App \d+$/i.test(gameTitle) || !imageSearchQuery.trim(), onClick: () => { void searchImages(); }, children: imageSearchBusy ? strings.searching : strings.search }),
        imageSearchMessage ? SP_JSX.jsx("div", { style: { ...rowTextStyle, whiteSpace: "normal" }, children: imageSearchMessage }) : null,
        renderBackgroundResults(imageResults, imageSearchBusy)
    ] });
    const pageContent = SP_JSX.jsxs(SP_REACT.Fragment, { children: [
        SP_JSX.jsx(SettingsCard, { children: SP_JSX.jsxs(SP_REACT.Fragment, { children: [
            SP_JSX.jsx(DFL.ToggleField, { label: strings.enableForGame, checked: resolved.enabled !== false, disabled: busy || !payload, onChange: (checked) => { void savePartial({ enabled: checked }); } }),
            SP_JSX.jsx(DFL.DropdownItem, { label: strings.exitDelay, rgOptions: exitDelayOptions, selectedOption: selectedExitDelay, disabled: busy || !payload, onChange: (option) => { const value = numericDropdownValue(option); if (value !== undefined) void savePartial({ exit_delay_seconds: value }); } }),
            SP_JSX.jsx(DFL.DropdownItem, { label: strings.forceMode ?? I18N.en.forceMode ?? "Force mode for this game", rgOptions: forceModeOptions, selectedOption: (resolved.force_mode || "auto"), disabled: busy || !payload, onChange: (option) => { if (typeof option.data === "string") void savePartial({ force_mode: option.data }); } }),
            SP_JSX.jsx(DFL.ToggleField, { label: strings.gameTimeout ?? I18N.en.gameTimeout ?? "Timeout only for this game", checked: resolved.timeout_enabled === true, disabled: busy || !payload, onChange: (checked) => { void savePartial({ timeout_enabled: checked }); } }),
            SP_JSX.jsx(DFL.DropdownItem, { label: strings.gameTimeoutSeconds ?? I18N.en.gameTimeoutSeconds ?? "Timeout duration", rgOptions: gameTimeoutOptions, selectedOption: (typeof resolved.timeout_seconds === "number" ? resolved.timeout_seconds : 50), disabled: busy || !payload || resolved.timeout_enabled !== true, onChange: (option) => { const value = numericDropdownValue(option); if (value !== undefined) void savePartial({ timeout_seconds: value }); } })
        ] }) }),
        SP_JSX.jsxs(DFL.Focusable, { "flow-children": "horizontal", noFocusRing: true, className: "lc-appearance-grid", children: [
            SP_JSX.jsx(SettingsCard, { className: "lc-appearance-card", title: strings.editorTitle, description: strings.logoHelp, children: SP_JSX.jsxs(SP_REACT.Fragment, { children: [
                SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: busy || !payload || resolved.show_logo === false, onClick: openLogoPlacement, children: strings.openEditor }),
                SP_JSX.jsx(DFL.ToggleField, { label: strings.showLogo, checked: resolved.show_logo !== false, disabled: busy || !payload, onChange: (checked) => { void savePartial({ show_logo: checked }); } }),
                SP_JSX.jsx(DFL.ToggleField, { label: strings.logoZoom, checked: resolved.logo_zoom_enabled !== false, disabled: busy || !payload || resolved.show_logo === false, onChange: (checked) => { void savePartial({ logo_zoom_enabled: checked }); } }),
                SP_JSX.jsx(DFL.ToggleField, { label: strings.bgZoom ?? "Enable background zoom-out animation", checked: resolved.bg_zoom_enabled === true, disabled: busy || !payload, onChange: (checked) => { void savePartial({ bg_zoom_enabled: checked }); } })
            ] }) }),
            SP_JSX.jsx(SettingsCard, { className: "lc-appearance-card", title: strings.background, description: selectedBackdropPath || strings.noLaunchImage, children: SP_JSX.jsxs(SP_REACT.Fragment, { children: [
                backdropPreviewUrl ? SP_JSX.jsx("div", { style: { width: "100%", display: "flex", justifyContent: "center" }, children: SP_JSX.jsx("img", { src: backdropPreviewUrl, style: { width: "100%", maxWidth: "680px", aspectRatio: "16 / 9", objectFit: "cover", borderRadius: 8 } }) }) : null,
                SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: busy || !payload, onClick: () => { void chooseBackdrop(); }, children: strings.chooseLaunchImage }),
                SP_JSX.jsx(DFL.DialogButton, { focusable: true, disabled: busy || !payload || !raw.fullscreen_image_path, onClick: () => { void savePartial({ fullscreen_image_path: "" }); }, children: strings.clearLaunchImage })
            ] }) })
        ] }),
        SP_JSX.jsx(SettingsCard, { title: strings.downloadBackgrounds || strings.scrapers, description: strings.scrapersHelp, children: SP_JSX.jsxs(SP_REACT.Fragment, { children: [
            scraperTabs([{ id: "playstation", label: "PlayStation" }, { id: "igdb", label: "IGDB" }, { id: "alphacoders", label: "AlphaCoders" }], activeScraper, (next) => { setActiveScraper(next); setFocusedScraper(""); setImageResults([]); setImageSearchMessage(""); setPlayStationMessage(""); }),
            scraperContent
        ] }) }),
        SP_JSX.jsx(DFL.DialogButton, { focusable: true, className: "lc-close-button", onClick: () => { try { DFL.Navigation?.NavigateBack?.(); } catch (_error) {} }, children: strings.close || "Close" })
    ] });
    return SP_JSX.jsxs(DFL.Focusable, { "flow-children": "vertical", noFocusRing: true, className: "launch-curtain-main lc-settings-page", style: { position: "relative", height: "100%", minHeight: 0, display: "flex", flexDirection: "column" }, children: [
        SP_JSX.jsx(LaunchCurtainPageStyles, {}),
        SP_JSX.jsx(DFL.ScrollPanel, { children: SP_JSX.jsx(DFL.Focusable, { "flow-children": "vertical", noFocusRing: true, style: pageStyle, children: pageContent }) })
    ] });
}
const LAUNCH_CURTAIN_MENU_KEY = "launch-curtain-game-settings";
const GAME_DETAIL_ROUTES = [
    "/library/app/:appid",
    "/library/details/:appid",
    "/library/:collection/app/:appid"
];
const DETAIL_PATTERNS = GAME_DETAIL_ROUTES.map((route) => {
    const pattern = route
        .replace(/\//g, "\\/")
        .replace(":collection", "[^\\/]+")
        .replace(":appid", "(\\d+)");
    return new RegExp(`^${pattern}`);
});
const normalizeMenuAppId = (value) => {
    const appId = Number.parseInt(String(value ?? ""), 10);
    return Number.isFinite(appId) && appId > 0 ? appId : 0;
};
const getLibraryPath = () => {
    try {
        const focusedWindow = globalThis.window?.SteamUIStore?.GetFocusedWindowInstance?.() ?? DFL.Router?.WindowStore?.GamepadUIMainWindowInstance;
        const browserWindow = focusedWindow?.BrowserWindow ?? DFL.Router?.WindowStore?.GamepadUIMainWindowInstance?.BrowserWindow;
        return browserWindow?.location?.pathname ?? globalThis.window?.location?.pathname ?? "";
    }
    catch (_error) {
        return "";
    }
};
const readAppIdFromLibraryLocation = () => {
    const pathname = getLibraryPath();
    for (const pattern of DETAIL_PATTERNS) {
        const match = pathname.match(pattern);
        if (match?.[1]) {
            const appId = normalizeMenuAppId(match[1]);
            if (appId)
                return appId;
        }
    }
    return 0;
};
const extractAppId = (...candidates) => {
    for (const candidate of candidates) {
        if (typeof candidate === "number" && Number.isFinite(candidate) && candidate > 0)
            return candidate;
        if (typeof candidate === "string") {
            const parsed = normalizeMenuAppId(candidate);
            if (parsed)
                return parsed;
        }
        if (candidate && typeof candidate === "object") {
            const possible = candidate.appid ?? candidate.app_id ?? candidate.unAppID ?? candidate.nAppID ?? candidate.id;
            const parsed = normalizeMenuAppId(possible);
            if (parsed)
                return parsed;
        }
    }
    return 0;
};
const extractAppIdFromTree = (node) => {
    if (!node)
        return 0;
    const candidate = extractAppId(node?.appid, node?.overview?.appid, node?._owner?.pendingProps?.overview?.appid, node?.props?.overview?.appid);
    if (candidate)
        return candidate;
    const children = node?.children ?? node?.props?.children;
    if (!children)
        return 0;
    if (Array.isArray(children)) {
        for (const child of children) {
            const result = extractAppIdFromTree(child);
            if (result)
                return result;
        }
        return 0;
    }
    return extractAppIdFromTree(children);
};
const coerceMenuChildren = (children) => {
    if (!children)
        return null;
    if (Array.isArray(children))
        return children;
    if (Array.isArray(children?.props?.children))
        return children.props.children;
    if (Array.isArray(children?.children))
        return children.children;
    return null;
};
const pruneLaunchCurtainMenu = (children) => {
    const list = coerceMenuChildren(children);
    if (!Array.isArray(list))
        return;
    const existing = list.findIndex((x) => x?.key === LAUNCH_CURTAIN_MENU_KEY);
    if (existing !== -1)
        list.splice(existing, 1);
};
const isGameContextMenu = (items) => {
    if (!items?.length)
        return false;
    return !!DFL.findInReactTree(items, (node) => {
        const source = [
            node?.props?.onSelected,
            node?.props?.onClick,
            node?.onSelected,
            node?.onClick
        ].filter((handler) => typeof handler === "function").map((handler) => handler.toString()).join("\n");
        return source.includes("launchSource") ||
            source.includes("PlayGame") ||
            source.includes("Launch") ||
            source.includes("AppProperties") ||
            source.includes("ShowAppProperties");
    });
};
const isLibraryAppContextMenu = (items) => {
    if (!items?.length)
        return false;
    return !!DFL.findInReactTree(items, (node) => {
        const source = [
            node?.props?.onSelected,
            node?.props?.onClick,
            node?.onSelected,
            node?.onClick
        ].filter((handler) => typeof handler === "function").map((handler) => handler.toString()).join("\n");
        if (!source)
            return false;
        return source.includes("launchSource") ||
            source.includes("AppProperties") ||
            source.includes("ShowAppProperties") ||
            source.includes("InstallApp") ||
            source.includes("Download");
    });
};
const deriveAppIdFromMenuItems = (items, fallback) => {
    if (!items?.length)
        return fallback || 0;
    const parent = items.find((entry) => entry?._owner?.pendingProps?.overview?.appid);
    const fromOwner = extractAppId(parent?._owner?.pendingProps?.overview?.appid);
    if (fromOwner)
        return fromOwner;
    const fromOverview = DFL.findInTree(items, (node) => node?.overview?.appid ?? node?.props?.overview?.appid, { walkable: ["props", "children", "_owner", "pendingProps"] });
    const overviewAppId = extractAppId(fromOverview?.overview?.appid, fromOverview?.props?.overview?.appid);
    if (overviewAppId)
        return overviewAppId;
    const foundAppNode = DFL.findInTree(items, (node) => node?.app?.appid ??
        node?.props?.app?.appid ??
        node?.appid ??
        node?.props?.appid ??
        node?.app_id ??
        node?.props?.app_id, { walkable: ["props", "children", "_owner", "pendingProps"] });
    const fromAppNode = extractAppId(foundAppNode?.app?.appid, foundAppNode?.props?.app?.appid, foundAppNode?.appid, foundAppNode?.props?.appid, foundAppNode?.app_id, foundAppNode?.props?.app_id);
    return fromAppNode || fallback || 0;
};
const insertLaunchCurtainMenu = (children, appId) => {
    const list = coerceMenuChildren(children);
    if (!Array.isArray(list) || !appId)
        return;
    pruneLaunchCurtainMenu(list);
    const propertiesMenuItemIdx = list.findIndex((item) => DFL.findInReactTree(item, (node) => {
        const handler = node?.onSelected ?? node?.props?.onSelected;
        return typeof handler === "function" && handler.toString().includes("AppProperties");
    }));
    const openLaunchCurtain = () => {
        const latestAppId = extractAppId(appId) || readAppIdFromLibraryLocation();
        if (!latestAppId) {
            toaster.toast({ title: "Launch Curtain", body: "Couldn't determine current game app id." });
            return;
        }
        DFL.Navigation.Navigate(`/launch-curtain/${latestAppId}`);
    };
    const menuItem = window.SP_REACT.createElement(DFL.MenuItem, { key: LAUNCH_CURTAIN_MENU_KEY, onSelected: openLaunchCurtain }, "Launch Curtain");
    if (propertiesMenuItemIdx >= 0)
        list.splice(propertiesMenuItemIdx, 0, menuItem);
    else
        list.push(menuItem);
};
const patchLaunchCurtainMenuItems = (menuItems, fallbackAppId) => {
    const entries = coerceMenuChildren(menuItems);
    if (!Array.isArray(entries) || !entries.length)
        return 0;
    if (!isGameContextMenu(entries) && !isLibraryAppContextMenu(entries))
        return 0;
    const derivedAppId = deriveAppIdFromMenuItems(entries, fallbackAppId);
    if (!derivedAppId)
        return 0;
    insertLaunchCurtainMenu(entries, derivedAppId);
    return derivedAppId;
};
const contextMenuPatch = (LibraryContextMenu) => {
    const patches = { unpatch: () => undefined };
    const state = { appId: 0 };
    patches.outer = DFL.afterPatch(LibraryContextMenu.prototype, "render", (_args, component) => {
        let appId = extractAppId(component?._owner?.pendingProps?.overview?.appid);
        try {
            if (!appId) {
                const foundApp = DFL.findInTree(component.props.children, (x) => x?.app?.appid, { walkable: ["props", "children"] });
                if (foundApp)
                    appId = extractAppId(foundApp.app.appid);
            }
        }
        catch (_error) {}
        if (appId)
            state.appId = appId;
        if (!patches.inner) {
            patches.inner = DFL.afterPatch(component, "type", (_unused, ret) => {
                DFL.afterPatch(ret.type.prototype, "render", (_args2, ret2) => {
                    const menuItems = ret2?.props?.children?.[0] ?? ret2?.props?.children;
                    try {
                        const fallbackAppId = extractAppIdFromTree(ret2) || state.appId;
                        const patched = patchLaunchCurtainMenuItems(menuItems, fallbackAppId);
                        if (patched)
                            state.appId = patched;
                    }
                    catch (_error) {}
                    return ret2;
                });
                DFL.afterPatch(ret.type.prototype, "shouldComponentUpdate", ([nextProps], shouldUpdate) => {
                    try {
                        if (shouldUpdate === true) {
                            const fallbackAppId = extractAppIdFromTree(nextProps?.children) || state.appId;
                            const patched = patchLaunchCurtainMenuItems(nextProps?.children, fallbackAppId);
                            if (patched)
                                state.appId = patched;
                        }
                    }
                    catch (_error) {}
                    return shouldUpdate;
                });
                return ret;
            });
        }
        else if (Array.isArray(component.props.children)) {
            const patched = patchLaunchCurtainMenuItems(component.props.children, appId || state.appId);
            if (patched)
                state.appId = patched;
        }
        return component;
    });
    patches.unpatch = () => { patches.outer?.unpatch?.(); patches.inner?.unpatch?.(); };
    return patches;
};
const installLaunchCurtainContextMenu = () => {
    try {
        const module = Object.values(DFL.findModuleByExport((e) => e?.toString?.().includes("().LibraryContextMenu"))).find((sibling) => sibling?.toString?.().includes("navigator:"));
        const LibraryContextMenu = DFL.fakeRenderComponent(module).type;
        return contextMenuPatch(LibraryContextMenu);
    }
    catch (error) {
        console.warn("Launch Curtain could not patch game context menu", error);
        return { unpatch: () => undefined };
    }
};
const runSilentStartupGameCacheRefresh = () => {
    let attempts = 0;
    const refresh = async () => {
        attempts += 1;
        try {
            const apps = collectSteamAppsForCache();
            if (!apps.length) {
                if (attempts < 4) {
                    window.setTimeout(refresh, 2500);
                }
                return;
            }
            await buildGameCache({ apps, silent: true, reason: "startup" });
            const nextSettings = await getSettings();
            playButtonHook.setSettingsCache(nextSettings);
            playButtonHook.setLogoPath(nextSettings.custom_logo_path ?? "");
            playButtonHook.setDefaultLogoPath(nextSettings.default_logo_path ?? "");
        }
        catch (error) {
            console.warn("Launch Curtain silent startup cache refresh failed", error);
        }
    };
    window.setTimeout(refresh, 2000);
};

const LAUNCH_CURTAIN_ROUTE = "/launch-curtain/:appid";
const LAUNCH_CURTAIN_EDITOR_ROUTE = "/launch-curtain/:appid/editor";


export { Content, GameSettingsPage, LogoEditorPage, installLaunchCurtainContextMenu, runSilentStartupGameCacheRefresh, LAUNCH_CURTAIN_ROUTE, LAUNCH_CURTAIN_EDITOR_ROUTE };
