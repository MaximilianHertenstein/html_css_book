// <playground-html-css>: interaktive HTML/CSS-Beispiele (Editoren + Vorschau)
// Unterstützt Mehrdatei-Projekte:
//   <script type="sample/html" filename="index.html"> ... </script>
//   <script type="sample/html" filename="subpage.html"> ... </script>
// Ohne filename greifen Defaults (index.html / style.css / script.js).
// Dateien werden 1:1 ins Projekt übernommen (kein Auto-Link).
const EDITOR_MAX = 400, PREVIEW_MAX = 600, TOOLBAR = 41; // Toolbar von <playground-preview>

const clamp = (v, m) => Math.min(Math.ceil(v), m);
const el = (tag, props = {}) => Object.assign(document.createElement(tag), props);
const DEFAULT_NAME = { html: "index.html", css: "style.css", js: "script.js" };

class PlaygroundHtmlCss extends HTMLElement {
  connectedCallback() {
    if (this._init) return;
    this._init = true;

    const sources = [...this.querySelectorAll('script[type^="sample/"]')];
    if (!sources.length)
      return console.error("<playground-html-css> enthält weder HTML noch CSS.");

    // Sammeln + Defaults + Duplikate auflösen.
    const seen = new Set();
    const files = [];
    for (const s of sources) {
      const type = s.getAttribute("type");
      const kind = type.split("/")[1]; // html | css | js | ...
      if (!["html", "css", "js"].includes(kind)) continue;
      let name = s.getAttribute("filename") || DEFAULT_NAME[kind] || `file-${files.length}.${kind}`;
      if (seen.has(name)) {
        const dot = name.lastIndexOf(".");
        const base = dot > 0 ? name.slice(0, dot) : name;
        const ext = dot > 0 ? name.slice(dot) : "";
        let i = 2;
        while (seen.has(`${base}-${i}${ext}`)) i++;
        name = `${base}-${i}${ext}`;
      }
      seen.add(name);
      const code = (s.textContent || "").trim();
      files.push({ name, code, type, kind });
    }
    if (!files.length)
      return console.error("<playground-html-css> enthält keine unterstützten Dateien.");

    const project = el("playground-project", {
      sandboxBaseUrl: new URL("../playground/", import.meta.url).href,
    });

    const box = el("div", { className: "playground-html-css-editors" });
    const editors = [];
    for (const f of files) {
      const code = f.code;
      const file = el("script", { type: f.type, textContent: code });
      file.setAttribute("filename", f.name);
      project.appendChild(file);

      const editor = el("playground-file-editor", { project, filename: f.name, lineNumbers: true });
      editor.style.height = `${clamp(code.split("\n").length * 20 + 16, EDITOR_MAX)}px`; // Startwert bis zur Messung
      editors.push(editor);

      const section = el("div", { innerHTML: `<div class="playground-html-css-header">${f.name}</div>` });
      section.appendChild(editor);
      box.appendChild(section);
    }

    const root = el("div", { className: "playground-html-css" });
    root.appendChild(box);
    const htmlFiles = files.filter((f) => f.kind === "html");
    const entry = htmlFiles.find((f) => f.name === "index.html") || htmlFiles[0];
    const preview = entry ? el("playground-preview", { project, className: "playground-html-css-preview" }) : null;
    if (preview) {
      preview.setAttribute("html-file", entry.name);
      root.appendChild(preview);
    }

    this.replaceChildren(project, root);

    // Höhen nachführen. "input" bubbelt aus dem Shadow-DOM heraus ("change" täte
    // das nicht), darum ist kein Lauscher im Shadow nötig. Das iframe wird bei
    // jeder Messung mitverbunden (Duplikate ignoriert der Browser).
    let timer = 0;
    const fit = () => {
      for (const editor of editors) {
        // Höhe aus der Zeilenanzahl berechnen, nicht aus scrollHeight:
        // scrollHeight hängt von der aktuellen Editorhöhe ab und wächst
        // dadurch bei jedem Tastenschlag (+6px-Schleife).
        const content = editor.shadowRoot
          ?.querySelector("playground-code-editor")?.shadowRoot?.querySelector(".cm-content");
        if (!content) continue;
        const lines = content.querySelectorAll(".cm-line").length;
        if (!lines) continue;
        const lineHeight =
          content.querySelector(".cm-line")?.getBoundingClientRect?.().height || 20;
        if (!lineHeight) continue;
        const wanted = clamp(lines * lineHeight + 16, EDITOR_MAX);
        if (Math.abs((parseFloat(editor.style.height) || 0) - wanted) > 1) {
          editor.style.height = `${wanted}px`;
        }
      }
      const frame = preview?.iframe;
      if (frame) {
        frame.addEventListener("load", fit);
        let height = 0;
        try {
          height = frame.contentDocument?.documentElement?.scrollHeight || 0;
        } catch {} // Sandbox noch cross-origin
        if (height > 0) preview.style.height = `${clamp(height + TOOLBAR + 8, PREVIEW_MAX)}px`;
      }
    };
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(fit, 150);
    };
    this.addEventListener("input", schedule);
    window.addEventListener("resize", schedule);
    fit();
    for (const ms of [400, 1200, 2500]) setTimeout(fit, ms); // Shadow-DOM rendert verzögert
  }
}

customElements.define("playground-html-css", PlaygroundHtmlCss);
