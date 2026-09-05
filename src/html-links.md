# HTML: Links


## Grundlagen
In HTML kann man Links mit dem Tag `<a>` erstellen.


<playground-html-css>

<script type="sample/html">
<a href="https://de.wikipedia.org"> Wiki </a>
</script>

</playground-html-css>

## Eigenschaften


Der Inhalt des Elements wird als Text des Links angezeigt. Mit
`href=...` wird angegeben, zu welcher Website der Link führt.

## Eigenschaften

In dem Beispiel oben ist `href` eine Eigenschaft des HTML-Elements.

Mit `html
href="https://de.wikipedia.org"
`
wird festgelegt, dass diese Eigenschaft den Wert `"https://de.wikipedia.org"` hat.


## Target

Mit dem Attribut `target` kann festgelegt werden, wo der
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

Wir können in Links auch auf eigene HTML-Dateien verweisen.

<playground-html-css>

<script filename="index.html" type="sample/html">
<a href = "./subpage.html">
    Go to subpage
</a>
</script>

<script filename="subpage.html" type="sample/html">
 <h1> Subpage </h1>
</script>


</playground-html-css>
