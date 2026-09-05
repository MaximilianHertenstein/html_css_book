// <playground-html-css>: interaktive HTML/CSS-Beispiele
const EDITOR_MAX_HEIGHT = 400;
const PREVIEW_MAX_HEIGHT = 600;
const TOOLBAR_HEIGHT = 41;

const clamp = (value, max) => Math.min(Math.ceil(value), max);

class PlaygroundHtmlCss extends HTMLElement {
  connectedCallback() {
    if (this.done) return;
    this.done = true;

    const html = this.querySelector('script[type="sample/html"]')?.textContent.trim() || "";
    const css = this.querySelector('script[type="sample/css"]')?.textContent.trim() || "";

    if (!html && !css) {
      return console.error("<playground-html-css> enthält weder HTML noch CSS.");
    }

    const project = Object.assign(document.createElement("playground-project"), {
      sandboxBaseUrl: new URL("../playground/", import.meta.url).href
    });

    const editorsBox = Object.assign(document.createElement("div"), {
      className: "playground-html-css-editors"
    });
    const editors = [];

    // Datei, Editor und UI-Sektion für jede vorhandene Datei anlegen
    for (const [filename, code, type] of [
      ["index.html", html, "sample/html"],
      ["style.css", css, "sample/css"],
    ]) {
      if (!code) continue;

      const file = Object.assign(document.createElement("script"), { type, textContent: code });
      file.setAttribute("filename", filename);
      project.appendChild(file);

      const editor = Object.assign(document.createElement("playground-file-editor"), {
        project, filename, lineNumbers: true
      });
      editor.style.height = `${clamp(code.split("\n").length * 20 + 16, EDITOR_MAX_HEIGHT)}px`;
      editors.push(editor);

      const section = Object.assign(document.createElement("div"), {
        innerHTML: `<div class="playground-html-css-header">${filename}</div>`
      });
      section.appendChild(editor);
      editorsBox.appendChild(section);
    }

    const root = Object.assign(document.createElement("div"), { className: "playground-html-css" });
    root.appendChild(editorsBox);

    let preview = null;
    if (html) {
      preview = Object.assign(document.createElement("playground-preview"), {
        project, className: "playground-html-css-preview"
      });
      // Unsichtbar, bis die erste echte Messung sitzt (sonst Geflacker)
      preview.style.visibility = "hidden";
      root.appendChild(preview);
    }

    this.replaceChildren(project, root);
    this._cleanupResize = autoResize(editors, preview, project);
  }

  disconnectedCallback() {
    this._cleanupResize?.();
  }
}

// Passt Editor- und Vorschau-Höhe laufend an ihren Inhalt an.
//
// Hintergrund (verifiziert im Quellcode von "playground-elements"):
// - Tippen im Editor löst KEIN "filesChanged" auf <playground-project> aus
//   (nur addFile/deleteFile/renameFile tun das) – wir beobachten darum
//   das eigene "change"-Event von <playground-code-editor>, das bei jeder
//   Nutzereingabe feuert.
// - Das <iframe> in <playground-preview> wird immer schon beim ersten
//   Render erzeugt (nur .src kommt später) – "not found" ist praktisch
//   nur ein sehr kurzes Zeitfenster direkt nach dem Einhängen.
function autoResize(editors, preview, project) {
  const attached = new WeakSet(); // codeEditor/iframe, die schon einen Listener haben
  const abortController = new AbortController();
  const { signal } = abortController;

  let shown = !preview;
  let debounceTimer = 0;
  let revealTimer = 0;
  let discoveryTries = 0;

  const reveal = () => {
    if (!shown && preview) {
      shown = true;
      preview.style.visibility = "";
    }
  };
  if (preview) {
    revealTimer = setTimeout(reveal, 3000); // Fallback, falls das Laden blockiert
  }

  const scheduleLayout = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(layout, 150);
  };

  // Hängt einen Listener genau einmal an ein Element; gibt es unverändert zurück.
  const wireOnce = (el, eventName, callback) => {
    if (el && !attached.has(el)) {
      attached.add(el);
      el.addEventListener(eventName, callback, { signal });
    }
    return el;
  };

  function layout() {
    if (signal.aborted) return; // Element wurde entfernt – nichts mehr zu tun

    let allDiscovered = true;

    // 1. Editoren an ihren Inhalt anpassen; bei Texteingabe erneut layouten
    for (const editor of editors) {
      const codeEditor = wireOnce(
        editor.shadowRoot?.querySelector("playground-code-editor"),
        "change", scheduleLayout
      );
      if (!codeEditor) { allDiscovered = false; continue; }

      // .cm-content misst seine eigene Höhe inkl. Padding selbst –
      // spart die manuelle Zeilenanzahl × Zeilenhöhe-Rechnung.
      const content = codeEditor.shadowRoot?.querySelector(".cm-content");
      if (!content) { allDiscovered = false; continue; }
      editor.style.height = `${clamp(content.scrollHeight + 6, EDITOR_MAX_HEIGHT)}px`;
    }

    // 2. Vorschau messen (wächst mit dem Inhalt mit)
    if (preview) {
      const iframe = wireOnce(preview.iframe, "load", layout); // öffentliche @query-Property
      if (!iframe) {
        allDiscovered = false;
      } else {
        let contentHeight = 0;
        try {
          contentHeight = iframe.contentDocument?.documentElement?.scrollHeight || 0;
        } catch {} // Sandbox cross-origin noch nicht bereit

        // Statt der internen "__playground_"-Sandbox-URL prüfen wir nur,
        // ob überhaupt schon eine echte Seite geladen wurde (siehe Kommentar
        // in playground-preview.js: das iframe feuert vor dem Setzen von
        // .src bereits ein "load" für eine leere Seite).
        const live = iframe.src !== "" && contentHeight > 0;

        if (live || !shown) {
          preview.style.height = `${clamp(contentHeight + TOOLBAR_HEIGHT + 8, PREVIEW_MAX_HEIGHT)}px`;
        }
        if (live) reveal();
      }
    }

    if (!allDiscovered && discoveryTries++ < 40) {
      setTimeout(layout, 500); // Elemente noch nicht gerendert – begrenzt erneut versuchen
    }
  }

  layout();
  project.addEventListener("filesChanged", layout, { signal });
  window.addEventListener("resize", scheduleLayout, { signal });

  return () => {
    abortController.abort();
    clearTimeout(debounceTimer);
    clearTimeout(revealTimer);
  };
}

customElements.define("playground-html-css", PlaygroundHtmlCss);