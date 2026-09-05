# HTML: Grundstruktur, Bilder und Links

## Grundstruktur

Jedes HTML-Dokument braucht eine gewisse Grundstruktur, um zu
funktionieren.

``` html
<!DOCTYPE html>
<html lang = "de">

  <head>
    <meta charset = "utf-8">
    <title> Titel des Browsertabs </title>
  </head>

  <body>
    <p> Eigentlicher Inhalt der Website <p> 
  </body>

</html>
```

Wenn wir diese Grundstruktur in einer Datei `new.html` speichern und
diese mit einem Browser öffnen, ist Folgendes zu sehen:

<img src="images/html-grundstruktur/browser_grundstruktur.png" style="width:50.0%" alt="image" />

Alle HTML-Elemente, die du bis jetzt kennengelernt hast, schreibt man
zwischen `<body>` und `</body>`. Diese Grundstruktur ist im folgenden
Code zu sehen.

| Tag | Bedeutung |
|:---|:---|
| `<!DOCTYPE html>` | Informiert den Browser über den Typ des Dokuments |
| `<html lang = "de">` | Festlegung der Sprache. Der Inhalt ist der gesamte HTML-Code |
| `<meta charset= "utf-8" >` | Festlegung der Kodierung. Ermöglicht zum Beispiel die Verwendung von Umlauten |
| `<title>` | Titel des Browsertabs |
| `<head>` | Der Inhalt enthält Informationen über die Website, aber keine sichtbaren Elemente |
| `<body>` | Der Inhalt enthält alle HTML-Elemente, die auf der Website zu sehen sind |

## Eigenschaften

In dem Code oben schließt der öffnende Tag `<html>` nicht direkt,
sondern enthält noch `lang = "de"`. Dabei wird der Wert der Eigenschaft
`lang` auf den Wert `"de"` gesetzt.

Auch der Tag `<meta>` enthält die Eigenschaft `charset` mit dem Wert
`"utf-8"`.

## Einbinden von CSS

Um CSS zu verwenden, müssen wir den Code in einer separaten Datei
abspeichern. In unserem Beispiel nennen wir diese `stylesheet.css`.

<playground-html-css>

<script type="sample/html">
<p> Eigentlicher Inhalt der Website </p>
</script>

<script type="sample/css">
p {
  color: red;
}
</script>

</playground-html-css>

Diese Datei muss anschließend im `head`-Element eingebunden werden. Dies
geschieht mit dem Tag `link`. Der Wert der Eigenschaft `rel` ist
`stylesheet`. Der Wert der Eigenschaft `href` ist der Name der
CSS-Datei.

``` html
...
  <head>
...
  <link rel="stylesheet" href="stylesheet.css">
...
  </head>
...
```

## Links

In HTML kann man Links mit dem Tag `a` erstellen.


<playground-html-css>

<script type="sample/html">
<a href = "https://de.wikipedia.org">
    Wiki
</a>
</script>

</playground-html-css>



Der Inhalt des Elements ist der Text des Links. Mit der Eigenschaft
`href` wird angegeben, wohin der Link führt.

Weitere wichtige Attribute für Links sind `title` und `target`. Der
Titel des Links wird angezeigt, wenn der Benutzer mit der Maus über den
Link fährt. Mit dem Attribut `target` kann festgelegt werden, wo der
Link geöffnet werden soll. Falls das Attribut nicht gesetzt wird, öffnet
sich der Link im Browser-Tab, in dem er angeklickt wurde. Wird die
Option `target = "_blank"` gewählt, öffnet sich der Link in einem neuen
Tab.

<playground-html-css>

<script type="sample/html">
<a href = "https://de.wikipedia.org"
   target = "_blank">
    Wiki
</a>
</script>

</playground-html-css>

Wir können auch auf eigene HTML-Dateien verweisen.

<playground-html-css>

<script type="sample/html">
<a href = "subpage.html">
    Go to subpage
</a>
</script>

</playground-html-css>

## Bilder

Bilder werden mit dem Tag `img` angezeigt. Wichtige Eigenschaften sind:

- `src` für den Namen der Bilddatei

- `alt` für einen Text, der angezeigt wird, wenn das Bild nicht geladen
  werden kann

- `width` für die Breite des Bildes

Im folgenden Beispiel wird das Bild `dog.png` eingebunden. Dieses liegt
im selben Ordner wie die `html`-Datei.

``` html
<h1>Total süßer Hund</h1>
<img src="dog.png" alt = "Ein süßer Hund" width = "500">
```

<img src="images/html-grundstruktur/website_hund.png" style="width:50.0%" alt="image" />
