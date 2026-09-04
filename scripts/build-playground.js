// Bereitet Playground Elements für mdBook vor:
// 1. kopiert die 4 Laufzeitdateien,
// 2. bündelt die drei benötigten Komponenten + eigene Komponente zu einem ES-Modul,
// 3. versieht das Bundle mit einem Inhalts-Hash im Dateinamen und erzeugt
//    daraus head.hbs. Feste Dateinamen würden vom Browser-Cache überlebt
//    (altes JS + neues CSS), der Hash macht jede Version eindeutig.

import {
  copyFileSync as copy,
  mkdirSync as mkdir,
  readFileSync as read,
  writeFileSync as write,
  readdirSync as readdir,
  rmSync as rm,
} from "node:fs";
import { createHash } from "node:crypto";
import { build } from "esbuild";

const pkg = "node_modules/playground-elements";
const theme = "src/book_theme";
mkdir("src/playground", { recursive: true });
mkdir(`${theme}/internal`, { recursive: true });
for (const [from, to] of [
  ["playground-service-worker.js", "src/playground/playground-service-worker.js"],
  ["playground-service-worker-proxy.html", "src/playground/playground-service-worker-proxy.html"],
  // Wird von Playground immer geladen (auch bei reinem HTML/CSS),
  // relativ zum Bundle gesucht; braucht internal/typescript.js daneben.
  ["playground-typescript-worker.js", `${theme}/playground-typescript-worker.js`],
  ["internal/typescript.js", `${theme}/internal/typescript.js`],
]) copy(`${pkg}/${from}`, to);

await build({
  stdin: {
    contents: [
      `import "playground-elements/playground-project.js";`,
      `import "playground-elements/playground-file-editor.js";`,
      `import "playground-elements/playground-preview.js";`,
      `import "./src/book_theme/playground-html-css.js";`,
    ].join("\n"),
    resolveDir: process.cwd(),
    loader: "js",
  },
  bundle: true,
  format: "esm",
  platform: "browser",
  outfile: `${theme}/playground-bundle.js`,
});

// Alte Hash-Stände aufräumen, neuen Hash-Namen vergeben.
for (const f of readdir(theme)) {
  if (/^playground-bundle\.[0-9a-f]+\.js$/.test(f)) rm(`${theme}/${f}`);
}
const hash = createHash("sha256")
  .update(read(`${theme}/playground-bundle.js`))
  .digest("hex")
  .slice(0, 8);
const hashed = `playground-bundle.${hash}.js`;
copy(`${theme}/playground-bundle.js`, `${theme}/${hashed}`);
rm(`${theme}/playground-bundle.js`);

// head.hbs aus dem Template erzeugen (mdBook lädt das Bundle als ES-Modul;
// nicht über additional-js, da import.meta sonst bricht).
const template = read("scripts/head.hbs.tmpl", "utf8");
write(`${theme}/head.hbs`, template.replace("__HASH__", hash));

console.log(`Playground vorbereitet (${hashed}).`);
