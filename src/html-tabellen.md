# HTML: Tabellen

Tabellen kannst du mit dem Befehl `<table>` erstellen. Tabellen enthalten Zeilen, die
mit `<tr>` abgegrenzt werden. Die einzelnen Zeilen wiederum enthalten
Datenelemente, die mit `<td>` abgegrenzt werden.


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
sein.


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
