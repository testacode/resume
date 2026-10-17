# Gotchas

Bugs difíciles, configs no documentadas y workarounds. Formato libre, por fecha.

## 2026-10-17 — Hero scenes (WebGL2)

- **No llamar `loseContext()` en el cleanup del effect.** En dev, StrictMode corre el effect dos veces sobre el mismo `<canvas>`; `getContext('webgl2')` devuelve el mismo contexto, y si quedó perdido los shaders no compilan (`getShaderInfoLog` → `null`). El canvas se desmonta con `key={scene.id}` y el GC se encarga.
- **Medir el `<h1>` con `offsetTop/offsetLeft`, no con `getBoundingClientRect()`.** Motion anima la entrada con `transform`, y la máscara de texto / el horizonte se construyen antes de que termine: el rect da la posición intermedia y el nombre del shader queda corrido. `untransformedOffset()` en `scenes/textMask.ts` suma la cadena de `offsetParent`; las palabras se ubican relativas al rect del `h1` (mismo transform) y se suman a ese origen.
- **Grid del hero**: `.content` base tiene `align-items: center`; en modo escena hay que forzar `align-items: stretch` o la fila 1 no empuja el nombre al fondo (queda flotando al medio de la fila y el horizonte no coincide).
- **agent-browser `console` acumula entre navegaciones** dentro de la misma sesión; `console.clear()` en la página no lo vacía. Para saber si un error es nuevo, cambiar el texto del log y buscar el formato nuevo.
- jsdom no tiene canvas: `src/test/setup.ts` stubbea `getContext` → `null` para que el código tome el fallback sin ruido en la consola de tests.
