APROBADO: 0 fallos. El fallo del informe anterior (script `test` y paso de pruebas del workflow) está corregido y ninguna otra comprobación se ha roto.

# Validación 2: Cuestionario de Personalidad de Marca (Al Objetivo)

Segunda validación, tras el ciclo de corrección 1. Se valida contra `docs/especificacion.md` (manda sobre el plan), con `docs/apps-script.gs` para las columnas. No se ha modificado nada de `src/` ni de `tests/`; el único archivo escrito es este informe. Los scripts propios están en el directorio temporal de sesión, fuera del proyecto.

## 1. Fallo del informe anterior: corregido

| Elemento | Antes | Ahora | Estado |
|---|---|---|---|
| `package.json` l. 6 | `"test": "node --test tests/"` (fallaba en Node 24.18 con `MODULE_NOT_FOUND`) | `"test": "node --test"` | Corregido |
| `.github/workflows/pages.yml` l. 25 (job `pruebas`) | `- run: node --test tests/` | `- run: node --test` | Corregido |

`git diff` confirma que esas dos líneas son los únicos cambios en archivos ya versionados. Las fechas de modificación de todo `src/` (17:44 a 17:56) y `tests/` (17:49 a 17:53) son anteriores al informe previo (18:07:09), y los dos archivos tocados son de 18:07:40: la corrección no ha tocado código ni pruebas. Aun así se ha repetido la validación completa (secciones 2 y 3).

Comprobaciones pedidas sobre el workflow:
- **Publica solo `src/`:** el job `build` sigue con `actions/upload-pages-artifact@v4` y `path: src` (l. 34). `tests/`, `docs/`, `handoff/`, `package.json` y `.github/` no se publican.
- **No depende de que Node interprete `tests/` como ruta o patrón:** el paso es `node --test`, sin argumento. Node descubre por su cuenta los archivos `*.test.js` (Node 20: patrón `.+[.\-_]test` en cualquier carpeta; Node 24: patrón glob por defecto). Ejecutado en Node 24 descubre exactamente los 4 archivos `tests/*.test.js` (60 pruebas) y no ejecuta `tests/fixtures.js` ni nada de `src/`.
- **Orden de jobs intacto:** `pruebas` → `build` (`needs: pruebas`) → `deploy` (`needs: build`). Si fallan las pruebas no se publica.
- **Node del workflow:** 20 (`actions/setup-node@v4`, `node-version: 20`). No se ha podido ejecutar en Node 20 (no está instalado aquí): es la única parte no verificada de la corrección, y está respaldada por el comportamiento documentado de Node 20 al ejecutarse sin argumentos.

## 2. Entorno y comandos ejecutados

Node `v24.18.0`, Windows 11, desde la raíz del proyecto.

| Comando exacto | Resultado |
|---|---|
| `node --version` | `v24.18.0` |
| `npm test` (ejecuta `node --test`) | `tests 60, suites 0, pass 60, fail 0, cancelled 0, skipped 0`. |
| `node --test` (lo que ejecuta el workflow) | `tests 60, pass 60, fail 0`. |
| `node --test tests/` (forma literal del encargo original) | Falla en Node 24 (`MODULE_NOT_FOUND`, `tests 1, fail 1`). No es un defecto del proyecto: desde Node 22 los argumentos son patrones glob, no carpetas. Ya no lo usan ni el script ni el workflow. |

Scripts propios ejecutados en esta validación (con el código actual):
- **Datos:** ids `P1` a `P43` correlativos; reparto por bloque `{1:3, 2:4, 3:12, 4:3, 5:6, 6:6, 7:3, 8:6}`. Bloque 3 leído de los datos: 12 arquetipos × 4 apariciones, pareja máxima 2 veces, 12 de 12 parejas intracuadrante cubiertas, y las 12 filas coinciden con la tabla de §5 (`especificacion.md` l. 170 a 183). Bloques 4 y 5: 12 códigos, uno cada vez. Bloque 6: 12 códigos, dos veces cada uno.
- **Literalidad:** 183 textos de `cuestionario.js` (enunciados de ambos modos, opciones, extremos de escala, sectores) buscados como cadena en la especificación: 171 literales; los 12 restantes son P35 (11 opciones provisionales) y la variante de fundador de P39 (ver observaciones 1 y 2). De `arquetipos.js`, 216 cadenas de más de 12 caracteres: 213 literales; las 3 restantes son plantillas con marcadores (`{promesa}`, `{dominante}`, `{a}`) que se rellenan con texto literal.
- **Motor contra referencia independiente:** implementación escrita desde la especificación, comparada con `calcular` en 20 000 cuestionarios aleatorios completos (unos 1 470 sin alerta y el resto con alerta): totales, discriminantes, top 3, alerta y porcentaje del dominante, 0 diferencias. En cada caso se invirtieron P1 a P3 y se cambiaron P35 a P43: el objeto devuelto por `calcular` fue idéntico en los 20 000.
- **Envío:** con `config.js` de una copia fuera del proyecto en `"PENDIENTE"`, `enviar` hizo 0 llamadas a `fetch`. Con la URL real y un `fetch` simulado que rechaza: método `POST`, cabecera `{"Content-Type":"text/plain;charset=utf-8"}`, sin excepciones. `grep -ri application/json src tests`: 0 coincidencias.
- **Carga:** las 23 claves de `CLAVES_HOJA` coinciden, una a una y en orden, con el bloque de §10 de la especificación y con `COLUMNAS` de `apps-script.gs`; `construirCarga` devuelve exactamente esas claves.
- **Al Objetivo:** MA dominante 62 %, HC secundario 38 %, BU tercero, sin alerta, con tensión.
- **Paleta:** en `estilos.css` y `src/js/*.js` solo aparecen `#FFFFFF`, `#000000`, `#D8851F`, `#3D391F`, `#1A2B32`.

## 3. Tabla de comprobaciones

| # | Comprobación | Estado | Evidencia |
|---|---|---|---|
| 1 | Las pruebas pasan enteras | ✅ | `npm test` y `node --test` en Node 24.18.0: 60 de 60, 0 fallos. El script (`package.json` l. 6) y el workflow (l. 25) ya no pasan `tests/`. Node 20 no verificado (sección 1). |
| 2 | Pruebas para cada caso de «Casos de prueba» del plan | ✅ | Plan 6.2: 20 casos, `puntuacion.test.js` 20 pruebas; 6.3: 13, `datos.test.js` 14; 6.4: 12, `resultado.test.js` 13; 6.5: 13, `envio.test.js` 13; caso 6.1 «Al Objetivo» en `puntuacion.test.js`, `resultado.test.js` y `envio.test.js`. Total 60 ejecutadas y en verde; ningún caso del plan sin cubrir. |
| 3 | 43 preguntas P1–P43 y bloques como la especificación | ✅ | Script: `P1`..`P43` en orden; reparto 3, 4, 12, 3, 6, 6, 3, 6. 21 sectores literales (`cuestionario.js` l. 26 a 48). |
| 4 | Bloque 3: 4 apariciones, pareja ≤ 2, 12 intracuadrantes ≥ 1 | ✅ | Script de Node sobre los datos: todos los arquetipos 4 veces; pareja máxima 2; faltan 0 de las 12 parejas intracuadrante; 12 filas idénticas a la tabla de la especificación. |
| 5 | Bloque 4 una vez cada uno; bloque 5 una vez; bloque 6 dos veces | ✅ | Script: bloques 4 y 5, 12 códigos con 1; bloque 6, 12 códigos con 2. |
| 6 | Textos de preguntas y fichas literales (≥ 10) | ✅ | 171 de 183 textos de preguntas y 213 de 216 cadenas de fichas coinciden literalmente; las excepciones están explicadas en la sección 2 y en las observaciones 1 y 2 (la especificación no da el texto o lo da como fragmento). |
| 7 | Pesos correctos por bloque | ✅ | `puntuacion.js` l. 33 (ancla +2 por arquetipo de la motivación), l. 45 y 46 (+3 / −2), l. 50 (−2), l. 54 (+2), l. 60 a 65 (escala: 1 y 2 izquierda, 4 y 5 derecha, peso `abs(pos−3)`, 3 nada). 0 diferencias con la referencia en 20 000 casos. |
| 8 | Bloques 1 y 7 no afectan a ninguna puntuación | ✅ | `puntuacion.js` solo lee ids de P4 a P34 (l. 7 a 11). Invertir P1 a P3 y cambiar P35 a P43 en 20 000 casos: `calcular` devuelve objeto idéntico. Sector y modo no entran (`interfaz.js` l. 605 pasa solo `r = estado.respuestas`). |
| 9 | La alerta usa el discriminante | ✅ | `puntuacion.js` l. 143: `detectarAlerta(discriminante, marcasMas)`; l. 102 a 111 ordena y evalúa sobre el discriminante. La referencia independiente (que usa el discriminante) coincide en todos los casos, con y sin alerta. |
| 10 | Negativas a 0 solo para porcentajes | ✅ | `calcularPorcentajes` (l. 93 a 99) recorta con `Math.max(0, …)`; `total` y `discriminante` se guardan sin recortar (l. 124). En el caso Al Objetivo `CR` y `GO` valen −2 en total y se envían así (`puntuaciones_totales`). Con `p1 + p2 = 0` devuelve `null`, sin dividir. |
| 11 | Empates según la especificación, reproducibles | ✅ | `ordenarArquetipos` (l. 82 a 90): puntuación, luego marcas «MÁS», luego `Intl.Collator('es')` sobre el nombre. La referencia (misma regla) coincide en 20 000 casos. |
| 12 | «Al Objetivo»: Mago dominante, Hombre común secundario | ✅ | Ejecutado: `MA HC BU 62 38 false true`. Prueba en `puntuacion.test.js` en verde. |
| 13 | Orden de la pantalla de resultado = §8 | ✅ | `resultado.js` l. 8 a 25: 16 elementos en el orden de §8 (dominante, secundario, frase, qué es, para qué sirve, tensión, puede, no debe, contexto, sombra, voz, paleta, nota fundador, nota categoría, descarga, cierre); `interfaz.js` l. 722 los recorre con `ORDEN_SECCIONES.map`. Las abiertas no se muestran. |
| 14 | Avisos de tensión, contexto, fundador y categoría solo cuando corresponde | ✅ | Tensión: `esTension` con los 6 pares en ambos órdenes (`puntuacion.js` l. 114 a 117; `textoTension` devuelve `null` si no). Contexto: `null` sin condiciones activas (`resultado.js` l. 62 a 64), cierre solo con 2 o más (l. 76). Fundador: solo si `modo === 'fundador'` (l. 138). Categoría: dominante → texto 1; distinta de ambos → texto 2; secundario o vacía → `null` (l. 81 a 86). |
| 15 | `text/plain;charset=utf-8`; `application/json` en ningún sitio | ✅ | `envio.js` l. 108; cabecera comprobada con `fetch` simulado. `grep -ri application/json src tests`: 0 resultados. |
| 16 | Envío sin bloqueo; un fallo no rompe nada visible | ✅ | `interfaz.js` l. 615 a 618: `pintarResultado` → `enviar(...)` sin `await` → `borrarProgreso`. `envio.js` l. 105 a 114: `try/catch` y `.catch(() => {})`. Con `fetch` rechazado no hay excepción ni rechazo sin capturar. |
| 17 | Campos enviados = §10, nombres exactos | ✅ | Script: las 23 claves de la carga coinciden con §10 y con `COLUMNAS` de `apps-script.gs`, mismo orden. Valores «sí»/«no»; listas como texto legible. |
| 18 | `localStorage` en `try/catch`; limpieza tras mostrar el resultado | ✅ | `interfaz.js` l. 92 a 129: guardar, borrar y leer, cada uno en `try/catch`. Guardado con cada respuesta (`responder`). Borrado en l. 618, después de `pintarResultado` y de lanzar el envío. Clave `alobjetivo-quiz-progreso`. |
| 19 | Con `"PENDIENTE"` no se intenta enviar | ✅ | `envio.js` l. 104. Copia con `config.js` = `"PENDIENTE"`: 0 llamadas a `fetch`. (Sin prueba en el repositorio; observación 5.) |
| 20 | Ningún color de arquetipo coincide con los de la marca | ✅ | Los 12 colores (`#F0E6D2 #2C3E50 #4A5D45 #B03A2E #1A1A1A #2E7D8C #8B7355 #A64B6B #E8B84B #6B8E7F #6B4C93 #5B2333`) están todos en §3 y ninguno coincide con `#FFFFFF #000000 #D8851F #3D391F #1A2B32`. |
| 21 | Interfaz con la paleta de Al Objetivo | ✅ | `estilos.css` l. 1 a 11: variables solo con los 5 colores de la marca; el resto de colores hexadecimales de `estilos.css` y `src/js/` son esos mismos cinco. Colores de arquetipo inyectados solo en la pantalla de resultado desde los datos. Tipografía `Kanit` y `Nunito Sans` con pila de respaldo. |
| 22 | Doble selección del bloque 3 usable a 360 px | ✅ | `interfaz.js` l. 398 a 430: por opción, dos `button` («Más me describe» / «Menos me describe») con `aria-pressed`; la misma opción no puede ser ambas (l. 413 a 416); avanzar exige las dos. `estilos.css` l. 145 a 166: rejilla de 2 columnas, `min-height: 48px`, sin anchos fijos, texto que puede pasar a dos líneas. Revisión estática de CSS y estructura. |
| 23 | Controles con etiqueta accesible y teclado | ✅ | `<label for>` en campos y `select` (`interfaz.js` l. 288, 300, 390); `role="radiogroup"` y `role="group"` etiquetados (l. 252, 399); botones del bloque 3 con `aria-label` y `aria-pressed`; escala con `aria-label` por opción (l. 262); barra `role="progressbar"` (l. 163); `textarea` con `aria-labelledby`; solo `tabindex="-1"` (foco programático al título); `:focus-visible` con contorno y sombra (`estilos.css` l. 39 a 43); `lang="es"` (`index.html` l. 2); viewport (l. 5). |

## 4. Cobertura por apartado de la especificación

| Apartado | Estado | Nota |
|---|---|---|
| §3 códigos, motivaciones y colores | ✅ | Coinciden. |
| §4 modos | ✅ | Solo cambian enunciados; opciones y códigos iguales. |
| §5 preguntas | ✅ | Puntos 3 a 6. |
| §6 pesos, ordenación, porcentajes, alerta | ✅ | Puntos 7 a 12, contra referencia independiente. Alerta en lugar del resultado, con el desglose de los tres. |
| §7 textos del resultado | ✅ | Literales; plantillas rellenas con texto literal. |
| §8 orden | ✅ | Punto 13. |
| §9 requisitos técnicos | ✅ | Puntos 15, 16, 18, 22, 23; barra con nombre de bloque. |
| §10 columnas | ✅ | Punto 17. |
| Regla del sector | ✅ | Sector, modo y bloque 1 no entran en `calcular`. |

## 5. Lista de fallos

No hay ninguno. Todos los puntos están en ✅.

## 6. Observaciones (no son fallos; pendientes para Elizabeth o el implementador)

1. **P35: 11 de 12 opciones son texto provisional del implementador** (`cuestionario.js` l. 398 a 409, marcadas `provisional: true`). La especificación (§5 l. 362) pide doce y solo da la del Sabio como ejemplo. Deben aprobarse o sustituirse antes de usar la herramienta con clientes; al hacerlo hay que quitar la marca y ajustar la última línea de la prueba de P35 en `tests/datos.test.js`.
2. **P39, variante de fundador compuesta** (`cuestionario.js` l. 431): la especificación solo da el fragmento «las personas con las que has trabajado». Revisar la frase.
3. **El Bufón tiene 3 comportamientos en «Puede»**, no 4: §8 l. 746 dice «los 4», pero la ficha de §7.6 del propio Bufón da 3. El código sigue la ficha. Incoherencia en la especificación; decide Elizabeth.
4. **Artículo en mayúscula en mitad de frase** («…y El Hombre común quiere…», «…entre El Cuidador, El Gobernante y El Sabio…»). Es literal a §3, pero queda incorrecto en castellano. Se arregla sin tocar el motor.
5. **Sin prueba en el repositorio para `URL_APPS_SCRIPT = "PENDIENTE"`**: la URL es una constante importada. El código es correcto (verificado en copia). Sería útil que `enviar` aceptara la URL como parámetro opcional.
6. **Comentario obsoleto**: `tests/fixtures.js` l. 2 aún menciona `node --test tests/`. Sin efecto funcional. También el plan (`handoff/01-plan-tecnico.md` l. 32 y 591) conserva el comando antiguo.
7. **Node 20 sin ejecutar** (el del workflow): el resultado del job `pruebas` real solo se verá en GitHub Actions. Conviene mirar la primera ejecución.
8. **Decisiones del plan sin texto en la especificación** (correctas respecto a ella): con alerta no se muestran nota de fundador ni botón de descarga; si la categoría coincide con el secundario no hay nota; `categoria_saturada = sí` solo si coincide con el dominante; `sector` se envía como identificador y los arquetipos como código de dos letras; P36 a P43 son opcionales.
9. **Sin comprobar por mí** (necesita navegador y hoja reales): envío real a Google Sheets y colocación de las 23 columnas, vista previa de impresión, aspecto en móviles reales y uso interactivo completo. Antes de publicar conviene una pasada manual con un envío real de «Al Objetivo».
