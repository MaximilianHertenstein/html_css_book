# Interaktive HTML-/CSS-Beispiele in mdBook

[https://maximilianhertenstein.github.io/html_css_book/]

Dieses Projekt integriert [Playground Elements](https://github.com/google/playground-elements)
in ein [mdBook](https://rust-lang.github.io/mdBook/).
Damit lassen sich HTML und CSS mit editierbaren Beispielen und Live-Vorschau erklären.

## Verwendung im Markdown

```html
<playground-html-css>

<script type="sample/html">
<h1>Hallo Welt!</h1>
<p>Meine erste Webseite.</p>
</script>

<script type="sample/css">
h1 {
    color: steelblue;
}
</script>

</playground-html-css>
```

Je ein `script`-Tag pro Sprache genügt. Daraus werden automatisch
HTML-Editor, CSS-Editor und darunter die Live-Vorschau aufgebaut
(Custom-Layout aus `playground-project`, `playground-file-editor`, `playground-preview`).
CSS wird automatisch als `style.css` eingebunden — im Markdown ist kein `<link>` nötig.
Jeder Editor sitzt auf seinem Inhalt (knapp darüber, ohne zu springen);
die Vorschau passt sich der gerenderten Seite an
(Deckel: 400px bzw. 600px, danach mit Scrollbalken).

## Voraussetzungen, Installation, Befehle

Benötigt: [mdBook](https://rust-lang.github.io/mdBook/), Node.js + npm.

```bash
npm install     # playground-elements + esbuild installieren
npm run serve   # Vorschauserver (http://localhost:3000)
npm run build   # fertiges Buch in book/
```

`serve` und `build` rufen vorher `npm run playground` auf:
Die 4 Playground-Laufzeitdateien werden aus `node_modules` nach `src/` kopiert
und das ES-Modul-Bundle `src/book_theme/playground-bundle.<hash>.js`
wird mit esbuild erzeugt. Der Hash im Dateinamen macht jede Version
eindeutig, sodass der Browser nie altes JS mit neuem CSS mischt.
`head.hbs` wird vom Build-Skript dazu passend erzeugt.
Generierte Dateien stehen in `.gitignore` und werden nicht gepflegt.

## Dateien

```text
scripts/build-playground.js              Laufzeitdateien kopieren + Bundle bauen
src/book_theme/head.hbs                  lädt das Bundle als ES-Modul (generiert)
src/book_theme/playground-html-css.js    <playground-html-css>: Editoren + Vorschau untereinander
src/book_theme/playground-html-css.css   Layout: Editoren links, Vorschau rechts
book.toml                                bindet Theme und CSS ein
```

Die Vorschau läuft auf derselben Origin unter `playground/`.
Für ein Schulbuch reicht das; bei einer öffentlichen Seite mit sensiblen Daten
sollte die Sandbox auf eine separate Origin (`sandboxBaseUrl` anpassen).
