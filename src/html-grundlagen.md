# HTML-Grundlagen

## Elemente und Tags

In Word schreibst du direkt das Dokument, das du später benutzt. Bei
Webseiten ist das anders: Hier schreibt man ein HTML-Dokument mit
Befehlen, die der Browser erkennt und ausführt. Die Besucher der Website
sehen nicht die Befehle, sondern nur das Ergebnis im Browser.

Ein HTML-Dokument besteht aus Elementen, denen durch sogenannte Tags
eine bestimmte Bedeutung zugewiesen wird. Zum Beispiel wird durch den Code `<p> HTML ist super! </p>` bestimmt, dass es sich bei dem Satz “HTML ist super!” um einen
eigenen Absatz handelt.\
Die Tags sind nicht für Besucher der Website gedacht, sondern werden vom
Browser erkannt und beeinflussen die Struktur des gezeigten Textes.

Tags schreibt man in spitzen Klammern (wie z. B. `<p>`). Wie in dem
Beispiel gehört zu vielen HTML-Elementen neben einem öffnenden auch ein
schließender Tag. Bei diesem steht nach der ersten spitzen Klammer noch
ein Querstrich (z. B. `</p>`). Zwischen den beiden Tags steht der Inhalt
des Elements.

![alt text](/images/html-grundlagen/equation.svg)


<playground-html-css>

<script type="sample/html">
<p>HTML ist super!</p>
</script>

</playground-html-css>


Weitere wichtige HTML-Tags mit schließendem Tag und Inhalt sind:

- `<h1>` bis `<h6>` für unterschiedlich große Überschriften

- `<strong>` und `<em>` (die Inhalte werden meist fett oder kursiv
  dargestellt) für sehr wichtige bzw. wichtige Inhalte

- `<a>` für Anker

Elemente, die weder Inhalt noch einen schließenden Tag benötigen, nennt
man leere Elemente. Ein Beispiel dafür ist der Tag `<br>`. Dieser steht
für einen Zeilenumbruch.

## Verschachtelte Tags


Tags können sowohl nacheinander

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

## Textformatierung

Im Gegensatz zu Word kannst du Text in HTML nicht mit Leerzeichen oder
Zeilenumbrüchen formatieren. Im folgenden Beispiel siehst du, dass
Zeilenumbrüche in der Ausgabe gelöscht und mehrere aufeinanderfolgende
Leerzeichen durch ein einzelnes Leerzeichen ersetzt werden.


<playground-html-css>

<script type="sample/html">
<p> Überschrift Text </p>

<p> Überschrift 

    Text
</p>
</script>

</playground-html-css>



Ein erster Schritt zur Formatierung ist die geeignete Auswahl von Tags.
Zum Beispiel kannst du mit Tags bestimmen, welche Teile des Textes
Überschriften oder eigene Absätze sind. Wie diese Elemente dargestellt
werden (Farbe, Schriftgröße usw.), wird aber nicht mit HTML, sondern mit
CSS festgelegt.


<playground-html-css>

<script type="sample/html">
<h1> Überschrift </h1>

<p> Text <em> wichtiger </em> 
<strong> Text </strong> </p>
</script>

</playground-html-css>



## Kommentare

Um deinen HTML-Code für dich und andere lesbarer zu machen, solltest du
Kommentare einfügen. In HTML musst du Kommentare mit `<!--` beginnen und
mit `-->` beenden. Der Code oder Text dazwischen ist nur im
HTML-Dokument und nicht auf der Website zu sehen.

<playground-html-css>

<script type="sample/html">
<p> Dieser Text ist auf der Website sichtbar</p>

<!-- <p> Dieser Text ist nur im HTML-Dokument sichtbar</p> -->
</script>

</playground-html-css>

## Listen

In HTML gibt es geordnete Listen, deren Inhalt durchnummeriert wird und
ungeordnete Listen, bei denen dies nicht der Fall ist. Die
entsprechenden HTML-Befehle lauten: `<ol>` (*ordered list*) und `<ul>`
(*unordered list*). Die einzelnen Listenelemente grenzt man durch den
Tag `<li>` voneinander ab. Damit der HTML-Code übersichtlich bleibt, ist
es sinnvoll, den Code für die einzelnen Listenelemente einzurücken.


<playground-html-css>

<script type="sample/html">
<ol>
  <li> USA </li>
  <li> VR China </li>
  <li> Japan </li>
</ol>

<ul>
  <li> Europa </li>
  <li> Asien </li>
  <li> Afrika </li>
  <li> Amerika </li>
  <li> Australien </li>
</ul>
</script>

</playground-html-css>



## Tabellen

In HTML ist es auch möglich, Tabellen zu erstellen. Die Tabelle selbst
wird mit dem Befehl `<table>` begonnen. Tabellen enthalten Zeilen, die
mit `<tr>` abgegrenzt werden. Die einzelnen Zeilen wiederum enthalten
Datenelemente, die mit `<td>` abgegrenzt werden.\


<playground-html-css>

<script type="sample/html">
<table>
  <tr>
    <td> USA </td>
    <td> 21.433 </td>
  </tr>
  <tr>
    <td> VR China </td>
    <td> 15.732 </td>
  </tr>
  <tr>
    <td> Japan </td>
    <td> 5.080 </td>
  </tr>
</table>
</script>

</playground-html-css>




Mit dem Tag `<th>` lassen sich Überschriften für die Spalten der Tabelle
einfügen. Auch Überschriften müssen in einem `<tr>`-Element enthalten
sein.\


<playground-html-css>

<script type="sample/html">
<table>
  <tr>
    <th> Land </th>
    <th> BIP in Mrd.</th>
  </tr>
  <tr>
    <td> USA </td>
    <td> 21.433 </td>
  </tr>
  <tr>
    <td> VR China </td>
    <td> 15.732 </td>
  </tr>
</table>
</script>

</playground-html-css>
