import { callable } from "./decky";
import { playButtonHook } from "./PlayButtonLaunchHook";
import { getStrings } from "./strings";

// Cattura e localizza le fasi GameAction che Steam espone durante il lancio.
export function initLaunchInfo() {
  try {
    const setLaunchStatus = callable("set_launch_status");
    const scaLog = callable("sca_input_diag");
    const strings = getStrings();
    const A = (typeof SteamClient !== "undefined") ? SteamClient : (window && window.SteamClient);
    if (!A || !A.Apps) { try { scaLog("LAUNCHINFO no SteamClient.Apps"); } catch (e) {} return; }
    try { scaLog("LAUNCHINFO GameAction keys=" + Object.keys(A.Apps).filter(function (k) { return /GameAction/i.test(k); }).join(",")); } catch (e) {}
    let logged = 0;
    const dbg = function (t) { try { if (logged < 40) { logged++; scaLog(t); } } catch (e) {} };
    const send = function (t) {
      const text = String(t == null ? "" : t);
      try { setLaunchStatus(text); } catch (e) {}
      try { playButtonHook.setInstantStatus(text); } catch (e) {}
    };
    const humanize = function (s) {
      s = String(s == null ? "" : s).trim();
      if (!s) return "";
      s = s.replace(/[_\-]+/g, " ").replace(/([a-z0-9])([A-Z])/g, "$1 $2");
      return s.charAt(0).toUpperCase() + s.slice(1);
    };
    const TASKMAP = {
      "Completed": strings.launchWaitingGame,
      "Done": strings.launchWaitingGame,
      "None": "",
      "Nothing": "",
      "Cancelled": "",
      "Cancelling": "",
      "Starting": strings.launchStarting,
      "CreatingProcess": strings.launchStarting,
      "CreatedProcess": strings.launchStarting,
      "LaunchApp": strings.launchStarting,
      "UpdatingAppTicket": strings.launchCheckingLicense,
      "SiteLicenseSeatCheckout": strings.launchCheckingLicense,
      "UpdatingDRM": strings.launchCheckingLicense,
      "CheckShaderDepotManifest": strings.launchCheckingFiles,
      "VerifyingFiles": strings.launchCheckingFiles,
      "RunningInstallScript": strings.launchInstallingComponents,
      "ProcessingInstallScript": strings.launchInstallingComponents,
      "InstallingRedistributables": strings.launchInstallingComponents,
      "SynchronizingCloud": strings.launchSyncingCloud,
      "SynchronizingStats": strings.launchSyncingStats,
      "SynchronizingControllerConfig": strings.launchSyncingController,
      "ShowInterstitials": strings.launchPreparing,
      "WaitingForOtherOperations": strings.launchDelayed,
      "WaitingForOtherApps": strings.launchDelayed,
      "DelayLaunch": strings.launchDelayed,
      "WaitingOnUserPrompts": strings.launchWaitingConfirmation,
      "WaitingGameWindow": strings.launchWaitingGame,
      "Updating": strings.launchUpdating
    };
    const onTask = function () {
      const args = Array.prototype.slice.call(arguments);
      dbg("GA_TASK " + JSON.stringify(args));
      let mapped = null;
      let textish = "";
      for (let i = 0; i < args.length; i++) {
        const value = args[i];
        if (typeof value !== "string") continue;
        if (Object.prototype.hasOwnProperty.call(TASKMAP, value)) mapped = TASKMAP[value];
        if (/[A-Za-z]/.test(value)) textish = value;
      }
      if (mapped !== null) send(mapped);
      else if (textish) send(humanize(textish));
    };
    if (typeof A.Apps.RegisterForGameActionStart === "function") {
      A.Apps.RegisterForGameActionStart(function () {
        dbg("GA_START " + JSON.stringify(Array.prototype.slice.call(arguments)));
        send(strings.launchStarting);
      });
    }
    if (typeof A.Apps.RegisterForGameActionTaskChange === "function") {
      A.Apps.RegisterForGameActionTaskChange(onTask);
    }
    if (typeof A.Apps.RegisterForGameActionEnd === "function") {
      A.Apps.RegisterForGameActionEnd(function () {
        dbg("GA_END " + JSON.stringify(Array.prototype.slice.call(arguments)));
        send(strings.launchWaitingGame);
      });
    }
    if (typeof A.Apps.RegisterForGameActionShowError === "function") {
      A.Apps.RegisterForGameActionShowError(function () {
        dbg("GA_ERR " + JSON.stringify(Array.prototype.slice.call(arguments)));
      });
    }
  } catch (e) {}
}
