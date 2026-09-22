APROBADO: 0 fallos. El único fallo de la validación anterior (`.decoracion-arquera` en `position: fixed` solapándose con controles interactivos) queda resuelto: la mascota pasó a flujo normal del documento, como hermano de `#app` situado después de él en el DOM, por lo que se pinta siempre después de todo el contenido de la pantalla actual y no puede superponerse a ningún control, en ningún punto de scroll. Reproducido en vivo con Edge headless por CDP en los 4 casos exactos que documentó la ronda anterior: cero solapes. `node --test` pasa 69/69. El resto de la especificación (motor de puntuación, datos, envío `text/plain`, colores de arquetipo frente a los de Al Objetivo) sigue cumpliéndose, verificado de nuevo en esta ronda con evidencia propia, no solo por referencia al informe previo.

# Validación 5: Cuestionario de Personalidad de Marca (Al Objetivo)

Quinta validación, encargada específicamente para comprobar si el «Ciclo de corrección 2: mascota tapa controles» descrito al final de `handoff/02-implementacion.md` resuelve el único fallo (`punto 22`) de la validación anterior (`handoff/03-validacion.md`, versión previa, RECHAZADO). Solo se ha escrito este informe; no se ha modificado nada de `src/` ni de `tests/`.

## 0. Qué ha cambiado desde la validación anterior (RECHAZADO)

```
git diff --stat 335b4b5 -- src/ tests/
 src/css/estilos.css | 100 ++++++++++++++++++++++++++++++++++++++++------------
 src/index.html      |   8 +++++
 2 files changed, 85 insertions(+), 23 deletions(-)
```

Solo `src/css/estilos.css` y `src/index.html` tienen cambios respecto al último commit (`335b4b5`); ambos siguen sin commitear (working tree). Nada en `src/js/`, `src/data/` ni `tests/` ha cambiado desde la ronda anterior (confirmado con `git diff --stat` sin salida para esos archivos), así que el motor de puntuación, los datos y el envío son bit a bit los mismos que ya se validaron con detalle. Por eso los puntos 1–21 y 23 se dan por ✅ con verificación propia (no solo remisión al informe anterior, ver metodología abajo) y el punto 22 recibe la comprobación exhaustiva que pedía el encargo de esta ronda.

Cambio concreto en `.decoracion-arquera` (`src/css/estilos.css` líneas 629–658):
- Antes: `position: fixed; right/bottom` con `mix-blend-mode: multiply`, `pointer-events: none`, ocultación solo por debajo de 480 px de alto y `main { padding-bottom: calc(var(--figura-alto) + 2.5rem) }` para dejar hueco al final del documento.
- Ahora: `display: block` en flujo normal, `margin: 2rem 0 1rem auto` (sin márgenes negativos), sin `--figura-alto` ni `padding-bottom` calculado; `main` vuelve a un padding fijo (`1.5rem 1rem 2.5rem`). El `<img class="decoracion-arquera">` en `src/index.html` (línea 13) sigue siendo hermano de `#app`, situado después de él en el DOM — eso ya era así antes y no se ha tocado — pero ahora, al no estar fijado al viewport, se renderiza en flujo justo después del contenido de `#app` (que `interfaz.js`, líneas 159–194, sustituye por completo en cada cambio de pantalla mediante `replaceChildren`). Como el modelo de caja en flujo normal apila los bloques uno tras otro sin permitir que dos ocupen el mismo espacio, y no hay posicionamiento `fixed`/`absolute` ni márgenes negativos de por medio, la mascota queda **estructuralmente** incapaz de solaparse con nada que esté antes que ella en el documento — no es una corrección ad hoc para los 4 casos reportados, sino un cambio del mecanismo que los causaba a todos.

## 1. Entorno y comandos ejecutados

Node `v24.18.0`, Windows 11, desde la raíz del proyecto.

| Comando | Resultado |
|---|---|
| `node --test tests/*.test.js` | `tests 69, suites 0, pass 69, fail 0, cancelled 0, skipped 0` |

Verificación independiente de datos y motor, con scripts de Node ad hoc (fuera del repo, en el directorio de scratchpad de la sesión, sobre `src/data/cuestionario.js`, `src/data/arquetipos.js` y `src/js/puntuacion.js` reales, no sobre una copia):
- `P1`…`P43` correlativos (`ids.length === 43`, secuencia exacta comprobada con `deepEqual`); reparto por bloque `{1:3, 2:4, 3:12, 4:3, 5:6, 6:6, 7:3, 8:6}`, igual que la tabla de la especificación.
- Bloque 3: los 12 códigos aparecen 4 veces cada uno; la pareja más repetida aparece 2 veces (`max pareja: 2`); las 12 parejas intracuadrante (derivadas de las 4 motivaciones) están todas cubiertas al menos una vez (`intracuadrante faltantes: []`).
- Bloque 4 y bloque 5: los 12 códigos aparecen exactamente una vez en cada uno (`todos1: true`).
- Bloque 6: los 12 códigos aparecen exactamente dos veces entre las columnas izquierda y derecha de las 6 escalas (`todos2: true`).
- Muestreo de textos: comparado a mano contra `docs/especificacion.md` — encabezado del bloque 6, las 21 opciones de sector con sus 21 identificadores (D10), P4–P7 completas (16 opciones) y la estructura de P29 (`{ izquierda: {HC,IN}, derecha: {GO,SA} }`) — todos coinciden literalmente. Sin cambios en `cuestionario.js` ni `arquetipos.js` desde la ronda anterior, que ya había contrastado 200+ cadenas.
- Colores de arquetipo (`ARQUETIPOS`) vs. paleta de Al Objetivo: `colisiones: []` (comprobado con los 5 hex de la marca contra los 12 de la ficha técnica).
- `grep -oE "#[0-9A-Fa-f]{6}" src/css/estilos.css | sort -u` → únicamente `#000000 #1A2B32 #3D391F #D8851F #FFFFFF`.
- `src/js/puntuacion.js` leído íntegro: `puntuarAncla` (+2 por código de la motivación elegida en P4–P7), `puntuarDiscriminante` (+3/−2 en bloque 3, −2 en bloque 4, +2 en bloque 5, +1/+2 según distancia a la posición 3 en bloque 6), `detectarAlerta` sobre `discriminante` con los dos cortes de la especificación y el caso `c1+c2<=0` cubierto, `calcularPorcentajes` recortando a 0 solo ahí, `ordenarArquetipos` con el desempate exacto (marcas «MÁS», luego alfabético con `Intl.Collator('es')`).
- `src/js/envio.js` leído íntegro: `if (URL_APPS_SCRIPT === 'PENDIENTE') return;` (línea 104) antes de cualquier `fetch`; cabecera `'Content-Type': 'text/plain;charset=utf-8'` (línea 108); `fetch(...).catch(() => {})` y `try/catch` alrededor de toda la llamada; `CLAVES_HOJA` con las 23 claves exactas de la sección 10 de la especificación, en el mismo orden.
- `grep -rn "application/json" src tests` → sin resultados.
- `tests/envio.test.js`: prueba explícita `'enviar: POST text/plain, una sola llamada y cuerpo JSON'` que además recorre todas las cabeceras y afirma `assert.doesNotMatch(v, /application\/json/)`.

Recorrido con Edge headless (`msedge.exe --headless=new --remote-debugging-port=9333`) controlado por CDP nativo (WebSocket global de Node, sin dependencias externas), sobre un servidor estático propio de `src/` en `http://127.0.0.1:8123`, con `window.fetch` interceptado antes de cargar el módulo de la app (sin envíos reales). Detalle en la sección 2. Navegador y servidor cerrados al terminar (`taskkill` sobre los procesos `msedge.exe` y el proceso Node del servidor).

## 2. Comprobación específica del fallo corregido (punto 22)

### Metodología

Recorrido real por la interfaz (no una maqueta aparte) a 360×740: bienvenida/modo → clic en «marca» → «Siguiente» → «Tus datos» (rellenados con datos válidos) → «Siguiente» → bloque 1 (P1–P3, respondidas «No») → bloque 2 (P4 respondida, parada en **P5** para revisar) → P5–P7 respondidas → bloque 3, recorrido de las 12 preguntas (P8–P19) con parada en la novena pregunta del bloque, que el propio recorrido confirmó como **P16** («Si tu marca fuera un lugar físico, sería...», el título exacto de la especificación).

En cada una de las 4 pantallas documentadas por la validación anterior se recorrió el scroll vertical en fracciones 0 %, 33 %, 66 % y 100 % de la altura desplazable (incluida la posición de reposo `scrollY = 0`), comprobando en cada paso con `getBoundingClientRect()` si el rectángulo de `.decoracion-arquera` intersecta con el de algún `button`, `a`, `input`, `select`, `textarea`, `.opcion` o `.boton-mm` visible.

### Resultado: sin solapes en ningún caso

| Pantalla | `scrollHeight` / `clientHeight` | Solapes en 0 %, 33 %, 66 %, 100 % | Desbordamiento horizontal |
|---|---|---|---|
| Bienvenida/modo | 1000 / 740 | `[]`, `[]`, `[]`, `[]` | No (`scrollWidth === clientWidth === 360`) |
| «Tus datos» | 839 / 740 | `[]`, `[]`, `[]`, `[]` | No |
| P5 (bloque 2) | 804 / 740 | `[]`, `[]`, `[]`, `[]` | No |
| Bloque 3, P16 | 1177 / 740 | `[]`, `[]`, `[]`, `[]` | No |

Los cuatro son exactamente los casos que la validación anterior había reportado como fallo (con capturas y coordenadas de solape). Ahora, en el mismo recorrido y las mismas fracciones de scroll, **cero solapes** en los cuatro.

Explicación de por qué no es una coincidencia de la muestra: `.decoracion-arquera` ya no tiene `position: fixed`, así que no está anclada a una esquina del viewport (lo que la hacía coincidir con lo que hubiera ahí en cada momento del scroll). Al estar en flujo normal, después de todo el contenido de `#app` en el DOM, el navegador la coloca siempre por debajo del último elemento de la pantalla actual; dos elementos en flujo de bloque nunca ocupan el mismo espacio salvo que se usen posicionamientos o márgenes negativos, y no es el caso aquí (verificado leyendo la regla completa, sección 0). Esto cubre no solo los 4 casos concretos sino cualquier pantalla y cualquier punto de scroll, incluidas las que la ronda anterior no llegó a probar.

### Verificaciones colaterales de esta ronda

- **Sin desbordamiento horizontal en móvil (360 px):** confirmado en las 4 pantallas anteriores y también en desktop (1280 px): `document.documentElement.scrollWidth === document.documentElement.clientWidth` en todos los casos.
- **Ausencia en impresión/PDF:** `estilos.css` línea 690, `@media print { … .decoracion-arquera { display: none !important; } }` (la regla ya existía y sigue intacta). Confirmado en vivo con `Emulation.setEmulatedMedia({ media: 'print' })`: `getComputedStyle(document.querySelector('.decoracion-arquera')).display` devuelve `'none'`.
- **La mascota se sigue viendo** (no se ocultó permanentemente para «resolver» el problema por la vía fácil): al no depender ya de una altura mínima de viewport, se eliminó la regla `@media (max-height: 480px) { .decoracion-arquera { display: none; } }` que existía en la versión anterior; ahora aparece siempre, al final de cada pantalla.
- **No se han vuelto a comprobar en detalle**: la pantalla de resultado y la de alerta con la mascota en esta ronda concreta (no estaban entre los 4 casos reportados como fallo, y su maquetación específica —tarjetas, desglose— no ha cambiado); por construcción del mecanismo (flujo normal, después de todo `#app`) no hay motivo para que se comporten de forma distinta, pero no se ha repetido el recorrido visual completo por no ser el objeto de esta ronda. Marco esto como algo no verificado exhaustivamente, no como una duda sobre el resultado: la garantía es estructural (CSS en flujo normal), no una coincidencia de los 4 casos muestreados.

## 3. Tabla de comprobaciones (los 23 puntos)

| # | Comprobación | Estado | Evidencia |
|---|---|---|---|
| 1 | `node --test` pasa entero | ✅ | 69 de 69, 0 fallos, Node 24.18.0 (sección 1). |
| 2 | Pruebas para cada caso del plan | ✅ | Sin cambios en `tests/` desde la validación anterior (`git diff` vacío); 69 pruebas, incluidas las de alerta, tensión, categoría, empates y «Al Objetivo». |
| 3 | 43 preguntas P1–P43 y bloques = especificación | ✅ | Script independiente de esta ronda (sección 1): ids correlativos y reparto exacto por bloque. |
| 4 | Bloque 3: 4 apariciones, pareja ≤ 2, 12 intracuadrantes ≥ 1 | ✅ | Script independiente de esta ronda (sección 1): las tres condiciones se cumplen (`max pareja: 2`, `intracuadrante faltantes: []`). |
| 5 | Bloque 4 una vez, bloque 5 una vez, bloque 6 dos veces | ✅ | Script independiente de esta ronda (sección 1). |
| 6 | Textos de preguntas y fichas literales (≥ 10) | ✅ | Muestreo propio de esta ronda: encabezado bloque 6, 21 sectores con sus 21 ids, P4–P7 (16 opciones), estructura de P29 — todos literales. Sin cambios en `src/data/` desde la ronda que hizo la comprobación exhaustiva (200+ cadenas). |
| 7 | Pesos correctos por bloque | ✅ | `src/js/puntuacion.js` leído íntegro en esta ronda: +2 ancla (bloque 2), +3/−2 (bloque 3), −2 (bloque 4), +2 (bloque 5), +1/+2 según distancia a 3 (bloque 6). Sin cambios desde la validación previa que lo contrastó contra una referencia independiente en 30 000 casos. |
| 8 | Bloques 1 y 7 no afectan a ninguna puntuación | ✅ | `puntuarAncla`/`puntuarDiscriminante` solo iteran `IDS_BLOQUE_2` a `IDS_BLOQUE_6`; P1–P3 y P35–P37 no aparecen en ninguna de esas listas (`src/js/puntuacion.js` líneas 7–11). |
| 9 | La alerta usa el discriminante | ✅ | `detectarAlerta(discriminante, marcasMas)` (línea 102); se llama con `discriminante`, no con `total` (línea 143). |
| 10 | Negativas a 0 solo para porcentajes | ✅ | `calcularPorcentajes` aplica `Math.max(0, ...)` (líneas 94–95); `detectarAlerta` también recorta a 0 antes de la segunda condición (líneas 108–109), como exige la skill del motor para el caso de discriminantes negativas. `puntuaciones_totales`/`puntuaciones_discriminantes` que se envían a la hoja no se recortan (confirmado en `tests/envio.test.js` línea 53: `MA=23`, `CR=-2`, `GO=-2` sin recortar). |
| 11 | Empates según la especificación, reproducibles | ✅ | `ordenarArquetipos`: primero por puntuación, luego por `marcasMas` (más marcas «MÁS» en bloque 3), luego alfabético con `Intl.Collator('es')` — determinista. |
| 12 | «Al Objetivo»: Mago dominante, Hombre común secundario | ✅ | `node --test`: prueba «Caso «Al Objetivo»: Mago dominante, Hombre común secundario» pasa; `tests/envio.test.js` confirma además `porcentaje_dominante: 62`, `porcentaje_secundario: 38`. |
| 13 | Orden del resultado = §8 | ✅ | Sin cambios en `resultado.js` ni `interfaz.js`; prueba «Orden de la pantalla de resultado (sección 8)» pasa. |
| 14 | Avisos de tensión, contexto, fundador y categoría solo cuando corresponde | ✅ | Pruebas «Tensión: 6 pares en ambos órdenes», «Contexto 7.3», «El matiz depende del dominante, no del secundario», «Nota de modo fundador», «Nota de categoría» — todas pasan; sin cambios en la lógica desde la ronda que las validó con detalle. |
| 15 | `text/plain;charset=utf-8`; nada de `application/json` | ✅ | Sección 1: `grep` sin coincidencias de `application/json`; cabecera confirmada en `envio.js` línea 108; prueba dedicada en `envio.test.js` línea 141 que además recorre todas las cabeceras. |
| 16 | Envío sin bloqueo; un fallo no rompe nada visible | ✅ | `enviar()` no usa `await`; `fetch(...).catch(() => {})` y `try/catch` alrededor de toda la llamada (líneas 103–115); prueba «enviar no lanza si fetch falla, de forma asíncrona o síncrona» pasa. |
| 17 | Campos enviados = §10, nombres exactos | ✅ | `CLAVES_HOJA` (23 claves) coincide con `docs/apps-script.gs` por prueba dedicada (`envio.test.js` línea 26) que lee el propio script y compara. |
| 18 | `localStorage` en `try/catch`, limpieza tras mostrar el resultado | ✅ | Sin cambios en `interfaz.js` desde la ronda que lo verificó con `localStorage` bloqueado (lanza al acceder) y comprobó que la app sigue funcionando. |
| 19 | Con `"PENDIENTE"` no se intenta enviar | ✅ | `envio.js` línea 104: `if (URL_APPS_SCRIPT === 'PENDIENTE') return;`, incondicional antes de cualquier `fetch`. `config.js` actual trae la URL real de despliegue, no el valor `"PENDIENTE"` (es la configuración de producción, no una prueba de este punto), pero la rama de código que lo maneja está intacta y cubierta por su diseño (no hay prueba unitaria específica para ese valor exacto, pero la condición es trivial y de una sola línea). |
| 20 | Ningún color de arquetipo coincide con la marca | ✅ | Script independiente de esta ronda (sección 1): `colisiones: []` sobre los 12 hex de `ARQUETIPOS` frente a los 5 de Al Objetivo. |
| 21 | Interfaz con la paleta de Al Objetivo | ✅ | Único conjunto de hex de 6 dígitos en `estilos.css`: `#000000 #1A2B32 #3D391F #D8851F #FFFFFF` (sección 1). Las sombras nuevas son `rgba(0,0,0,…)` y `rgba(216,133,31,…)` (este último es `#D8851F` con transparencia, no una tinta nueva). |
| **22** | **Doble selección del bloque 3 usable a 360 px, sin solape de la mascota en ninguna pantalla ni scroll** | **✅** | **Recorrido real por CDP: cero solapes en los 4 casos exactos reportados como fallo (bienvenida, «Tus datos», P5, bloque 3/P16), en 4 fracciones de scroll cada uno, incluida la posición de reposo. Botones «Más me describe»/«Menos me describe» en `.botones-mm` (grid de 2 columnas, `min-height: 48px`, ≥ 44 px). Detalle en sección 2.** |
| 23 | Etiqueta accesible y teclado | ✅ | `role="progressbar"` con `aria-label` (interfaz.js línea 167), `aria-label` en radios y botones «Más/Menos» (líneas 276, 423), `aria-pressed` en botones del bloque 3 (línea 418), `:focus-visible` con contorno doble en CSS (líneas 81–85, 277–285), `lang="es"` en `index.html` línea 2. Sin cambios desde la ronda anterior. |

## 4. Qué no he podido comprobar

- **Vista previa real de impresión / PDF**: se confirmó que `.decoracion-arquera` computa `display: none` en el medio `print` (con `Emulation.setEmulatedMedia`), pero no se generó ni revisó un PDF real (sin visor disponible en esta sesión).
- **Navegadores distintos de Edge/Chromium y dispositivos táctiles reales**: solo se ha probado con Edge headless por CDP, igual que en las rondas anteriores.
- **Recorrido visual de la pantalla de resultado y de la pantalla de alerta con la mascota en esta ronda concreta**: no estaban entre los 4 casos reportados como fallo y no se han vuelto a fotografiar en esta ronda; la garantía de que tampoco se solapan ahí es estructural (mecanismo de flujo normal, sección 2), no una comprobación visual repetida.
- **Envío real a la hoja de Google**: se ha interceptado `fetch` en todo el recorrido, según la práctica ya establecida en rondas anteriores (para evitar el incidente de filas de prueba reales documentado en `handoff/02-implementacion.md`, C2.3); no se ha hecho ninguna petición real en esta ronda.
- **Punto 19 con el valor literal `"PENDIENTE"`**: `config.js` trae la URL real de producción, así que no se ha ejecutado el flujo completo con ese valor exacto en esta ronda (tampoco lo hicieron las rondas anteriores); la comprobación es de lectura de código, no de ejecución con ese valor concreto.

## 5. Lista de fallos

Ninguno.
