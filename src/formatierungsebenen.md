# Formatierungsebenen

## Inhalt und Aussehen

Eine Website besteht aus zwei Ebenen:

- `HTML` für den Inhalt und die Struktur der Seite

- `CSS` für das Aussehen der Seite

Der HTML-Code beschreibt also, was auf der Seite steht. Der CSS-Code
beschreibt, wie es aussieht. Im Beispiel bleibt der HTML-Code gleich,
nur CSS ändert die Überschrift.


<playground-html-css>

<script type="sample/html">
<link rel="stylesheet" href="style.css">
<h1> Hallo Welt </h1>
<p> Ein Absatz </p>
</script>

<script type="sample/css">
h1 {
    color: red;
    font-size: 40px;
}
</script>

</playground-html-css>
