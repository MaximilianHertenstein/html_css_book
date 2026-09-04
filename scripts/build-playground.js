// Bereitet Playground Elements für mdBook vor: kopiert die 4 Laufzeitdateien
// und bündelt die drei benötigten Komponenten + eigene Komponente zu einem ES-Modul.

import { copyFileSync as copy, mkdirSync as mkdir } from "node:fs";
import { build } from "esbuild";

const pkg = "node_modules/playground-elements";
mkdir("src/playground", { recursive: true });
mkdir("src/book_theme/internal", { recursive: true });
for (const [from, to] of [
  ["playground-service-worker.js", "src/playground/playground-service-worker.js"],
  ["playground-service-worker-proxy.html", "src/playground/playground-service-worker-proxy.html"],
  // Wird von Playground immer geladen (auch bei reinem HTML/CSS),
  // relativ zum Bundle gesucht; braucht internal/typescript.js daneben.
  ["playground-typescript-worker.js", "src/book_theme/playground-typescript-worker.js"],
  ["internal/typescript.js", "src/book_theme/internal/typescript.js"],
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
  outfile: "src/book_theme/playground-bundle.js",
});

console.log("Playground vorbereitet.");
