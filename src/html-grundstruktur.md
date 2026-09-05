# HTML: Grundstruktur

## Grundstruktur

Wir haben bisher nur unvollständige HTML-Dokumente geschrieben. Der Browser hat diese selbst vervollständigt und konnte sie so anzeigen. Um die volle Kontrolle zu haben, schreibst du selbst ein Grundgerüst.


<playground-html-css>

<script filename="new.html" type="sample/html">
<!DOCTYPE html>
<html lang = "de">

  <head>
    <meta charset = "utf-8">
    <title> Titel des Browsertabs </title>
  </head>

  <body>
    <p> Eigentlicher Inhalt der Website </p> 
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




