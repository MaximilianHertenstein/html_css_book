# CSS: Grundlagen und Selektoren

## Grundlagen

Die Formatierung von Websites erfolgt nicht im HTML-Code selbst, sondern
in einem separaten Dokument, dem sogenannten *Stylesheet*. Im folgenden
Beispiel siehst du den HTML-Code und den zugehörigen CSS-Code.


<playground-html-css>

<script type="sample/html">
<h1> hallo </h1> 
<p> welt </p> 
</script>

<script type="sample/css">
h1 {
  color: blue;
}
</script>

</playground-html-css>


Im CSS-Code wird festgelegt, dass alle Texte in einem `<h1>`-Tag blau
dargestellt werden.

Dabei ist `color` die Eigenschaft und `blue` der zugehoerige Wert.

## Weitere wichtige Eigenschaften

Mit der Eigenschaft `font-size` kannst du die Schriftgröße von
HTML-Elementen festlegen. Die Schriftgröße wird in Pixeln (`px`)
angegeben. Je größer die Zahl, desto größer die Schrift.


<playground-html-css>

<script type="sample/html">
<h1> Überschrift </h1>
</script>

<script type="sample/css">
h1 {
    font-size: 60px;
}
</script>

</playground-html-css>



Eine weitere wichtige Eigenschaft ist `text-align`, mit der du die
Ausrichtung von Text in HTML-Elementen festlegen kannst. In den
folgenden Beispielen wird derselbe Text einmal linksbündig und einmal
zentriert dargestellt.


<playground-html-css>

<script type="sample/html">
<p> Lorem ipsum dolor sit amet, consetetur sadipscing elitr. </p>
</script>

<script type="sample/css">
p {
    text-align: left;
}
</script>

</playground-html-css>



<playground-html-css>

<script type="sample/html">
<p> Lorem ipsum dolor sit amet, consetetur sadipscing elitr. </p>
</script>

<script type="sample/css">
p {
    text-align: center;
}
</script>

</playground-html-css>



Weitere CSS-Eigenschaften findest du in der CSS-Referenz:
<https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties>.

## Typselektoren

In den Beispielen oben haben wir die Formatierung ueber die Namen
bestimmter HTML-Tags festgelegt, zum Beispiel `h1` oder `p`. Ein
weiteres Beispiel dafuer ist im folgenden Code zu sehen.


<playground-html-css>

<script type="sample/html">
<h1> Wie </h1> 
<p> geht </p> 
<em> es </em> 
<p> dir? </p> 
</script>

<script type="sample/css">
p {
    color: blue;
}
</script>

</playground-html-css>



Solche Anweisungen, die sich auf alle Tags mit einem bestimmten Namen
beziehen, werden *Typselektoren* genannt. In diesem Beispiel betrifft
der Selektor `p` alle Absatz-Tags der Seite.
