# CSS: Grundlagen und Selektoren

## Grundlagen

Die Formatierung von Websites erfolgt nicht im HTML-Code selbst, sondern
in einem separaten Dokument, dem sogenannten *Stylesheet*. Die Sprache, die in Stylesheets verwendet wird, wird *CSS* genannt.


In den folgenden Codeblöcken befindet sich der HTML-Code immer oben und der CSS-Code unten.

<playground-html-css>

<script type="sample/html">
<link rel="stylesheet" href="style.css">
<h1> hallo </h1> 
<p> welt </p> 
</script>

<script type="sample/css">
h1 {
  color: blue;
}
</script>

</playground-html-css>

Durch das Element `<link rel="stylesheet" href="style.css">`
wird die Datei `style.css` eingebunden.

In `style.css` wird festgelegt, dass alle Texte in `<h1>`-Tags eine blaue Schriftfarbe haben.

Dabei ist `color` die Eigenschaft, die geändert wird und `blue` der zugehörige Wert.



## Typselektoren

In den Beispielen oben haben wir die Formatierung aller Elemente mit dem Tagnamen `h1` geändert. Solche Anweisungen, die sich auf alle Tags mit einem bestimmten Namen
beziehen, werden *Typselektoren* genannt.

Wir können alle bisher kennengelernten Tags als *Typselektoren* verwenden.


<playground-html-css>

<script type="sample/html">
<link rel="stylesheet" href="style.css">
<h1> hallo </h1> 
<p> welt </p> 
</script>

<script type="sample/css">
h1 {
  color: blue;
}

p {
  color: blue;
}
</script>

</playground-html-css>








## Einbinden von CSS im Grundgerüst




Im HTML-Grundgerüst muss die `CSS`-Datei im `head`-Element eingebunden werden. 


<playground-html-css>

<script filename="new.html" type="sample/html">
<!DOCTYPE html>
<html lang = "de">

  <head>
    <meta charset = "utf-8">
    <link rel="stylesheet" href="style.css">

    <title> Titel des Browsertabs </title>
  </head>

  <body>
    <p> Eigentlicher Inhalt der Website </p> 
  </body>

</html>
</script>

<script type="sample/css">
p {
  color: red;
}
</script>

</playground-html-css>

