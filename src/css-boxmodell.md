# CSS: Box-Modell

## Grundlagen

Jedes HTML-Element ist ein Rechteck. Zu dem Rechteck gehören
der Inhalt und der Rahmen des Elements.
Die Farbe des Rahmens kann wie dei Schriftfarbe verändert werden.
Die Breite des Rahmens kann mit der Eigenschaft `pixel` geändert werden.
Wie alle Längenangaben in diesem Kapitel muss diese in Pixeln (`px`) gemacht werden.
`solid`  wird benötigt, damit der Rahmen pberhaupt angezeigt wird.

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

## Border

Die Eigenschaft `padding` ist der Abstand von Inhalt und Rahmen des Elements.

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

## Margin

Die Eigenscahft `margin` ist der Außenabstand eines Elements zum nächsten Element oder zum Seitenende



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