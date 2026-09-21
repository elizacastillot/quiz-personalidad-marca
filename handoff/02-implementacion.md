# Implementación: Cuestionario de Personalidad de Marca

## 1. Resultado

- Los 14 archivos del plan existen, más uno auxiliar (`tests/fixtures.js`, ver 5).
- `node --test` (descubre `tests/*.test.js`): **60 pruebas, 60 correctas, 0 fallos**. Idéntico con `node --test tests/*.test.js`.
- **Aviso sobre el comando `node --test tests/`** (el de `package.json`): en Node 24.18 (el instalado aquí) falla con `Cannot find module '...\tests'`, porque desde Node 22 los argumentos se tratan como patrones glob y no como carpeta. En Node 20 (el del workflow `.github/workflows/pages.yml`) funciona. No he tocado `package.json` ni `.github/`. Conviene que el validador lo tenga en cuenta y que se decida si el script pasa a `node --test` o a `node --test tests/*.test.js`.
- Comprobaciones manuales de 6.6 recorridas con servidor estático local (`python -m http.server`) y Edge headless controlado por CDP a 360 px de ancho. Detalle en la sección 6.

## 2. Archivos creados

`src/index.html`, `src/css/estilos.css`, `src/data/cuestionario.js`, `src/data/arquetipos.js`, `src/js/puntuacion.js`, `src/js/resultado.js`, `src/js/utilidades.js`, `src/js/interfaz.js`, `src/js/envio.js`, `src/js/config.js`, `tests/datos.test.js`, `tests/puntuacion.test.js`, `tests/resultado.test.js`, `tests/envio.test.js`, y `tests/fixtures.js` (auxiliar).

`config.js` lleva la URL real de Apps Script del plan (3.6). `envio.js` no envía si vale `"PENDIENTE"`.

## 3. Datos que el plan pedía listar

### 3.1 Borradores de P35 (11, PROVISIONAL)

Cada uno lleva `provisional: true` y comentario `// PROVISIONAL` en `src/data/cuestionario.js`. La del Sabio (`P35b`) es literal de la especificación.

| Id | Código | Texto provisional |
|---|---|---|
| P35a | IN | Simplifican todo y hablan sin rodeos ni tecnicismos |
| P35b | SA | Explican mucho y se posicionan como los que más saben (literal, no provisional) |
| P35c | EX | Prueban cosas nuevas antes que nadie y lo cuentan mientras las hacen |
| P35d | HE | Hablan de resultados y de objetivos, y retan al cliente a superarse |
| P35e | RE | Cuestionan lo establecido y dicen en voz alta lo que otros callan |
| P35f | MA | Cambian la manera de ver el problema y prometen una transformación |
| P35g | HC | Hablan como uno más y se presentan como gente normal y cercana |
| P35h | AM | Cuidan al detalle la estética y la experiencia de cada contacto |
| P35i | BU | Usan el humor y un tono ligero para quitarle peso al tema |
| P35j | CU | Se centran en acompañar y en que el cliente se sienta protegido |
| P35k | CR | Presumen de trabajar a medida, con un estilo propio y reconocible |
| P35l | GO | Se presentan como la referencia que marca las reglas y decide cómo se hace |

Cuando se aprueben, hay que quitar `provisional` y ajustar la última línea de la prueba «P35» de `tests/datos.test.js`.

### 3.2 Identificadores de sector (D10)

Se envían en la columna `sector`.

| Texto de la spec | id |
|---|---|
| Servicios profesionales (consultoría, asesoría, coaching) | `servicios_profesionales` |
| Legal y fiscal | `legal_y_fiscal` |
| Salud y bienestar | `salud_y_bienestar` |
| Estética y belleza | `estetica_y_belleza` |
| Deporte y fitness | `deporte_y_fitness` |
| Educación y formación | `educacion_y_formacion` |
| Marketing, publicidad y comunicación | `marketing_publicidad_y_comunicacion` |
| Tecnología y software | `tecnologia_y_software` |
| Diseño y creatividad | `diseno_y_creatividad` |
| Arquitectura, construcción y reformas | `arquitectura_construccion_y_reformas` |
| Inmobiliario | `inmobiliario` |
| Finanzas y seguros | `finanzas_y_seguros` |
| Hostelería y restauración | `hosteleria_y_restauracion` |
| Turismo y viajes | `turismo_y_viajes` |
| Comercio minorista y ecommerce | `comercio_minorista_y_ecommerce` |
| Alimentación | `alimentacion` |
| Industria y B2B | `industria_y_b2b` |
| Eventos | `eventos` |
| Servicios a domicilio y oficios | `servicios_a_domicilio_y_oficios` |
| ONG, asociaciones y sector público | `ong_asociaciones_y_sector_publico` |
| Otro | `otro` |

### 3.3 Textos de interfaz provisionales (no dictados por la spec)

Todos están en el objeto `UI` al principio de `src/js/interfaz.js`, salvo el `<title>` y el aviso `noscript` de `index.html`.

- Cabecera: «Cuestionario de Personalidad de Marca» (título de la spec) y, en `<title>`, «— Al Objetivo».
- Bienvenida (pantalla del modo): «Responde con calma y con sinceridad. No hay respuestas buenas ni malas: lo que importa es cómo trabajas de verdad. Tardarás entre 15 y 20 minutos y tu progreso se guarda solo.» (los 15 a 20 minutos vienen de §9).
- Retomar: «Tienes un cuestionario a medias», «Puedes seguir donde lo dejaste o empezar de nuevo.», botones «Continuar donde lo dejaste» y «Empezar de nuevo» (los dos últimos son de la skill `envio-resultados`).
- Datos: título «Tus datos»; etiquetas «Nombre y apellidos», «Nombre de la marca», «Email» (de §5), «Sector», «Cuéntanos cuál es tu sector» (campo de «Otro»), marcador «Elige una opción».
- Navegación: «Anterior», «Siguiente», «Ver resultado».
- Sí/No: «Sí», «No». Bloque 3: «Más me describe», «Menos me describe» (skill `marca-al-objetivo`) y ayuda «Elige la opción que más te describe y otra distinta que menos te describe.»
- Abiertas: «Esta pregunta es opcional.» Campo libre de cada bloque: «¿Quieres añadir algo sobre este bloque? (opcional)».
- Progreso: «Datos iniciales» (antes del bloque 1) y «Bloque N de 8: nombre»; etiqueta accesible «Progreso del cuestionario».
- Errores: «Elige una opción para continuar.», «Rellena este campo para continuar.», «Escribe un email válido, por ejemplo nombre@dominio.com.», «Marca una opción como «Más me describe» y otra distinta como «Menos me describe».»
- Resultado: «Arquetipo dominante», «Arquetipo secundario», rótulos de la paleta «Acento / Complemento / Fondo / Texto», botón «Descargar ficha» y ayuda «Se abrirá el diálogo de impresión. Elige «Guardar como PDF» para descargarla.»
- Alerta: subtítulo del desglose «Así se reparten tus respuestas» y unidad «punto/puntos» junto a cada discriminante.
- `noscript`: «Este cuestionario necesita JavaScript para funcionar.»
- Los rótulos de sección del resultado («Qué es», «Para qué sirve», «Aviso importante», «Qué puede hacer tu marca», «Qué no debe hacer nunca», «Tu sombra», «Tu voz», «Paleta sugerida») salen de §7.6 y §8 y están en `TEXTOS.etiquetasResultado`.

## 4. Decisiones donde el plan dejaba margen

- Un solo paso por pregunta (45 pasos: modo, datos y P1 a P43) en móvil y en escritorio. El campo libre de cada bloque aparece bajo la última pregunta del bloque, no en una pantalla propia.
- Bloque 6: cada pantalla muestra el encabezado obligatorio del bloque (y en modo fundador la nota) y la escala; las preguntas de escala tienen `enunciado.marca: null` porque la spec no da enunciado por escala.
- La nota de fundador del bloque 6 lleva punto final (la spec lo pone dentro de las comillas).
- P39, variante fundador: la spec solo dice «las personas con las que has trabajado». La frase se compone sustituyendo «tus tres mejores clientes»: «¿Qué crees que dirían las personas con las que has trabajado de ti si no estuvieras delante?». Revisar.
- El resultado incluye «Sombra:» delante del texto de la sombra, como pide el plan.
- El foco tras cada cambio de pantalla va al título (`data-foco`); en el resultado, al arquetipo dominante.
- `colorTextoSobre(hex)` (nuevo, en `utilidades.js`, con prueba) elige texto negro o blanco por contraste calculado.
- Al finalizar se revalidan modo, datos y P1 a P35; si falta algo (progreso guardado incompleto), vuelve a ese paso.
- Los valores de nombre, marca, email, `sector_otro`, `campos_libres` y `respuestas_abiertas` se recortan; los que empiezan por `= + - @` llevan `'` delante (4.3 del plan).

## 5. Desviaciones respecto al plan y a la spec

1. **El Bufón tiene 3 comportamientos en «Puede», no 4.** La spec (§7.6, BU) da solo tres: «humor en cualquier punto de contacto, incluidos los aburridos · formatos ligeros · reírse de sí misma». El plan decía 4 para los 12 y §8 dice «los 4 comportamientos licenciados». Manda el texto literal de la ficha: no he inventado un cuarto. La prueba de fichas espera 3 para BU y 4 para el resto. Elizabeth debería decidir si se añade un cuarto a BU.
2. **Regex de identificadores de sector**: el plan usaba `/^[a-z]+(_[a-z]+)*$/`, que rechaza `industria_y_b2b` (lleva un dígito). La prueba admite dígitos: `/^[a-z][a-z0-9]*(_[a-z0-9]+)*$/`. Mantengo `industria_y_b2b` porque conserva el texto de la spec («Industria y B2B»).
3. **`tests/fixtures.js`** (archivo extra, sin pruebas): guarda las respuestas de «Al Objetivo» y los datos compartidos por tres archivos de prueba. `node --test` lo ejecuta sin problema, pasa vacío y no cuenta como prueba.
4. `utilidades.js` exporta además `colorTextoSobre` (ver 4).
5. `calcular` no tiene parámetro por defecto (`calcular.length === 1`, prueba 20 del plan); `calcular(undefined)` sigue funcionando.
6. El plan no tenía ningún punto en contradicción con la spec salvo el 1. Los valores de la tabla 6.1 del plan coinciden exactamente con lo que calcula el motor.

## 6. Comprobaciones manuales (6.6) recorridas

Hechas a 360 px de ancho con Edge headless. Todas correctas:

- Bloque 3: dos botones por opción («Más me describe» / «Menos me describe»), todos de al menos 44 × 44 px, sin desbordamiento horizontal; la misma opción no puede ser «más» y «menos» a la vez (marcar una libera la otra); no avanza con una sola marca; sí con dos distintas.
- Obligatorios: no avanza sin modo, sin nombre, con email inválido, con «Otro» sin texto ni sin responder P1; el campo de «Otro» se oculta y se limpia al cambiar de sector. P36 a P43 y los campos libres son opcionales (el envío de «Al Objetivo» se hizo sin P37 a P43).
- Retomar: al recargar a mitad aparecen «Continuar donde lo dejaste» y «Empezar de nuevo»; continuar vuelve al paso guardado, y «Anterior» conserva las marcas del bloque 3. Con `localStorage` bloqueado (lanza al acceder) la app sigue funcionando.
- Barra de progreso: «Bloque N de 8: nombre» y porcentaje.
- Orden de opciones barajado en cada carga y respuestas guardadas por código (el flujo elige por texto de opción y el motor puntúa igual que en las pruebas).
- «Al Objetivo» completo por la interfaz: resultado Mago 62 % / Hombre común 38 %, orden de §8, tarjetas con el color del arquetipo, texto claro sobre el Mago, `localStorage` vacío tras mostrarlo. Envío interceptado: 1 sola llamada, `POST`, `Content-Type: text/plain;charset=utf-8`, 23 claves, `sector: servicios_profesionales`, arquetipos como códigos, `campos_libres: "B2: ninguna encaja del todo"`.
- Héroe dominante en modo fundador con las 3 condiciones: «Aviso importante» dentro de «Para qué sirve», nota de fundador, sección de contexto con el texto de «varias condiciones».
- Alerta (modo fundador): solo mensaje con los tres nombres, desglose de 3 y cierre; sin nota de fundador ni botón de descarga.
- Impresión: con medios `print` se ocultan cabecera y botón de descarga; el botón llama a `window.print()`.

**No comprobado** (el validador debe mirarlo):
- Envío real a la hoja de Google y que las 23 columnas queden bien colocadas (aquí se interceptó `fetch`; no se hizo la petición real). Si `URL_APPS_SCRIPT` no es la del despliegue vigente, no llegará nada.
- Vista previa real de impresión y guardado como PDF (solo se comprobó la CSS de impresión y la llamada a `window.print()`).
- Aspecto en navegadores móviles reales y en escritorio; las fuentes Kanit y Nunito Sans se cargan de Google Fonts (con `display=swap`, y con respaldo `system-ui`); no se probó sin conexión.
- Prueba «Héroe secundario» solo cubierta en `tests/resultado.test.js`, no en pantalla.

## 7. Puntos a mirar con atención

- La lectura de la escala del bloque 6 sigue el plan: posición 2 y 4 dan +1 a los dos de su lado (coherente con el máximo de 26).
- `notaCategoria` es `null` (no se muestra nada) cuando la categoría coincide con el secundario (D3), y `categoria_saturada` es «sí» solo con el dominante (D4).
- En la alerta, los tres nombrados salen del ranking por `discriminante` y pueden no coincidir con `arquetipo_dominante/secundario/tercero` de la hoja (por `total`), como dice el plan.
- La carga enviada con `respuestas_abiertas` incluye P36 y P37 (bloque 7) además de P38 a P43.
- El HTML no tiene CSP ni dependencias externas salvo Google Fonts.

## Ciclo de corrección 1

Fallo tratado: el único del informe `handoff/03-validacion.md` (`node --test tests/` da `MODULE_NOT_FOUND` en Node 24.18, porque desde Node 22 los argumentos de `--test` son patrones glob).

Cambios:
- `package.json`: `"test": "node --test"` (antes `node --test tests/`).
- `.github/workflows/pages.yml`, paso del job `pruebas`: `- run: node --test` (antes `node --test tests/`). Local y CI ejecutan lo mismo.

Sin argumento, Node descubre por sí mismo los archivos `*.test.js` (los cuatro de `tests/`) y no ejecuta `tests/fixtures.js`. No depende de interpretar `tests/` como ruta ni como patrón, ni de que el shell expanda un glob. No se ha tocado nada de `src/`, `tests/` ni `docs/`.

Comprobación:
- Node `v24.18.0`, `npm test`: `tests 60, pass 60, fail 0`.
- Node 20: no está disponible en esta máquina (no hay nvm ni otra instalación), así que no se ha comprobado. El descubrimiento por defecto de `*.test.js` existe en Node 18, 20 y 24, y el workflow lo ejecutará con Node 20 en el primer push.

Pendiente menor: el comentario de `tests/fixtures.js` línea 2 sigue diciendo «node --test tests/». Es solo un comentario y `tests/` quedaba fuera del alcance de esta ronda; se puede actualizar en otra.

## Cambio 1: alerta y rediseño

### C1.1 Resultado

- `npm test` (`node --test`): **69 pruebas, 69 correctas, 0 fallos** (antes 60; nueve nuevas).
- Recorrido con servidor estático local (`python -m http.server`) y Edge headless por CDP a 360 px (y una pasada a 1100 px): bienvenida, datos, P1, bloque 2, bloque 3, escala del bloque 6, resultado de «Al Objetivo» (Mago 62 % / Hombre común 38 %) y alerta en modo fundador. Sin desbordamiento horizontal en ninguna, sin errores de consola y **ninguna petición a recursos externos**. Objetivos táctiles del bloque 3 de al menos 44 px. Envío de la alerta: `POST`, `text/plain;charset=utf-8`, 23 claves.

### C1.2 Pantalla de alerta (spec §6, §7.7, §8, §9)

Orden comprobado en el DOM: mensaje, explicación, un párrafo por cada uno de los tres arquetipos, desglose, botón «Descargar resumen» (`window.print()`) y cierre. Sin nota de fundador, ni siquiera en modo fundador. Los tres nombrados salen de `rankingDiscriminante`.

- `src/data/arquetipos.js`: `TEXTOS.alerta.explicacion` y `TEXTOS.alerta.arquetipos` (12 textos copiados literalmente de §7.7 de `docs/especificacion.md`, que ya los recoge). El comentario `// PROVISIONAL` sigue puesto; quitarlo cuando Elizabeth apruebe.
- `src/js/resultado.js`: exporta `ORDEN_SECCIONES_ALERTA` y `parrafosAlerta`; `resultadoAlerta` devuelve ahora seis claves. `componerResultado` no lee el modo en la alerta.
- `src/js/interfaz.js`: `pintarAlerta` es un mapa de constructores por id recorrido con `ORDEN_SECCIONES_ALERTA`; `seccionDescarga(etiqueta)` compartida por el resultado y la alerta.
- Pruebas nuevas: datos 6.3.14; resultado 6.4.10 (modificada) y 6.4.13 a 6.4.19; envío 6.5.14. `respuestasAlerta` y `alertaPorEstabilidad` pasan a `tests/fixtures.js`.
- `puntuacion.js`, `envio.js` y `config.js` no se han tocado.

### C1.3 Rediseño (arquería)

Concepto: un arco, una flecha y la diana, con solo la paleta de Al Objetivo (`#FFFFFF`, `#000000`, `#D8851F`, `#3D391F`, `#1A2B32`). Ningún color de arquetipo se usa en la interfaz.

- **Cabecera:** logo (`src/img/logo-al-objetivo.svg`, copia del original con nombre sin espacios; el original no se ha modificado; proporción 187:43 comprobada) sobre fondo blanco, título en versalitas y filete naranja. El logo no se ve sobre fondos oscuros (el texto es gris casi negro), por eso la cabecera es blanca.
- **Barra de progreso:** es el vuelo de una flecha (SVG) que recorre una línea punteada hasta una diana. `--p` (0 a 1) mueve la flecha y el trazo naranja. Conserva `role="progressbar"`, el nombre del bloque y el porcentaje.
- **Bienvenida:** tarjeta oscura con el texto de bienvenida y una escena SVG (arco, flecha que da en el centro de la diana). Es la misma pantalla del modo; no existe una pantalla de bienvenida aparte.
- **Opciones:** cada radio es una pequeña diana; la seleccionada pasa a fondo `#1A2B32` con el centro naranja. Bloque 3: «Más me describe» en naranja y «Menos me describe» en `#1A2B32`, con una marca de verificación además del color.
- **Resultado:** banda con la escena (flecha en el centro), tarjetas de arquetipo con anillos de diana tenues al fondo (con el color del texto, sin restar contraste), títulos con icono de diana, listas con puntas de flecha (puede) y cruces (no debe), cierre con línea de puntos hasta una diana.
- **Alerta:** misma banda, con la flecha clavada en un anillo, no en el centro. Cada párrafo de arquetipo va en una tarjeta con una diana; el desglose, con una diana por línea. Solo colores de interfaz.
- **Botones:** naranja con texto negro y flecha; «Anterior» con flecha a la izquierda. Foco visible con doble contorno negro y naranja, también en las opciones (`:has(input:focus-visible)`).
- **Impresión:** la cabecera se conserva con el logo y el título; se ocultan progreso, navegación, botones y la banda decorativa; se conservan los colores de arquetipo; `break-inside: avoid` en secciones, párrafos y líneas del desglose.
- Nuevos gráficos: `src/js/graficos.js` (escena) y `src/img/`: `diana.svg`, `flecha.svg`, `flecha-corta.svg`, `flecha-derecha.svg`, `flecha-izquierda.svg`, `check.svg`, `punta.svg`, `cruz.svg`, `favicon.svg`. `src/index.html` gana el favicon y `theme-color`.

### C1.4 Decisiones y cosas a saber

1. **Fuentes:** la restricción de no usar recursos externos prevalece sobre la skill. He **quitado el enlace a Google Fonts** de `index.html`. `estilos.css` conserva «Kanit» y «Nunito Sans» al principio de la pila, pero solo se usan si están instaladas en el equipo; si no, se ve `system-ui` / Segoe UI. Para tener la tipografía provisional de marca en todos los equipos habría que alojar los archivos de fuente en `src/` (decisión pendiente). Queda anulado lo que decía la sección 6 anterior sobre Google Fonts.
2. `src/img/Logo Al Objetivo 187x43px.svg` (155 KB, con espacios en el nombre) sigue en `src/` y se publicará con la web aunque no se use; conviene sacarlo de `src/` o borrarlo. No lo he tocado. El logo pesa 155 KB (lleva un PNG incrustado); se carga una vez y se cachea.
3. La barra de progreso ya no usa `style.width`; usa la variable CSS `--p`.
4. Los botones de opción cambian de color con transición de 0,15 s (se anula con `prefers-reduced-motion`).
5. Sin cambios en `docs/`, `package.json` ni `.github/`.

### C1.5 Textos de interfaz nuevos (no dictados por la spec)

- `UI.descargarAlerta`: «Descargar resumen» (propuesto por el plan 10.3.G).
- `alt` del logo: «Al Objetivo» (`UI.marca`, ya existía).
- Ningún otro texto visible nuevo. Se reutilizan «Así se reparten tus respuestas» (ahora como `h2`, antes `h3`) y la ayuda de descarga.

### C1.6 No comprobado

- **Vista previa real de impresión y guardado como PDF.** Solo se ha emulado `media: print` (logo visible, progreso y botón ocultos, color del Mago intacto) y capturado la pantalla; no se ha visto la paginación real ni cómo se corta. Falta comprobar que el logo (SVG con PNG incrustado) y los fondos de las tarjetas salen en el PDF de Chrome/Edge.
- Navegadores distintos de Edge (Safari, Firefox) y móviles reales. Se usan `:has()`, `mask` y `appearance: none`; hay respaldo para `:has()`, pero no se ha probado.
- Contraste medido solo a ojo y por construcción: texto negro sobre naranja, blanco sobre `#1A2B32` y `#3D391F`. Texto sobre el color de arquetipo sigue calculado por `colorTextoSobre`.
- Modo fundador con Héroe y condiciones activas en el rediseño (no recorrido en esta ronda; los estilos son los mismos de `.bloque-oscuro`).
- La captura del bloque 6 y de la escala sirve de referencia visual; los recorridos completos por pantalla del resto de bloques (P4 a P7, abiertas) no se han fotografiado uno a uno.

## Cambio 2: tipografía

Decisión de Elizabeth: Kanit es la única tipografía de marca. Nunito Sans desaparece. La skill `marca-al-objetivo` sigue nombrándola (está desactualizada en este punto y no se ha tocado).

### C2.1 Qué se ha hecho

- **Fuentes alojadas** en `src/fonts/`: `kanit-latin-400-normal.woff2`, `-500-`, `-600-` y `-700-` (unos 19 KB cada una, 77 KB en total). Solo los pesos que usa `estilos.css` (400 cuerpo, 500 botones y porcentajes, 600 titulares, 700 etiquetas y negritas).
- **Origen:** distribución `@fontsource/kanit` v5.3.0 (licencia OFL-1.1), descargada ahora con `curl` desde `cdn.jsdelivr.net/npm/@fontsource/kanit/files/`. Es el subconjunto latino de Google Fonts.
- **Licencia:** `src/fonts/OFL.txt`, texto SIL Open Font License 1.1 con el copyright «2020 The Kanit Project Authors», tomado de `google/fonts` (`ofl/kanit/OFL.txt`).
- **`src/css/estilos.css`:** cuatro `@font-face` de «Kanit» (`font-display: swap`, solo `format("woff2")`, rutas `../fonts/...`). `--fuente-titulos` es `"Kanit", system-ui, -apple-system, "Segoe UI", sans-serif` y `--fuente-texto` apunta a la misma variable; por tanto titulares y cuerpo usan Kanit. Se actualizó el comentario de cabecera. No se ha tocado ningún tamaño, peso, color ni regla de maquetación.
- **Nunito Sans:** `grep -i nunito` en `src/` y `tests/` no devuelve nada. Las menciones que quedan están en `handoff/01`, `02`, `03` y `04` (histórico y aviso de despliegue: la línea de `04-despliegue.md` que pide comprobar «Kanit y Nunito Sans» está obsoleta) y en `.claude/skills/marca-al-objetivo/SKILL.md`, que no he modificado.
- **Logo:** `src/img/Logo Al Objetivo 187x43px.svg` movido a `docs/Logo Al Objetivo 187x43px.svg` sin modificarlo (era idéntico byte a byte a `src/img/logo-al-objetivo.svg`, que es el que usa la web; se comprobó con `cmp`). Ningún archivo de `src/` ni `tests/` lo referencia. Con esto queda resuelto el punto C1.4.2. `src/index.html` no necesitó cambios.

### C2.2 Comprobaciones

- `npm test`: **69 pruebas, 69 correctas, 0 fallos**.
- Servidor estático (`python -m http.server` sobre `src/`) y Edge headless por CDP a 360 x 800 (móvil), caché desactivada. Recorrido automático desde el primer paso hasta la pantalla final (9 capturas del recorrido, más la de retomar), con `fetch` sustituido por un stub:
  - Las cuatro fuentes se piden a `http://127.0.0.1:.../fonts/kanit-latin-{400,500,600,700}-normal.woff2`, con estado `loaded` en `document.fonts`. Cero peticiones a otros dominios y cero peticiones fallidas (22 en total, todas locales).
  - `font-family` calculada en cabecera y cuerpo: `Kanit, system-ui, ...`.
  - Cobertura de glifos por medición de anchos (Kanit frente a `serif` y `monospace`) en los cuatro pesos: `á é í ó ú ü ñ Á É Í Ó Ú Ü Ñ ¿ ¡ « » €` y `, . ; : ( ) %` presentes en todos.
  - Sin desbordamiento horizontal: `scrollWidth` = 360 = `clientWidth` en todas las pantallas recorridas. Revisadas a ojo las capturas de retomar, bloque 3 (botones «Más/Menos me describe» sin cortes de texto) y alerta: la maquetación no se rompe. El texto ocupa algo más que antes porque Kanit es más ancha que la fuente del sistema, que era lo que se veía realmente en equipos sin Kanit; los saltos de línea cambian, pero nada se sale de su caja.

### C2.3 Incidencia a tener en cuenta

En una primera pasada de comprobación olvidé interceptar `fetch` y el recorrido automático **envió dos filas de prueba a la hoja de Google real** (`URL_APPS_SCRIPT`, nombre «Prueba», email `a@b.es`, respuestas automáticas). No he podido borrarlas. Hay que eliminar a mano esas dos filas (las más recientes con nombre «Prueba» y `a@b.es`, fecha de hoy) de la hoja. Las pasadas siguientes ya usaron stub y no enviaron nada.

### C2.4 No comprobado

- Firefox, Safari y móviles reales; no se ha visto Kanit renderizada en ellos (solo Edge/Chromium headless).
- Impresión y «Guardar como PDF» con Kanit (con `@media print` la fuente es la misma, pero no se ha visto la paginación real).
- La pantalla de resultado normal (Mago) y el modo fundador con Héroe no se recorrieron en esta ronda; la pasada automática terminó en la alerta. Los estilos no han cambiado, solo la fuente.
- Comprobación de cobertura de glifos indirecta (por anchos); no se ha leído la tabla `cmap` del woff2.
- Kanit tiene un interlineado propio alto; se mantiene `line-height` de la hoja sin ajustes y visualmente es legible.
- El validador debe mirar: contraste y legibilidad del peso 400 en cuerpo a 17 px en un móvil real.
