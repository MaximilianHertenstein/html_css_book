# CSS: Klassenselektoren

Eine weitere Moeglichkeit, Elemente fuer die Formatierung auszuwaehlen,
ist die Verwendung von Klassenselektoren. Dabei wird einem oder mehreren
Tags eine Klasse zugewiesen, und die Formatierung wird nur fuer diese
Klasse festgelegt. In CSS steht vor dem Namen der Klasse ein Punkt, um
anzuzeigen, dass es sich um einen Klassenselektor handelt.


<playground-html-css>

<script type="sample/html">
<h1> Wie </h1> 
<p class="important" > geht </p> 
<em class="important"> es </em> 
<p> dir? </p> 
</script>

<script type="sample/css">
.important {
    color: blue;
}
</script>

</playground-html-css>
