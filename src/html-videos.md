# HTML: Videos

## Grundlagen

Videos werden mit dem Tag `video` angezeigt. Wichtige Eigenschaften sind:

- `src` für den Namen der Videodatei

- `controls` für die Steuerung des Videos

- `width` für die Breite des Videos

Ohne `controls` fehlt die Steuerung. Du kannst das Video
dann nicht abspielen.

Im folgenden Beispiel wird ein Video aus dem Internet eingebunden.


<playground-html-css>

<script filename="index.html" type="sample/html">
<video src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
       controls
       width="300"></video>
</script>

</playground-html-css>


## Lokale Videos


Wie bei Bildern kannst du auch lokal verfügbare Videos verwenden.


Wenn sich das Video im selben Ordner wie die HTML-Datei befindet und den Namen `blume.mp4` hat, kannst du es folgendermaßen einbinden.

```html
<video src="blume.mp4" controls width="300"></video>
```
