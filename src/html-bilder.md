# HTML: Bilder

## Grundlagen

Bilder werden mit dem Tag `img` angezeigt. Wichtige Eigenschaften sind:

- `src` für den Namen der Bilddatei

- `alt` für einen Text, der angezeigt wird, wenn das Bild nicht geladen
  werden kann

- `width` für die Breite des Bildes

Im folgenden Beispiel wird ein Bild aus dem Internet eingebunden.


<playground-html-css>

<script filename="index.html" type="sample/html">
<h1>Total süßer Hund</h1>
<img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/My_Cute_dog%28MOTE%29_2014-05-08_08-04.JPG"
     alt="Ein süßer Hund"
     width="300">
</script>

</playground-html-css>


## Lokale Bilder


Wie bei Links auf eigene HTML-Dateien kannst du auch lokal verfügbare Bilder verwenden.


Wenn sich das Bild im selben Ordner wie die HTML-Datei befindet und den Namen `dog.png` hat, kannst du es folgendermaßen einbinden.

```html
<img src="dog.png" alt="Ein süßer Hund" width="300">
```