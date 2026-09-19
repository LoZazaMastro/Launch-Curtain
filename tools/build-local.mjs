// Bundler locale per Launch Curtain — NON richiede npm/@decky/rollup.
// Ricuce src/*.ts in dist/index.js. Funziona perché il codice non ha veri tipi TS
// e usa React/@decky come globali runtime (SP_REACT/SP_JSX/DFL), non pacchetti.
// Uso:  node tools/build-local.mjs
import { existsSync, readFileSync, writeFileSync } from "node:fs";
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
  "PlayButtonLaunchHook.ts", "pluginMenuSection.ts", "ui.tsx",
  "steamControllerClose.ts", "launchInfo.ts", "index.tsx",
];

const sourceFiles = order.map((file) => ({ file, code: readFileSync(join(src, file), "utf8") }));
let out = readFileSync(join(here, "preamble.js"), "utf8").replace(/\s*$/, "") + "\n\n";

const iconNames = new Set();
for (const { code } of sourceFiles) {
  for (const match of code.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']react-icons\/fa["']/g)) {
    for (const name of match[1].split(",").map((item) => item.trim()).filter(Boolean)) iconNames.add(name);
  }
}
const missingIcons = [...iconNames].filter((name) => !new RegExp(`function\\s+${name}\\s*\\(`).test(out));
if (missingIcons.length) {
  const iconModulePath = join(root, "node_modules", "react-icons", "fa", "index.mjs");
  if (!existsSync(iconModulePath)) throw new Error(`Missing react-icons source: ${iconModulePath}`);
  const iconModule = readFileSync(iconModulePath, "utf8");
  for (const name of missingIcons) {
    const match = iconModule.match(new RegExp(`export function ${name} \\(props\\) \\{[\\s\\S]*?\\n\\};`));
    if (!match) throw new Error(`Could not bundle icon ${name}`);
    out += "\n" + match[0].replace(/^export /, "") + "\n";
  }
}

for (const { code } of sourceFiles) out += "\n" + strip(code) + "\n";
out += "\nexport { index as default };\n";

for (const name of iconNames) {
  if (!new RegExp(`function\\s+${name}\\s*\\(`).test(out)) throw new Error(`Undefined bundled icon ${name}`);
}

writeFileSync(join(root, "dist", "index.js"), out);
console.log("dist/index.js generato — righe:", out.split("\n").length);
