// <playground-html-css>: interaktive HTML/CSS-Beispiele
const EDITOR_MAX_HEIGHT = 400;
const PREVIEW_MAX_HEIGHT = 600;

class PlaygroundHtmlCss extends HTMLElement {
  connectedCallback() {
    if (this.done) return;
    this.done = true;

    let html = this.querySelector('script[type="sample/html"]')?.textContent.trim() || "";
    const css = this.querySelector('script[type="sample/css"]')?.textContent.trim() || "";

    if (!html && !css) {
      return console.error("<playground-html-css> enthält weder HTML noch CSS.");
    }

    // CSS automatisch einbinden
    if (html && css && !html.includes("style.css")) {
      html = `<link rel="stylesheet" href="style.css">\n${html}`;
    }

    const project = Object.assign(document.createElement("playground-project"), {
      sandboxBaseUrl: new URL("../playground/", import.meta.url).href
    });

    const root = Object.assign(document.createElement("div"), { className: "playground-html-css" });
    const editorsBox = Object.assign(document.createElement("div"), { className: "playground-html-css-editors" });
    const fileEditors = [];

    // Hilfsfunktion zum Erstellen von Datei, Editor und UI-Sektion
    const addFile = (name, code, type) => {
      if (!code) return;
      
      // 1. Projekt-Datei anlegen
      const script = Object.assign(document.createElement("script"), { type, textContent: code });
      script.setAttribute("filename", name);
      project.appendChild(script);

      // 2. Editor anlegen
      const editor = Object.assign(document.createElement("playground-file-editor"), {
        project, filename: name, lineNumbers: true
      });
      editor.style.height = `${Math.min(code.split("\n").length * 20 + 16, EDITOR_MAX_HEIGHT)}px`;
      fileEditors.push(editor);

      // 3. UI-Box anlegen
      const section = Object.assign(document.createElement("div"), {
        innerHTML: `<div class="playground-html-css-header">${name}</div>`
      });
      section.appendChild(editor);
      editorsBox.appendChild(section);
    };

    addFile("index.html", html, "sample/html");
    addFile("style.css", css, "sample/css");
    root.appendChild(editorsBox);

    let previewEl = null;
    if (html) {
      previewEl = Object.assign(document.createElement("playground-preview"), {
        project, className: "playground-html-css-preview"
      });
      // Unsichtbar, bis die erste echte Messung sitzt (sonst Geflacker)
      previewEl.style.visibility = "hidden";
      root.appendChild(previewEl);
    }

    this.replaceChildren(project, root);
    fitSizes(root, fileEditors, previewEl, project);
  }
}

function fitSizes(root, fileEditors, previewEl, project) {
  let iframe = null, toolbarH = 41, timer = 0, shown = !previewEl, iframeTries = 0;
  const seen = new WeakSet(); // bereits beobachtete Inhalte (kein Doppel-Anhängen)

  const show = () => {
    if (!shown && previewEl) {
      shown = true;
      previewEl.style.visibility = "";
    }
  };
  
  // Fallback: Vorschau spätestens nach 3 Sekunden einblenden, falls iframe-Load blockiert
  setTimeout(show, 3000); 

  const refit = () => { clearTimeout(timer); timer = setTimeout(layout, 150); };

  const layout = () => {
    // 1. Editoren messen – jeder für sich (fehlende holen wir später nach)
    for (const fe of fileEditors) {
      const ce = fe.shadowRoot?.querySelector("playground-code-editor");
      const content = ce?.shadowRoot?.querySelector(".cm-content");
      if (!ce || !content) continue;

      if (!seen.has(content)) {
        seen.add(content);
        new MutationObserver(refit).observe(content, { childList: true, characterData: true, subtree: true });
      }

      const lines = (ce.value || "").split("\n").length;
      const lh = content.querySelector(".cm-line")?.getBoundingClientRect().height || 19;
      // Padding oben + unten (nicht verdoppelt – wäre bei Asymmetrie falsch).
      const cs = getComputedStyle(content);
      const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

      fe.style.height = `${Math.min(Math.ceil(lines * lh + pad) + 6, EDITOR_MAX_HEIGHT)}px`;
    }

    // 2. Vorschau messen (mitwachsen basierend auf Inhalt)
    if (!previewEl) return;

    if (!iframe) {
      iframe = previewEl.shadowRoot?.querySelector("iframe") || null;
      if (iframe) {
        toolbarH = previewEl.shadowRoot?.querySelector("#toolbar")?.getBoundingClientRect()
          .height ?? 41;
        iframe.addEventListener("load", layout);
        iframe.contentDocument?.fonts?.ready.then(layout).catch(()=>{});
      } else if (iframeTries++ < 40) {
        // Noch nicht gerendert – begrenzt erneut versuchen (endet von selbst).
        setTimeout(layout, 500);
      }
    }

    let contentH = 0, live = false;
    try {
      contentH = iframe?.contentDocument?.documentElement?.scrollHeight || 0;
      live = (iframe?.src || "").includes("__playground_") && contentH > 0;
    } catch {} // Sandbox cross-origin noch nicht bereit

    // Höhe anwenden
    if (live || !shown) {
      previewEl.style.height = `${Math.min(Math.ceil(contentH) + toolbarH + 8, PREVIEW_MAX_HEIGHT)}px`;
    }
    
    // Nach erfolgreicher Messung sofort anzeigen
    if (live) show(); 
  };

  // Initiale Layout-Berechnung und Event-Listener
  layout();
  project.addEventListener("filesChanged", layout);
  window.addEventListener("resize", layout);
}

customElements.define("playground-html-css", PlaygroundHtmlCss);