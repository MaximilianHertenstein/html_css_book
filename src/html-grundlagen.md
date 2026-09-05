# HTML-Grundlagen

## Elemente und Tags

In Word sieht das Dokument, das man bearbeitet, genauso aus wie eine PDF, die man damit erzeugt.

![Word-Dokument mit Bearbeitungsansicht](/images/html-grundlagen/word.png)
Quelle: <https://de.wikipedia.org/wiki/Datei:Ooowysiwyg.png>


Bei Webseiten ist das anders: Hier schreibst du ein *HTML*-Dokument, das
Formatierungsbefehle und Text enthält. Wenn jemand das Dokument mit einem Browser anschaut, sieht er den fertig formatierten Text.

Im folgenden Beispiel ist oben das HTML-Dokument zu sehen. Darunter siehst du die Website, die daraus erzeugt wird.


<playground-html-css>

<script type="sample/html">
<p>HTML ist super!</p>
<p>und wichtig</p>

</script>

</playground-html-css>



Ein HTML-Dokument besteht aus Elementen, denen durch sogenannte Tags
eine bestimmte Bedeutung zugewiesen wird. Zum Beispiel wird durch den Code `<p>HTML ist super!</p>` bestimmt, dass es sich bei dem Satz *HTML ist super!* um einen
eigenen Absatz handelt.



Tags schreibt man in spitzen Klammern (wie z. B. `<p>`). Wie in dem
Beispiel gehört zu vielen HTML-Elementen neben einem öffnenden auch ein
schließender Tag. Bei diesem steht nach der ersten spitzen Klammer noch
ein Schrägstrich (z. B. `</p>`). Zwischen den beiden Tags steht der Inhalt
des Elements.

![Aufbau eines HTML-Elements aus öffnendem Tag, Inhalt und schließendem Tag](/images/html-grundlagen/equation.svg)

Elemente, die weder Inhalt noch einen schließenden Tag benötigen, nennt
man leere Elemente. Ein Beispiel dafür ist das Tag `<br>`. Dieses steht
für einen Zeilenumbruch.

<playground-html-css>

<script type="sample/html">
HTML ist super!<br>
und wichtig!

</script>

</playground-html-css>


## Textformatierung

Im Gegensatz zu Word kannst du Text in HTML nicht mit Leerzeichen oder
Zeilenumbrüchen formatieren. Im folgenden Beispiel siehst du, dass
Zeilenumbrüche in der Ausgabe gelöscht und mehrere aufeinanderfolgende
Leerzeichen durch ein einzelnes Leerzeichen ersetzt werden.

<playground-html-css>

<script type="sample/html">
text1

text2

text3



text4
</script>



</playground-html-css>


Stattdessen musst du Texte immer mithilfe von Tags formatieren.

<playground-html-css>

<script type="sample/html">
<p>text1</p>

<p>text2</p>
<p>text3</p>
<br>
<p>text4</p>
</script>



</playground-html-css>


## Überschriften

Mit den Tags `<h1>` bis `<h6>` kannst du Überschriften mit unterschiedlicher Größe erstellen.

<playground-html-css>

<script type="sample/html">
<h1>Überschrift</h1>
<h2>Überschrift</h2>
<h3>Überschrift</h3>
<h4>Überschrift</h4>
<h5>Überschrift</h5>
<h6>Überschrift</h6>

</script>
</playground-html-css>





## Fett und Kursiv


Mit dem Tag `<strong>` werden Texte fett dargestellt. Mit dem Tag `<em>` werden Texte kursiv dargestellt.



<playground-html-css>

<script type="sample/html">

<em> wichtiger </em> 
<strong> Text </strong>
</script>

</playground-html-css>



## Verschachtelte Tags


Tags können entweder nacheinander

<playground-html-css>

<script type="sample/html">
<h1> Überschrift </h1>
<p> Erster Absatz </p>
<p> Zweiter Absatz </p>
</script>

</playground-html-css>

oder verschachtelt

<playground-html-css>

<script type="sample/html">
<p> HTML macht <strong> Spaß </strong> </p>
</script>

</playground-html-css>

verwendet werden.



Dabei gilt: Ein Element, das im Inhalt eines anderen Elements begonnen
wurde, muss auch dort wieder abgeschlossen werden. Zum Beispiel ist der
folgende Code nicht korrekt.

``` html
    <p> HTML ist <strong> super! </p> </strong>
```


