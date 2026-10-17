# Gotchas

Bugs difíciles, configs no documentadas y workarounds. Formato libre, por fecha.

## 2026-10-17 — Hero scenes (WebGL2)

- **No llamar `loseContext()` en el cleanup del effect.** En dev, StrictMode corre el effect dos veces sobre el mismo `<canvas>`; `getContext('webgl2')` devuelve el mismo contexto, y si quedó perdido los shaders no compilan (`getShaderInfoLog` → `null`). El canvas se desmonta con `key={scene.id}` y el GC se encarga.
- **Medir el `<h1>` con `offsetTop/offsetLeft`, no con `getBoundingClientRect()`.** Motion anima la entrada con `transform`, y la máscara de texto / el horizonte se construyen antes de que termine: el rect da la posición intermedia y el nombre del shader queda corrido. `untransformedOffset()` en `scenes/textMask.ts` suma la cadena de `offsetParent`; las palabras se ubican relativas al rect del `h1` (mismo transform) y se suman a ese origen.
- **Grid del hero**: `.content` base tiene `align-items: center`; en modo escena hay que forzar `align-items: stretch` o la fila 1 no empuja el nombre al fondo (queda flotando al medio de la fila y el horizonte no coincide).
- **agent-browser `console` acumula entre navegaciones** dentro de la misma sesión; `console.clear()` en la página no lo vacía. Para saber si un error es nuevo, cambiar el texto del log y buscar el formato nuevo.
- jsdom no tiene canvas: `src/test/setup.ts` stubbea `getContext` → `null` para que el código tome el fallback sin ruido en la consola de tests.

## 2026-10-17 — Hero audio

- **Autoplay**: `AudioContext` nace `suspended` sin gesto. `resume()` tiene que llamarse *sincrónicamente* dentro del handler del gesto (antes de cualquier `await`), si no Chrome lo ignora. Por eso `start()` crea/resume el contexto antes del primer `await` y el Hero escucha `pointerdown/keydown/touchend` hasta que `start()` devuelva `true`.
- **Pixabay bloquea `curl`** (Cloudflare) pero la página expone la URL del CDN en el HTML: se abre en el Chrome CDP, se lee `cdn.pixabay.com/download/audio/...` del DOM y *eso* sí baja con `curl`. Openverse (`api.openverse.org`) devuelve previews de Freesound con URL directa y filtro de licencia, mucho más cómodo.
- **Opus sobrepasa el pico**: con limitador a −1 dBTP el `.ogg` salió a +1.2/+2.4 dBFS. Limitar a −3 dBTP antes de codificar. Y `alimiter` trae `level=true` por default: aplica make-up gain hasta el límite y te sube 3 dB la sonoridad que acabás de normalizar — `level=false`.
- Loop sin costura: no usar `<audio loop>` (deja hueco); el crossfade va horneado en el archivo (`scripts/make-sea-loop.sh`) y `AudioBufferSourceNode.loop` lo reproduce exacto.

## 2026-10-17 — Publicar el repo / perfil

- **`git push --mirror` tras `filter-repo`** falla en `refs/pull/N/head` ("deny updating a hidden ref"): las ramas se fuerzan igual, pero los commits viejos quedan vivos en GitHub colgados de las PRs. Purgarlos de verdad = pedido a GitHub Support. Tenerlo en cuenta antes de prometer "sin rastro".
- El shell tiene `cp` con `-i` (prompt "overwrite?") y `cp -f` no lo pisa: en scripts usar `command cp` o `cat src > dst`.
- `agent-browser record start <path> <url>`: con URL abre la página antes de que apliquen cambios de `localStorage` hechos en la tab; para grabar un estado forzado, navegar + verificar primero y grabar sin URL.
- El clasificador de permisos de Claude Code bloquea `filter-repo` y `push --force` aunque sea en `/tmp`; esos pasos los corre Carlos con `!`.

## 2026-10-17 — Banner del perfil (GIF del hero)

- `agent-browser record start` abre un **contexto nuevo** (sin `localStorage`, sin CSS inyectado): graba una escena al azar y con toda la UI. Y los screenshots por el wrapper salen a ~0.4 fps. Lo que funciona: `Page.startScreencast` por CDP directo sobre la tab propia (`scripts/capture-hero.mjs`, 35–45 fps reales) y `scripts/make-hero-banner.sh` para el GIF.
- GIF de escenas con dither/grano: cada píxel cambia por frame y no comprime. `paletteuse=dither=none`, ≤64 colores, 6 fps y 720 px: 1.7 MB; con dither de ffmpeg y 10 fps a 960 px el mismo clip daba 20 MB.
