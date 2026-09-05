# CSS: ID-Selektoren

Eine weitere Möglichkeit, Elemente für die Formatierung auszuwählen,
ist die Verwendung von ID-Selektoren. Dabei wird einem bestimmten Tag
eine ID zugewiesen, und die Formatierung wird nur für dieses eine Tag
festgelegt.


<playground-html-css>

<script type="sample/html">
<link rel="stylesheet" href="style.css">
<h1> Wie </h1> 
<p id="p1" > geht </p> 
<em> es </em> 
<p> dir? </p> 
</script>

<script type="sample/css">
#p1 {
    color: blue;
}
</script>

</playground-html-css>
