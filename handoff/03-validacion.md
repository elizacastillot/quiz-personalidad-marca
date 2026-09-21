APROBADO: 0 fallos. Alerta (§6, §7.7, §8, §9), rediseño con logo y Kanit alojada cumplen la especificación actual; sin regresiones en datos, motor, resultado normal ni envío.

# Validación 3: Cuestionario de Personalidad de Marca (Al Objetivo)

Tercera validación, tras el «Cambio 1: alerta y rediseño» y el «Cambio 2: tipografía». Se valida contra `docs/especificacion.md` (manda sobre el plan) y `docs/apps-script.gs`. No se ha modificado nada de `src/` ni de `tests/`; el único archivo escrito es este informe. Los scripts propios están en el directorio temporal de sesión, fuera del proyecto. Se repite la comprobación completa, no solo los cambios.

## 1. Entorno y comandos ejecutados

Node `v24.18.0` (`node --version`), Windows 11, desde la raíz del proyecto.

| Comando exacto | Resultado |
|---|---|
| `npm test` (ejecuta `node --test`) | `tests 69, suites 0, pass 69, fail 0, cancelled 0, skipped 0` |
| `node --test` (lo que ejecuta el workflow, `.github/workflows/pages.yml` l. 25) | `tests 69, pass 69, fail 0` |
| `node --test tests/` (forma literal del encargo original) | Falla en Node 24 por diseño de Node (argumentos = patrones glob). Ya no lo usan `package.json` l. 6 ni el workflow. No es un defecto. |

Scripts propios ejecutados con el código actual:

- **Datos** (Node): ids `P1` a `P43` correlativos; reparto por bloque `{1:3, 2:4, 3:12, 4:3, 5:6, 6:6, 7:3, 8:6}`. Bloque 3 leído de los datos: 12 arquetipos × 4 apariciones, pareja máxima 2 veces, 0 de 12 parejas intracuadrante sin cubrir, las 12 filas idénticas a la tabla de §5. Bloques 4 y 5: 12 códigos, una vez cada uno. Bloque 6: 12 códigos, dos veces cada uno.
- **Literalidad**: 200 cadenas de `cuestionario.js` (>12 caracteres) y 229 de `arquetipos.js` buscadas como texto en la especificación. No literales, todas explicadas: 11 opciones de P35 provisionales, P39 fundador compuesta, identificadores de sector (ids, no texto), encabezado y nota del bloque 6 (la especificación los da con negrita o sin punto final) y 3 plantillas con marcadores (`{promesa}`, `{a}`…) rellenadas con texto literal.
- **Textos de la alerta**: la explicación de §7.7 coincide carácter a carácter; los 12 párrafos (`TEXTOS.alerta.arquetipos`) coinciden 12 de 12 con las viñetas de §7.7; título, cuerpo (con `[X] [Y] [Z]` sustituidos), pie y cierre coinciden con §6 y §8.
- **Motor contra referencia independiente** (escrita desde §6, 30 000 cuestionarios aleatorios completos, 27 730 con alerta y 2 270 sin ella): totales, discriminantes, dominante, secundario, tercero, alerta y porcentaje, 0 diferencias. Invirtiendo P1 a P3 y cambiando P35 a P37, `calcular` devuelve un objeto idéntico en los 30 000. En cada alerta y en ambos modos: claves del resultado exactamente `alerta, mensaje, explicacion, arquetipos, desglose, cierre`; los tres arquetipos y el desglose coinciden con el top 3 por discriminante y con los valores discriminantes; en 20 158 de ellas el top 3 por discriminante difiere del top 3 por total, y la pantalla sigue al discriminante. 0 diferencias.
- **Navegador** (Edge headless por CDP a 360 × 800, sobre una **copia** de `src/` con `URL_APPS_SCRIPT` cambiada a `https://stub.invalid/exec` y `fetch` sustituido por un stub que registra la llamada; `window.print` también sustituido). No se envió nada a la URL real. Cuatro recorridos completos por la interfaz (172 pantallas): «Al Objetivo» en modo marca; alerta en modo fundador con las tres condiciones activas y categoría igual al dominante; resultado normal en modo fundador con tensión, tres condiciones y categoría distinta; resultado normal en modo marca con categoría igual al dominante y sin condiciones. Servidor estático y navegador cerrados al terminar (comprobado: ningún `msedge` con el perfil temporal queda vivo).

## 2. Tabla de comprobaciones (los 23 puntos)

| # | Comprobación | Estado | Evidencia |
|---|---|---|---|
| 1 | `node --test` pasa entero | ✅ | 69 de 69, 0 fallos, Node 24.18.0. Node 20 (el del workflow) no se ha podido ejecutar: ⚠ solo esa parte. |
| 2 | Pruebas para cada caso del plan | ✅ | Recuento por archivo: puntuación 20, datos 15 (+6.3.14), resultado 20 (+6.4.10 modificada y 6.4.13 a 6.4.19), envío 14 (+6.5.14) = 69 = 60 + 9 nuevas. Las pruebas de alerta (`tests/resultado.test.js` l. 152 a 261, `tests/envio.test.js` l. 184 a 197) cubren claves, orden, párrafos, discriminante frente a total, mismo texto en ambos modos, `calcular({})` y carga inalterada. |
| 3 | 43 preguntas P1–P43 y bloques = especificación | ✅ | Script: `P1`..`P43`; reparto 3, 4, 12, 3, 6, 6, 3, 6; 21 sectores. |
| 4 | Bloque 3: 4 apariciones, pareja ≤ 2, 12 intracuadrantes ≥ 1 | ✅ | Script de Node sobre los datos (sección 1). |
| 5 | Bloque 4 una vez, bloque 5 una vez, bloque 6 dos veces | ✅ | Script (sección 1). |
| 6 | Textos de preguntas y fichas literales (≥ 10) | ✅ | 200 y 229 cadenas contrastadas; excepciones explicadas en la sección 1 y en las observaciones 1 y 2. |
| 7 | Pesos correctos por bloque | ✅ | `src/js/puntuacion.js` l. 33 (+2 ancla), 45 y 46 (+3 / −2), 50 (−2), 54 (+2), 60 a 65 (escala 1 y 2 izquierda, 4 y 5 derecha, peso `abs(pos−3)`). 0 diferencias con la referencia en 30 000 casos. |
| 8 | Bloques 1 y 7 no afectan a ninguna puntuación | ✅ | `puntuacion.js` solo lee P4 a P34 (l. 7 a 11). Invirtiendo P1 a P3 y cambiando P35 a P37 en 30 000 casos, `calcular` devuelve objeto idéntico. |
| 9 | La alerta usa el discriminante | ✅ | `puntuacion.js` l. 102 a 111 y 143. Referencia coincide en todos los casos; `resultado.js` l. 107 toma `rankingDiscriminante`. |
| 10 | Negativas a 0 solo para porcentajes | ✅ | `calcularPorcentajes` (l. 93 a 99). En «Al Objetivo» `CR=-2` y `GO=-2` se envían sin recortar (`puntuaciones_totales` en la carga interceptada). |
| 11 | Empates según la especificación, reproducibles | ✅ | `ordenarArquetipos` (l. 82 a 90): puntuación, marcas «MÁS», orden alfabético del nombre. 0 diferencias con la referencia. |
| 12 | «Al Objetivo»: Mago dominante, Hombre común secundario | ✅ | Por interfaz: Mago 62 % y Hombre común 38 %; tercero BU; tensión sí; sin alerta. |
| 13 | Orden del resultado = §8 | ✅ | Ver punto B2 (sección 3). `resultado.js` l. 8 a 25 y DOM real. |
| 14 | Avisos de tensión, contexto, fundador y categoría solo cuando corresponde | ✅ | Ver B2. En el navegador: modo marca sin condiciones y categoría = dominante (sin tensión, sin contexto, sin nota de fundador, con nota de coincidencia); modo fundador con tensión, contexto, nota de fundador y nota «se sale». |
| 15 | `text/plain;charset=utf-8`; nada de `application/json` | ✅ | `envio.js` l. 108; cabecera capturada en la interfaz: `{"Content-Type":"text/plain;charset=utf-8"}`. `grep -rniE "application/json" src tests`: 0 coincidencias. |
| 16 | Envío sin bloqueo; un fallo no rompe nada visible | ✅ | `interfaz.js` l. 629 a 632: `pintarResultado` → `enviar(...)` sin `await` → `borrarProgreso`. `envio.js` l. 105 a 114: `try/catch` y `.catch(() => {})`. Sin errores de consola en ninguno de los 4 recorridos. |
| 17 | Campos enviados = §10, nombres exactos | ✅ | Ver B3. |
| 18 | `localStorage` en `try/catch`, limpieza tras mostrar el resultado | ✅ | `interfaz.js` l. 94 a 131 (guardar, borrar y leer, cada uno en `try/catch`); l. 632 borra después de `pintarResultado` y del envío. En el navegador, `localStorage` vacío tras el resultado normal y tras la alerta. |
| 19 | Con `"PENDIENTE"` no se intenta enviar | ✅ | `envio.js` l. 104. Sin cambios respecto a la validación anterior (`git diff` sin cambios en `envio.js`, `config.js` ni `puntuacion.js`). Sin prueba en el repositorio (observación 5). |
| 20 | Ningún color de arquetipo coincide con la marca | ✅ | Ver B4. |
| 21 | Interfaz con la paleta de Al Objetivo | ✅ | Ver B4. |
| 22 | Doble selección del bloque 3 usable a 360 px | ✅ | Ver B8. |
| 23 | Etiqueta accesible y teclado | ✅ | Ver B8. |

## 3. Comprobaciones específicas de esta ronda

### B1. Pantalla de alerta (§6, §7.7, §8, §9): ✅

DOM real del recorrido en modo fundador (todas las condiciones activas y categoría igual al dominante) y hijos de `.resultado` en este orden:

1. Escena decorativa (SVG, sin texto).
2. Mensaje «Tu marca todavía no ha elegido un carácter.» con los tres nombres y el pie «Es el punto de partida más habitual. Lo resolvemos en la sesión.».
3. Explicación de 7.7 (literal, ver sección 1).
4. Tres párrafos, uno por arquetipo, en el orden del mensaje (12 de 12 literales).
5. «Así se reparten tus respuestas»: nombre y discriminante de cada uno (`El Amante 9 puntos`, `El Creador 8 puntos`, `El Cuidador 6 puntos`).
6. Botón «Descargar resumen». Al pulsarlo se llamó una vez a `window.print()`.
7. Cierre «Esto es el punto de partida. Lo afinamos juntas en la sesión.».

- **Tres arquetipos por discriminante:** caso del navegador con top 3 por discriminante `AM, CR, CU` frente a top 3 por total `IN, AM, CR`; la pantalla muestra `AM, CR, CU`. Código: `resultado.js` l. 106 a 128; `interfaz.js` l. 748 a 789 (recorre `ORDEN_SECCIONES_ALERTA`, `resultado.js` l. 28).
- **Sin nota de fundador, también en modo fundador:** el texto «Este resultado retrata cómo trabajas tú» no aparece en el DOM de la alerta en modo fundador; `resultadoAlerta` no incluye `notaFundador` (30 000 casos: claves exactas).
- **Sin otros elementos del resultado normal:** sin tarjetas de dominante o secundario, frase, «Qué puede hacer», contexto, paleta ni nota de categoría, aunque las tres condiciones estaban activas y la categoría era igual al dominante.
- **Envío de la alerta:** una llamada, `POST`, `text/plain;charset=utf-8`, 23 claves, `alerta_sin_definir = "sí"`, `arquetipo_dominante/secundario/tercero = IN/AM/CR` (por total, como pide §6), `porcentaje_dominante = 55` (11 / (11 + 9)), `categoria_saturada = "sí"`.

### B2. Resultado normal sin cambios (§8): ✅

`git diff` de `resultado.js`: solo se añaden `ORDEN_SECCIONES_ALERTA`, `parrafosAlerta` y las claves nuevas de `resultadoAlerta`; `componerResultado` para el caso normal, `ORDEN_SECCIONES` y todos los textos del resultado normal no cambian. Orden real en el DOM (caso «Al Objetivo», modo marca): dominante, secundario, frase, Qué es, Para qué sirve, tensión, Qué puede hacer, Qué no debe hacer nunca, (contexto ausente: sin condiciones), Tu sombra, Tu voz, Paleta sugerida, (nota de fundador ausente), nota de categoría, «Descargar ficha», cierre. En modo fundador con las tres condiciones: contexto entre «no debe» y «sombra»; nota de fundador después de la paleta y antes de la nota de categoría. Las respuestas abiertas no se muestran.

### B3. Puntuación y envío sin cambios: ✅

`git diff --stat` sobre `puntuacion.js`, `envio.js`, `config.js`, `cuestionario.js` y `utilidades.js`: sin cambios. Las 23 claves de `CLAVES_HOJA` coinciden una a una y en el mismo orden con el bloque de §10 de la especificación y con `COLUMNAS` de `docs/apps-script.gs`. Carga capturada en la interfaz: `Object.keys` = esas 23, valores `"sí"/"no"`, listas como texto (`IN=3; SA=1; …`), `campos_libres: "B2: ninguna encaja del todo"`, `sector: servicios_profesionales`.

### B4. Colores y paleta: ✅

- Los 12 colores de arquetipo (`#F0E6D2 #2C3E50 #4A5D45 #B03A2E #1A1A1A #2E7D8C #8B7355 #A64B6B #E8B84B #6B8E7F #6B4C93 #5B2333`) coinciden con §3 y ninguno es `#FFFFFF`, `#000000`, `#D8851F`, `#3D391F` ni `#1A2B32`.
- Todos los colores hexadecimales de `src/css/estilos.css`, `src/index.html`, `src/js/*.js` y `src/img/*.svg` (salvo el logo) son de la marca; ninguno de arquetipo (`#000` corto en cinco iconos SVG). Sin `rgb()`, `hsl()` ni nombres de color en la hoja. Los colores de arquetipo solo entran en el resultado normal desde los datos (`interfaz.js` l. 646 y 647, 669 a 673). La alerta usa solo colores de interfaz.

### B5. Tipografía: ✅

- **Kanit única:** `estilos.css` l. 8 a 35 (cuatro `@font-face`, pesos 400, 500, 600, 700, `font-display: swap`, `format("woff2")`), pila `"Kanit", system-ui, -apple-system, "Segoe UI", sans-serif` (l. 46 y 47). En el navegador, `document.fonts`: las cuatro caras en estado `loaded`; la `font-family` calculada de los 88 elementos del cuerpo del resultado es la misma pila que empieza por Kanit.
- **Servida desde `src/fonts/`:** peticiones a `/fonts/kanit-latin-{400,500,600,700}-normal.woff2`, todas respondidas por el servidor local; los cuatro archivos son `wOF2` válidos.
- **Licencia:** `src/fonts/OFL.txt` (SIL Open Font License 1.1, «Copyright 2020 The Kanit Project Authors»), completa.
- **Sin Nunito Sans ni dominios externos:** `grep -rniE "nunito|googleapis|gstatic|@import|cdn" src tests` sin coincidencias. Únicas `http(s)://` en `src/` y `tests/`: la URL de Apps Script (`src/js/config.js` l. 4, y su prueba en `tests/envio.test.js` l. 180), enlaces de texto en `OFL.txt` y espacios de nombres XML de los SVG. Red del navegador en los cuatro recorridos: 25 recursos únicos, todos del servidor local, 0 externos, 0 respuestas 404.

### B6. Logo: ✅

`src/img/logo-al-objetivo.svg` existe y es el único logo en `src/` (`ls src/img`). Se usa en la web (`interfaz.js` l. 180, `alt="Al Objetivo"`, 187 × 43) y en impresión (`estilos.css` l. 637 a 639 lo conserva; con `media: print` emulado, `.logo` y `.cabecera` valen `display: block`). El original con espacios ya no está en `src/`: está en `docs/Logo Al Objetivo 187x43px.svg`, idéntico byte a byte al de `src/img` (`cmp`). Ningún archivo de `src/` ni `tests/` lo referencia.

### B7. Estilos de impresión: ✅

`estilos.css` l. 634 a 653. Con `media: print` emulado en el navegador: `.progreso`, todos los `button`, `.no-imprimir` y `.escena` valen `display: none`; `.navegacion` está oculto por regla (l. 636; en la pantalla de resultado no existe). Se conservan los colores de arquetipo: la tarjeta del Mago sigue con `rgb(46, 125, 140)` y `print-color-adjust: exact` (l. 642 a 645). `break-inside: avoid` calculado en secciones, `.bloque-oscuro`, `.tarjeta-arquetipo`, `.muestra`, `.parrafo-arquetipo`, `.explicacion-alerta` y `.desglose li`. Vale para resultado y alerta (ambos con `.no-imprimir` en el botón, `seccionDescarga`, `interfaz.js` l. 661 a 667). `Page.printToPDF` generó 2 páginas en cada caso; la vista previa visual no se pudo revisar (ver sección 5).

### B8. Accesibilidad básica: ✅

- **Contraste medido con cálculo (WCAG):** negro sobre blanco 21,00; blanco sobre `#1A2B32` 14,63; blanco sobre `#3D391F` 11,64; negro sobre `#D8851F` 7,29 (botones y «Más me describe»); `#1A2B32` sobre blanco 14,63 (barra, etiquetas y bordes). Anillo de foco negro sobre blanco 21,00 (el halo naranja, 2,88, es adorno: el contorno negro cumple solo). Arquetipos con el texto elegido por `colorTextoSobre`: mínimos MA 4,74, HC 4,68, AM 5,47, HE 6,02; los demás ≥ 5,8. Todos ≥ 4,5. Con los anillos decorativos de la tarjeta (16 % de opacidad) el peor caso solo sobre la línea del anillo baja a 3,54 (MA) y 3,56 (HC); es una línea de 2 px en la zona derecha, lejos del texto en 360 px (observación 6).
- **Foco visible:** `estilos.css` l. 76 a 79 y 266 a 274. Recorrido con Tab en el bloque 3: en los 10 elementos enfocables, `:focus-visible` activo, contorno `solid 3px` negro y halo naranja de 6 px. Radios (`.opcion:has(input:focus-visible)`): revisado en CSS; no medido en navegador (sección 5).
- **Teclado:** el orden de Tab recorre «Más» y «Menos» de cada opción, «Anterior» y «Siguiente»; Espacio sobre «Más me describe» cambió `aria-pressed` a `true`. Etiquetas: `label for`, `role=radiogroup` con `aria-labelledby`/`aria-label`, botones del bloque 3 con `aria-label` («Más me describe: …»), barra con `role="progressbar"`, `lang="es"`.
- **360 px sin desbordamiento:** en las 172 pantallas recorridas, `scrollWidth` = `clientWidth` = 360 y ningún elemento (salvo SVG decorativos) se sale por la izquierda ni por la derecha. Objetivos táctiles: ningún botón, `label.opcion`, `select`, campo de texto ni `textarea` por debajo de 44 × 44 px.
- **Kanit 400 en el cuerpo:** `body` a 17 px (18 px desde 720 px), peso 400, interlineado 26,35 px; la cara 400 se carga. Revisadas las capturas a 360 px (bloque 3, escala, alerta, resultado): texto legible, sin recortes de texto en «Más me describe» ni «Menos me describe». No comprobado en un móvil real.

## 4. Lista de fallos

No hay ninguno. Todos los puntos están en ✅ (el único ⚠ parcial es Node 20 en el punto 1 y está justificado en la sección 5).

## 5. Qué no he podido comprobar

- **Node 20** (el del workflow): no está instalado. El descubrimiento de `*.test.js` sin argumentos existe en Node 20, pero el resultado real del job `pruebas` solo se verá en GitHub Actions.
- **Vista previa real de impresión y guardado como PDF**: solo se verificaron los estilos calculados con `media: print` y que `Page.printToPDF` produce un PDF de 2 páginas; no había visor de PDF (`pdftoppm`) para ver el resultado. Falta comprobar visualmente que el logo (SVG con PNG incrustado, 155 KB), los fondos de tarjeta y los cortes de página salen bien.
- **Firefox, Safari y móviles reales**: solo Edge/Chromium a 360 × 800 y sin pantalla táctil real. Se usan `:has()`, `mask` y `appearance: none`.
- **Foco de los radios y `Shift+Tab`/flechas** en navegador: solo se midió el foco de los botones del bloque 3.
- **Envío real a Google Sheets** y colocación de las 23 columnas: no se hizo, por indicación expresa (siempre con stub o URL falsa). Se comprobó la carga y la coincidencia de claves con `docs/apps-script.gs`, no la escritura en la hoja.
- **Filas de prueba de la hoja real**: el informe de implementación (C2.3) dice que dos filas de prueba llegaron a la hoja de Google real. No puedo ver ni borrar la hoja; hay que eliminarlas a mano (nombre «Prueba», email `a@b.es`).
- **Legibilidad de Kanit 400 en un móvil real** y sin conexión a Internet: no se probó.

## 6. Observaciones (no son fallos)

1. **P35: 11 de 12 opciones son texto provisional** (`src/data/cuestionario.js`, marcadas `provisional: true`). La especificación pide doce y solo da la del Sabio. Aprobarlas o sustituirlas antes de usar con clientes.
2. **P39 variante de fundador compuesta**: la especificación solo da el fragmento «las personas con las que has trabajado».
3. **El Bufón tiene 3 comportamientos en «Puede»**; §8 dice «los 4», pero la ficha de §7.6 da 3. El código sigue la ficha. Incoherencia de la especificación.
4. **Artículo en mayúscula en mitad de frase** («entre El Amante, El Creador y El Cuidador»). Es literal a §3 pero incorrecto en castellano; se arregla sin tocar el motor.
5. **Sin prueba en el repositorio para `URL_APPS_SCRIPT = "PENDIENTE"`** (la URL es una constante importada). El código es correcto.
6. **Anillos decorativos de la tarjeta de arquetipo** (`estilos.css` l. 444 a 456): con los colores más claros de texto (MA, HC) el contraste bajo la línea del anillo es 3,5. Cumple porque el anillo es adorno y queda lejos del texto, pero conviene vigilar si se agranda.
7. **Texto de 12 px** en el rótulo de cabecera «Cuestionario de personalidad de marca» (`estilos.css` l. 121 a 131, versalitas, contraste 14,63). Legible pero pequeño.
8. **Comentarios y documentos obsoletos**: `src/data/arquetipos.js` l. 332 y 335 marcan `PROVISIONAL` textos ya literales de §7.7; `tests/fixtures.js` l. 2 menciona `node --test tests/`; `.claude/skills/marca-al-objetivo/SKILL.md` sigue nombrando Nunito Sans; `handoff/04-despliegue.md` pide comprobar «Kanit y Nunito Sans». Sin efecto en el código.
9. **Sin pruebas automáticas** de fuentes, logo ni botón «Descargar resumen» (son DOM/CSS); las cubre esta validación manual. Sería útil una prueba de Node que compruebe que `src/fonts/` tiene los cuatro archivos y la licencia, y que `src/` no contiene `nunito`.
10. **Decisiones sin texto en la especificación** (conformes con ella): si la categoría coincide con el secundario no hay nota; `categoria_saturada = sí` solo si coincide con el dominante; `sector` se envía como identificador; P36 a P43 son opcionales.
