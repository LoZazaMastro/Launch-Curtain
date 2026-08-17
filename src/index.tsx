import { definePlugin, routerHook, SP_REACT, SP_JSX, DFL } from "./decky";
import { FaTheaterMasks } from "react-icons/fa";
import { getSettings } from "./backend";
import { playButtonHook } from "./PlayButtonLaunchHook";
import { Content, GameSettingsPage, LogoEditorPage, installLaunchCurtainContextMenu, runSilentStartupGameCacheRefresh, LAUNCH_CURTAIN_ROUTE, LAUNCH_CURTAIN_EDITOR_ROUTE } from "./ui";
import { initSteamControllerClose } from "./steamControllerClose";
import { initLaunchInfo } from "./launchInfo";

const launchCurtainHookKey = "__playhubLaunchCurtainPlayHook";
try {
    const previousHook = globalThis[launchCurtainHookKey];
    if (previousHook && previousHook !== playButtonHook && typeof previousHook.cleanup === "function") {
        previousHook.cleanup();
    }
}
catch (error) {
    console.warn("Launch Curtain could not clean up the previous play hook", error);
}
globalThis[launchCurtainHookKey] = playButtonHook;

var index = definePlugin(() => {
    const menuPatch = installLaunchCurtainContextMenu();
    try {
        routerHook?.addRoute?.(LAUNCH_CURTAIN_ROUTE, () => SP_REACT.createElement(GameSettingsPage, null), { exact: true });
        routerHook?.addRoute?.(LAUNCH_CURTAIN_EDITOR_ROUTE, () => SP_REACT.createElement(LogoEditorPage, null), { exact: true });
    }
    catch (error) {
        console.warn("Launch Curtain could not add per-game route", error);
    }
    playButtonHook.setup();
    runSilentStartupGameCacheRefresh();
    const controllerCloseCleanup = initSteamControllerClose();
    const launchInfoCleanup = initLaunchInfo();
    void getSettings().then((settings) => {
        playButtonHook.setEnabled(Boolean(settings.auto_mode));
        playButtonHook.setSettingsCache(settings);
        playButtonHook.setLogoPath(settings.custom_logo_path ?? "");
        playButtonHook.setDefaultLogoPath(settings.default_logo_path ?? "");
    }).catch((error) => {
        console.warn("Launch Curtain could not load initial settings", error);
    });
    return {
        name: "Launch Curtain",
        titleView: SP_JSX.jsxs("div", { className: DFL.staticClasses.Title, style: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.45rem", width: "100%", marginLeft: "auto", paddingRight: 8 }, children: [SP_JSX.jsx(FaTheaterMasks, { size: 19 }), SP_JSX.jsx("span", { children: "Launch Curtain" })] }),
        content: SP_JSX.jsx(Content, {}),
        icon: SP_JSX.jsx(FaTheaterMasks, {}),
        alwaysRender: true,
        onDismount() {
            try { menuPatch?.unpatch?.(); } catch (error) { console.warn("Launch Curtain context menu unpatch failed", error); }
            try { routerHook?.removeRoute?.(LAUNCH_CURTAIN_EDITOR_ROUTE); } catch (error) { console.warn("Launch Curtain editor route remove failed", error); }
            try { routerHook?.removeRoute?.(LAUNCH_CURTAIN_ROUTE); } catch (error) { console.warn("Launch Curtain route remove failed", error); }
            try { controllerCloseCleanup?.(); } catch (error) { console.warn("Launch Curtain controller cleanup failed", error); }
            try { launchInfoCleanup?.(); } catch (error) { console.warn("Launch Curtain launch-info cleanup failed", error); }
            playButtonHook.cleanup();
            if (globalThis[launchCurtainHookKey] === playButtonHook) {
                delete globalThis[launchCurtainHookKey];
            }
            console.log("Launch Curtain unloaded");
        }
    };
});



export default index;
