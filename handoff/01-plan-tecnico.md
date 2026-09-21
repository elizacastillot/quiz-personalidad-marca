# Plan técnico: Cuestionario de Personalidad de Marca (Al Objetivo)

Fuente de verdad: `docs/especificacion.md` (en adelante «la spec»). Las referencias «§» son secciones de la spec; «l.» son líneas de ese archivo, para localizar los textos que hay que copiar literalmente. También se usan las reglas de `CLAUDE.md` y las skills del proyecto (`motor-puntuacion`, `envio-resultados`, `marca-al-objetivo`) cuando aportan detalle que la spec no da; se indica cuándo. Las referencias «Dn» remiten a las decisiones tomadas de la sección 7, que son vinculantes. Las referencias «Cn» remiten a las decisiones del Cambio 1 (sección 10), que sustituyen a las «Dn» que contradicen (en concreto D6).

## 1. Resumen

- Se construye una web estática (HTML, CSS y JS puro con módulos ES, sin build) con el cuestionario de 43 preguntas, un motor de puntuación puro y testeado con `node --test`, la pantalla de resultado de 16 elementos (§8) y el envío de 23 columnas a Google Apps Script (§10).
- Estado: la implementación descrita en las secciones 2 a 9 ya existe en `src/` y `tests/` (commit `6e33591`). Existen también `package.json` (script `test`), `docs/apps-script.gs` (COLUMNAS = §10, no se modifica) y `.github/workflows/pages.yml` (fuera de este plan). **Cambio 1 (sección 10):** la pantalla de alerta deja de ser solo «mensaje, desglose y cierre» y pasa a llevar, en este orden, mensaje, explicación corta, un párrafo por cada uno de los tres arquetipos nombrados, desglose, botón de descarga (`window.print()`) y cierre. El resto del plan no cambia.
- Las 12 dudas que había están resueltas (sección 7, D1 a D12) y el plan las recoge. El Cambio 1 añade una única duda abierta, no bloqueante (sección 11). Lo que la spec no trae y se resuelve por decisión (textos de P35, identificadores de sector, textos de interfaz, textos nuevos de la alerta) se marca como provisional y se lista en `handoff/02-implementacion.md` para revisión.

## 2. Mapa de archivos

14 archivos del plan original (ya creados). El Cambio 1 modifica 6 de ellos y no crea ninguno (detalle en 10.4); la columna «Responsabilidad» ya recoge el estado tras el cambio. `tests/fixtures.js` existe (exporta `alObjetivo`) y no estaba en el plan original; el Cambio 1 le añade una fixture (10.4).

| Archivo | Responsabilidad |
|---|---|
| `src/index.html` | Estructura mínima (`lang="es"`, viewport, contenedor `#app`, fuentes Kanit y Nunito Sans con `display=swap`) y una sola carga: `<script type="module" src="js/interfaz.js">`. Sin cambios en el Cambio 1. |
| `src/css/estilos.css` | Estilos mobile first (mínimo 360 px, áreas táctiles ≥ 44 px, foco visible). Paleta de interfaz solo `#FFFFFF #000000 #D8851F #3D391F #1A2B32` (skill `marca-al-objetivo`). Los colores de arquetipo no van aquí: se inyectan desde datos en el resultado. Incluye un bloque `@media print` para la descarga por impresión (D7), que sirve al resultado normal y, desde el Cambio 1, a la pantalla de alerta. |
| `src/data/cuestionario.js` | Datos: bloques, 43 preguntas con enunciados por modo, opciones con código, tabla de escalas, lista de 21 sectores con su identificador (D10), 12 opciones de P35 (11 provisionales, D1), textos fijos del bloque 6. Sin lógica. |
| `src/data/arquetipos.js` | Datos: `ARQUETIPOS` (12 fichas, §3 y §7.6), `MOTIVACIONES`, `TENSIONES` (§7.2) y `TEXTOS` (plantillas 7.1 a 7.5, alerta, cierre). La alerta incluye, desde el Cambio 1, `explicacion` y los 12 párrafos `arquetipos` (PROVISIONAL). Sin lógica. |
| `src/js/puntuacion.js` | Motor puro (sin DOM, sin `localStorage`). Puntuaciones, ordenación, porcentajes, alerta, tensión. Sin cambios en el Cambio 1. |
| `src/js/resultado.js` | Funciones puras que componen el objeto de resultado (frase, tensión, contexto 7.3, notas 7.4 y 7.5, aviso del Héroe, paleta, orden §8, pantalla de alerta con su orden propio) a partir del cálculo y del contexto. |
| `src/js/utilidades.js` | `barajar(lista, aleatorio = Math.random)` (Fisher-Yates, devuelve copia) y `textoSiNo(bool)`. Puro. |
| `src/js/interfaz.js` | Punto de entrada. Navegación por pantallas, validación de obligatorios (D11), render, barra de progreso, guardado y recuperación de progreso, disparo del cálculo y del envío, render del resultado o de la alerta, botón de impresión (D7) en ambas pantallas. |
| `src/js/envio.js` | `CLAVES_HOJA`, `construirCarga(...)` (pura) y `enviar(carga)` (fetch fire and forget). Sin cambios en el Cambio 1 (C4). |
| `src/js/config.js` | `export const URL_APPS_SCRIPT` con el valor de la sección 3.6. |
| `tests/datos.test.js` | Integridad de los datos: 43 preguntas, tabla del bloque 3 (tres condiciones calculadas), cobertura por arquetipo en bloques 4, 5 y 6, colores, fichas, variantes de modo fundador, P35, identificadores de sector, `barajar`, textos de la alerta (Cambio 1). |
| `tests/puntuacion.test.js` | Pesos aislados por bloque, bloques 1 y 7 neutros, alerta, empates, divisiones por cero, caso «Al Objetivo». Sin cambios en el Cambio 1. |
| `tests/resultado.test.js` | Frase combinada (132 combinaciones), tensiones, contexto 7.3, notas 7.4 y 7.5, aviso del Héroe, `categoria_saturada`, orden §8, pantalla de alerta (Cambio 1: explicación, párrafos, orden propio). |
| `tests/envio.test.js` | Las 23 claves (contra `docs/apps-script.gs`), formatos de valores, cabecera `text/plain`, URL configurada, no romper si falla; con alerta la carga no cambia (Cambio 1). |

`package.json` ya tiene `"type": "module"` y `"test": "node --test tests/"`: no tocar.

## 3. Modelo de datos

### 3.1 Identificadores

- Códigos de arquetipo: `IN SA EX HE RE MA HC AM BU CU CR GO` (§3, l. 38–51).
- Claves de motivación, sin tilde y en mayúsculas (skill `motor-puntuacion`): `INDEPENDENCIA` (IN, SA, EX), `MAESTRIA` (HE, RE, MA), `PERTENENCIA` (HC, AM, BU), `ESTABILIDAD` (CU, CR, GO) (§1, l. 11–16).
- Ids de pregunta: `P1` a `P43`. Ids de opción: id de pregunta más letra minúscula en el orden de la spec (`P8a`, `P8b`...). El orden de la spec es solo el orden de definición; en pantalla se baraja.
- Valores internos de sí/no: booleanos (`true` = sí). Se convierten a «sí»/«no» solo al enviar.

### 3.2 Pregunta y opción (`src/data/cuestionario.js`)

Campos comunes de una pregunta:

```js
{
  id: 'P8',
  bloque: 3,                 // 1..8
  tipo: 'mas-menos',         // 'si-no' | 'motivacion' | 'mas-menos' | 'resta' | 'dos-opciones' | 'escala' | 'lista-arquetipo' | 'abierta'
  enunciado: { marca: '…', fundador: '…' | null },   // null = sin cambios, se usa el de marca
  opciones: [ { id: 'P8a', texto: '…', codigo: 'IN' }, … ]   // ausente en 'si-no', 'escala' y 'abierta'
}
```

Ejemplo real, bloque 3 (§5.3a l. 187–192 y §5.3b l. 264):

```js
{
  id: 'P8', bloque: 3, tipo: 'mas-menos',
  enunciado: {
    marca: 'Un cliente te dice que está perdido y no sabe por dónde empezar. Tú...',
    fundador: 'Alguien cercano te dice que está perdido y no sabe por dónde empezar. Tú...'
  },
  opciones: [
    { id: 'P8a', texto: 'Le quito capas hasta que quede una sola cosa que hacer mañana', codigo: 'IN' },
    { id: 'P8b', texto: 'Le explico cómo funciona esto para que entienda dónde está', codigo: 'SA' },
    { id: 'P8c', texto: 'Le pongo un primer objetivo concreto y empezamos', codigo: 'HE' },
    { id: 'P8d', texto: 'Le digo que no pasa nada, que vamos a ir juntos', codigo: 'CU' }
  ]
}
```

Ejemplo real, bloque 2 (§5 l. 131–136). En este bloque el `codigo` es una clave de motivación:

```js
{
  id: 'P4', bloque: 2, tipo: 'motivacion',
  enunciado: { marca: '¿Qué cambia en la vida de tu cliente después de trabajar contigo?',
               fundador: '¿Qué quieres que cambie?' },
  opciones: [
    { id: 'P4a', texto: 'Entiende algo que antes no entendía y gana criterio propio', codigo: 'INDEPENDENCIA' },
    { id: 'P4b', texto: 'Consigue algo difícil que antes no lograba', codigo: 'MAESTRIA' },
    { id: 'P4c', texto: 'Deja de sentirse solo en esto', codigo: 'PERTENENCIA' },
    { id: 'P4d', texto: 'Su negocio deja de ir a golpe de improvisación', codigo: 'ESTABILIDAD' }
  ]
}
```

Otros tipos:

- `si-no` (P1 a P3): añade `clave` (`clientes_vulnerables`, `restriccion_normativa`, `consecuencias_graves`), sin `opciones`. Ej.: `{ id: 'P1', bloque: 1, tipo: 'si-no', clave: 'clientes_vulnerables', enunciado: { marca: '¿Tus clientes suelen llegar a ti en un momento delicado o vulnerable?', fundador: null } }` (l. 115–116).
- `resta` (P20 a P22): opciones con código de arquetipo; el peso −2 lo aplica el motor. Ej. P20: `{ texto: 'Sonar ingenua o naíf', codigo: 'IN' }` (l. 284–289).
- `dos-opciones` (P23 a P28): 2 opciones con código de arquetipo (+2 al elegido). Ej. P23: `GO` «Protegerlo y mejorarlo desde dentro» / `RE` «Tirarlo y hacerlo distinto» (l. 307–309).
- `escala` (P29 a P34): sin `opciones`; lleva `izquierda: { etiqueta, codigos: [..2] }` y `derecha: { etiqueta, codigos: [..2] }`. Ej. P29: `{ izquierda: { etiqueta: 'Cercano', codigos: ['HC','IN'] }, derecha: { etiqueta: 'Con autoridad', codigos: ['GO','SA'] } }` (l. 347). Las 6 filas están en l. 347–352. El bloque exporta además `ENCABEZADO_BLOQUE_6` (l. 339–341) y `NOTA_FUNDADOR_BLOQUE_6` («Si todavía no conoces bien tu sector, sitúate respecto a las marcas que consideras tu referencia», l. 343).
- `lista-arquetipo` (P35, D1): 12 opciones, una por arquetipo, cada una con `id` (`P35a`…`P35l`), `texto` y `codigo`. La del Sabio es literal de la spec (l. 362): `{ id: 'P35b', texto: 'Explican mucho y se posicionan como los que más saben', codigo: 'SA' }`. Las otras 11 las redacta el implementador como borradores, con `provisional: true` en la opción y un comentario `// PROVISIONAL` en el código. Requisitos de los borradores: una línea, describen cómo se comporta la categoría (no cómo es la marca del usuario), sin nombrar al arquetipo, misma longitud aproximada y misma deseabilidad que la del Sabio (principio 2, §2), en el estilo de la de SA. Todos los borradores se listan en `handoff/02-implementacion.md`, con su código, para que Elizabeth los revise. Cuando se aprueben, se quita `provisional` y se actualiza la prueba 6.3.12.
- `abierta` (P36 a P43): solo enunciado. P39 lleva variante de fundador «…las personas con las que has trabajado» (l. 378); el resto `fundador: null`. Enunciados en l. 368–370 y 377–382. Son opcionales (D11).

Variantes de modo fundador que existen en la spec (las demás son `fundador: null`):

| Bloque | Con variante | Sin variante |
|---|---|---|
| 2 | P4, P5, P6 (l. 132, 139, 146) | P7 |
| 3 | P8, P10, P11, P12, P13, P14, P15, P17, P18 (l. 262–274) | P9, P16, P19 |
| 8 | P39 | P38, P40 a P43 |
| 1, 4, 5, 7 | ninguna | todas |

Las opciones nunca dependen del modo: viven fuera de `enunciado` (§4 l. 65–70, regla 4 de la skill).

Exports de `cuestionario.js`: `BLOQUES`, `PREGUNTAS`, `SECTORES`, `PREGUNTA_MODO`, `ENCABEZADO_BLOQUE_6`, `NOTA_FUNDADOR_BLOQUE_6`.

`BLOQUES` (nombres de la spec, para la barra de progreso, §5): 1 «Condiciones de tu actividad», 2 «La transformación del cliente», 3 «Comportamiento real», 4 «Lo que tu marca nunca haría», 5 «Tensiones», 6 «Voz y tono», 7 «Tu categoría», 8 «Abiertas». Cada uno con `puntua` (false en 1, 7 y 8) y `campoLibre: true`.

`PREGUNTA_MODO` (§4 l. 59–63): enunciado «¿En qué punto está tu marca?»; opciones `{ valor: 'marca', texto: 'Ya está en marcha: tengo clientes y una forma de trabajar rodada' }` y `{ valor: 'fundador', texto: 'Estoy empezando o construyéndola desde cero' }`.

`SECTORES` (§5 l. 84–106): 21 elementos `{ id, texto, requiereTexto }`. El `texto` es literal de la spec. El último, «Otro», lleva `requiereTexto: true` (la spec escribe «Otro (con campo de texto)»; el texto visible es «Otro» y el campo de texto es un control aparte). El `id` es el valor que se envía a la hoja (D10): minúsculas, palabras unidas con guion bajo, sin tildes, sin comas y sin paréntesis ni su contenido. Ejemplos: `servicios_profesionales`, `legal_y_fiscal`, `marketing_publicidad_y_comunicacion`, `otro`. El implementador define los 21 y los lista en `handoff/02-implementacion.md`.

### 3.3 Fichas de arquetipo (`src/data/arquetipos.js`)

Estructura de cada entrada de `ARQUETIPOS[codigo]`, con los textos literales de §3 y §7.6:

```js
MA: {
  codigo: 'MA',
  nombre: 'El Mago',              // §3
  nombreCorto: 'Mago',            // sin artículo; se usa para el orden alfabético
  motivacion: 'MAESTRIA',
  deseoCentral: 'Transformar la realidad',   // §3, literal; la tensión lo usa en minúscula inicial (D2)
  sombraCorta: 'Manipulación, humo',
  color: '#2E7D8C',
  ficha: {
    queEs: 'Cambia la situación de raíz, no la mejora un poco. Trabaja sobre la forma en que el cliente ve su propio problema; cuando esa mirada cambia, todo lo demás se recoloca.',
    paraQueSirve: 'Cuando el cliente cree que su problema es X y en realidad es Y. Justifica el diagnóstico como servicio con entidad propia y convierte la consultoría en algo más que ejecución.',
    aviso: null,                  // solo HE lo tiene (D8)
    promesa: 'cambia la manera en que ves tu negocio',
    manera: 'sacando a la luz lo que no se veía',
    puede: ['reformular el problema del cliente', 'vender diagnóstico', 'contenido que descoloca', 'mostrar el antes y el después de la perspectiva'],
    noDebe: ['prometer magia', 'esconder el método', 'usar el misterio como táctica de venta'],
    sombra: 'la manipulación. El Mago tiene el poder de cambiar cómo alguien ve las cosas; usado para vender más y no para ayudar, se convierte en humo.',
    voz: ['inspiradora', 'con visión', 'apoyada en método']
  }
}
```

Reglas de transcripción: `puede` = 4 elementos y `noDebe` = 3, partiendo la línea de la spec por « · » (separador) y quitando el punto final; `voz` = 3 elementos partiendo por «, ». Todo lo demás, literal, sin retocar mayúsculas (el render pone la etiqueta «Sombra:» delante y el texto va tal cual). `aviso` de HE (l. 598): el texto que sigue a «Aviso importante:», literal («el héroe es el cliente, no la marca. La marca es el entrenador. Las marcas Héroe que se colocan en el papel protagonista se vuelven autocomplacientes y dejan de conectar.»); el render pone delante la etiqueta «Aviso importante:». En los otros 11, `aviso: null`. Ubicación en la spec: IN l. 544–556, SA 560–572, EX 576–588, HE 592–606, RE 610–622, MA 626–638, HC 642–654, AM 658–670, BU 674–686, CU 690–702, CR 706–718, GO 722–734. Datos de §3: l. 40–51.

Otros exports de `arquetipos.js`:

- `MOTIVACIONES`: `{ INDEPENDENCIA: ['IN','SA','EX'], MAESTRIA: ['HE','RE','MA'], PERTENENCIA: ['HC','AM','BU'], ESTABILIDAD: ['CU','CR','GO'] }`.
- `ORDEN_CODIGOS`: `['IN','SA','EX','HE','RE','MA','HC','AM','BU','CU','CR','GO']` (orden de §3, para serializar).
- `TENSIONES`: los 6 pares, sin orden: `[['GO','RE'],['CU','EX'],['SA','BU'],['HE','IN'],['MA','HC'],['AM','CR']]` (§7.2 l. 461).
- `TEXTOS`, con el texto literal de:
  - `combinacion`: plantilla «Tu marca {promesa}, {manera}.» (§7.1)
  - `tension`: título, cuerpo y cierre (§7.2 l. 463–467); el cuerpo lleva los marcadores `{dominante}`, `{deseoDominante}`, `{secundario}`, `{deseoSecundario}`. Los nombres son el campo `nombre` de §3 tal cual («El Mago»); los deseos son `deseoCentral` con la primera letra en minúscula (D2).
  - `contexto.encabezado`, y por condición `general` y `matices` (§7.3 l. 477–518): `clientes_vulnerables` (matices BU, RE, HE, MA, EX), `restriccion_normativa` (HE, MA, GO, RE, y AM y BU con el mismo texto), `consecuencias_graves` (IN, BU, EX, HC, CR); `contexto.variasCondiciones` (l. 524)
  - `notaFundador` (§7.4 l. 528)
  - `notaCategoria.coincideDominante` y `notaCategoria.distinta` (§7.5 l. 534 y 538). No hay texto para «coincide con el secundario» (D3): no se crea ninguna clave para ese caso.
  - `alerta` (§6 l. 433–437): `titulo`, `cuerpo` con marcadores `{a}`, `{b}`, `{c}` y `pie` (literales). **Cambio 1:** se añaden `explicacion` (una cadena) y `arquetipos` (objeto con los 12 códigos como claves y un párrafo por cada uno), ambos PROVISIONAL; texto exacto en 10.3 (§7.7 propuesto).
  - `cierre`: «Esto es el punto de partida. Lo afinamos juntas en la sesión.» (§8 l. 755)
  - `etiquetasResultado` de las secciones (Qué es, Para qué sirve, Aviso importante, Qué puede hacer tu marca, Qué no debe hacer nunca, Tu sombra, Tu voz, Paleta sugerida): están nombradas en §8 y §7.6; los rótulos visibles son los de la lista.
- Los matices «Resto: sin matiz específico» no se almacenan: la ausencia de clave significa «solo el texto general».

### 3.4 Respuesta del usuario

Entrada del motor: objeto `respuestas` indexado por id de pregunta. **Se guarda el código, no el id de opción ni la posición**, porque las opciones se barajan (regla 5). Un id ausente = sin responder.

| Bloque | Valor guardado | Ejemplo |
|---|---|---|
| 1 (P1–P3) | booleano | `P1: true` |
| 2 (P4–P7) | clave de motivación | `P4: 'MAESTRIA'` |
| 3 (P8–P19) | `{ mas, menos }` con códigos; deben ser distintos | `P12: { mas: 'MA', menos: 'GO' }` |
| 4 (P20–P22) | código restado | `P20: 'SA'` |
| 5 (P23–P28) | código elegido | `P23: 'GO'` |
| 6 (P29–P34) | entero 1 a 5 | `P33: 5` |
| 7 (P35) | código | `P35: 'SA'` |
| 7 y 8 (P36–P43), opcionales | texto; sin clave si está vacío | `P42: 'Hacemos que lo complicado tenga sentido'` |

Estado completo persistido (`localStorage`, clave `alobjetivo-quiz-progreso`, skill `envio-resultados`):

```js
{
  version: 1,
  paso: 'P14',                       // dónde retomar
  datos: { modo: 'marca', nombre: '', marca: '', email: '', sector: '', sectorOtro: '' },   // sector = id de D10
  respuestas: { /* como arriba */ },
  libres: { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '' }   // campo libre por bloque (regla 9 de §2)
}
```

`calcular(respuestas)` solo lee `respuestas`. Nunca lee `datos` (incluido el sector) ni P1 a P3 ni P35 a P43 (§2 principio 7, §6 l. 404).

### 3.5 Objeto de cálculo (salida de `calcular`)

```js
{
  total:         { IN: 3, SA: 1, EX: -1, … },    // 12 claves; sin recortar
  discriminante: { IN: 3, SA: 1, EX: -1, … },
  ancla:         { IN: 0, SA: 0, EX: 0, HE: 6, … },
  marcasMas:     { IN: 0, SA: 1, … },            // nº de «MÁS» en el bloque 3
  ranking: ['MA','HC','BU', /* …12 códigos por total */],
  rankingDiscriminante: ['MA','HC', /* …12 códigos por discriminante */],
  dominante: 'MA', secundario: 'HC', tercero: 'BU',
  porcentajeDominante: 62, porcentajeSecundario: 38,   // null y null si p1 + p2 = 0
  alerta: false,
  tension: true
}
```

### 3.6 Configuración de envío (`src/js/config.js`)

```js
export const URL_APPS_SCRIPT =
  'https://script.google.com/macros/s/AKfycbz6j99B4irmmeFJbqub6H2LAr7vYh7rUxJ17Ljzq593Oj4_ZgXmOvE04YJSZfOAdCWylw/exec';
```

Es el valor de configuración del envío (dato de la delegación). `envio.js` mantiene la protección de la skill: si el valor fuera `'PENDIENTE'` no se envía. `docs/apps-script.gs` ya lo espera en `src/js/config.js` (l. 9).

### 3.7 Carga enviada (§10, 23 claves exactas y en este orden)

```
fecha, nombre, marca, sector, sector_otro, email, modo,
clientes_vulnerables, restriccion_normativa, consecuencias_graves,
arquetipo_dominante, porcentaje_dominante, arquetipo_secundario, porcentaje_secundario,
arquetipo_tercero, alerta_sin_definir, tension_dominante_secundario,
arquetipo_categoria, categoria_saturada,
puntuaciones_totales, puntuaciones_discriminantes, campos_libres, respuestas_abiertas
```

Formato de cada valor (la spec fija solo lo que aparece entre paréntesis en §10; el resto es decisión técnica de este plan y de D4, D9 y D10):

| Clave | Valor |
|---|---|
| `fecha` | `new Date().toISOString()` |
| `modo` | `'marca'` o `'fundador'` |
| `sector` | identificador de `SECTORES` (D10), por ejemplo `servicios_profesionales` |
| `clientes_vulnerables`, `restriccion_normativa`, `consecuencias_graves`, `alerta_sin_definir`, `tension_dominante_secundario`, `categoria_saturada` | `'sí'` o `'no'` (skill `envio-resultados`) |
| `arquetipo_dominante`, `arquetipo_secundario`, `arquetipo_tercero`, `arquetipo_categoria` | código de dos letras (D9), por ejemplo `MA`; `''` si no hay dato |
| `categoria_saturada` | `'sí'` solo si `arquetipo_categoria` coincide con el dominante; en cualquier otro caso `'no'` (D4) |
| `sector_otro` | texto solo si el sector elegido es «Otro»; si no, `''` |
| `porcentaje_*` | número; `''` si es `null` |
| `puntuaciones_totales`, `puntuaciones_discriminantes` | texto `IN=3; SA=1; EX=-1; …`, los 12 en `ORDEN_CODIGOS` |
| `campos_libres` | `B2: texto \| B3: texto`, solo los bloques con texto; `''` si ninguno |
| `respuestas_abiertas` | `P36: texto \| P37: texto \| … \| P43: texto`, solo las con texto (son opcionales, D11) |

Ejemplo de la carga del caso «Al Objetivo» (sección 6.1): `sector: 'servicios_profesionales'`, `arquetipo_dominante: 'MA'`, `porcentaje_dominante: 62`, `arquetipo_secundario: 'HC'`, `porcentaje_secundario: 38`, `arquetipo_tercero: 'BU'`, `alerta_sin_definir: 'no'`, `tension_dominante_secundario: 'sí'`, `arquetipo_categoria: 'SA'`, `categoria_saturada: 'no'`, `puntuaciones_totales: 'IN=3; SA=1; EX=-1; HE=2; RE=4; MA=23; HC=14; AM=4; BU=5; CU=3; CR=-2; GO=-2'`.

## 4. Contrato del motor

Todas las funciones son puras y exportadas como módulos ES. `puntuacion.js` importa solo de `data/arquetipos.js` (motivaciones, nombres) y `data/cuestionario.js` (escalas de P29 a P34).

### 4.1 `puntuacion.js`

**`puntuarAncla(respuestas) → Record<Codigo, number>`** (§6 l. 398–399; §5 bloque 2). Para cada P4 a P7 con valor de motivación, suma +2 a cada uno de los 3 arquetipos de esa motivación. Máximo +8 (l. 409, 423). Valor desconocido o ausente: se ignora.

**`puntuarDiscriminante(respuestas) → Record<Codigo, number>`** (§6 l. 391–396). Suma, sobre los 12 códigos:
- Bloque 3 (P8 a P19): +3 al `mas`, −2 al `menos`. Si `mas === menos` o falta uno de los dos, se ignora la pregunta entera (la interfaz lo impide, l. 166).
- Bloque 4 (P20 a P22): −2 al código elegido.
- Bloque 5 (P23 a P28): +2 al código elegido.
- Bloque 6 (P29 a P34): posición 1 → +2 a cada uno de los dos de la izquierda; 2 → +1 a cada uno de los dos de la izquierda; 3 → nada; 4 → +1 a cada uno de los dos de la derecha; 5 → +2 a cada uno de los dos de la derecha (l. 335). Lectura adoptada: «+1 izquierda» significa +1 a los dos de la izquierda, simétrico a la posición 1. Es coherente con el rango de §6 l. 423 (máximo 26 = 12 + 2 + 4 + 8).
- Ignora P1 a P3, P35 a P43 y todo lo que no sea de los bloques 3 a 6.

**`contarMarcasMas(respuestas) → Record<Codigo, number>`**. Número de veces que cada código es `mas` en el bloque 3 (para el desempate, l. 425).

**`ordenarArquetipos(puntuaciones, marcasMas) → Codigo[]`** (§6 l. 425; D12). Devuelve los 12 códigos ordenados por puntuación descendente; en empate, más marcas «MÁS»; si persiste, orden alfabético por `nombreCorto` con `new Intl.Collator('es')`. Orden alfabético resultante: Amante, Bufón, Creador, Cuidador, Explorador, Gobernante, Héroe, Hombre común, Inocente, Mago, Rebelde, Sabio. La spec define el desempate solo para el primer puesto; por D12 la misma regla se aplica a todas las posiciones (en particular a la segunda y la tercera).

**`calcularPorcentajes(p1, p2) → { dominante, secundario } | { dominante: null, secundario: null }`** (§6 l. 412–421). Recibe los totales de las posiciones 1 y 2 sin recortar. Pasos: llevar cada uno a `Math.max(0, x)`; si la suma es 0, devolver `null` en ambos (decisión técnica; con respuestas completas es inalcanzable, ver 5.4); `dominante = Math.round(p1 * 100 / (p1 + p2))`; `secundario = 100 - dominante`. Se multiplica antes de dividir para no perder exactitud con decimales binarios (por ejemplo `0.145 * 100`).

**`detectarAlerta(discriminante, marcasMas) → boolean`** (§6 l. 427–431 y skill `motor-puntuacion`). Ordena los 12 por `discriminante` con `ordenarArquetipos`, toma `d1, d2, d3` (valores sin recortar) y devuelve `true` si:
1. `d3 >= d2 - 2`, o
2. `c1 = max(0, d1)`, `c2 = max(0, d2)`, y `c1 + c2 <= 0` (no se puede dividir: se trata como alerta), o
3. `c1 * 100 < 55 * (c1 + c2)` (equivale a `c1 / (c1 + c2) * 100 < 55`, sin coma flotante; el recorte a 0 antes de dividir viene de la skill `motor-puntuacion`, no de la spec).

**`esTension(a, b) → boolean`** (§7.2 l. 461). `true` si `{a, b}` coincide con alguno de los 6 pares de `TENSIONES`, en cualquier orden. `esTension(x, x)` es `false`.

**`calcular(respuestas) → Calculo`** (§6 completo). Devuelve el objeto de 3.5:
- `total[c] = discriminante[c] + ancla[c]`.
- `ranking = ordenarArquetipos(total, marcasMas)`; `dominante`, `secundario`, `tercero` = posiciones 1 a 3.
- Porcentajes con `calcularPorcentajes(total[dominante], total[secundario])`.
- `alerta = detectarAlerta(discriminante, marcasMas)`; `rankingDiscriminante = ordenarArquetipos(discriminante, marcasMas)`, cuyas tres primeras posiciones son los arquetipos que nombra y desglosa la alerta (D5) y de los que se muestra el párrafo explicativo (C1, Cambio 1).
- `tension = esTension(dominante, secundario)`.
- Se ordena y se muestra por `total`; la alerta usa solo `discriminante` (l. 406–409).
- No lanza excepciones con entradas parciales o vacías: `calcular({})` devuelve ceros, `alerta: true` y porcentajes `null`.

### 4.2 `resultado.js`

**`fraseCombinada(dominante, secundario) → string`** (§7.1). `'Tu marca ' + ARQUETIPOS[dominante].ficha.promesa + ', ' + ARQUETIPOS[secundario].ficha.manera + '.'`. Con `dominante === secundario` lanza un error (nunca ocurre).

**`textoTension(dominante, secundario) → { titulo, cuerpo, cierre } | null`** (§7.2 l. 463–467; D2). Si `esTension(dominante, secundario)`, devuelve los tres textos de `TEXTOS.tension` con los marcadores sustituidos: `{dominante}` y `{secundario}` por el `nombre` de §3 (por ejemplo «El Mago»), `{deseoDominante}` y `{deseoSecundario}` por el `deseoCentral` de §3 con la primera letra en minúscula (`toLocaleLowerCase('es')` sobre el primer carácter). El dominante va siempre en primer lugar, con independencia del orden en `TENSIONES`. Ejemplo para MA dominante y HC secundario: «El Mago quiere transformar la realidad y El Hombre común quiere pertenecer y conectar.» Si no es tensión, `null`.

**`seccionContexto(dominante, condiciones) → null | { encabezado, bloques, cierre }`** (§7.3 l. 471–524). `condiciones = { clientes_vulnerables, restriccion_normativa, consecuencias_graves }` (booleanos). Si ninguna es `true`, devuelve `null`. Si no, `bloques` tiene una entrada por condición activa, en el orden vulnerables, normativa, graves: `{ condicion, general, matiz }`, donde `matiz` es el texto para el arquetipo **dominante** si existe en `TEXTOS.contexto`, o `null` («Resto: sin matiz específico»). `cierre` es el texto de «varias condiciones» si hay 2 o 3 activas, si no `null`. El secundario nunca aporta matiz (la spec dice «por arquetipo dominante»).

**`notaCategoria(dominante, secundario, arquetipoCategoria) → string | null`** (§7.5; D3). Igual que dominante → texto «coincide»; distinto de ambos → texto «se sale»; igual que el secundario → `null` (no se muestra nada, D3). `arquetipoCategoria` ausente o vacío → `null`.

**`esCategoriaSaturada(dominante, arquetipoCategoria) → boolean`** (§10; D4). `true` solo si `arquetipoCategoria === dominante`. Con la categoría ausente o igual al secundario, `false`.

**`ORDEN_SECCIONES`**: array con los 16 ids de §8 en su orden: `dominante, secundario, frase, queEs, paraQueSirve, tension, puede, noDebe, contexto, sombra, voz, paleta, notaFundador, notaCategoria, descarga, cierre`. El aviso del Héroe no tiene id propio: se pinta dentro del elemento `paraQueSirve`, justo a continuación de su texto (D8).

**`ORDEN_SECCIONES_ALERTA`** (nuevo, Cambio 1, C1): array con los 6 ids de la pantalla de alerta en su orden: `mensaje, explicacion, arquetipos, desglose, descarga, cierre`. Como en `ORDEN_SECCIONES`, `descarga` es solo un id de posición: el resultado no lleva ningún campo de datos con ese nombre.

**`parrafosAlerta(codigos) → [ { codigo, nombre, texto } ]`** (nueva, pura, Cambio 1, C2). Para cada código de la lista, en el mismo orden, devuelve `nombre = ARQUETIPOS[codigo].nombre` y `texto = TEXTOS.alerta.arquetipos[codigo]`. Un código desconocido lanza un error (nunca ocurre: viene de `rankingDiscriminante`).

**`componerResultado(calculo, contexto) → Resultado`**. `contexto = { modo, clientes_vulnerables, restriccion_normativa, consecuencias_graves, arquetipo_categoria }`.

Sin alerta:
```js
{
  alerta: false,
  dominante:  { codigo, nombre, color, porcentaje },
  secundario: { codigo, nombre, color, porcentaje },
  frase, queEs, paraQueSirve,
  aviso: null | string,            // texto del Héroe solo si dominante === 'HE'; con HE secundario, null (D8)
  tension: null | { titulo, cuerpo, cierre },
  puede: [4 textos], noDebe: [3 textos],
  contexto: null | { encabezado, bloques, cierre },
  sombra, voz: [3],
  paleta: { acento: colorDominante, complemento: colorSecundario, fondo: '#FFFFFF', texto: '#000000' },
  notaFundador: null | string,     // string solo si contexto.modo === 'fundador'
  notaCategoria: null | string,    // null también si la categoría coincide con el secundario (D3)
  cierre
}
```

Con alerta (§6 l. 427–441; D5; **Cambio 1: C1 a C4, que sustituyen a D6**). Se muestra **en lugar** del resultado normal y lleva, en el orden de `ORDEN_SECCIONES_ALERTA`, mensaje, explicación, un párrafo por cada uno de los tres arquetipos nombrados, desglose, botón de descarga y cierre:
```js
{
  alerta: true,
  mensaje: { titulo, cuerpo, pie },   // §6 l. 433–437 (literal); en cuerpo, {a}, {b}, {c} = nombre de §3 de los tres primeros de rankingDiscriminante
  explicacion,                         // Cambio 1: TEXTOS.alerta.explicacion (PROVISIONAL, 10.3)
  arquetipos: [ { codigo, nombre, texto }, /* ×3, mismo orden que el desglose */ ],   // Cambio 1: parrafosAlerta(tres primeros de rankingDiscriminante)
  desglose: [ { codigo, nombre, discriminante }, /* ×3, en el orden de rankingDiscriminante */ ],
  cierre                               // §8 elemento 16
}
```
Sin `notaFundador` (aunque el modo sea fundador) y sin ningún otro elemento del resultado normal (frase, tensión, listas, contexto, paleta, notas). Lectura adoptada: la nota de provisionalidad de §4 l. 70 forma parte del resultado normal (§8 elemento 13), que la alerta sustituye; el Cambio 1 lo deja escrito en la spec (10.3). El botón de descarga sí forma parte de la alerta (C1). El desglose muestra nombre y `discriminante` (no `total`) de los tres (D5).

Regla de la paleta (§8 l. 751 y §3 l. 53): el color del arquetipo es contenido del resultado; nunca se usa en la interfaz. La pantalla de alerta no usa colores de arquetipo.

### 4.3 `envio.js`

- `CLAVES_HOJA`: array de las 23 claves de 3.7.
- `construirCarga({ datos, respuestas, libres, calculo, resultado, ahora }) → Record<string, string|number>`. Devuelve un objeto con **exactamente** `CLAVES_HOJA` como claves (ninguna de más ni de menos), con los formatos de 3.7. `arquetipo_categoria = respuestas.P35 ?? ''` y `categoria_saturada = textoSiNo(esCategoriaSaturada(calculo.dominante, respuestas.P35))`. `sector = datos.sector` (identificador de D10). `ahora` es un `Date` inyectable para pruebas. Si el valor de un campo de texto empieza por `=`, `+`, `-` o `@`, se antepone `'` para que Sheets no lo interprete como fórmula; verificar el comportamiento con la hoja real en la validación. Los campos nuevos del resultado de alerta (`explicacion`, `arquetipos`) **no** se envían (C4).
- `enviar(carga) → void`:
  ```js
  if (URL_APPS_SCRIPT === 'PENDIENTE') return;
  fetch(URL_APPS_SCRIPT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(carga)
  }).catch(() => {});
  ```
  Nunca `application/json` (§9 l. 766, regla 3 de `CLAUDE.md`). No se espera la respuesta. Un fallo síncrono de `fetch` también se captura con `try/catch`. `envio.js` no toca el DOM ni `localStorage` en el nivel superior del módulo, para poder importarlo desde Node.

## 5. Casos límite

### 5.1 Empates (§6 l. 425; D12)
- Empate en cualquier posición por `total` (primera, segunda o tercera) → más marcas «MÁS» del bloque 3 → orden alfabético del nombre. Ejemplo: solo P4 a P7 con `INDEPENDENCIA` deja IN, SA y EX en 8: dominante EX, secundario IN, tercero SA (Explorador, Inocente, Sabio).
- Empate en `discriminante` al elegir d1, d2, d3: misma regla, y se usa para nombrar, explicar y desglosar los tres en la alerta (D5, C1).
- Empate exacto p1 = p2 → 50 % y 50 %.
- Los arquetipos con puntuación negativa se ordenan por su valor real (sin recortar); el recorte a 0 solo se aplica al calcular porcentajes.

### 5.2 Puntuaciones negativas
- `total` va de −10 a +26 (§6 l. 423). Ejemplo del mínimo: un arquetipo con 4 «MENOS» (−8) y elegido en el bloque 4 (−2).
- Un `p2` negativo se convierte en 0 para el porcentaje: si p1 = 10 y p2 = −3 → 100 % y 0 %. Es coherente con la spec, aunque el secundario mostrado tendría 0 %; la regla de salida «un dominante y, como mucho, un secundario» (§1 l. 18) no obliga a ocultarlo. No inventar otra cosa.
- Los porcentajes se muestran y se envían recortados; `puntuaciones_*` se envían sin recortar.

### 5.3 Alerta con puntuación discriminante
- La alerta usa `discriminante`, no `total`. Cuadrante ganador claro (ancla igual para 3 arquetipos) pero comportamiento bien definido → no salta. Cuadrante ganador claro con comportamiento plano → salta (§6 l. 409).
- Límites: `d3 == d2 - 2` → salta (`>=`); `d3 == d2 - 3` → no salta por esa condición. Proporción exactamente 55 % (por ejemplo d1 = 11, d2 = 9) → **no** salta (`<`, no `<=`).
- Discriminantes negativas o cero: `d1 <= 0` o `d1 + d2 <= 0` tras recortar → alerta, sin dividir.
- Pantalla de alerta (D5, Cambio 1): mensaje con los nombres de los tres primeros por `discriminante`, explicación corta, un párrafo por cada uno de esos tres, desglose con su nombre y su `discriminante`, botón de descarga y cierre. Nada más: ni nota de modo fundador ni ningún otro elemento del resultado normal. Los casos límite propios de la pantalla de alerta están en 10.5.
- Si hay alerta, se guardan y envían igualmente `arquetipo_dominante`, `secundario`, `tercero` (por `total`) y `alerta_sin_definir = sí`; la pantalla no los presenta como resultado. Los tres nombrados en pantalla (por `discriminante`) pueden no coincidir con esos tres: es esperado, porque cada ranking usa su puntuación (§6 l. 406–407).
- `tension_dominante_secundario` y `categoria_saturada` se calculan siempre, con o sin alerta.

### 5.4 Divisiones por cero
- Con respuestas **completas** no ocurre: la suma de los `total` es al menos 12 (bloque 3) − 6 (bloque 4) + 12 (bloque 5) + 24 (ancla) = 42, así que `p1 >= 4`; y la suma de los `discriminante` es al menos 18, lo que impide `d1 + d2 <= 0`.
- Con respuestas parciales o vacías (pruebas, progreso corrupto) sí puede pasar; la guarda de 4.1 lo cubre. `calcular({})` → alerta `true`, porcentajes `null`, envío con esas columnas vacías. La pantalla de alerta se compone igualmente (con `rankingDiscriminante` todo a 0, los tres primeros son Amante, Bufón y Creador por orden alfabético).

### 5.5 Modo fundador
- No cambia el cálculo: `calcular` no recibe el modo. Solo cambia el texto mostrado (P4–P6, P8, P10–P15, P17, P18, P39 y la nota del bloque 6) y se añade la nota 7.4 al resultado normal.
- Si la pregunta no tiene variante (`fundador: null`), se muestra la de marca.
- El modo se elige antes que nada. Cambiar de modo estando a medias (al retomar) solo cambia enunciados, no invalida respuestas, porque se guardan códigos.
- En pantalla de alerta con modo fundador no se muestra la nota 7.4 (C1; antes D6). Los textos de la alerta son idénticos en ambos modos.

### 5.6 Sector «Otro»
- Se muestra un campo de texto, obligatorio si el sector es «Otro» (D11). `sector_otro` se envía solo si el sector es «Otro»; con otro sector se envía vacío aunque el usuario hubiera escrito algo antes de cambiar de opción (limpiar el campo al cambiar de sector). El valor de `sector` en ese caso es `otro` (D10).
- El sector nunca entra en `calcular` (§2 principio 7). Prueba obligatoria. Tampoco modifica ningún texto de la alerta.

### 5.7 Bloques sin respuesta y obligatoriedad (D11)
- **Obligatorios:** modo, nombre, marca, email, sector (y el texto si es «Otro») y P1 a P35. Los campos de texto se consideran vacíos si solo contienen espacios (se recortan). La interfaz no deja avanzar sin ellos y, en el bloque 3, exige `mas` y `menos` distintos (§5 l. 166).
- **Opcionales:** P36 a P43 y los campos libres de cada bloque. Se puede avanzar sin escribir nada; el bloque 8 puede completarse vacío.
- El motor tolera huecos: una pregunta ausente aporta 0. Con las obligatorias respondidas, el motor recibe siempre P4 a P35 completas.
- Un campo libre o una abierta vacía no se guarda ni se envía.

### 5.8 Bloque 3 (doble selección)
- Marcar una opción como «Más» cuando ya era «Menos» la convierte en «Más» y deja libre el «Menos» (no se permiten dos marcas en la misma opción).
- Con 4 opciones, «más» y «menos» son 2 de 4; las otras 2 suman 0.

### 5.9 Barajado
- Se baraja cada pregunta con opciones (bloques 2 a 5 y P35) en cada carga. El orden se mantiene en memoria durante la sesión (para que no salte al volver atrás) pero no se guarda. Al retomar se rebaraja; no pasa nada porque las respuestas guardan códigos.
- Escala del bloque 6, sí/no y lista de sectores no se barajan.

### 5.10 Almacenamiento y envío
- `localStorage` bloqueado o lleno: todo dentro de `try/catch`; la app funciona sin guardar (§9 l. 764).
- Progreso guardado con `version` distinta o JSON inválido: se descarta y se empieza de cero.
- `localStorage` se limpia solo **después** de renderizar el resultado (o la alerta) y de haber lanzado `enviar` (§9 l. 767). Se envía una sola vez por finalización (guarda contra doble clic en «Ver resultado»).
- El envío fallido no muestra nada (§9 l. 766).
- Al recargar la pantalla de resultado, el progreso ya está borrado y se empieza de cero (la spec no pide conservar resultados).

### 5.11 Datos de entrada
- Email: validación de formato básica en cliente (presencia de `@` y punto); no hay más reglas en la spec.
- Texto libre con saltos de línea o el carácter `|`: se envía tal cual; el separador ` | ` de `campos_libres` y `respuestas_abiertas` es solo legible, no se vuelve a parsear.

### 5.12 Descarga por impresión (D7; ampliada por C1)
- El botón (elemento 15 de §8 y quinto elemento de la pantalla de alerta) llama a `window.print()`. No hay librerías ni generación de archivos.
- `@media print` en `estilos.css`: se oculta la barra de progreso, el propio botón y cualquier control de navegación; el resultado ocupa el ancho de la página; los colores de arquetipo se conservan con `print-color-adjust: exact` (y `-webkit-print-color-adjust: exact`); se evitan cortes de página dentro de una sección (`break-inside: avoid`). Desde el Cambio 1 esas reglas cubren también los bloques de la alerta (mensaje, explicación, párrafos de arquetipo y filas del desglose).
- En la pantalla de alerta el botón existe (C1; sustituye a D6, que lo excluía). Lleva su propia etiqueta (`UI.descargarAlerta`, PROVISIONAL) porque en la alerta no hay «ficha» que descargar (ver sección 11).
- Si `window.print` no existe, el botón no hace nada visible y no lanza error.

### 5.13 Aviso del Héroe (D8)
- Se muestra solo si el dominante es HE, inmediatamente después de «Para qué sirve» y antes de la tensión (elemento 6 de §8), con la etiqueta «Aviso importante:».
- Con HE como secundario o tercero no se muestra. El resto de arquetipos no lo tienen (`aviso: null`).
- No aparece en la alerta: los párrafos de la alerta no reutilizan `ficha.aviso` (C2).

## 6. Casos de prueba

Todas usan `node:test` y `node:assert/strict`. Importan desde `../src/...`.

### 6.1 Caso «Al Objetivo» (consultora Mago con Hombre común)

Sector «Servicios profesionales (consultoría, asesoría, coaching)» (`servicios_profesionales`), modo marca, categoría dominada por el Sabio.

Respuestas (`respuestas`; los códigos guardados, no ids de opción):

```js
const alObjetivo = {
  P1: false, P2: false, P3: false,
  P4: 'MAESTRIA', P5: 'MAESTRIA', P6: 'PERTENENCIA', P7: 'MAESTRIA',
  P8:  { mas: 'SA', menos: 'IN' },  P9:  { mas: 'EX', menos: 'GO' },
  P10: { mas: 'AM', menos: 'SA' },  P11: { mas: 'HC', menos: 'HE' },
  P12: { mas: 'MA', menos: 'GO' },  P13: { mas: 'MA', menos: 'CR' },
  P14: { mas: 'HC', menos: 'AM' },  P15: { mas: 'HC', menos: 'CU' },
  P16: { mas: 'BU', menos: 'CR' },  P17: { mas: 'MA', menos: 'AM' },
  P18: { mas: 'CU', menos: 'RE' },  P19: { mas: 'MA', menos: 'EX' },
  P20: 'SA', P21: 'HE', P22: 'EX',
  P23: 'GO', P24: 'CU', P25: 'SA', P26: 'IN', P27: 'MA', P28: 'AM',
  P29: 1, P30: 3, P31: 3, P32: 2, P33: 5, P34: 4,
  P35: 'SA'
};
```

Resultado esperado de `calcular(alObjetivo)` (cálculos comprobados a mano):

| Código | IN | SA | EX | HE | RE | MA | HC | AM | BU | CU | CR | GO |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| discriminante | 3 | 1 | −1 | −4 | −2 | 17 | 12 | 2 | 3 | 3 | −2 | −2 |
| ancla | 0 | 0 | 0 | 6 | 6 | 6 | 2 | 2 | 2 | 0 | 0 | 0 |
| total | 3 | 1 | −1 | 2 | 4 | 23 | 14 | 4 | 5 | 3 | −2 | −2 |
| marcasMas | 0 | 1 | 1 | 0 | 0 | 4 | 3 | 1 | 1 | 1 | 0 | 0 |

- `dominante = 'MA'`, `secundario = 'HC'`, `tercero = 'BU'`.
- `porcentajeDominante = 62` (23/37 = 62,16), `porcentajeSecundario = 38`.
- `alerta = false`: `d1 = 17`, `d2 = 12`, `d3 = 3`; `3 >= 10` es falso y `17/29 = 58,6 %` no es menor que 55.
- `tension = true` (MA–HC está en la lista de §7.2).
- `componerResultado(calculo, { modo: 'marca', clientes_vulnerables: false, restriccion_normativa: false, consecuencias_graves: false, arquetipo_categoria: 'SA' })`:
  - `frase === 'Tu marca cambia la manera en que ves tu negocio, hablando como quien habla con un vecino.'` (es el ejemplo literal de §7.1 l. 455).
  - `tension.cuerpo` contiene «El Mago quiere transformar la realidad y El Hombre común quiere pertenecer y conectar.» (D2).
  - `aviso === null` (el dominante no es HE).
  - `contexto === null`; `notaFundador === null`.
  - `notaCategoria` = texto «Tu arquetipo se sale de lo que hace tu categoría…» (la categoría SA no es MA ni HC).
  - `paleta.acento === '#2E7D8C'`, `paleta.complemento === '#8B7355'`.
  - Sin claves `explicacion` ni `arquetipos` (son exclusivas de la alerta; Cambio 1).
- Variantes:
  - Con `clientes_vulnerables: true`: `contexto.bloques.length === 1`, con `general` de vulnerables y `matiz` de MA («Cuidado con el lenguaje de transformación espectacular…»); `cierre === null`.
  - Con `modo: 'fundador'` (mismo `calcular`): totales idénticos; `notaFundador` = texto 7.4.
  - En la carga: `sector === 'servicios_profesionales'`, `arquetipo_categoria === 'SA'` y `categoria_saturada === 'no'`.

### 6.2 `tests/puntuacion.test.js`

1. **Pesos del bloque 2 aislados.** Solo `{P4:'ESTABILIDAD'}` → `ancla` +2 en CU, CR, GO, 0 en el resto y `discriminante` todo 0. Cuatro respuestas `MAESTRIA` → +8 en HE, RE, MA.
2. **Pesos del bloque 3.** Solo `{P8:{mas:'IN', menos:'SA'}}` → IN +3, SA −2, HE y CU 0; `marcasMas.IN === 1`. Con `mas === menos` la pregunta se ignora.
3. **Pesos del bloque 4.** `{P20:'GO'}` → GO −2, resto 0.
4. **Pesos del bloque 5.** `{P23:'RE'}` → RE +2, resto 0.
5. **Pesos del bloque 6.** Con P29 (izquierda HC, IN; derecha GO, SA): posición 1 → HC +2, IN +2; 2 → HC +1, IN +1; 3 → todo 0; 4 → GO +1, SA +1; 5 → GO +2, SA +2. Repetir con P34 (izquierda EX, BU; derecha AM, MA) para comprobar que lee la tabla de datos y no valores fijos.
6. **Bloques 1 y 7 no cambian nada.** Misma entrada base variando solo P1 a P3, P35 y P36 a P43 (y añadiendo un sector en `datos`): `calcular` da objetos profundamente iguales.
7. **El sector no interviene.** `calcular(respuestas, …)` ignora cualquier segundo argumento o clave `datos`; con respuestas idénticas el resultado no cambia.
8. **Suma de rango.** Con todas las respuestas de `alObjetivo`, la suma de los 12 `total` es 54 (30 discriminante + 24 ancla). Con el mejor caso posible (todo «MÁS» al mismo arquetipo con las 4 apariciones y demás máximos) el máximo es 26 y con el peor, −10.
9. **Alerta que salta con cuadrante claro.** `{P4..P7:'MAESTRIA', P23:'GO', P24:'CU', P25:'SA'}`: `total` HE=RE=MA=8; `discriminante` GO=CU=SA=2, el resto 0 → `d3 (2) >= d2 (2) - 2` → `alerta === true` aunque el ancla favorezca a un cuadrante. Además, dominante `HE`, secundario `MA`, tercero `RE` (desempate alfabético: Héroe, Mago, Rebelde). `rankingDiscriminante.slice(0, 3)` es `['CU','GO','SA']` (Cuidador, Gobernante, Sabio; empate resuelto alfabéticamente).
10. **Alerta que no salta.** `alObjetivo` → `alerta === false` con ancla igual para HE, RE, MA.
11. **Límites de la alerta con `detectarAlerta` sobre mapas.** `d = (10, 9, 6)` → no salta por la condición 1 (6 < 7) pero sí por la 3 (10/19 = 52,6 %); `d = (11, 9, 6)` → **no** salta (55 % exacto, d3 = 6 < 7); `d = (12, 9, 7)` → salta (7 >= 7); `d = (12, 9, 6)` → no salta (57,1 %, 6 < 7).
12. **Discriminantes negativas.** `d = (−1, −3, −5)` → salta sin lanzar error; `d = (5, −4, −9)` → recorta `d2` a 0 → 100 % → no salta por la proporción (y `−9 >= −6` es falso).
13. **Empate en el primero por «MÁS».** `ordenarArquetipos({IN:5, SA:5, …0}, {IN:0, SA:1})` → SA antes que IN.
14. **Empate persistente: alfabético.** Mismos totales y mismas marcas → IN antes que SA (Inocente < Sabio); `calcular` con solo P4 a P7 = `INDEPENDENCIA` → EX, IN, SA.
15. **Empate en segunda y tercera posición (D12).** `ordenarArquetipos({MA:10, HE:6, RE:6, CU:6, …0}, {HE:0, RE:2, CU:1})` → MA, RE, CU, HE (más «MÁS» primero en la segunda posición). Con marcas iguales → MA, CU, HE, RE (alfabético: Cuidador, Héroe, Rebelde). `calcular` devuelve `secundario` y `tercero` según ese orden.
16. **Orden alfabético completo.** Con 12 puntuaciones y 12 marcas iguales, el resultado sigue exactamente Amante, Bufón, Creador, Cuidador, Explorador, Gobernante, Héroe, Hombre común, Inocente, Mago, Rebelde, Sabio (BU antes de CR, HE antes de HC).
17. **División por cero.** `calcular({})` no lanza; `alerta === true`; `porcentajeDominante === null`. `calcularPorcentajes(0, 0)` y `(−3, 0)` → `null` en ambos.
18. **Porcentajes.** `(23, 14)` → `62 / 38`; `(10, 10)` → `50 / 50`; `(10, −3)` → `100 / 0`; `(5, 3)` → `63 / 37` (62,5 redondea a 63); `(29, 11)` → `73 / 27` (72,5 → 73, comprobando que no hay error de coma flotante).
19. **Tensiones.** Los 6 pares en ambos órdenes → `true`; `IN–SA`, `GO–CU`, `MA–MA` y `HC–BU` → `false`.
20. **Modo.** No hay parámetro de modo; una prueba comprueba que `calcular.length === 1`.

`puntuacion.test.js` no cambia con el Cambio 1: el cálculo no se toca.

### 6.3 `tests/datos.test.js`

1. 43 preguntas con ids `P1` a `P43` únicos, y distribución por bloque 3, 4, 12, 3, 6, 6, 3, 6.
2. **Tabla del bloque 3 desde los datos** (§2 principio 6, §5 l. 168): (a) cada arquetipo aparece exactamente 4 veces; (b) ninguna pareja aparece más de 2 veces (conteo de las 6 parejas por pregunta, 72 en total); (c) las 12 parejas intracuadrante aparecen al menos una vez (se generan desde `MOTIVACIONES`). Además, que cada pregunta del bloque 3 tenga 4 opciones con códigos distintos y que coincidan con la tabla de §5 l. 170–183 (fijada como constante en la prueba, para que un cambio accidental en datos falle).
3. Bloque 4: los 12 arquetipos aparecen exactamente una vez entre P20 a P22. Bloque 5: exactamente una vez entre P23 a P28. Bloque 6: cada arquetipo aparece exactamente dos veces entre `izquierda.codigos` y `derecha.codigos`.
4. Bloque 2: cada pregunta tiene las 4 motivaciones una vez, con las claves `INDEPENDENCIA`, `MAESTRIA`, `PERTENENCIA`, `ESTABILIDAD`.
5. Todo código de opción o escala es un código válido; toda clave de motivación es válida; no hay opciones con texto vacío.
6. Variantes de modo fundador: `fundador` es no `null` exactamente en P4, P5, P6, P8, P10, P11, P12, P13, P14, P15, P17, P18 y P39. Las opciones de bloque 2 y 3 no dependen del modo (no viven dentro de `enunciado`).
7. Lista de sectores: 21 elementos; el último es «Otro» con `requiereTexto`; los textos son los de §5 l. 84–105.
8. **Identificadores de sector (D10).** Los 21 `id` son únicos, cumplen `/^[a-z]+(_[a-z]+)*$/` (minúsculas, guion bajo, sin tildes, sin paréntesis ni comas), el primero es `servicios_profesionales` y el último es `otro`.
9. Colores (regla 4 de `CLAUDE.md`, §3 l. 53): los 12 son `#RRGGBB` distintos y ninguno está en `{#FFFFFF, #000000, #D8851F, #3D391F, #1A2B32}`; coinciden con la tabla de §3.
10. Fichas: los 12 tienen `queEs`, `paraQueSirve`, `promesa`, `manera`, `sombra` y `deseoCentral` no vacíos, `puede.length === 4`, `noDebe.length === 3`, `voz.length === 3`; cada motivación agrupa exactamente 3 arquetipos; `aviso` no es `null` solo en HE (D8) y empieza por «el héroe es el cliente».
11. `TEXTOS.contexto`: matices presentes en las claves de §7.3: vulnerables (BU, RE, HE, MA, EX), normativa (HE, MA, GO, RE, AM, BU; AM y BU con el mismo texto), graves (IN, BU, EX, HC, CR). `TEXTOS.notaCategoria` tiene solo las claves `coincideDominante` y `distinta` (D3).
12. **P35 (D1).** 12 opciones, una por arquetipo (12 códigos distintos), sin nombres de arquetipo en el texto y sin textos vacíos. La de SA es exactamente «Explican mucho y se posicionan como los que más saben» y no está marcada `provisional`; las otras 11 tienen `provisional === true`. Al aprobarse los borradores se quitan las marcas y se ajusta esta prueba.
13. `barajar`: devuelve una permutación (mismos elementos), no muta la entrada, y **cada opción conserva su `codigo`** al barajar (regla 5). Con `aleatorio` inyectado es determinista.
14. **Textos de la alerta (Cambio 1, C1 a C3; prueba nueva).**
    - `TEXTOS.alerta` tiene exactamente las claves `titulo`, `cuerpo`, `pie`, `explicacion` y `arquetipos`. `titulo`, `cuerpo` y `pie` siguen siendo literales de §6 (l. 433–437; `cuerpo` conserva `{a}`, `{b}`, `{c}`).
    - `explicacion` es una cadena no vacía de como mucho 300 caracteres, sin dígitos, sin `%` y sin marcadores `{…}` (C3: corta, sin porcentajes ni puntuaciones internas).
    - `TEXTOS.alerta.arquetipos` tiene exactamente las 12 claves de `ORDEN_CODIGOS`. Cada texto: no vacío, de como mucho 300 caracteres, sin dígitos ni `{…}`, **empieza por `ARQUETIPOS[codigo].nombre`** y **contiene el `deseoCentral` del arquetipo con la inicial en minúscula** (garantiza que se apoya en §3 y no inventa el deseo). Ejemplo: IN empieza por «El Inocente» y contiene «sencillez y seguridad».
    - Ningún texto de `arquetipos` contiene el nombre de otro arquetipo (evita mezclar fichas).

### 6.4 `tests/resultado.test.js`

1. **Frase combinada.** Las 132 combinaciones ordenadas (12 × 11) devuelven un texto que empieza por «Tu marca », termina en «.» y contiene la `promesa` del dominante y la `manera` del secundario. Ejemplo literal MA + HC (ver 6.1). `fraseCombinada('IN','IN')` lanza.
2. **Tensión (D2).** Los 6 pares, en ambos órdenes, devuelven `{ titulo, cuerpo, cierre }` donde `cuerpo` contiene `«{nombre del dominante} quiere {deseoCentral del dominante con inicial en minúscula} y {nombre del secundario} quiere {deseoCentral del secundario con inicial en minúscula}»`, con el dominante primero. Ejemplos literales: SA dominante y BU secundario → «El Sabio quiere comprender la verdad y El Bufón quiere disfrutar el momento»; BU dominante y SA secundario → «El Bufón quiere disfrutar el momento y El Sabio quiere comprender la verdad»; MA y HC → ver 6.1. No queda ningún marcador `{…}` sin sustituir. Un par no tensionado devuelve `null`.
3. **Contexto 7.3.**
   - Sin condiciones → `null`.
   - Solo `clientes_vulnerables` con dominante BU → 1 bloque, `matiz` de BU, `cierre === null`.
   - Con dominante IN (sin matiz para vulnerables) → `matiz === null`, se muestra el `general`.
   - `restriccion_normativa` con dominante AM y con BU → mismo texto de matiz.
   - `consecuencias_graves` con dominante HC → matiz de HC.
   - Dos condiciones → `cierre` es el texto «Tu actividad acumula varias de estas condiciones…»; tres condiciones → lo mismo.
   - El matiz depende del **dominante**, no del secundario.
   - El orden de los bloques es vulnerables, normativa, graves.
4. **Nota de modo fundador.** `modo: 'fundador'` → texto 7.4; `modo: 'marca'` → `null`.
5. **Nota de categoría (D3).** Igual al dominante → texto de coincidencia; distinta de ambos → texto «se sale»; igual al secundario → `null`; sin categoría (ausente o `''`) → `null`.
6. **`esCategoriaSaturada` (D4).** Categoría igual al dominante → `true`; igual al secundario → `false`; distinta de ambos → `false`; ausente → `false`.
7. **Paleta y colores.** `paleta.acento` = color del dominante, `complemento` = color del secundario, `fondo` `#FFFFFF`, `texto` `#000000`.
8. **Orden §8.** `ORDEN_SECCIONES` es exactamente la lista de 16 elementos de 4.2, en el orden de §8 l. 740–755.
9. **Aviso del Héroe (D8).** Con HE dominante, `aviso` es el texto de la ficha de HE; con HE secundario (por ejemplo MA dominante y HE secundario) o tercero, `aviso === null`; con cualquier otro dominante, `null`.
10. **Alerta (D5, Cambio 1; prueba modificada).** Con la fixture de 6.2.9 (alerta, llamada `respuestasAlerta`): `componerResultado` devuelve `alerta: true` con las únicas claves `alerta`, `arquetipos`, `cierre`, `desglose`, `explicacion` y `mensaje` (antes eran cuatro; ahora seis); no incluye `frase`, `puede`, `noDebe`, `notaFundador` ni ningún campo de descarga, tampoco con `modo: 'fundador'`. `mensaje.cuerpo` contiene «El Cuidador, El Gobernante y El Sabio» (sin marcadores `{a}`, `{b}`, `{c}`). `desglose` tiene 3 elementos, `[{ codigo:'CU', nombre:'El Cuidador', discriminante:2 }, { codigo:'GO', nombre:'El Gobernante', discriminante:2 }, { codigo:'SA', nombre:'El Sabio', discriminante:2 }]`, sin campo `total`. `cierre` es el texto de §8 elemento 16.
11. **Caso «Al Objetivo»** completo (6.1).
12. El resultado no incluye las respuestas abiertas de los bloques 7 y 8 (§8 l. 757).
13. **Explicación de la alerta (Cambio 1; nueva).** Con `respuestasAlerta`, en modo `marca` y en modo `fundador`: `explicacion === TEXTOS.alerta.explicacion` (mismo texto en ambos modos y para cualquier causa de alerta).
14. **Párrafos de la alerta (Cambio 1; nueva).** Con `respuestasAlerta`: `arquetipos` tiene 3 elementos; sus `codigo` son `['CU','GO','SA']`, iguales y en el mismo orden que los de `desglose` y que los tres nombres de `mensaje.cuerpo`; cada elemento es `{ codigo, nombre, texto }` con `nombre = ARQUETIPOS[codigo].nombre` y `texto = TEXTOS.alerta.arquetipos[codigo]`. Sin `total` ni `color` en ningún elemento.
15. **Los tres párrafos siguen a `rankingDiscriminante`, no a `total` (Cambio 1; nueva).** Fixture `alertaPorEstabilidad = { P4:'ESTABILIDAD', P5:'ESTABILIDAD', P6:'ESTABILIDAD', P7:'ESTABILIDAD', P26:'IN', P27:'MA', P28:'AM' }`: `discriminante` AM=IN=MA=2 y resto 0, `alerta === true`; `ranking.slice(0,3)` es `['CR','CU','GO']` (por `total`) pero `arquetipos.map(a => a.codigo)` es `['AM','IN','MA']` (Amante, Inocente, Mago, por `discriminante` con desempate alfabético). Los tres párrafos son los de AM, IN y MA.
16. **`ORDEN_SECCIONES_ALERTA` (Cambio 1; nueva).** Es exactamente `['mensaje','explicacion','arquetipos','desglose','descarga','cierre']`. Las claves de datos del resultado de alerta son ese orden sin `descarga` (comprobar que cada id distinto de `descarga` existe como clave del resultado).
17. **`parrafosAlerta` (Cambio 1; nueva).** `parrafosAlerta(['CU','GO','SA'])` devuelve 3 elementos en ese orden; con un código desconocido lanza. `parrafosAlerta([])` devuelve `[]`.
18. **La alerta no contamina el resultado normal (Cambio 1; nueva).** El resultado de «Al Objetivo» no tiene las claves `explicacion`, `arquetipos`, `mensaje` ni `desglose`.
19. **`calcular({})` compone la alerta sin error (Cambio 1; nueva).** `componerResultado(calcular({}), sinCondiciones)` devuelve `alerta: true` con `arquetipos` de Amante, Bufón y Creador (`['AM','BU','CR']`) y el desglose con `discriminante: 0` en los tres.

### 6.5 `tests/envio.test.js`

1. `CLAVES_HOJA` tiene 23 claves en el orden de §10 y **coincide con el array `COLUMNAS` de `docs/apps-script.gs`** (la prueba lee el archivo y extrae el array con una expresión regular). Una clave mal escrita llegaría vacía sin error (skill `envio-resultados`).
2. `construirCarga(alObjetivo…)` devuelve exactamente esas 23 claves (`Object.keys` igual, sin extras) y los valores de 3.7.
3. Los sí/no salen como `'sí'`/`'no'` (con tilde); `sector_otro` es `''` con un sector distinto de «Otro» y el texto con `sector: 'otro'`.
4. `sector` sale como identificador de D10 (`'servicios_profesionales'` en «Al Objetivo»), nunca como el texto largo de la lista.
5. `arquetipo_dominante`, `arquetipo_secundario`, `arquetipo_tercero` y `arquetipo_categoria` salen como códigos de dos letras (D9); sin P35, `arquetipo_categoria` es `''`.
6. `categoria_saturada` (D4): `'sí'` con P35 igual al dominante; `'no'` con P35 igual al secundario, distinto de ambos o ausente.
7. `puntuaciones_totales` y `puntuaciones_discriminantes` contienen 12 pares `CODIGO=valor` en `ORDEN_CODIGOS`.
8. `campos_libres` y `respuestas_abiertas`: solo entradas con texto; vacío si no hay ninguna (P36 a P43 son opcionales, D11).
9. Con `calcular({})`: `porcentaje_dominante` y `porcentaje_secundario` salen `''`.
10. Un valor que empieza por `=` sale con `'` delante (nombre, marca, email, `sector_otro`).
11. `enviar` con `globalThis.fetch` sustituido por un espía: se llama una vez, con `method: 'POST'`, `headers['Content-Type'] === 'text/plain;charset=utf-8'` (ninguna cabecera contiene `application/json`) y cuerpo `JSON.stringify(carga)`.
12. `enviar` no lanza si `fetch` devuelve una promesa rechazada ni si lanza síncronamente.
13. `URL_APPS_SCRIPT` es exactamente `https://script.google.com/macros/s/AKfycbz6j99B4irmmeFJbqub6H2LAr7vYh7rUxJ17Ljzq593Oj4_ZgXmOvE04YJSZfOAdCWylw/exec`.
14. **La carga no cambia con la alerta (Cambio 1, C4; nueva).** Con `respuestasAlerta` y el `resultado` de alerta ya compuesto (con `explicacion` y `arquetipos`): `construirCarga` devuelve exactamente las mismas 23 claves; `alerta_sin_definir === 'sí'`; `arquetipo_dominante === 'HE'`, `arquetipo_secundario === 'MA'`, `arquetipo_tercero === 'RE'` (por `total`, ver 6.2.9); y ningún valor de la carga contiene texto de `TEXTOS.alerta.explicacion` ni de los párrafos.

### 6.6 Comprobaciones manuales (las hace el validador, no son `node --test`)
Se anotan aquí porque la interfaz no se prueba en Node:
- Bloque 3 en móvil de 360 px: dos botones por opción («Más me describe», «Menos me describe», skill `marca-al-objetivo`), no se puede marcar la misma opción con ambos, no avanza sin ambas marcas.
- Obligatorios (D11): no se avanza sin modo, nombre, marca, email, sector (ni con «Otro» sin texto) ni sin responder P1 a P35; sí se avanza con P36 a P43 y campos libres vacíos.
- Recargar a mitad: aparece «Continuar donde lo dejaste» / «Empezar de nuevo»; con `localStorage` bloqueado la app sigue funcionando.
- El orden de las opciones cambia entre cargas y las respuestas se puntúan bien.
- Barra de progreso con el nombre del bloque actual.
- Envío real de la fila de «Al Objetivo» a la hoja: las 23 columnas rellenas y en su sitio, con `sector` como identificador y los arquetipos como códigos.
- Resultado de «Al Objetivo»: orden de secciones de §8, colores de arquetipo distintos de los de interfaz, texto legible sobre el color del Inocente `#F0E6D2` (texto oscuro).
- Resultado con Héroe dominante: el «Aviso importante» aparece justo después de «Para qué sirve»; con Héroe secundario no aparece.
- **Pantalla de alerta (Cambio 1; sustituye a la comprobación anterior).** Responder de forma plana en el bloque 3 hasta que salte. Comprobar, en este orden: mensaje con los tres nombres; explicación corta; tres párrafos, uno por cada nombre del mensaje y en el mismo orden; desglose con nombre y discriminante de los tres; botón de descarga; cierre. Sin nota de fundador (probar también en modo fundador, con los mismos textos que en modo marca) y sin ningún elemento del resultado normal. En 360 px se lee sin scroll horizontal y el botón es táctil (≥ 44 px). La explicación no muestra porcentajes ni puntos.
- Descarga (D7, ampliada por C1): el botón abre el diálogo de impresión tanto en el resultado normal como en la alerta; en la vista previa se ven los colores de arquetipo (resultado normal), no aparecen la barra de progreso ni el botón, no se corta a mitad un párrafo de arquetipo de la alerta y se puede guardar como PDF.

## 7. Decisiones sobre las dudas

Decisiones tomadas para las 12 dudas que tenía el plan. Son vinculantes para la implementación; el resto del documento ya las refleja. El Cambio 1 (sección 10) sustituye a D6.

**D1. Textos de P35.** La spec solo da el del Sabio (§5 l. 361–362). Decisión: el implementador redacta 11 borradores de las opciones restantes, marcados `PROVISIONAL` en el código (`provisional: true` y comentario) y listados en `handoff/02-implementacion.md` para revisión. Se aplica en 3.2 (`lista-arquetipo`), prueba 6.3.12 y paso 3 de la sección 8.

**D2. Variables de la tensión.** Decisión: `[X]` e `[Y]` salen de la columna «Deseo central» de §3, con la primera letra en minúscula. Ejemplo: «El Sabio quiere comprender la verdad y El Bufón quiere disfrutar el momento». Se aplica en 3.3 (`deseoCentral`, `TEXTOS.tension`), en `textoTension` (4.2) y en la prueba 6.4.2.

**D3. Nota de categoría cuando coincide con el secundario.** Decisión: `notaCategoria` es `null`; no se muestra nada. Se aplica en `notaCategoria` (4.2), en el tipo del resultado y en la prueba 6.4.5.

**D4. `categoria_saturada`.** Decisión: vale «sí» solo si `arquetipo_categoria` coincide con el dominante; en cualquier otro caso «no». Se aplica en `esCategoriaSaturada` (4.2), en 3.7 y 4.3 y en las pruebas 6.4.6 y 6.5.6.

**D5. Arquetipos nombrados en la alerta y desglose.** Decisión: los tres primeros por `discriminante` (`rankingDiscriminante`); el desglose muestra el nombre y el `discriminante` de esos tres. Se aplica en `calcular` (4.1), en el objeto de alerta (4.2) y en las pruebas 6.2.9 y 6.4.10. Desde el Cambio 1, esos mismos tres son también los de los párrafos explicativos (C1).

**D6. Elementos de la pantalla de alerta. SUSTITUIDA por C1 (Cambio 1).** Decisión original: mensaje, desglose y cierre; sin nota de modo fundador y sin botón de descarga. Ahora: mensaje, explicación, párrafos, desglose, botón de descarga y cierre; sigue sin nota de modo fundador. Se aplica en el objeto de alerta (4.2), en 5.3, 5.5 y 5.12 y en las pruebas 6.4.10, 6.4.13 a 6.4.19 y 6.6.

**D7. Descarga de la ficha.** Decisión: el botón llama a `window.print()`, con estilos de impresión (`@media print`) para guardar como PDF, sin dependencias. Se aplica en `estilos.css` e `interfaz.js` (sección 2) y en 5.12. Desde el Cambio 1 el botón está también en la pantalla de alerta.

**D8. Aviso importante del Héroe.** Decisión: se muestra justo después de «Para qué sirve», solo si HE es dominante; si HE es secundario no se muestra. Se aplica en `ficha.aviso` (3.3), en `componerResultado` (4.2), en 5.13 y en las pruebas 6.3.10 y 6.4.9.

**D9. Arquetipos en la hoja.** Decisión: los cuatro campos (`arquetipo_dominante`, `arquetipo_secundario`, `arquetipo_tercero`, `arquetipo_categoria`) llevan el código de dos letras, por ejemplo `MA`. Se aplica en 3.7 y en la prueba 6.5.5.

**D10. Valor de `sector` en la hoja.** Decisión: identificador en minúsculas con guion bajo, sin tildes ni paréntesis (por ejemplo `servicios_profesionales`, `otro`). El implementador los define en `cuestionario.js` y los lista en `handoff/02-implementacion.md`. Se aplica en 3.2 (`SECTORES`), 3.7 y en las pruebas 6.3.8 y 6.5.4.

**D11. Campos obligatorios.** Decisión: obligatorios modo, nombre, marca, email, sector (y el texto si es «Otro») y P1 a P35; opcionales P36 a P43 y los campos libres. Se aplica en 5.6, 5.7 y en el paso 8 de la sección 8.

**D12. Desempate en segunda y tercera posición.** Decisión: la misma regla que en el primer puesto (más «MÁS»; si persiste, orden alfabético del nombre). Se aplica en `ordenarArquetipos` (4.1), en 5.1 y en la prueba 6.2.15.

## 8. Orden de implementación

Cada paso termina con su comprobación. No se avanza si `npm test` (`node --test tests/`) falla. Los pasos 1 a 9 ya están hechos (commit `6e33591`); el Cambio 1 se implementa después, en el paso 10.

1. **`src/js/config.js`.** Crear con la URL de 3.6. Comprobación: la prueba 6.5.13 (se escribe en el paso 7; aquí solo se revisa a ojo).
2. **`src/data/arquetipos.js`.** Transcribir las 12 fichas, colores, motivaciones, tensiones y textos de resultado, literales (referencias de línea en 3.3). Tensión con marcadores de nombre y de deseo central (D2); `notaCategoria` solo con las claves `coincideDominante` y `distinta` (D3); `aviso` solo en HE (D8). Comprobación: `tests/datos.test.js` puntos 9, 10 y 11.
3. **`src/data/cuestionario.js`.** Transcribir bloques, preguntas, opciones, variantes (tabla 3.2), sectores con su identificador (D10) y textos del bloque 6. Redactar los 11 borradores de P35 con `provisional: true` (D1). Comprobación: `tests/datos.test.js` puntos 1 a 8 y 12. Anotar borradores e identificadores para `handoff/02-implementacion.md`.
4. **`src/js/utilidades.js` y `tests/datos.test.js` completo.** Comprobación: la tabla del bloque 3 cumple sus tres condiciones (ya verificado a mano al planificar: 4 apariciones por arquetipo, máximo 2 por pareja, las 12 parejas intracuadrante cubiertas).
5. **`src/js/puntuacion.js` y `tests/puntuacion.test.js`.** Implementar 4.1, con el desempate de D12 en todas las posiciones. Comprobación: el caso «Al Objetivo» da exactamente la tabla de 6.1.
6. **`src/js/resultado.js` y `tests/resultado.test.js`.** Implementar 4.2: tensión con deseo central (D2), nota de categoría nula si coincide con el secundario (D3), `esCategoriaSaturada` (D4), aviso del Héroe (D8) y pantalla de alerta (D5; la versión con explicación y párrafos es el Cambio 1, paso 10). Comprobación: la frase de MA + HC es literal a §7.1.
7. **`src/js/envio.js` y `tests/envio.test.js`.** Implementar 4.3 con códigos de arquetipo (D9), sector como identificador (D10) y `categoria_saturada` (D4). Comprobación: `CLAVES_HOJA` igual a `COLUMNAS` de `docs/apps-script.gs`.
8. **`src/index.html`, `src/css/estilos.css`, `src/js/interfaz.js`.**
   - Flujo: retomar o empezar → modo → datos (nombre, marca, email, sector y texto si Otro) → bloques 1 a 8 → resultado o alerta. Una pregunta por pantalla en móvil; campo libre opcional al final de cada bloque 1 a 8 (no en datos iniciales).
   - Obligatoriedad (D11): modo, nombre, marca, email, sector (y texto si Otro) y P1 a P35 bloquean el avance si faltan; P36 a P43 y campos libres no.
   - Barra de progreso con «Bloque N de 8: nombre» (nombres de 3.2) además del porcentaje.
   - Bloque 3: por opción, botones «Más me describe» y «Menos me describe» (skill `marca-al-objetivo`); no permite el mismo en ambas; exige las dos marcas.
   - Bloque 6: encabezado obligatorio de §6 l. 339–341 y, en modo fundador, la nota de l. 343; escala 1 a 5 con etiquetas en los extremos, con el `name` de radio por pregunta y teclado.
   - Guardado en cada cambio (`try/catch`), clave `alobjetivo-quiz-progreso`; oferta de retomar.
   - Al finalizar: `calcular` → `componerResultado` → render → `construirCarga` + `enviar` → limpiar `localStorage`. Render normal en el orden de `ORDEN_SECCIONES`, con el aviso del Héroe tras «Para qué sirve» solo si HE es dominante (D8). Render de alerta: en el orden de `ORDEN_SECCIONES_ALERTA` (Cambio 1).
   - Botón de descarga: `window.print()`, con `@media print` en `estilos.css` (D7, 5.12), en el resultado normal y en la alerta (Cambio 1).
   - Texto de contraste sobre el color del arquetipo por luminancia (el Inocente `#F0E6D2` lleva texto oscuro).
   - Los textos de interfaz que no dicta la spec (botones, bienvenida, etiquetas del campo libre, mensajes de campo obligatorio) son texto funcional, en español de España, de tú, sin emojis, y se listan en `handoff/02-implementacion.md` para que Elizabeth los revise. No se presentan como texto de la spec.
   - El resultado no muestra P36 a P43 (§8 l. 757).
9. **Cierre.** Ejecutar `npm test`; abrir `src/index.html` con un servidor estático local (los módulos ES no cargan desde `file://`) y recorrer las comprobaciones de 6.6; escribir `handoff/02-implementacion.md` con qué se hizo, los 11 borradores de P35 marcados PROVISIONAL, los 21 identificadores de sector y los textos de interfaz provisionales.
10. **Cambio 1: pantalla de alerta.** Se ejecuta sobre lo ya implementado, en el orden de 10.6 (datos y su prueba, `resultado.js` y sus pruebas, fixtures y prueba de envío, interfaz, estilos, validación manual y actualización de `handoff/02-implementacion.md`). No requiere que la spec ya esté editada: los textos de 10.3 se implementan como PROVISIONAL y se pasan a la spec cuando Elizabeth los apruebe.

## 9. Trazabilidad spec → archivos

| Spec | Se implementa en |
|---|---|
| §1, §3 (motivaciones, códigos, colores) | `data/arquetipos.js` |
| §4 (modos) | `data/cuestionario.js` (`PREGUNTA_MODO`, variantes), `interfaz.js` (selección), `resultado.js` (nota 7.4; ausente en la alerta) |
| §5 datos iniciales y sectores | `data/cuestionario.js`, `interfaz.js` |
| §5 bloques 1 a 8 | `data/cuestionario.js` |
| §6 puntuación y alerta | `js/puntuacion.js` (cálculo), `js/resultado.js` (pantalla de alerta), `data/arquetipos.js` (mensaje, explicación y párrafos), `js/interfaz.js` (render de la alerta) |
| §7.1 a 7.5 | `data/arquetipos.js` (textos), `js/resultado.js` (composición) |
| §7.6 fichas | `data/arquetipos.js` |
| §7.7 textos de la alerta (propuesto, Cambio 1) | `data/arquetipos.js` (`TEXTOS.alerta.explicacion` y `TEXTOS.alerta.arquetipos`), `js/resultado.js` (`parrafosAlerta`) |
| §8 orden de resultado | `js/resultado.js` (`ORDEN_SECCIONES`), `js/interfaz.js` (render), `css/estilos.css` (impresión) |
| §8 orden de la pantalla de alerta (propuesto, Cambio 1) | `js/resultado.js` (`ORDEN_SECCIONES_ALERTA`), `js/interfaz.js` (render), `css/estilos.css` |
| §9 requisitos técnicos | `js/interfaz.js` (móvil, progreso, `localStorage`), `js/envio.js` (POST `text/plain`), `css/estilos.css` (impresión) |
| §10 columnas | `js/envio.js` (`CLAVES_HOJA`, `construirCarga`); sin cambios por el Cambio 1 |
| §11, §12 | Sin efecto en el código |

## 10. Cambio 1: pantalla de alerta

### 10.1 Qué cambia y por qué

Hasta ahora la pantalla de alerta (resultado sin definir) mostraba el mensaje de §6, el desglose de los tres y el cierre (D5, D6). Un cliente que no conoce los doce arquetipos ve tres nombres («El Cuidador, El Gobernante y El Sabio») sin saber qué significan ni por qué el resultado no le da un dominante. El cambio añade, sin tocar el cálculo ni el envío, lo necesario para que la pantalla se entienda por sí sola y se pueda llevar a la sesión en papel o PDF.

Decisiones tomadas (vinculantes para esta implementación; D6 queda sustituida):

- **C1. Contenido y orden.** La pantalla de alerta lleva, en este orden: (1) mensaje, (2) explicación corta de por qué el resultado no es concluyente, (3) un párrafo breve por cada uno de los tres arquetipos nombrados en la alerta, (4) desglose (nombre y discriminante de esos tres), (5) botón de descarga que abre `window.print()` con estilos de impresión, (6) cierre. Sigue sin llevar la nota de modo fundador. Los «tres nombrados» son, como en D5, los tres primeros de `rankingDiscriminante`.
- **C2. Párrafos de arquetipo.** Se apoyan solo en el contenido que ya existe en la spec para cada arquetipo: el «Qué es» de §7.6 y el «Deseo central» de §3. No añaden rasgos nuevos. Van marcados PROVISIONAL para revisión de Elizabeth.
- **C3. Explicación.** Corta, en español de España, de tú, sin tecnicismos ni porcentajes de puntuación interna. Es un único texto fijo (no depende del modo, de la causa de la alerta ni de los arquetipos). PROVISIONAL.
- **C4. El envío no cambia.** Las 23 columnas, su formato y su contenido son los mismos con o sin alerta. Los textos nuevos no se envían.

Nota sobre C3: el desglose sigue mostrando la puntuación discriminante de cada arquetipo (D5, ya decidido). C3 solo afecta a la explicación.

### 10.2 Apartados de `docs/especificacion.md` que cambian

| Apartado de la spec | Cambio | Texto propuesto |
|---|---|---|
| §4 (l. 70, lista «Qué cambia en modo fundador») | Aclarar que la nota de provisionalidad no aparece en la alerta | 10.3.A |
| §6, subsección «Alerta de marca sin definir» (l. 427–441) | Sustituir la frase «Debajo, mostrar igualmente el desglose de los tres.» por la definición completa de la pantalla (qué tres arquetipos, qué elementos, en qué orden, qué no lleva, que el envío no cambia). El mensaje literal y la nota de umbrales no se tocan | 10.3.B |
| §7.4 (l. 526–528) | Añadir que la nota no se muestra en la alerta | 10.3.C |
| §7, nueva subsección **7.7** al final de §7 (tras la ficha del Gobernante, l. 734) | Textos nuevos de la alerta: explicación y 12 párrafos | 10.3.D |
| §8 (tras l. 757) y elemento 15 (l. 754) | Añadir el orden de la pantalla de alerta y precisar el botón | 10.3.E |
| §9 (l. 761–767) | Añadir el requisito de la descarga por impresión (D7, que la spec aún no recoge) | 10.3.F |
| §10 | **Sin cambios** (C4) | — |
| §11 punto 7 (l. 815) | **Sin cambios** | — |
| §1, §2, §3, §5, §7.1 a 7.3, §7.5, §7.6, §12 | Sin cambios | — |

### 10.3 Texto propuesto para la especificación (listo para pegar)

Convención: todo lo que sigue es redacción nueva, no literal de la spec, y por tanto está marcado **PROVISIONAL** hasta que lo revise Elizabeth. La marca `[PROVISIONAL]` es de revisión: **se quita al pegar** cada texto en la spec cuando se apruebe. Los bloques entre líneas `----- pegar desde aquí -----` y `----- hasta aquí -----` son el texto exacto; lo demás es indicación.

#### 10.3.A — §4, línea 70

Sustituir la línea `- Resultado: añade la nota de provisionalidad.` por:

```
----- pegar desde aquí -----
- Resultado: añade la nota de provisionalidad. No se muestra en la pantalla de alerta (§6).
----- hasta aquí -----
```
[PROVISIONAL]

#### 10.3.B — §6, subsección «Alerta de marca sin definir»

Sustituir la línea `Debajo, mostrar igualmente el desglose de los tres.` (l. 439) por el bloque siguiente. El encabezado de la subsección, las dos condiciones, el mensaje en cita y la nota «Umbrales provisionales» quedan como están.

```
----- pegar desde aquí -----
[X], [Y] y [Z] son los tres arquetipos con mayor `puntuacion_discriminante`, con el mismo desempate que el resto de posiciones (más marcas «la que MÁS» en el bloque 3; si persiste, orden alfabético del nombre). No tienen por qué coincidir con el dominante, el secundario y el tercero del resultado normal, que se ordenan por `puntuacion_total`.

La pantalla de alerta lleva, en este orden:

1. El mensaje anterior.
2. Una explicación corta de por qué el resultado no es concluyente (7.7).
3. Para cada uno de [X], [Y] y [Z], un párrafo breve que explica qué es ese arquetipo y qué quiere (7.7).
4. El desglose de los tres: nombre y `puntuacion_discriminante` de cada uno.
5. El botón de descarga (§9).
6. El cierre (§8, elemento 16).

No lleva la nota de modo fundador (7.4) ni ningún otro elemento del resultado normal (§8). El envío de datos (§10) es el mismo con alerta y sin ella: se guardan y envían dominante, secundario y tercero por `puntuacion_total`, y `alerta_sin_definir = sí`.
----- hasta aquí -----
[PROVISIONAL]

#### 10.3.C — §7.4, al final de la sección

Añadir tras la cita de la nota:

```
----- pegar desde aquí -----
La nota no se muestra en la pantalla de alerta (§6).
----- hasta aquí -----
```
[PROVISIONAL]

#### 10.3.D — §7, nueva subsección 7.7 (al final de §7, antes de «## 8.»)

```
----- pegar desde aquí -----
### 7.7 — Textos de la pantalla de alerta

Se muestran solo cuando salta la alerta (§6), en el orden que define §6. Son los mismos en modo marca y en modo fundador.

#### Explicación

> No hay un resultado concluyente porque, en tus respuestas, ningún carácter se separa lo bastante de los demás. Si eligiéramos uno como el principal, estaríamos adivinando. Lo que sí podemos decirte es cuáles son los tres que más pesan, para que veas entre cuáles tienes que decidir.

#### Los tres arquetipos

Un párrafo por cada arquetipo nombrado en la alerta, en el mismo orden que el mensaje y el desglose. Cada párrafo sale de la ficha del arquetipo: el «Qué es» de 7.6 y el «Deseo central» de §3. No añade rasgos nuevos.

- **IN.** El Inocente cree que las cosas no tienen por qué ser complicadas: quita capas, jerga y letra pequeña hasta que el cliente entiende. Lo que quiere es sencillez y seguridad.
- **SA.** El Sabio no hace por ti: te ayuda a entender el porqué de cada decisión para que decidas con tu propio criterio. Lo que quiere es comprender la verdad.
- **EX.** El Explorador se mueve antes que los demás: prueba, descarta y comparte el camino mientras lo recorre. Lo que quiere es libertad para descubrir.
- **HE.** El Héroe cree que el esfuerzo bien dirigido da resultados, y lo organiza todo alrededor de conseguirlos: objetivos, medición, logro. Lo que quiere es demostrar valía con logros.
- **RE.** El Rebelde señala lo que no funciona, aunque incomode: existe contra una práctica del sector o una creencia que todos aceptan sin discutir. Lo que quiere es cambiar lo que no funciona.
- **MA.** El Mago cambia la situación de raíz, no la mejora un poco: trabaja sobre la forma en que el cliente ve su propio problema. Lo que quiere es transformar la realidad.
- **HC.** El Hombre común trata a todo el mundo de igual a igual, sin ponerse por encima ni hacer de gurú: el cliente se reconoce en él. Lo que quiere es pertenecer y conectar.
- **AM.** El Amante cuida cómo se siente el cliente en cada punto del recorrido, no solo el resultado final: el detalle, la estética y la experiencia. Lo que quiere es conexión e intimidad.
- **BU.** El Bufón quita hierro: usa el humor para que algo difícil se haga llevadero y para que la gente baje la guardia. Lo que quiere es disfrutar el momento.
- **CU.** El Cuidador pone por delante que el cliente esté bien atendido, y eso condiciona qué incluye el servicio, cómo responde y cuánto acompaña. Lo que quiere es proteger a los demás.
- **CR.** El Creador hace cosas que antes no existían y le importa que estén bien hechas: no entrega plantillas, cada trabajo es una pieza. Lo que quiere es crear algo duradero.
- **GO.** El Gobernante pone orden: tiene método y condiciones claras, y no las negocia. Lo que quiere es liderar y ordenar.
----- hasta aquí -----
[PROVISIONAL]

Para el implementador, la correspondencia con el código es: la cita de «Explicación» es `TEXTOS.alerta.explicacion` (sin el `>`); cada viñeta de «Los tres arquetipos» es `TEXTOS.alerta.arquetipos[CODIGO]` (sin el código ni los asteriscos; el texto empieza por «El Inocente», «El Sabio», etc.). Trazabilidad de cada párrafo (comprobable por la prueba 6.3.14):

| Código | «Qué es» (§7.6) en el que se apoya | «Deseo central» (§3) |
|---|---|---|
| IN | «Cree que las cosas no tienen por qué ser complicadas. Su fuerza está en quitar capas: donde otros añaden jerga, requisitos y letra pequeña, el Inocente simplifica hasta que el cliente entiende.» | Sencillez y seguridad |
| SA | «Su valor no es hacer por ti, es que entiendas. Enseña el porqué de cada decisión y entrega criterio» | Comprender la verdad |
| EX | «Se mueve antes que los demás. Prueba, descarta, vuelve a probar, y comparte el camino mientras lo recorre.» | Libertad para descubrir |
| HE | «Cree que el esfuerzo bien dirigido da resultados y organiza todo alrededor de conseguirlos: objetivos, medición, logro.» | Demostrar valía con logros |
| RE | «Señala lo que no funciona, aunque sea incómodo. Existe contra algo: una práctica del sector, una creencia instalada, una forma de hacer las cosas que todos aceptan sin discutir.» | Cambiar lo que no funciona |
| MA | «Cambia la situación de raíz, no la mejora un poco. Trabaja sobre la forma en que el cliente ve su propio problema» | Transformar la realidad |
| HC | «Trata a todo el mundo de igual a igual. No se pone por encima ni hace de gurú. […] el cliente se reconoce» | Pertenecer y conectar |
| AM | «Le importa cómo se siente el cliente en cada punto del recorrido, no solo el resultado final. Cuida el detalle, la estética y la experiencia» | Conexión e intimidad |
| BU | «Quita hierro. Usa el humor para que algo difícil se haga llevadero y para que la gente baje la guardia.» | Disfrutar el momento |
| CU | «Su prioridad es que el cliente esté bien atendido, y eso condiciona todas sus decisiones: qué incluye el servicio, cómo responde, cuánto acompaña.» | Proteger a los demás |
| CR | «Hace cosas que antes no existían y le importa que estén bien hechas. No entrega plantillas: cada trabajo es una pieza.» | Crear algo duradero |
| GO | «Pone orden. Tiene método, condiciones claras y no las negocia.» | Liderar y ordenar |

Cada párrafo son dos frases: la primera reformula el «Qué es» en tercera persona y sin jerga; la segunda es «Lo que quiere es» más el deseo central de §3 con la inicial en minúscula (en HE, «demostrar valía con logros», literal de §3, sin añadir «su»). No se usan «Para qué sirve», «Puede», «No debe», «Sombra» ni «Voz», ni el aviso del Héroe.

#### 10.3.E — §8, orden de la pantalla de alerta

Sustituir la línea `15. Botón de descarga de la ficha.` (l. 754) por la primera línea del bloque, y añadir el resto tras la línea «Las respuestas abiertas de los bloques 7 y 8 no se muestran. Solo se guardan.» (l. 757).

```
----- pegar desde aquí (sustituye a la línea 15) -----
15. Botón de descarga de la ficha (§9).
----- hasta aquí -----

----- pegar desde aquí (después de la línea 757) -----
### Pantalla de alerta: orden

Cuando salta la alerta (§6) se muestra esta pantalla en lugar de la anterior:

1. Mensaje «Tu marca todavía no ha elegido un carácter» (§6).
2. Explicación de por qué el resultado no es concluyente (7.7).
3. Un párrafo por cada uno de los tres arquetipos nombrados (7.7).
4. Desglose de los tres: nombre y puntuación discriminante.
5. Botón de descarga (§9).
6. Cierre: «Esto es el punto de partida. Lo afinamos juntas en la sesión.»

Sin nota de modo fundador.
----- hasta aquí -----
```
[PROVISIONAL] (el cierre es literal de la línea 16 de esta misma sección)

#### 10.3.F — §9, requisito de descarga

Añadir como viñeta al final de la lista de requisitos técnicos (tras «Limpiar `localStorage`…», l. 767):

```
----- pegar desde aquí -----
- **Descarga.** El botón de descarga llama a `window.print()`. La hoja de estilos incluye un bloque `@media print` que oculta la barra de progreso, la navegación y el propio botón, conserva los colores de arquetipo y evita cortes de página dentro de una sección. Sin librerías: el usuario guarda como PDF desde el diálogo de impresión. Vale para el resultado y para la pantalla de alerta.
----- hasta aquí -----
```
[PROVISIONAL] (recoge la decisión D7, que hasta ahora no estaba escrita en la spec)

#### 10.3.G — Textos de interfaz nuevos (no van a la spec)

Son texto funcional de la interfaz, en `interfaz.js`, no contenido de la spec. Se listan en `handoff/02-implementacion.md` para revisión.

- `UI.descargarAlerta`: «Descargar resumen» [PROVISIONAL]. En la alerta no hay «ficha» que descargar (ver sección 11).
- `UI.ayudaDescarga` (ya existe): «Se abrirá el diálogo de impresión. Elige «Guardar como PDF» para descargarla.» Se reutiliza sin cambios.
- `UI.desgloseTitulo` (ya existe): «Así se reparten tus respuestas». Sin cambios.

### 10.4 Archivos afectados

Archivos que cambian (6) y archivos que no (verificados):

| Archivo | Cambio |
|---|---|
| `src/data/arquetipos.js` | En `TEXTOS.alerta` (hoy `titulo`, `cuerpo`, `pie`) añadir `explicacion` (cadena de 10.3.D) y `arquetipos` (objeto con las 12 claves de `ORDEN_CODIGOS`, texto de 10.3.D), con comentario `// PROVISIONAL` sobre ambos. `titulo`, `cuerpo` y `pie` no se tocan. |
| `src/js/resultado.js` | Exportar `ORDEN_SECCIONES_ALERTA` y `parrafosAlerta`. Modificar la función interna `resultadoAlerta`: añadir `explicacion` y `arquetipos` al objeto devuelto (ver 4.2). `componerResultado` no cambia de firma. |
| `src/js/interfaz.js` | Importar `ORDEN_SECCIONES_ALERTA`. Reescribir `pintarAlerta(r)` como un mapa de constructores por id, recorrido con `ORDEN_SECCIONES_ALERTA` (igual que `pintarResultado` con `ORDEN_SECCIONES`). Extraer el constructor de `descarga` de `pintarResultado` a una función compartida `seccionDescarga(etiqueta)` (botón `window.print()` protegido con `typeof window.print === 'function'`, más `UI.ayudaDescarga`, dentro de una `section` con clase `no-imprimir`) y usarla en las dos pantallas: `UI.descargar` en el resultado, `UI.descargarAlerta` en la alerta. Añadir `UI.descargarAlerta`. El `h2` del mensaje conserva `tabindex: -1` y `data-foco` (foco al mostrar la pantalla). Cada elemento de la alerta va en su propia `section` (para el `break-inside: avoid` de impresión). |
| `src/css/estilos.css` | Estilos de `.parrafo-arquetipo` y `.explicacion-alerta` (texto legible, separación vertical, solo colores de la paleta de interfaz; ningún color de arquetipo). En `@media print`, añadir `.parrafo-arquetipo`, `.explicacion-alerta` y `.desglose li` a la lista de `break-inside: avoid`. El selector actual `.resultado > section` ya cubre las secciones de la alerta si cada elemento va en su `section`. |
| `tests/datos.test.js` | Añadir la prueba 6.3.14. |
| `tests/resultado.test.js` | Modificar la prueba de alerta (6.4.10: seis claves) y añadir 6.4.13 a 6.4.19. |
| `tests/fixtures.js` | Exportar `respuestasAlerta` (hoy declarada dentro de `resultado.test.js`, la de 6.2.9) y `alertaPorEstabilidad` (6.4.15), para que `envio.test.js` y `resultado.test.js` usen la misma. `resultado.test.js` la importa desde ahí. |
| `tests/envio.test.js` | Añadir la prueba 6.5.14. |

Sin cambios: `src/index.html`, `src/js/puntuacion.js`, `src/js/envio.js`, `src/js/config.js`, `src/js/utilidades.js`, `src/data/cuestionario.js`, `tests/puntuacion.test.js`, `docs/apps-script.gs`, `docs/especificacion.md` (esta última se edita a mano tras la aprobación de Elizabeth, con los textos de 10.3).

### 10.5 Funciones nuevas o modificadas y casos límite

| Función | Estado | Entrada y salida | Reglas |
|---|---|---|---|
| `parrafosAlerta(codigos)` | Nueva, en `resultado.js` (exportada) | `Codigo[] → [{ codigo, nombre, texto }]` | Mismo orden que la entrada. `nombre` de `ARQUETIPOS`; `texto` de `TEXTOS.alerta.arquetipos`. Código desconocido: lanza. Lista vacía: `[]`. Pura. |
| `ORDEN_SECCIONES_ALERTA` | Nueva constante, en `resultado.js` | `['mensaje','explicacion','arquetipos','desglose','descarga','cierre']` | Fuente única del orden de la pantalla (10.3.E). `descarga` no es clave del resultado. |
| `resultadoAlerta(calculo)` | Modificada, interna a `resultado.js` | `Calculo → { alerta:true, mensaje, explicacion, arquetipos, desglose, cierre }` | Toma `[a, b, c] = calculo.rankingDiscriminante.slice(0, 3)`; los tres consumidores (`mensaje.cuerpo`, `arquetipos`, `desglose`) usan esa misma lista, por eso coinciden siempre en nombres y orden. |
| `componerResultado(calculo, contexto)` | Sin cambio de firma | — | Con `calculo.alerta` devuelve el objeto de alerta y **no** lee `contexto.modo` (ni ningún otro campo de `contexto`). |
| `pintarAlerta(r)` | Modificada, en `interfaz.js` | Pinta las 6 secciones en el orden de `ORDEN_SECCIONES_ALERTA` | Sin nota de fundador. Botón con `UI.descargarAlerta`. |
| `seccionDescarga(etiqueta)` | Nueva (extraída de `pintarResultado`), en `interfaz.js`, no exportada | Devuelve el nodo de la sección del botón | `window.print()` solo si existe; la sección lleva `no-imprimir`. |

Casos límite propios del cambio:

- **Empate en discriminante entre los tres nombrados.** El orden de mensaje, párrafos y desglose es el de `rankingDiscriminante` (desempate por marcas «MÁS» y luego alfabético, D12). Ejemplo con `alertaPorEstabilidad`: AM, IN, MA (Amante, Inocente, Mago), aunque el resultado normal ordenaría CR, CU, GO por `total`.
- **Los tres nombrados no coinciden con dominante, secundario y tercero.** Es esperado (5.3). Los párrafos explican los tres de la alerta, nunca los del `total`.
- **Discriminantes negativas o cero entre los tres nombrados** (por ejemplo `calcular({})`, todo a 0, o el caso `d = (−1, −3, −5)` de 6.2.12). La alerta se compone igual: párrafos de los tres primeros (en `calcular({})`: AM, BU, CR) y desglose con sus valores, que pueden ser negativos («−1 punto», «−3 puntos»; la interfaz ya pluraliza por valor absoluto).
- **Modo fundador.** Mismos textos, sin nota 7.4. `componerResultado` no lee el modo en la alerta.
- **Sector «Otro».** No interviene: el sector no modifica ni el cálculo ni los textos.
- **Bloques sin respuesta.** Si faltan respuestas (solo en pruebas o progreso corrupto), la alerta se compone con lo que haya; nunca lanza, porque `rankingDiscriminante` siempre trae 12 códigos válidos.
- **División por cero.** Sin efecto: la alerta no calcula porcentajes; la guarda de 4.1 sigue siendo la del cálculo.
- **Fuera de contexto.** Recargar la pantalla de alerta empieza de cero (5.10). El `localStorage` se limpia tras pintar la alerta y lanzar el envío, como con el resultado normal.
- **Impresión sin `window.print`.** El botón no hace nada visible y no lanza error.
- **Texto largo en móvil.** Los párrafos son cortos (como mucho 300 caracteres, prueba 6.3.14) para no alargar la pantalla; comprobación manual en 360 px (6.6).
- **Colores.** La alerta no usa colores de arquetipo (son contenido del resultado normal, §3 l. 53); solo la paleta de interfaz.

### 10.6 Orden de implementación del cambio (paso 10 de la sección 8)

Cada subpaso termina con `npm test` en verde.

1. **Datos y su prueba.** Escribir primero la prueba 6.3.14 en `tests/datos.test.js` (falla). Añadir `explicacion` y `arquetipos` a `TEXTOS.alerta` en `src/data/arquetipos.js` con los textos exactos de 10.3.D. Comprobación: 6.3.14 en verde.
2. **Fixtures.** Mover `respuestasAlerta` a `tests/fixtures.js` y añadir `alertaPorEstabilidad`. Comprobación: `resultado.test.js` sigue en verde importándola.
3. **`resultado.js` y sus pruebas.** Escribir 6.4.10 (modificada) y 6.4.13 a 6.4.19 (fallan). Implementar `ORDEN_SECCIONES_ALERTA`, `parrafosAlerta` y la ampliación de `resultadoAlerta`. Comprobación: todas en verde y 6.4.11 («Al Objetivo») sin cambios.
4. **Envío.** Añadir 6.5.14 en `tests/envio.test.js`. Debe pasar sin tocar `envio.js` (si falla, el cambio ha roto C4).
5. **`interfaz.js`.** Extraer `seccionDescarga`, añadir `UI.descargarAlerta`, reescribir `pintarAlerta`.
6. **`estilos.css`.** Estilos de los bloques nuevos y ampliación de `@media print` (10.4).
7. **Validación manual y documentación.** Recorrer la comprobación de la alerta y de la descarga de 6.6 (móvil de 360 px y vista previa de impresión). Actualizar `handoff/02-implementacion.md` con: la explicación y los 12 párrafos como PROVISIONAL (para revisión de Elizabeth), la etiqueta `UI.descargarAlerta` y el estado de D6 (sustituida por C1).
8. **Spec.** Cuando Elizabeth apruebe los textos, pegar 10.3.A a 10.3.F en `docs/especificacion.md` (sin la marca `[PROVISIONAL]`) y quitar el comentario `// PROVISIONAL` de `arquetipos.js`. Este paso no lo hace el implementador por su cuenta.

## 11. Dudas abiertas

Una, no bloqueante. Surge de una contradicción menor entre la spec y la decisión C1.

**Duda 1. Etiqueta del botón de descarga en la pantalla de alerta.** §8 elemento 15 llama al botón «Botón de descarga de la ficha», pero la pantalla de alerta no tiene ficha (no hay «Qué es», «Puede», «Sombra»…); lo que se descarga es el resumen de la alerta. Es una contradicción de nombre, no de comportamiento (el botón es el mismo, C1). Pregunta cerrada: ¿qué texto lleva el botón en la alerta?

- **A)** «Descargar resumen» (adoptada provisionalmente en 10.3.G; distingue las dos pantallas).
- **B)** «Descargar ficha» (el mismo que el resultado normal, `UI.descargar`; la spec lo llama «ficha» en todas partes).

No bloquea la implementación: se implementa A y cambiar a B es cambiar una constante de `interfaz.js`. Si se elige B, en 10.3.E el punto 5 de la pantalla de alerta se mantiene igual y se elimina `UI.descargarAlerta`.
