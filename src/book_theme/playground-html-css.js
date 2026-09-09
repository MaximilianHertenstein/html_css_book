// <playground-html-css>: interaktive HTML/CSS-Beispiele (Editoren + Vorschau).
//   <script type="sample/html" filename="index.html"> ... </script>
//   <script type="sample/css" filename="style.css"> ... </script>
// Ohne filename gelten index.html / style.css; mehrere Dateien (z.B.
// index.html + subpage.html) werden 1:1 ins Projekt übernommen (kein Auto-Link).
// Vorschau wächst mit dem gerenderten Inhalt mit (Deckel per CSS/JS).
const EDITOR_MAX = 400, PREVIEW_MAX = 600, TOOLBAR = 41; // Toolbar von <playground-preview>

const clamp = (v, m) => Math.min(Math.ceil(v), m);
const el = (tag, props = {}) => Object.assign(document.createElement(tag), props);

class PlaygroundHtmlCss extends HTMLElement {
  connectedCallback() {
    if (this._init) return;
    this._init = true;

    const sources = [...this.querySelectorAll('script[type^="sample/"]')];
    if (!sources.length)
      return console.error("<playground-html-css> enthält weder HTML noch CSS.");

    const project = el("playground-project", {
      sandboxBaseUrl: new URL("../playground/", import.meta.url).href,
    });

    const box = el("div", { className: "playground-html-css-editors" });
    const editors = [];
    let entry;
    for (const s of sources) {
      const kind = s.getAttribute("type").split("/")[1];
      if (kind !== "html" && kind !== "css") continue;
      const name = s.getAttribute("filename") || (kind === "html" ? "index.html" : "style.css");
      if (kind === "html" && (name === "index.html" || !entry)) entry = name;

      const code = s.textContent.trim();
      const file = el("script", { type: s.type, textContent: code });
      file.setAttribute("filename", name);
      project.appendChild(file);

      const editor = el("playground-file-editor", { project, filename: name, lineNumbers: true });
      editor.style.height = `${clamp(code.split("\n").length * 20 + 16, EDITOR_MAX)}px`; // Startwert bis zur Messung
      editors.push(editor);
      const section = el("div", { innerHTML: `<div class="playground-html-css-header">${name}</div>` });
      section.appendChild(editor);
      box.appendChild(section);
    }
    if (!box.children.length)
      return console.error("<playground-html-css> enthält keine unterstützten Dateien.");

    const preview = el("playground-preview", { project, className: "playground-html-css-preview" });
    preview.setAttribute("html-file", entry || "index.html");

    const root = el("div", { className: "playground-html-css" });
    root.append(box, preview);
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
      const frame = preview.iframe;
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
