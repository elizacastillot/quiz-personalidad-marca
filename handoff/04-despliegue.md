# Despliegue: Cuestionario de Personalidad de Marca (Al Objetivo)

**Estado: PUBLICADO. Workflow completo en verde y la web publicada responde con los archivos nuevos.**

URL: https://elizacastillot.github.io/quiz-personalidad-marca/

Este informe sustituye al anterior (que correspondía al despliegue del commit `2cf228b`, que a su vez solo era un informe de despliegue: la web publicada seguía siendo la del commit `fbf6f24`). Esta ronda sí publica CSS nuevo.

## Comprobaciones previas

| Comprobación | Resultado |
|---|---|
| `handoff/03-validacion.md` empieza por APROBADO | Sí: primera línea «APROBADO: 0 fallos. Los 4 ajustes visuales pedidos por Elizabeth quedan resueltos en `src/css/estilos.css`...» (Validación 6). |
| `URL_APPS_SCRIPT` en `src/js/config.js` | URL real de Apps Script (`https://script.google.com/macros/s/AKfycbz.../exec`), no `"PENDIENTE"` (la palabra solo aparece en el comentario de la línea 2). |
| `node --test tests/` en local (Node 24.18.0) | Falla con `Cannot find module '...\tests'`. Es el problema ya documentado en `handoff/02-implementacion.md` (desde Node 22, los argumentos de `--test` se tratan como patrones glob, no como carpeta). El workflow usa `actions/setup-node@v4` con Node 20 y ejecuta `node --test` sin argumento (vía `npm test`), donde sí funciona, y así lo confirmó también esta ejecución del workflow (ver abajo). Por eso ejecuté además `npm test`, que es literalmente el mismo comando que corre en CI. |
| `npm test` (`node --test`) en local (Node 24.18.0) | **69 de 69 pruebas, 0 fallos.** |
| Rama y remoto | `main`, `origin` = `elizacastillot/quiz-personalidad-marca`; `git fetch origin main` antes del push no mostró commits remotos pendientes; push normal, sin rechazo ni conflicto. |
| Cambios fuera de `src/`, `tests/` y `handoff/` | `.claude/skills/marca-al-objetivo/SKILL.md` (modificado) y dos archivos nuevos en `docs/` (`captura-pantalla-web-al-objetivo.png`, `mujer-con-arco-y-flecha.jpg`). **No incluidos en el commit** por estar fuera del alcance de esta tarea; siguen como cambios pendientes en el árbol de trabajo tras el despliegue (confirmado con `git status` después del push). El diff de `SKILL.md` es una sola línea sobre tipografía (Kanit única, sin Nunito Sans), coherente con el Cambio 2 ya publicado; no se ha tocado. |

No he modificado ningún archivo de `src/` ni de `tests/`; solo hice commit de lo que ya estaba en el árbol de trabajo (el ajuste de estilo «Cambio 4», ya validado) más los informes de `handoff/` que documentan esa ronda.

## Commit publicado

- **`e2da1b4`** en `main`: «Afina el estilo visual: quita el recuadro de foco, agranda la mascota, quita negrita del enunciado y reduce los border-left de acento a 2px».
- Push normal (`2cf228b..e2da1b4`), sin forzar ni reescribir historial.
- Contenido (3 archivos): `src/css/estilos.css`, `handoff/02-implementacion.md`, `handoff/03-validacion.md`.
- **No incluido:** `.claude/skills/marca-al-objetivo/SKILL.md` (modificado, fuera de `src/`/`tests/`/`handoff/`) ni `docs/captura-pantalla-web-al-objetivo.png` ni `docs/mujer-con-arco-y-flecha.jpg` (nuevos en `docs/`, que en cualquier caso no publica el workflow, pues solo sube `src/`).

## Workflow de GitHub Actions

Seguido con la API pública de GitHub por `curl` (`gh` no está instalado en esta máquina).

Ejecución nº 5 «Publicar en GitHub Pages», commit `e2da1b4`, evento `push`, conclusión **success** (12:50:41 a 12:51:18 UTC del 22/09/2026):
https://github.com/elizacastillot/quiz-personalidad-marca/actions/runs/35729654384

| Job | Resultado | Detalle |
|---|---|---|
| `pruebas` (`actions/setup-node@v4`, `node-version: 20`) | success (12:50:44–12:50:53) | Paso «Run node --test» en verde: confirma en CI, con Node 20, lo mismo que `npm test` mostró en local (69/69). |
| `build` (`actions/upload-pages-artifact@v4`, `path: src`) | success (12:50:56–12:51:00) | Solo se sube `src/`. |
| `deploy` (`actions/deploy-pages@v4`) | success (12:51:04–12:51:18) | Despliegue completado. |

Versiones de acciones en uso (sin cambios respecto al despliegue anterior; no se ha tocado el workflow): `checkout@v4`, `setup-node@v4`, `configure-pages@v5`, `upload-pages-artifact@v4`, `deploy-pages@v4`. No se ha comprobado en esta ronda si existen versiones mayores más recientes; el despliegue anterior tampoco encontró motivo para actualizarlas y el workflow queda fuera de mi alcance de escritura.

## Comprobación de la URL publicada (solo peticiones GET con `curl`)

No se ha enviado nada a la URL de Google Apps Script; únicamente peticiones GET a la web publicada.

| Petición | Resultado |
|---|---|
| `index.html` | 200, `text/html; charset=utf-8`; `<title>` «Cuestionario de personalidad de marca — Al Objetivo»; `Last-Modified: Tue, 22 Sep 2026 12:51:07 GMT` (posterior al fin del job `deploy`). |
| `css/estilos.css` | 200, `text/css; charset=utf-8`. |
| Módulos JS: `js/config.js`, `envio.js`, `graficos.js`, `interfaz.js`, `puntuacion.js`, `resultado.js`, `utilidades.js` | 200 en los siete. |
| Datos: `data/arquetipos.js`, `data/cuestionario.js` | 200 en los dos. |
| `img/mujer-arco-flecha.jpg` | 200. |
| **Contenido nuevo servido, confirmado directamente en el CSS publicado** | `.encabezado-bloque { border-left: 2px solid var(--enfasis); ... }` (antes 4px); `[tabindex="-1"]:focus, [tabindex="-1"]:focus-visible { outline: none !important; box-shadow: none !important; }`; `.decoracion-arquera` con anchos `170px`/`240px`/`320px` en los puntos de corte (antes 110/170/230). |
| **Integridad** | SHA-1 del `css/estilos.css` servido por la URL pública, idéntico al de `git show HEAD:src/css/estilos.css` del commit `e2da1b4`: `62f3f9112c8ceb35a0b9cfb19ae1750f52b3193d` en ambos. |

`curl` solo confirma que los archivos se sirven; la página no se ha ejecutado en un navegador real en esta ronda.

## Lo que debe probar Elizabeth a mano

1. **Rellenar el cuestionario entero una vez** (por ejemplo el caso «Al Objetivo», que debe dar Mago 62 % / Hombre común 38 %) y comprobar que aparece una fila nueva en su hoja de cálculo de Google, con las 23 columnas bien colocadas y `sector` como identificador (p. ej. `servicios_profesionales`). Ninguna comprobación automatizada de este despliegue ha hecho una petición real: en todas se interceptó `fetch` o se hicieron solo peticiones GET.
2. **Que ya no se vea el recuadro naranja** al pasar de una pantalla a otra (por ejemplo al pulsar «Siguiente»): el título de la pregunta no debe mostrar ningún contorno ni sombra al recibir el foco automático.
3. **Que la mascota (mujer con arco y flecha) se vea más grande** y que en ningún momento tape un botón, una opción ni un campo, en el móvil y en el escritorio.
4. **Que el enunciado de cada pregunta ya no esté en negrita** (los títulos de bloque y del resultado sí deben seguir en negrita).
5. **Aspecto general**: que las líneas de color naranja junto a los bloques oscuros, avisos y frases destacadas se vean como un detalle fino, no como una barra gruesa.
6. **Caché del navegador**: si al abrir la URL se ve una versión antigua, esperar un par de minutos y forzar la recarga (Ctrl+F5).
