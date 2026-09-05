# CSS: Box-Modell

## Grundlagen

Jedes HTML-Element ist ein Rechteck. Um das Rechteck herum gibt es
drei Bereiche:

- `padding` für den Innenabstand zwischen Inhalt und Rahmen

- `border` für den Rahmen um das Element

- `margin` für den Außenabstand zu den Nachbarelementen

Alle drei Angaben machst du in Pixeln (`px`). Damit du den Innenabstand
siehst, bekommt das Element im Beispiel eine Hintergrundfarbe.


<playground-html-css>

<script type="sample/html">
<link rel="stylesheet" href="style.css">
<p> Hallo Welt </p>
</script>

<script type="sample/css">
p {
    background-color: lightblue;
    padding: 20px;
    border: 2px solid blue;
    margin: 20px;
}
</script>

</playground-html-css>
