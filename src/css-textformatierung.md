# Textformatierung mit CSS


## Weitere wichtige Eigenschaften

Mit der Eigenschaft `font-size` kannst du die Schriftgröße von
HTML-Elementen festlegen. Die Schriftgröße wird in Pixeln (`px`)
angegeben.


<playground-html-css>

<script type="sample/html">
<link rel="stylesheet" href="style.css">
<h1> Überschrift </h1>
</script>

<script type="sample/css">
h1 {
    font-size: 60px;
}
</script>

</playground-html-css>



Mit der Eigenschaft `font-family` legst du die Schriftart von
HTML-Elementen fest. Als Wert schreibst du den Namen der Schrift,
zum Beispiel `Arial`.


<playground-html-css>

<script type="sample/html">
<link rel="stylesheet" href="style.css">
<p> Hallo Welt </p>
</script>

<script type="sample/css">
p {
    font-family: Brush Script MT,cursive; 
}
</script>

</playground-html-css>



Mit der Eigenschaft `text-align` kannst du die
Ausrichtung von Texten in HTML-Elementen festlegen. In den
folgenden Beispielen wird derselbe Text einmal linksbündig und einmal
zentriert dargestellt.


<playground-html-css>

<script type="sample/html">
<link rel="stylesheet" href="style.css">
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
<link rel="stylesheet" href="style.css">
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