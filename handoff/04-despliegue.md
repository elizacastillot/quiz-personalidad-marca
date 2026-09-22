# Despliegue: Cuestionario de Personalidad de Marca (Al Objetivo)

**Estado: PUBLICADO. Workflow completo en verde y la web publicada responde con los archivos nuevos.**

URL: https://elizacastillot.github.io/quiz-personalidad-marca/

Este informe sustituye al anterior (que correspondía al despliegue del commit `335b4b5`).

## Comprobaciones previas

| Comprobación | Resultado |
|---|---|
| `handoff/03-validacion.md` empieza por APROBADO | Sí: primera línea «APROBADO: 0 fallos. El único fallo de la validación anterior (`.decoracion-arquera` en `position: fixed` solapándose con controles interactivos) queda resuelto...». |
| `URL_APPS_SCRIPT` en `src/js/config.js` | URL real de Apps Script (`https://script.google.com/macros/s/AKfycbz.../exec`), no `"PENDIENTE"` (la palabra solo aparece en el comentario de la línea 2). |
| `node --test tests/` en local (Node 24.18.0) | Falla con `Cannot find module '...\tests'`. Es el problema ya documentado en `handoff/02-implementacion.md` (desde Node 22, los argumentos de `--test` se tratan como patrones glob, no como carpeta) y ya visto en el despliegue anterior: el workflow usa `actions/setup-node@v4` con Node 20 y ejecuta `node --test` (sin argumento, vía `npm test`), donde sí funciona — y así lo confirmó también esta ejecución del workflow (ver abajo). Por eso ejecuté además `npm test`, que es literalmente el mismo comando que corre en CI. |
| `npm test` (`node --test`) en local (Node 24.18.0) | **69 de 69 pruebas, 0 fallos.** |
| Rama y remoto | `main`, `origin` = `elizacastillot/quiz-personalidad-marca`; `git fetch origin main` sin novedades antes del push, sin commits remotos pendientes. |
| Cambios fuera de `src/`, `tests/` y `handoff/` | `.claude/skills/marca-al-objetivo/SKILL.md` (modificado) y dos archivos nuevos en `docs/` (`captura-pantalla-web-al-objetivo.png`, `mujer-con-arco-y-flecha.jpg`). **No incluidos en el commit** por estar fuera del alcance de esta tarea; quedan como cambios pendientes en el árbol de trabajo (`git status` los sigue mostrando tras el despliegue). |

No he modificado ningún archivo de `src/` ni de `tests/`; solo hice commit de lo que ya estaba en el árbol de trabajo (cambios de las rondas de implementación y validación anteriores) más los informes de `handoff/`.

## Commit publicado

- **`fbf6f24`** en `main`: «Corrige el solape de la mascota con los controles y publica el rediseño validado».
- Push normal (`335b4b5..fbf6f24`), sin forzar ni reescribir historial.
- Contenido (6 archivos): `src/css/estilos.css`, `src/index.html`, `src/img/mujer-arco-flecha.jpg` (imagen de la mascota, referenciada en `index.html` línea 15 y hasta ahora sin seguimiento en git; sin incluirla la web publicada habría dado 404 en esa imagen), `handoff/02-implementacion.md`, `handoff/03-validacion.md` y este mismo informe (`handoff/04-despliegue.md`).
- **No incluido:** `.claude/skills/marca-al-objetivo/SKILL.md` (modificado, fuera de `src/`/`tests/`/`handoff/`) ni `docs/captura-pantalla-web-al-objetivo.png` ni `docs/mujer-con-arco-y-flecha.jpg` (nuevos en `docs/`, que en cualquier caso no publica el workflow, pues solo sube `src/`).

## Workflow de GitHub Actions

Seguido con la API pública de GitHub por `curl` (`gh` no está instalado en esta máquina).

Ejecución nº 4 «Publicar en GitHub Pages», commit `fbf6f24`, evento `push`, conclusión **success** (11:50:47 a 11:51:21 UTC del 22/09/2026):
https://github.com/elizacastillot/quiz-personalidad-marca/actions/runs/35723738958

| Job | Resultado | Detalle |
|---|---|---|
| `pruebas` (`actions/setup-node@v4`, `node-version: 20`) | success | Paso «Run node --test» en verde: confirma en CI, con Node 20, lo mismo que `npm test` mostró en local (69/69). |
| `build` (`actions/upload-pages-artifact@v4`, `path: src`) | success | Solo se sube `src/`. |
| `deploy` (`actions/deploy-pages@v4`) | success | Despliegue completado. |

Versiones de acciones en uso (sin cambios respecto al despliegue anterior; no se ha tocado el workflow): `checkout@v4`, `setup-node@v4`, `configure-pages@v5`, `upload-pages-artifact@v4`, `deploy-pages@v4`.

## Comprobación de la URL publicada (solo peticiones GET con `curl`)

No se ha enviado nada a la URL de Google Apps Script; únicamente peticiones GET a la web publicada.

| Petición | Resultado |
|---|---|
| `index.html` | 200, `text/html; charset=utf-8`; `<title>` «Cuestionario de personalidad de marca — Al Objetivo» |
| Referencias de `index.html` | `css/estilos.css`, `img/favicon.svg`, `img/mujer-arco-flecha.jpg`, `js/interfaz.js` — todas rutas relativas |
| `css/estilos.css` | 200, `text/css` |
| Módulos JS: `js/config.js`, `envio.js`, `graficos.js`, `interfaz.js`, `puntuacion.js`, `resultado.js`, `utilidades.js` | 200, `application/javascript` |
| Datos: `data/arquetipos.js`, `data/cuestionario.js` | 200, `application/javascript` |
| Fuentes: `fonts/kanit-latin-400-normal.woff2`, `-700-` | 200, `font/woff2` |
| **`img/mujer-arco-flecha.jpg` (archivo nuevo de este despliegue)** | 200, `image/jpeg`, 357 275 bytes |
| Integridad | SHA-1 del contenido publicado idéntico, byte a byte, al blob de git del commit `fbf6f24` para `src/css/estilos.css`, `src/index.html` y `src/img/mujer-arco-flecha.jpg` (comparado con `git show HEAD:<archivo> \| sha1sum` para evitar el ruido de CRLF/LF que introduce `core.autocrlf=true` al comparar contra el archivo del disco local) |

`curl` solo confirma que los archivos se sirven; la página no se ha ejecutado en un navegador real.

## Lo que debe probar Elizabeth a mano

1. **Rellenar el cuestionario entero una vez** (por ejemplo el caso «Al Objetivo», que debe dar Mago 62 % / Hombre común 38 %) y comprobar que aparece una fila nueva en su hoja de cálculo de Google, con las 23 columnas bien colocadas y `sector` como identificador (p. ej. `servicios_profesionales`). Ninguna comprobación automatizada de este despliegue ha hecho una petición real: en todas se interceptó `fetch` a propósito.
2. **Aspecto del rediseño** en un navegador real (no solo en las capturas headless de las rondas de implementación/validación): logo, colores de Al Objetivo, tarjetas y tipografía Kanit.
3. **La mascota (mujer con arco y flecha)** al final de varias pantallas (bienvenida, «Tus datos», una pregunta de elección única, el bloque 3 con scroll): comprobar que se ve bien y que nunca tapa un botón ni una opción, tal como certifica la validación aprobada.
4. Revisar los puntos ya anotados como pendientes de decisión suya en informes anteriores: los textos provisionales de P35, la frase de P39 en modo fundador, y el Bufón con 3 comportamientos en «Puede» (ver `handoff/03-validacion.md` y `handoff/02-implementacion.md`).
5. **Caché del navegador**: si al abrir la URL se ve una versión antigua, esperar un par de minutos y forzar la recarga (Ctrl+F5).
