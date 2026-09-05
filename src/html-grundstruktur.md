# HTML: Grundstruktur

## Grundstruktur

Jedes HTML-Dokument braucht eine gewisse Grundstruktur, um zu
funktionieren.


<playground-html-css>

<script type="sample/html">
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
</script>

</playground-html-css>



Wenn wir diese Grundstruktur in einer Datei `new.html` speichern und
diese mit einem Browser öffnen, ist Folgendes zu sehen:

<img src="images/html-grundstruktur/browser_grundstruktur.png" style="width:50.0%" alt="image" />

Alle HTML-Elemente, die du bis jetzt kennengelernt hast, schreibt man
zwischen `<body>` und `</body>`.

| Tag | Bedeutung |
|:---|:---|
| `<!DOCTYPE html>` | Informiert den Browser über den Typ des Dokuments |
| `<html lang = "de">` | Festlegung der Sprache. Der Inhalt ist der gesamte HTML-Code |
| `<meta charset= "utf-8" >` | Festlegung der Kodierung. Ermöglicht zum Beispiel die Verwendung von Umlauten |
| `<title>` | Titel des Browsertabs |
| `<head>` | Der Inhalt enthält Informationen über die Website, aber keine sichtbaren Elemente |
| `<body>` | Der Inhalt enthält alle HTML-Elemente, die auf der Website zu sehen sind |



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
