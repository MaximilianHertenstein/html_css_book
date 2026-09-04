// <playground-html-css>: interaktive HTML/CSS-Beispiele –
// Editoren und Live-Vorschau untereinander in voller Breite.
// Verwendung im Markdown siehe README.

const EDITOR_MAX_HEIGHT = 400;
const PREVIEW_MAX_HEIGHT = 600;

class PlaygroundHtmlCss extends HTMLElement {
  connectedCallback() {
    if (this.done) return;
    this.done = true;

    const html = this.querySelector('script[type="sample/html"]');
    const css = this.querySelector('script[type="sample/css"]');
    if (!html && !css) {
      console.error("<playground-html-css> enthält weder HTML noch CSS.");
      return;
    }

    // Code einmal aufbereiten: CSS wird automatisch eingebunden,
    // damit im Markdown kein <link> nötig ist.
    let htmlText = html?.textContent.trim() ?? "";
    const cssText = css?.textContent.trim() ?? "";
    if (htmlText && cssText && !htmlText.includes("style.css")) {
      htmlText = `<link rel="stylesheet" href="style.css">\n${htmlText}`;
    }
    if (!htmlText && !cssText) return; // Leere Beispiele bauen keine Box.

    const project = document.createElement("playground-project");
    // Sandbox-Dateien liegen neben dem Bundle (…/book_theme/../playground/).
    project.sandboxBaseUrl = new URL("../playground/", import.meta.url).href;
    if (htmlText) project.appendChild(file("sample/html", "index.html", htmlText));
    if (cssText) project.appendChild(file("sample/css", "style.css", cssText));

    const root = document.createElement("div");
    root.className = "playground-html-css";

    const editorsBox = document.createElement("div");
    editorsBox.className = "playground-html-css-editors";
    const fileEditors = [];
    for (const [name, code] of [["index.html", htmlText], ["style.css", cssText]]) {
      if (!code) continue;
      const ed = editor(project, name, code);
      fileEditors.push(ed);
      editorsBox.appendChild(section(name, ed));
    }
    root.appendChild(editorsBox);

    let previewEl = null;
    if (htmlText) {
      previewEl = document.createElement("playground-preview");
      previewEl.project = project;
      // Unsichtbar, bis die erste echte Messung sitzt (sonst Geflacker).
      previewEl.style.visibility = "hidden";
      previewEl.className = "playground-html-css-preview";
      root.appendChild(previewEl);
    }

    this.replaceChildren(project, root);
    fitSizes(root, fileEditors, previewEl, project);
  }
}

function file(type, filename, code) {
  const script = document.createElement("script");
  script.type = type;
  script.setAttribute("filename", filename);
  script.textContent = code;
  return script;
}

function editor(project, filename, code) {
  const editor = document.createElement("playground-file-editor");
  editor.project = project;
  editor.filename = filename;
  editor.lineNumbers = true;
  // Starthöhe aus der Zeilenzahl (~20px/Zeile): nah am Endergebnis.
  const lines = code.split("\n").length;
  editor.style.height = `${Math.min(lines * 20 + 16, EDITOR_MAX_HEIGHT)}px`;
  return editor;
}

function section(title, element, cls) {
  const box = document.createElement("div");
  if (cls) box.className = cls;
  const header = document.createElement("div");
  header.className = "playground-html-css-header";
  header.textContent = title;
  box.append(header, element);
  return box;
}

// CodeMirror malt bei Fokus einen gepunkteten Rahmen (.cm-focused).
// Von außen nicht per CSS erreichbar (Shadow-DOM ohne Part),
// daher hier direkt im offenen Shadow-Root abstellen.
function injectNofocus(ce) {
  const root = ce.shadowRoot;
  if (!root || root.querySelector("style[data-nofocus]")) return;
  const style = document.createElement("style");
  style.setAttribute("data-nofocus", "");
  style.textContent = ".cm-editor.cm-focused{outline:none !important}";
  root.appendChild(style);
}

// Misst und setzt Höhen – rein ereignisgetrieben, ohne Warten und Polling:
// Innere Elemente werden bei jedem Durchgang faul aufgelöst (Projektdateien
// laden asynchron nach). Schreiben ist idempotent, daher keine Schleife.
function fitSizes(root, fileEditors, previewEl, project) {
  let iframe = null; // Vorschau-iframe, sobald gerendert
  let toolbarH = 41;

  let shown = !previewEl;
  const show = () => {
    if (shown || !previewEl) return;
    shown = true;
    previewEl.style.visibility = "";
  };
  setTimeout(show, 3000);

  let timer = 0;
  const refit = () => {
    clearTimeout(timer);
    timer = setTimeout(layout, 150);
  };

  // Lebend-Zustand pro Editor: Playground ersetzt innere Elemente beim
  // Nachladen (z. B. Projektdateien) – daher bei jedem Durchgang frisch
  // auflösen statt Referenzen zu cachen (alte Knoten liefern sonst
  // abgehängte Metriken und verlieren injizierte Styles mit).
  const states = fileEditors.map(() => ({ content: null, obs: null }));

  const layout = () => {
    const eds = [];
    for (let i = 0; i < fileEditors.length; i++) {
      const fe = fileEditors[i];
      const ce = fe.shadowRoot?.querySelector("playground-code-editor");
      const content = ce?.shadowRoot?.querySelector(".cm-content");
      if (!ce || !content) return; // unvollständig – später erneut versuchen
      injectNofocus(ce);
      const st = states[i];
      if (st.content !== content) {
        st.obs?.disconnect();
        st.content = content;
        st.obs = new MutationObserver(refit);
        st.obs.observe(content, {
          childList: true,
          characterData: true,
          subtree: true,
        });
      }
      eds.push({ fe, ce, content });
    }
    if (previewEl && !iframe) {
      iframe = previewEl.shadowRoot?.querySelector("iframe") ?? null;
      if (iframe) {
        // Ausgeblendete Toolbar misst 0 – das ist korrekt so (kein ||, das 0 schluckt!).
        const bar = previewEl.shadowRoot?.querySelector("#toolbar");
        toolbarH = bar ? bar.getBoundingClientRect().height : 41;
        iframe.addEventListener("load", layout);
        try {
          iframe.contentDocument?.fonts?.ready.then(layout);
        } catch {
          // Sandbox noch nicht bereit – load-Listener greift dann.
        }
      }
    }

    // Editoren: Inhaltshöhe + kleine Luft, ganze Pixel.
    // ("".split liefert [""] – daher keine Sonderfälle nötig.)
    for (const { fe, ce, content } of eds) {
      const lines = (ce.value ?? "").split("\n").length;
      const line = content.querySelector(".cm-line");
      const lh = line?.getBoundingClientRect().height || 19;
      const cs = getComputedStyle(content);
      const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      fe.style.height = `${Math.min(Math.ceil(lines * lh + pad) + 6, EDITOR_MAX_HEIGHT)}px`;
    }
    if (!previewEl) return;

    let contentH = 0;
    let live = false;
    try {
      const doc = iframe?.contentDocument;
      if (doc?.documentElement) contentH = doc.documentElement.scrollHeight;
      live = (iframe?.src ?? "").includes("__playground_") && contentH > 0;
    } catch {
      // Sandbox noch nicht bereit.
    }
    const want = Math.min(Math.ceil(contentH) + toolbarH + 8, PREVIEW_MAX_HEIGHT);
    // Während Reload (leerer iframe) nicht schrumpfen.
    if (live || !shown) previewEl.style.height = `${want}px`;
    if (live) show();
  };

  layout();
  project.addEventListener("filesChanged", layout);
  window.addEventListener("resize", layout);
  for (const ms of [2500, 8000, 20000]) setTimeout(layout, ms);
}

customElements.define("playground-html-css", PlaygroundHtmlCss);
