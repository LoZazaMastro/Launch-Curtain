// Bundler locale per Launch Curtain — NON richiede npm/@decky/rollup.
// Ricuce src/*.ts in dist/index.js. Funziona perché il codice non ha veri tipi TS
// e usa React/@decky come globali runtime (SP_REACT/SP_JSX/DFL), non pacchetti.
// Uso:  node tools/build-local.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const src = join(root, "src");

function strip(code) {
  return code.split("\n")
    .filter((l) => !/^import\s/.test(l) && !/^export\s*\{/.test(l) && !/^export default/.test(l))
    .map((l) => l.replace(/^export function\s/, "function "))
    .join("\n");
}

const order = [
  "backend.ts", "strings.ts", "constants.ts",
  "PlayButtonLaunchHook.ts", "ui.tsx",
  "steamControllerClose.ts", "launchInfo.ts", "index.tsx",
];

let out = readFileSync(join(here, "preamble.js"), "utf8").replace(/\s*$/, "") + "\n\n";
for (const f of order) out += "\n" + strip(readFileSync(join(src, f), "utf8")) + "\n";
out += "\nexport { index as default };\n";

writeFileSync(join(root, "dist", "index.js"), out);
console.log("dist/index.js generato — righe:", out.split("\n").length);
