# CSS: Box-Modell

## Grundlagen

Jedes HTML-Element ist ein Rechteck. Das Rechteck besteht aus dem Inhalt und dem Rahmen des Elements.

Mit `border` legst du den Rahmen fest. Das Beispiel zeigt einen 5 Pixel breiten, durchgezogenen (`solid`) roten Rahmen.
Ohne `solid` siehst du keinen Rahmen. Die Farbe funktioniert wie bei `color`.

<playground-html-css>

<script type="sample/html">
<link rel="stylesheet" href="style.css">
<p> Hallo Welt </p>
</script>

<script type="sample/css">
p {
    border: 5px solid red;
}
</script>

</playground-html-css>

## Innenabstand mit `padding`

Mit `padding` legst du den Abstand zwischen Inhalt und Rahmen fest. 
Alle Längenangaben in diesem Kapitel gibst du in Pixeln (`px`) an.


<playground-html-css>

<script type="sample/html">
<link rel="stylesheet" href="style.css">
<p> Hallo Welt </p>
</script>

<script type="sample/css">
p {
    border: 5px solid red;
    padding: 10px;
}
</script>

</playground-html-css>

## Außenabstand mit `margin`

Mit `margin` legst du den Abstand nach außen fest, also zum nächsten Element oder zum Seitenrand.
Im Beispiel hat der Absatz (`p`) rundherum 30 Pixel Abstand.



<playground-html-css>

<script type="sample/html">
<link rel="stylesheet" href="style.css">
<h1> Überschrift </h1>
<p> Hallo Welt </p>
</script>

<script type="sample/css">
h1 {
    border: 1px solid red;
}
p { 
    margin: 30px;
    border: 5px solid red;
    padding: 10px;
}


</script>

</playground-html-css>