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
