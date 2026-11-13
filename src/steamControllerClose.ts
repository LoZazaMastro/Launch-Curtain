import { callable } from "./decky";
import { getStatus, hideCurtain } from "./backend";
import { playButtonHook } from "./PlayButtonLaunchHook";

// Steam Controller / Steam Input close bridge. RegisterForControllerInputMessages
// only signals that input happened (it does not identify the button). The Steam
// Controller 2 may be absent from the browser Gamepad API. Only an explicit B
// state is a close command here; keyboard/Steam Back remains handled by the hook.
// An unclassified controller notification also occurs during launch and movement.
export function initSteamControllerClose() {
  try {
    const scaLog = callable("sca_input_diag");
    const S = (typeof SteamClient !== "undefined") ? SteamClient : (window && window.SteamClient);
    if (!S || !S.Input || typeof S.Input.RegisterForControllerInputMessages !== "function") {
      try { scaLog("RegisterForControllerInputMessages unavailable"); } catch (e) {}
      return function () {};
    }
    const registryKey = "__playhubLaunchCurtainControllerCleanup";
    try { if (typeof S.Input[registryKey] === "function") S.Input[registryKey](); } catch (e) {}
    const release = function (registration) {
      try {
        if (typeof registration === "function") registration();
        else if (registration) {
          if (typeof registration.Unregister === "function") registration.Unregister();
          else if (typeof registration.unregister === "function") registration.unregister();
          else if (typeof registration.Dispose === "function") registration.Dispose();
          else if (typeof registration.dispose === "function") registration.dispose();
        }
      } catch (e) {}
    };
    let curtainRunning = false, curtainSince = 0, lastDbg = 0;
    const statusTimer = window.setInterval(function () {
      try {
        Promise.resolve(getStatus()).then(function (st) {
          const running = !!(st && st.curtain_running);
          if (running && !curtainRunning) curtainSince = Date.now();
          curtainRunning = running;
        }).catch(function () {});
      } catch (e) {}
    }, 700);
    try { scaLog("SC2 close listener registered (status-gated)"); } catch (e) {}
    const registration = S.Input.RegisterForControllerInputMessages(function () {
      try {
        const h = playButtonHook;
        if (!h?.setupDone) return;
        const now = Date.now();
        const instant = !!(h && h.instantCurtainVisible);
        const overlay = curtainRunning;
        const pads = navigator.getGamepads ? Array.from(navigator.getGamepads()) : [];
        const bPressed = pads.some((pad) => !!(pad && pad.buttons && pad.buttons[1] && pad.buttons[1].pressed));
        const anyPadButton = pads.some((pad) => pad && (pad.buttons || []).some((b) => b && b.pressed));
        const treatAsClose = bPressed;
        if ((instant || overlay) && now - lastDbg > 1500) {
          lastDbg = now;
          try { scaLog("SC2 input cover instant=" + instant + " overlay=" + overlay + " b=" + bPressed + " any=" + anyPadButton); } catch (e) {}
        }
        if (!treatAsClose) return;
        const overlayReady = overlay && (now - curtainSince >= 900);
        if (!instant && !overlayReady) return;
        if (instant && h && now < (h.gamepadCloseIgnoreUntil || 0)) return;
        try { scaLog("SC2 close triggered instant=" + instant + " overlay=" + overlayReady); } catch (e) {}
        if (h && typeof h.requestCloseAllCurtains === "function") h.requestCloseAllCurtains();
        else hideCurtain();
      } catch (e) {}
    });
    const cleanup = function () {
      window.clearInterval(statusTimer);
      release(registration);
      try { if (S.Input[registryKey] === cleanup) delete S.Input[registryKey]; } catch (e) {}
    };
    S.Input[registryKey] = cleanup;
    return cleanup;
  } catch (e) {}
  return function () {};
}
