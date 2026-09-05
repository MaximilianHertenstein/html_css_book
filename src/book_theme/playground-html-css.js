// <playground-html-css>: interaktive HTML/CSS-Beispiele (Editoren + Vorschau)
const EDITOR_MAX = 400, PREVIEW_MAX = 600, TOOLBAR = 41; // Toolbar von <playground-preview>

const clamp = (v, m) => Math.min(Math.ceil(v), m);
const el = (tag, props = {}) => Object.assign(document.createElement(tag), props);

class PlaygroundHtmlCss extends HTMLElement {
  connectedCallback() {
    if (this._init) return;
    this._init = true;

    const html = this.querySelector('script[type="sample/html"]')?.textContent.trim() || "";
    const css = this.querySelector('script[type="sample/css"]')?.textContent.trim() || "";
    if (!html && !css) return console.error("<playground-html-css> enthält weder HTML noch CSS.");

    const project = el("playground-project", {
      sandboxBaseUrl: new URL("../playground/", import.meta.url).href,
    });

    const box = el("div", { className: "playground-html-css-editors" });
    const editors = [];
    for (const [name, code, type] of [
      ["index.html", html, "sample/html"],
      ["style.css", css, "sample/css"],
    ]) {
      if (!code) continue;
      const file = el("script", { type, textContent: code });
      file.setAttribute("filename", name);
      project.appendChild(file);

      const editor = el("playground-file-editor", { project, filename: name, lineNumbers: true });
      editor.style.height = `${clamp(code.split("\n").length * 20 + 16, EDITOR_MAX)}px`; // Startwert bis zur Messung
      editors.push(editor);

      const section = el("div", { innerHTML: `<div class="playground-html-css-header">${name}</div>` });
      section.appendChild(editor);
      box.appendChild(section);
    }

    const root = el("div", { className: "playground-html-css" });
    root.appendChild(box);
    const preview = html ? el("playground-preview", { project, className: "playground-html-css-preview" }) : null;
    if (preview) root.appendChild(preview);

    this.replaceChildren(project, root);

    // Höhen nachführen. "input" bubbelt aus dem Shadow-DOM heraus ("change" täte
    // das nicht), darum ist kein Lauscher im Shadow nötig. Das iframe wird bei
    // jeder Messung mitverbunden (Duplikate ignoriert der Browser).
    let timer = 0;
    const fit = () => {
      for (const editor of editors) {
        const content = editor.shadowRoot
          ?.querySelector("playground-code-editor")?.shadowRoot?.querySelector(".cm-content");
        if (content) editor.style.height = `${clamp(content.scrollHeight + 6, EDITOR_MAX)}px`;
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
