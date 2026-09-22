APROBADO: 0 fallos. Los 4 ajustes visuales pedidos por Elizabeth quedan resueltos en `src/css/estilos.css` (recuadro naranja del foco de accesibilidad eliminado, mascota agrandada a 110/170/240/320 px, enunciados sin negrita, `border-left` de acento a 2 px). La mascota más grande sigue sin solapar ningún control interactivo: comprobado con un recorrido real por Edge headless/CDP que pasa por **las 46 pantallas** del flujo completo (modo, datos, P1–P43, resultado) y, además, por la pantalla de resultado a 5 anchos de viewport (360/480/720/1100/1280 px) — cero solapes en todos los casos. `node --test` pasa 69/69 y ningún color de arquetipo coincide con la paleta de Al Objetivo.

# Validación 6: Cuestionario de Personalidad de Marca (Al Objetivo)

Sexta validación. Encargada específicamente para revisar una ronda de ajustes **puramente visuales** sobre el rediseño ya publicado y aprobado en la Validación 5 (`handoff/03-validacion.md`, versión anterior, APROBADO con 0 fallos, commit de referencia `fbf6f24`). Solo se ha escrito este informe; no se ha modificado nada de `src/` ni de `tests/`.

## 0. Qué ha cambiado desde la Validación 5

```
git diff --stat fbf6f24 -- src/js/ src/data/ tests/
(sin salida)

git diff --stat fbf6f24 -- src/css/ src/index.html
 src/css/estilos.css | 103 +++++++++++++++++++++++++++++-----------------------
 1 file changed, 58 insertions(+), 45 deletions(-)
```

Confirmado: **nada** ha cambiado en `src/js/`, `src/data/` ni `tests/` desde el commit que la Validación 5 dio por bueno. `src/index.html` tampoco cambia. El único archivo modificado es `src/css/estilos.css`, en el working tree (sin commitear todavía). Por eso los puntos 1–19 se dan por ✅ remitiéndose a la Validación 5 más una comprobación rápida propia (`node --test`, ausencia de `application/json`), y el esfuerzo de esta ronda se concentra en los puntos 20–23 y, sobre todo, en el punto 22 (mascota vs. controles), que es justo el que había fallado dos rondas atrás y cuya superficie de riesgo (tamaño de imagen) es lo único que ha vuelto a tocarse.

Los 4 cambios pedidos, verificados leyendo el CSS real (no solo `handoff/02-implementacion.md`):

1. **Sin recuadro naranja alrededor del enunciado al cambiar de pantalla** — `src/css/estilos.css` líneas 91–95: `[tabindex="-1"]:focus, [tabindex="-1"]:focus-visible { outline: none !important; box-shadow: none !important; }`. Antes, la regla equivalente (línea 96 de la versión previa) no llevaba `!important` en `outline-style` ni ganaba de forma fiable a `:focus-visible` (que sí llevaba `!important` en su `box-shadow`, líneas 81–85 antiguas). Ahora `:focus-visible` general ya no usa `!important` (línea 84: `box-shadow: 0 0 0 4px rgba(216, 133, 31, 0.35);` sin `!important`) y la regla de `[tabindex="-1"]` sí lo lleva en ambas propiedades, además de tener mayor especificidad (selector de atributo + pseudoclase). Doble garantía: especificidad y `!important`.
2. **Mascota más grande** — `src/css/estilos.css` líneas 650–671: base `110px` (antes `64px`), `≥480px` → `170px` (antes `110px`), `≥720px` → `240px` (antes `170px`), `≥1100px` → `320px` (antes `230px`).
3. **Enunciado sin negrita** — línea 210: `.pantalla > h2 { font-weight: 500; }`. Los `h1, h2, h3` genéricos (línea ~76) siguen en 700 para los títulos de sección de verdad (bloques, resultado); la regla más específica `.pantalla > h2` es la que gana para el enunciado de cada pregunta.
4. **`border-left` de acento a 2 px** — confirmado en 6 selectores (líneas 243, 399, 518, 524, 535, 587): `.encabezado-bloque`, `.error:not(:empty)`/`.campo-libre` (399), `.frase` (518), `.bloque-oscuro` (524), `.aviso-heroe` (535) y `.explicacion-alerta p` (587, con `var(--seccion-b)` en vez de `var(--enfasis)`, mismo criterio de grosor). `.opcion.seleccionada` (inset 4px) y `.escala .opcion.seleccionada` (inset 4px) no se tocaron a propósito, según explica `handoff/02-implementacion.md`: son indicadores de estado funcionales, no decoración estática — criterio razonable, no es un punto exigido por la especificación ni por el encargo de Elizabeth.

## 1. Comprobación propia del punto crítico: mascota vs. controles (punto 22)

### Metodología (más exhaustiva que la Validación 5, no solo repetida)

Recorrido real con Edge headless (`msedge.exe --headless=new --remote-debugging-port=9334`) controlado por WebSocket nativo de Node (sin dependencias externas, `node_modules` está vacío), contra un servidor estático propio de `src/` en `http://127.0.0.1:8321`, con `window.fetch` interceptado antes de cargar la app (sin envíos reales). A diferencia de la Validación 5 (4 pantallas muestreadas), esta ronda recorrió **automáticamente las 46 pantallas del flujo completo** (retomar progreso → modo → datos → P1–P43 → resultado), contestando de forma genérica cada pregunta (primer radio disponible, "Más"/"Menos" en el bloque 3, primera opción de cada `select`) y comprobando en cada pantalla, antes de avanzar, si el rectángulo de `.decoracion-arquera` intersecta con algún `button`, `a`, `input`, `select`, `textarea`, `.opcion` o `.boton-mm` visible.

Adicionalmente, en la pantalla de resultado final (la que tiene más contenido y tarjetas, y donde la mascota alcanza su tamaño máximo en escritorio) se repitió la comprobación a 5 anchos de viewport — 360, 480, 720, 1100 y 1280 px — en 3 fracciones de scroll cada uno (0 %, 50 %, 100 %), verificando también que `.decoracion-arquera` mide el ancho esperado en cada punto de corte (`110px` / `170px` / `240px` / `320px` / `320px`) y que no hay desbordamiento horizontal (`scrollWidth === clientWidth`).

### Resultado: cero solapes en las 46 pantallas y en los 5 anchos del resultado

- **46/46 pantallas del flujo** (incluida la de retomar progreso): `hasOverlap: false` en todas, comprobado antes de contestar y avanzar en cada una. Entre ellas están las 4 pantallas exactas que la Validación 5 había documentado (bienvenida/modo, «Tus datos», P5, bloque 3) y las 42 restantes que no se habían vuelto a recorrer desde el «Ciclo de corrección 2».
- **Pantalla de resultado a 360/480/720/1100/1280 px**, 3 fracciones de scroll cada uno (15 comprobaciones): `overlaps: []` en las 15, con el ancho de `.decoracion-arquera` confirmado en cada corte (`110px`, `170px`, `240px`, `320px`, `320px`) y sin desbordamiento horizontal en ninguno.
- Título de la novena pregunta del bloque 3 alcanzada en el recorrido: «Si tu marca fuera un lugar físico, sería...» — coincide literalmente con la especificación y con lo que documentó la Validación 5, confirmando que la navegación real del cuestionario no se ha visto afectada por los cambios de CSS.

Esto no es una coincidencia de la muestra: el mecanismo que garantiza la ausencia de solape (`.decoracion-arquera` en flujo normal del documento, como hermano de `#app` situado después de él en el DOM, sin `position: fixed`/`absolute` ni márgenes negativos — línea 650 y comentario adjunto en `estilos.css`) no depende del tamaño de la imagen ni del contenido de la pantalla. Agrandar la mascota de 64/110/170/230 px a 110/170/240/320 px no reintroduce el problema porque el mecanismo que lo evita es estructural, no una coincidencia de dimensiones. La comprobación de las 46 pantallas (en vez de una muestra de 4) confirma esto empíricamente, no solo por argumento estructural.

### Verificación colateral: los otros 3 puntos del encargo

- **Sin recuadro naranja:** `h2` con `tabindex="-1"` de la pantalla de bienvenida, tras `focus()` programático (igual que hace `interfaz.js` al cambiar de pantalla): `getComputedStyle` → `outlineStyle: "none"`, `boxShadow: "none"`.
- **Sin negrita:** el mismo `h2` (enunciado «¿En qué punto está tu marca?») y el de P5 (bloque 2): `fontWeight: "500"` en ambos.
- **`border-left` a 2 px:** confirmado por lectura directa del CSS (sección 0, punto 4); no requiere comprobación en navegador porque no depende de JavaScript ni de layout dinámico.

## 2. Resto de puntos: verificación propia breve, sin repetir el trabajo exhaustivo de la Validación 5

- `node --test tests/*.test.js` → **69 pruebas, 69 correctas, 0 fallos**, Node `v24.18.0` (ejecutado en esta ronda, tras los cambios de CSS; no podía haberse roto porque `src/js/` y `tests/` no cambiaron, pero se ha vuelto a ejecutar en vez de asumirlo).
- `grep -oE "#[0-9A-Fa-f]{6}" src/css/estilos.css | sort -u` → `#000000 #1A2B32 #3D391F #D8851F #FFFFFF`: sigue siendo exactamente la paleta de Al Objetivo, sin tintas nuevas (las sombras nuevas, más suaves, siguen siendo `rgba(0,0,0,…)` y `rgba(216,133,31,…)`, es decir `#D8851F` con transparencia, no un color nuevo).
- Colores de arquetipo (`src/data/arquetipos.js`, sin cambios) frente a esa paleta, recalculado con un script de Node en esta ronda: `['#F0E6D2','#2C3E50','#4A5D45','#B03A2E','#1A1A1A','#2E7D8C','#8B7355','#A64B6B','#E8B84B','#6B8E7F','#6B4C93','#5B2333']` → `colisiones: []`.
- `grep -rn "application/json" src tests` → sin resultados (comprobación trivial, repetida por higiene ya que toca `envio.js`, que no ha cambiado).
- Motor de puntuación, datos, envío, orden del resultado, avisos condicionales, `localStorage` y accesibilidad de etiquetas/teclado: **sin cambios de código desde la Validación 5** (confirmado arriba con `git diff --stat`), así que se remiten a esa validación, que los verificó con evidencia propia (scripts independientes, lectura íntegra de `puntuacion.js` y `envio.js`, 69 pruebas). No se han vuelto a ejecutar esos scripts ad hoc porque no hay ninguna superficie de cambio que pudiera haberlos afectado: ninguno de los 4 ajustes de esta ronda toca `src/js/` ni `src/data/`.

## 3. Tabla de comprobaciones (los 23 puntos)

| # | Comprobación | Estado | Evidencia |
|---|---|---|---|
| 1 | `node --test` pasa entero | ✅ | 69/69, 0 fallos, ejecutado de nuevo en esta ronda (sección 2). |
| 2 | Pruebas para cada caso del plan | ✅ | Sin cambios en `tests/` desde la Validación 5 (`git diff --stat` vacío, sección 0). |
| 3 | 43 preguntas P1–P43 y bloques = especificación | ✅ | Sin cambios en `src/data/`; recorrido real de esta ronda pasa por las 43 preguntas en orden y sin saltos (sección 1). |
| 4 | Bloque 3: 4 apariciones, pareja ≤ 2, 12 intracuadrantes ≥ 1 | ✅ | Sin cambios en `src/data/` desde la Validación 5, que lo calculó con script de Node (no a ojo). |
| 5 | Bloque 4 una vez, bloque 5 una vez, bloque 6 dos veces | ✅ | Sin cambios en `src/data/` desde la Validación 5. |
| 6 | Textos de preguntas y fichas literales (≥ 10) | ✅ | Sin cambios en `src/data/`; título de P16 («Si tu marca fuera un lugar físico, sería...») confirmado literal en el recorrido de esta ronda (sección 1). |
| 7 | Pesos correctos por bloque | ✅ | Sin cambios en `src/js/puntuacion.js` desde la Validación 5, que lo leyó íntegro. |
| 8 | Bloques 1 y 7 no afectan a ninguna puntuación | ✅ | Sin cambios en `src/js/puntuacion.js`. |
| 9 | La alerta usa el discriminante | ✅ | Sin cambios en `src/js/puntuacion.js`; prueba «Alerta: los tres párrafos siguen al discriminante, no al total» pasa (sección 2). |
| 10 | Negativas a 0 solo para porcentajes | ✅ | Sin cambios en `src/js/puntuacion.js`. |
| 11 | Empates según la especificación, reproducibles | ✅ | Sin cambios en `src/js/puntuacion.js`. |
| 12 | «Al Objetivo»: Mago dominante, Hombre común secundario | ✅ | Prueba «Caso «Al Objetivo» completo» pasa en esta ronda (sección 2). |
| 13 | Orden del resultado = §8 | ✅ | Prueba «Orden de la pantalla de resultado (sección 8)» pasa en esta ronda. |
| 14 | Avisos de tensión, contexto, fundador y categoría solo cuando corresponde | ✅ | Pruebas correspondientes pasan en esta ronda (sección 2); sin cambios en la lógica. |
| 15 | `text/plain;charset=utf-8`; nada de `application/json` | ✅ | `grep -rn "application/json" src tests` sin resultados (sección 2); sin cambios en `envio.js`. |
| 16 | Envío sin bloqueo; un fallo no rompe nada visible | ✅ | Sin cambios en `envio.js`/`interfaz.js`; recorrido de 46 pantallas de esta ronda con `fetch` interceptado no mostró ningún error visible ni bloqueo. |
| 17 | Campos enviados = §10, nombres exactos | ✅ | Sin cambios en `envio.js` ni `docs/apps-script.gs`. |
| 18 | `localStorage` en `try/catch`, limpieza tras mostrar el resultado | ✅ | Sin cambios en `interfaz.js`; el recorrido de esta ronda partió de progreso guardado real («Tienes un cuestionario a medias») y lo gestionó sin error. |
| 19 | Con `"PENDIENTE"` no se intenta enviar | ✅ | Sin cambios en `envio.js` (línea con el `return` incondicional intacta). |
| 20 | Ningún color de arquetipo coincide con la marca | ✅ | Recalculado en esta ronda con script de Node sobre `src/data/arquetipos.js` (sin cambios) y la paleta de 5 hex: `colisiones: []` (sección 2). |
| 21 | Interfaz con la paleta de Al Objetivo | ✅ | Único conjunto de hex de 6 dígitos en el CSS actualizado: `#000000 #1A2B32 #3D391F #D8851F #FFFFFF` (sección 2); las sombras nuevas, más suaves, son `rgba(0,0,0,…)` y `rgba(216,133,31,…)`, sin tintas nuevas. |
| **22** | **Doble selección del bloque 3 usable a 360 px, sin solape de la mascota en ninguna pantalla ni scroll** | **✅** | **Recorrido real por CDP de las 46 pantallas del flujo completo (no solo 4 muestreadas): cero solapes. Pantalla de resultado comprobada además a 5 anchos de viewport (360/480/720/1100/1280 px), 3 fracciones de scroll cada uno: cero solapes, ancho de la mascota correcto en cada corte, sin desbordamiento horizontal. Detalle en sección 1.** |
| 23 | Etiqueta accesible y teclado | ✅ | Sin cambios en `interfaz.js` (roles, `aria-label`, `aria-pressed`, `lang="es"`); el nuevo `:focus-visible` (línea 81–85) sigue siendo visible para navegación real por teclado (contorno 2 px + halo translúcido de 4 px), solo se anuló específicamente para el título con `tabindex="-1"` que no es un destino de tabulación (líneas 91–95, sección 0, punto 1). |

## 4. Qué no he podido comprobar / no era objeto de esta ronda

- **Pantalla de alerta con la mascota agrandada:** el recorrido genérico de esta ronda (primer radio disponible en cada pregunta) no garantiza haber disparado el caso de alerta; no se ha forzado ese camino a propósito porque no estaba entre los 4 puntos del encargo y la garantía de ausencia de solape es estructural (mecanismo de flujo normal, sección 1), igual para la pantalla de alerta que para el resultado normal — ambas comparten la misma estructura de documento (`#app` seguido de `.decoracion-arquera`).
- **Vista previa real de impresión / PDF y navegadores distintos de Edge/Chromium:** no se han comprobado en esta ronda, igual que en la Validación 5; ninguno de los 4 cambios de esta ronda afecta a la regla `@media print` (que oculta la mascota, sin cambios) ni depende del motor de renderizado.
- **Envío real a Google Sheets:** `fetch` interceptado en todo el recorrido, según la práctica ya establecida; no se ha hecho ninguna petición real.

## 5. Lista de fallos

Ninguno.
