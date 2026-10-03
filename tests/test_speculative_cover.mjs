import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

// Execute the production hook with deterministic browser timers and cached
// backend state. No Steam surface, gamepad or real plugin is touched.
const strip = (source) => source.split("\n").filter((line) => !/^import\s/.test(line) && !/^export\s/.test(line)).join("\n");
let nextTimer = 0;
const timers = new Map();
let backendStatus = {};
const context = vm.createContext({
  console, Date, Math, Map, Set, Array, Boolean, Number, String,
  window: {
    setTimeout: (run, delay) => { const token = ++nextTimer; timers.set(token, { run, delay }); return token; },
    clearTimeout: (token) => timers.delete(token),
  },
  getStatus: () => Promise.resolve(backendStatus),
});
vm.runInContext(strip(readFileSync(new URL("../src/constants.ts", import.meta.url), "utf8")) + "\n"
  + strip(readFileSync(new URL("../src/PlayButtonLaunchHook.ts", import.meta.url), "utf8"))
  + "\nglobalThis.Hook = PlayButtonLaunchHook;", context);

function fixture() {
  timers.clear();
  const hook = new context.Hook();
  hook.isModernMode = () => true;
  hook.instantCurtainVisible = true;
  hook.activeInstantAppId = 123;
  hook.dbg = () => {};
  hook.syncModernCurtainSurfaces = () => {};
  hook.beginModernFadeToBlack = () => {};
  let closes = 0;
  hook.requestCloseAllCurtains = () => { closes++; hook.instantCurtainVisible = false; };
  return { hook, closes: () => closes };
}

{
  const { hook, closes } = fixture();
  hook.armModernSpeculation(false);
  const token = hook.modernSpeculationTimer;
  const timer = timers.get(token);
  assert.equal(timer.delay, 2500);
  hook.armModernSpeculation(false);
  assert.equal(hook.modernSpeculationTimer, token, "Repeated speculative input must not extend expiry");
  timer.run();
  assert.equal(closes(), 1);
  timer.run();
  assert.equal(closes(), 1, "Close once and leave Steam usable");
  console.log("PASS unconfirmed prediction releases at 2.5 seconds without repeated-input extension");
}
{
  const { hook, closes } = fixture();
  hook.armModernSpeculation(false);
  const token = hook.modernSpeculationTimer;
  const obsoleteCallback = timers.get(token).run;
  hook.armModernSpeculation(true);
  assert.equal(timers.has(token), false);
  obsoleteCallback();
  assert.equal(closes(), 0);
  assert.equal(hook.modernLaunchConfirmed, true);
  console.log("PASS confirmed RunGame promotes speculative cover and preserves slow launch");
}
{
  const { hook, closes } = fixture();
  backendStatus = { modern_launch_confirmed: true, modern_curtain_show: true, modern_launch_app_id: 123, modern_launch_started_at: 1 };
  hook.armModernSpeculation(false);
  const speculativeCallback = timers.get(hook.modernSpeculationTimer).run;
  hook.startModernHandoffPoll();
  timers.get(hook.modernHandoffTimer).run();
  await Promise.resolve();
  speculativeCallback();
  assert.equal(closes(), 0);
  assert.equal(hook.modernLaunchConfirmed, true);
  console.log("PASS observed Steam action, process or prompt preserves the real launch cover");
}
{
  const { hook, closes } = fixture();
  backendStatus = { modern_launch_confirmed: true, modern_curtain_show: true, modern_launch_app_id: 999, modern_launch_started_at: 1 };
  hook.armModernSpeculation(false);
  hook.startModernHandoffPoll();
  timers.get(hook.modernHandoffTimer).run();
  await Promise.resolve();
  timers.get(hook.modernSpeculationTimer).run();
  assert.equal(closes(), 1);
  console.log("PASS unrelated launch confirmation cannot preserve a speculative cover");
}
{
  const { hook, closes } = fixture();
  backendStatus = {};
  hook.armModernSpeculation(false);
  hook.startModernHandoffPoll();
  timers.get(hook.modernHandoffTimer).run();
  await Promise.resolve();
  timers.get(hook.modernSpeculationTimer).run();
  assert.equal(closes(), 1);
  console.log("PASS absent backend confirmation fails open without the 75-second wait");
}
{
  const { hook, closes } = fixture();
  hook.lastTriggerAt = 10000;
  backendStatus = { modern_launch_confirmed: true, modern_curtain_show: true, modern_launch_app_id: 123, modern_launch_started_at: 1 };
  hook.armModernSpeculation(false);
  hook.startModernHandoffPoll();
  timers.get(hook.modernHandoffTimer).run();
  await Promise.resolve();
  timers.get(hook.modernSpeculationTimer).run();
  assert.equal(closes(), 1);
  console.log("PASS stale confirmation for the same game cannot preserve a new speculative cover");
}
