// <playground-html-css>: Custom-Layout –
// links HTML- und CSS-Editor untereinander, rechts die Live-Vorschau.
// Beide Spalten werden stets auf dieselbe Höhe gezogen.
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
    if (htmlText && css && !htmlText.includes("style.css")) {
      htmlText = `<link rel="stylesheet" href="style.css">\n${htmlText}`;
    }
    const cssText = css?.textContent.trim() ?? "";

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
    if (htmlText) {
      // Sofortige Starthöhe aus dem Quelltext, damit nichts springt.
      // Der exakte Feinschliff folgt nach dem Rendern.
      const ed = editor(project, "index.html", htmlText);
      fileEditors.push(ed);
      editorsBox.appendChild(section("index.html", ed));
    }
    if (cssText) {
      const ed = editor(project, "style.css", cssText);
      fileEditors.push(ed);
      editorsBox.appendChild(section("style.css", ed));
    }
    root.appendChild(editorsBox);

    let previewEl = null;
    if (htmlText) {
      previewEl = preview(project);
      // Unsichtbar, bis die erste echte Messung sitzt (sonst Geflacker).
      previewEl.style.visibility = "hidden";
      const box = section("Vorschau", previewEl, "playground-html-css-preview");
      // Eigener Reload-Button in der Kopfzeile (Toolbar ist ausgeblendet).
      const reload = document.createElement("button");
      reload.className = "playground-html-css-reload";
      reload.textContent = "↻";
      reload.title = "Vorschau neu laden";
      reload.setAttribute("aria-label", "Vorschau neu laden");
      reload.addEventListener("click", () => previewEl.reload());
      box.querySelector(".playground-html-css-header").appendChild(reload);
      root.appendChild(box);
    } else {
      root.classList.add("playground-html-css--solo");
    }

    this.replaceChildren(project, root);
    equalizeHeights(root, fileEditors, previewEl);
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
  editor.style.height = `${Math.min(Math.max(code.split("\n").length * 20 + 16, 40), EDITOR_MAX_HEIGHT)}px`;
  return editor;
}

function preview(project) {
  const preview = document.createElement("playground-preview");
  preview.project = project;
  return preview;
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

// Schreibt eine Höhe nur bei echter Änderung (> 2px): Subpixel-Dithering
// an Scroll-Schwellen würde sonst endlos hin- und herschalten (Flackern).
function setHeight(el, h, cap) {
  const next = Math.min(Math.ceil(h), cap);
  const cur = parseFloat(el.style.height) || 0;
  if (Math.abs(next - cur) > 2) el.style.height = `${next}px`;
}
// Editoren sitzen immer exakt auf ihrem Inhalt. Die Zeile wird so hoch wie
// die höhere Seite – ist die Vorschau kürzer, füllt sie auf (wie ein
// Browserfenster); ist sie länger, bleibt links unten ruhig Luft.
// Alle Messwerte sind layout-unabhängig, daher keine Anpassungsschleife.
// Zieht beide Spalten auf dieselbe Höhe, ohne je einen Editor zu verziehen:
// Editoren sitzen immer exakt auf ihrem Inhalt. Die Zeile wird so hoch wie
// die höhere Seite – ist die Vorschau kürzer, füllt sie auf (wie ein
// Browserfenster); ist sie länger, bleibt links unten ruhig Luft.
// Alle Messwerte sind layout-unabhängig, daher keine Anpassungsschleife.
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

async function equalizeHeights(root, fileEditors, previewEl) {
  // Warte auf die inneren Editoren: Die Projektdateien laden asynchron,
  // vorher rendert der File-Editor noch keinen Code-Editor.
  const editors = [];
  for (let attempt = 0; attempt < 50 && editors.length < fileEditors.length; attempt++) {
    editors.length = 0;
    for (const fe of fileEditors) {
      try {
        await fe.updateComplete;
        const ce = fe.shadowRoot?.querySelector("playground-code-editor");
        if (!ce) continue;
        injectNofocus(ce);
        await ce.updateComplete;
        const content = ce.shadowRoot?.querySelector(".cm-content");
        if (!content) continue;
        editors.push({ fe, ce, content });
      } catch {
        // Noch nicht bereit – nächster Versuch.
      }
    }
    if (editors.length < fileEditors.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  let iframe = null;
  let toolbarH = 41;
  if (previewEl) {
    await previewEl.updateComplete;
    iframe = previewEl.shadowRoot.querySelector("iframe");
    toolbarH =
      previewEl.shadowRoot.querySelector("#toolbar")?.getBoundingClientRect()
        .height || 41;
  }

  let previewShown = !previewEl;
  const showPreview = () => {
    if (previewShown || !previewEl) return;
    previewShown = true;
    previewEl.style.visibility = "";
  };
  // Fallback: notfalls sichtbar schalten, auch ohne Messung.
  setTimeout(showPreview, 3000);

  const headerEl = root.querySelector(".playground-html-css-header");
  const previewBox = root.querySelector(".playground-html-css-preview");

  const layout = () => {
    // Injektion nachholen, falls beim Init das Shadow-Root noch fehlte.
    for (const fe of fileEditors) {
      const ce = fe.shadowRoot?.querySelector("playground-code-editor");
      if (ce) injectNofocus(ce);
    }
    const headerH = headerEl?.offsetHeight || 23;
    // Zwei Spalten nebeneinander? (Sonst: natürliche Höhen.)
    const tracks = getComputedStyle(root).gridTemplateColumns.split(" ").length;
    const sideBySide = tracks > 1 && editors.length > 0 && previewEl;

    const infos = editors.map(({ ce, content }) => {
      // Inhaltshöhe + kleine Luft (ganze Pixel): exakt bündige Boxen
      // kippen an Scroll-Schwellen (Flackern). Echte Zeilenzahl ×
      // Zeilenhöhe, kein Umbruch in CodeMirror.
      const lines = Math.max((ce.value ?? "").split("\n").length, 1);
      const lineEl = content.querySelector(".cm-line");
      const lh = lineEl?.getBoundingClientRect().height || 19;
      const cs = getComputedStyle(content);
      const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      return Math.min(Math.ceil(lines * lh + pad) + 6, EDITOR_MAX_HEIGHT);
    });

    let contentH = 0;
    let live = false;
    if (previewEl) {
      try {
        const doc = iframe?.contentDocument;
        if (doc?.documentElement) contentH = doc.documentElement.scrollHeight;
        live = (iframe?.src ?? "").includes("__playground_") && contentH > 0;
      } catch {
        // Sandbox noch nicht bereit.
      }
    }

    if (!sideBySide) {
      // Untereinander bzw. solo: am Inhalt, ohne Reserve.
      infos.forEach((h, i) => {
        setHeight(editors[i].fe, h, EDITOR_MAX_HEIGHT);
      });
      if (previewEl) {
        setHeight(previewEl, contentH + toolbarH + 8, PREVIEW_MAX_HEIGHT);
        if (live) showPreview();
      }
      return;
    }

    const previewH = Math.min(Math.ceil(contentH) + toolbarH + 8, PREVIEW_MAX_HEIGHT);
    // Editoren exakt (ohne Strecken/Stauchen: Eingriff hier verzieht dort nichts).
    infos.forEach((h, i) => {
      setHeight(editors[i].fe, h, EDITOR_MAX_HEIGHT);
    });
    // Zeile so hoch wie die höhere Seite.
    const leftNatural =
      infos.length * headerH + infos.reduce((a, b) => a + b, 0);
    setHeight(previewEl, Math.max(leftNatural, headerH + previewH) - headerH, PREVIEW_MAX_HEIGHT);
    if (live) showPreview();

    // Geometrisch nachziehen (einmalig): Arithmetik sieht weder Rundungen
    // noch Border. Schreibt nur über setHeight (Hysterese) – kein Pingpong.
    requestAnimationFrame(() => {
      const headH = headerEl.getBoundingClientRect().height;
      setHeight(previewEl, Math.max(previewBox.clientHeight - headH, 0), PREVIEW_MAX_HEIGHT);
      // Falls eine Seite trotzdem überläuft (z. B. spät nachgereifte
      // Schrift-Metriken): exakt aufs Gerenderte aufziehen, gedeckelt.
      // Nur bei echter Änderung neu planen, sonst Endlosschleife.
      let dirty = false;
      const contentBox = previewEl.shadowRoot.querySelector("#content");
      if (contentBox) {
        const over =
          contentBox.getBoundingClientRect().bottom -
          previewEl.getBoundingClientRect().bottom;
        const cur = previewEl.getBoundingClientRect().height;
        const next = Math.min(cur + over, PREVIEW_MAX_HEIGHT);
        if (over > 2 && next - cur > 2) {
          previewEl.style.height = `${next}px`;
          dirty = true;
        }
      }
      for (const { fe, ce } of editors) {
        const scroller = ce.shadowRoot?.querySelector(".cm-scroller");
        if (!scroller) continue;
        // Mit horizontalem Balken sind die Vertikal-Werte verfälscht
        // (lange Zeile, z. B. der <link>) – dann nicht aufziehen,
        // sonst kämen fälschlich ~13px dazu. Scrollen ist dann normal.
        if (scroller.scrollWidth > scroller.clientWidth + 1) continue;
        const over = scroller.scrollHeight - scroller.clientHeight;
        const cur = fe.getBoundingClientRect().height;
        const next = Math.min(cur + over, EDITOR_MAX_HEIGHT);
        if (over > 2 && next - cur > 2) {
          fe.style.height = `${next}px`;
          dirty = true;
        }
      }
      if (dirty) schedule();
    });
  };

  layout();

  // Entprellt: Salven (z. B. CodeMirror-Nachrendern) werden zu einem Durchgang.
  let debounceTimer = 0;
  const schedule = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(layout, 120);
  };
  for (const { content } of editors) {
    new MutationObserver(schedule).observe(content, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }
  iframe?.addEventListener("load", schedule);
  try {
    iframe?.contentDocument?.fonts?.ready.then(schedule);
  } catch {
    // Sandbox noch nicht bereit – load-Listener greift dann.
  }
  window.addEventListener("resize", schedule);
  // Sicherheitsnetz für stilles Nachreifen (z. B. Schrift-Metriken),
  // das keine Events auslöst – auch für langsame Handshakes gestaffelt.
  for (const ms of [2500, 8000, 20000]) setTimeout(schedule, ms);
}

customElements.define("playground-html-css", PlaygroundHtmlCss);
