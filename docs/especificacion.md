# Cuestionario de Personalidad de Marca — Al Objetivo

Documento de especificación para el proyecto de Claude Code.

---

## 1. Marco de referencia

Modelo de Carol S. Pearson y Margaret Mark (*The Hero and the Outlaw*, 2001), que aplica al branding el sistema de doce arquetipos que Pearson desarrolló a partir de Jung.

| Motivación | Qué busca | Arquetipos |
|---|---|---|
| **Independencia** | Entender, ser libre, tener criterio propio | Inocente, Sabio, Explorador |
| **Maestría** | Dejar huella mediante habilidad, valor o transformación | Héroe, Rebelde, Mago |
| **Pertenencia** | Conectar con otros y disfrutar el momento | Hombre común, Amante, Bufón |
| **Estabilidad** | Poner orden y estructura en el caos | Cuidador, Creador, Gobernante |

**Regla de salida:** un dominante y, como mucho, un secundario. Nunca tres.

---

## 2. Principios de diseño

1. **Comportamiento, no aspiración.** Preguntar por el ideal produce respuestas halagadoras e inútiles.
2. **Opciones igualadas en deseabilidad.** Si una opción suena mejor que las demás, se elige por eso.
3. **El cuadrante primero, el arquetipo después.**
4. **Lo que no se hace puntúa.** Los bloques 3 (opción "la que menos") y 4 restan.
5. **Formato mixto.** Elección forzada más escalas.
6. **Equilibrio de enfrentamientos.** Ninguna pareja de arquetipos compite más de dos veces en el bloque 3, y todas las parejas del mismo cuadrante compiten al menos una vez.
7. **El sector cambia la interpretación y la expresión, nunca la puntuación.** Si las convenciones de la categoría suman o restan puntos, la herramienta acaba recomendando lo que ya hace todo el mundo y deja de servir para diferenciarse. Las condiciones del sector se recogen, se guardan y se usan para interpretar el resultado, pero no entran en el cálculo.
8. **Orden aleatorio.** Barajar opciones en cada carga. El código viaja con la opción, no con la posición.
9. **Salida de escape.** Campo libre opcional por bloque. No puntúa, se guarda.

---

## 3. Ficha técnica de los 12

| Código | Arquetipo | Motivación | Deseo central | Sombra | Color |
|---|---|---|---|---|---|
| IN | El Inocente | Independencia | Sencillez y seguridad | Negar los problemas | `#F0E6D2` |
| SA | El Sabio | Independencia | Comprender la verdad | Condescendencia, parálisis | `#2C3E50` |
| EX | El Explorador | Independencia | Libertad para descubrir | Dispersión | `#4A5D45` |
| HE | El Héroe | Maestría | Demostrar valía con logros | Agotar al cliente | `#B03A2E` |
| RE | El Rebelde | Maestría | Cambiar lo que no funciona | Provocación vacía | `#1A1A1A` |
| MA | El Mago | Maestría | Transformar la realidad | Manipulación, humo | `#2E7D8C` |
| HC | El Hombre común | Pertenencia | Pertenecer y conectar | Desaparecer entre todos | `#8B7355` |
| AM | El Amante | Pertenencia | Conexión e intimidad | Perder criterio por agradar | `#A64B6B` |
| BU | El Bufón | Pertenencia | Disfrutar el momento | Que no le tomen en serio | `#E8B84B` |
| CU | El Cuidador | Estabilidad | Proteger a los demás | Anularse | `#6B8E7F` |
| CR | El Creador | Estabilidad | Crear algo duradero | Perfeccionismo | `#6B4C93` |
| GO | El Gobernante | Estabilidad | Liderar y ordenar | Distancia con el cliente | `#5B2333` |

**Dos paletas separadas.** La interfaz del cuestionario (fondos, botones, barra de progreso, tipografía) usa los colores de Al Objetivo: `#FFFFFF`, `#000000`, `#D8851F`, `#3D391F` y `#1A2B32`. Los colores de esta tabla son contenido: identifican a cada arquetipo en el resultado y en la paleta sugerida al cliente. Ninguno de los doce debe coincidir con los de Al Objetivo, para que el resultado del cliente no se confunda con la marca que firma la herramienta.

---

## 4. Los dos modos

Primera pregunta del cuestionario:

> **¿En qué punto está tu marca?**
> - Ya está en marcha: tengo clientes y una forma de trabajar rodada → **MODO MARCA**
> - Estoy empezando o construyéndola desde cero → **MODO FUNDADOR**

**Qué cambia en modo fundador**
- Bloque 2: enunciados en intención en vez de en presente.
- Bloque 3: enunciados sustituidos por sus variantes (5.3b). Opciones y códigos idénticos.
- Bloque 6: nota de ayuda para quien aún no conoce bien su sector.
- Bloques 1, 4, 5, 7, 8: sin cambios.
- Resultado: añade la nota de provisionalidad.

**Por qué existe este modo.** El cuestionario mide comportamiento, y una marca que no existe no tiene. Pero sí hay comportamiento disponible: el del fundador. El sistema de Pearson nació como marco de desarrollo personal aplicado a individuos antes de aplicarse a marcas, así que preguntar a la persona es volver al origen, no tomar un atajo. Y hay una razón práctica: la personalidad de marca no se rompe en la home, se rompe en el email de soporte, el aviso de renovación y el proceso de baja. En un negocio pequeño todo eso lo escribe el fundador, y un arquetipo que contradiga su temperamento se cae justo ahí.

---

## 5. Las preguntas

### Datos iniciales

Nombre y apellidos · Nombre de la marca · Email · Modo

**Sector** — lista cerrada, no texto libre:

```
Servicios profesionales (consultoría, asesoría, coaching)
Legal y fiscal
Salud y bienestar
Estética y belleza
Deporte y fitness
Educación y formación
Marketing, publicidad y comunicación
Tecnología y software
Diseño y creatividad
Arquitectura, construcción y reformas
Inmobiliario
Finanzas y seguros
Hostelería y restauración
Turismo y viajes
Comercio minorista y ecommerce
Alimentación
Industria y B2B
Eventos
Servicios a domicilio y oficios
ONG, asociaciones y sector público
Otro (con campo de texto)
```

La lista cerrada permite que, cuando haya suficientes resultados acumulados, se pueda comparar a cada cliente con la media de su sector en vez de con cero. Con el sector en texto libre esa comparación exige limpiar los datos a mano y deja de hacerse.

---

### BLOQUE 1 — Condiciones de tu actividad
*3 preguntas de sí o no. **No puntúan.** Determinan cómo se expresa el arquetipo en el resultado.*

**P1.** ¿Tus clientes suelen llegar a ti en un momento delicado o vulnerable?
→ `clientes_vulnerables`

**P2.** ¿Tu sector tiene límites legales, deontológicos o de colegio profesional sobre cómo se puede comunicar o qué se puede prometer?
→ `restriccion_normativa`

**P3.** ¿Una decisión equivocada en tu servicio tiene consecuencias graves para el cliente (salud, dinero, legalidad, seguridad)?
→ `consecuencias_graves`

> Estas tres preguntas capturan lo que de verdad limita la expresión de una marca, sin necesidad de mantener una lista de reglas por sector que envejece y nunca cubre al siguiente cliente.

---

### BLOQUE 2 — La transformación del cliente
*4 preguntas, elección única. Cada opción suma **+2 a cada uno de los 3 arquetipos** de esa motivación.*

**P4.** ¿Qué cambia en la vida de tu cliente después de trabajar contigo?
*(Fundador: ¿Qué quieres que cambie?)*
- Entiende algo que antes no entendía y gana criterio propio → INDEPENDENCIA
- Consigue algo difícil que antes no lograba → MAESTRÍA
- Deja de sentirse solo en esto → PERTENENCIA
- Su negocio deja de ir a golpe de improvisación → ESTABILIDAD

**P5.** Cuando un cliente te cuenta por qué te eligió, lo que más repite es...
*(Fundador: ¿Por cuál de estas razones te gustaría que te eligieran?)*
- «Nadie me lo había explicado así» → INDEPENDENCIA
- «Contigo por fin lo conseguí» → MAESTRÍA
- «Me sentí cómodo desde el primer minuto» → PERTENENCIA
- «Por fin tengo esto bajo control» → ESTABILIDAD

**P6.** Si tu marca desapareciera mañana, lo que más echarían de menos tus clientes sería...
*(Fundador: Si tu marca nunca llegara a existir, ¿qué se perdería tu cliente?)*
- La claridad con la que les enseñas a mirar las cosas → INDEPENDENCIA
- El empujón para atreverse → MAESTRÍA
- La sensación de estar acompañados → PERTENENCIA
- La tranquilidad de saber que todo está en su sitio → ESTABILIDAD

**P7.** La frase que mejor describe la promesa de tu marca:
- «Aquí vas a entender lo que nadie te ha explicado» → INDEPENDENCIA
- «Aquí vas a conseguir lo que hasta ahora no has conseguido» → MAESTRÍA
- «Aquí vas a encontrar a los tuyos» → PERTENENCIA
- «Aquí vas a dejar de improvisar» → ESTABILIDAD

> *Campo libre opcional.*

---

### BLOQUE 3 — Comportamiento real
*12 preguntas. **Doble selección**: la que MÁS describe y la que MENOS.*
*MÁS = **+3**. MENOS = **−2**. Las otras dos, 0.*

**Interfaz:** dos controles por opción. No permitir marcar la misma como más y menos. Exigir ambas para avanzar.

**Reparto de enfrentamientos.** Cada arquetipo aparece 4 veces. Ninguna pareja coincide más de 2 veces. Las 12 parejas del mismo cuadrante coinciden al menos 1 vez. Cualquier cambio en esta tabla obliga a recalcular las tres condiciones.

| Pregunta | Arquetipos enfrentados |
|---|---|
| P8 | IN · SA · HE · CU |
| P9 | IN · EX · RE · GO |
| P10 | SA · EX · AM · BU |
| P11 | HE · RE · HC · CR |
| P12 | HE · MA · BU · GO |
| P13 | RE · MA · CR · CU |
| P14 | HC · AM · CR · GO |
| P15 | HC · BU · IN · CU |
| P16 | AM · BU · EX · CR |
| P17 | HC · AM · IN · MA |
| P18 | CU · GO · SA · RE |
| P19 | EX · MA · SA · HE |

#### 5.3a — Enunciados MODO MARCA

**P8.** Un cliente te dice que está perdido y no sabe por dónde empezar. Tú...
- Le quito capas hasta que quede una sola cosa que hacer mañana → IN
- Le explico cómo funciona esto para que entienda dónde está → SA
- Le pongo un primer objetivo concreto y empezamos → HE
- Le digo que no pasa nada, que vamos a ir juntos → CU

**P9.** Sale un método nuevo del que todo el mundo habla en tu sector. Tu reacción real es...
- Preguntarme si hace falta de verdad o es complicar por complicar → IN
- Probarlo enseguida, por curiosidad → EX
- Desconfiar del ruido y decirlo en voz alta → RE
- Comprobar si supera a lo que ya uso; si no, sigo con lo mío → GO

**P10.** Tu forma de crear contenido se parece más a...
- Explicar bien cómo funciona algo → SA
- Contar lo que estoy probando ahora mismo → EX
- Cuidar mucho cómo queda, no solo qué dice → AM
- Buscar que se lea con gusto y saque una sonrisa → BU

**P11.** Un cliente te pregunta qué te diferencia. Tu respuesta natural es...
- Que conmigo se consiguen resultados → HE
- Que no te voy a contar lo mismo que los demás → RE
- Que te entiendo porque he estado donde estás → HC
- Que lo que hago no sale de una plantilla → CR

**P12.** Piensa en cómo termina una sesión contigo. El cliente se va...
- Con una tarea clara y ganas de ponerse → HE
- Viendo su situación de otra manera → MA
- De buen humor, con el tema más ligero → BU
- Con la sensación de que ya está decidido y en orden → GO

**P13.** Un cliente te enseña algo suyo que no está bien. ¿Qué haces?
- Se lo digo claramente, sin adornos → RE
- Le enseño que el problema real es otro distinto → MA
- Le propongo rehacerlo bien desde cero → CR
- Le señalo primero lo que sí funciona, y luego lo demás → CU

**P14.** Piensa en tu web o tu perfil tal y como están hoy. ¿Qué transmiten más?
- Que detrás hay una persona normal y accesible → HC
- Que está cuidado hasta el último detalle → AM
- Que tiene un estilo propio, reconocible → CR
- Que sabes lo que haces y no necesitas demostrarlo → GO

**P15.** Un cliente potencial te escribe pidiendo precio, sin más contexto.
- Le contesto como a un conocido y le pregunto qué necesita → HC
- Le respondo con naturalidad y algo de humor → BU
- Le mando el precio sin rodeos: no tengo nada que esconder → IN
- Le pregunto primero por su situación, sin hablar de dinero todavía → CU

**P16.** Si tu marca fuera un lugar físico, sería...
- Un espacio cuidado donde apetece quedarse → AM
- Un sitio donde la gente se ríe mientras trabaja → BU
- Un campamento base, siempre a punto de salir → EX
- Un taller lleno de cosas a medio hacer → CR

**P17.** De todo tu trabajo, lo que más disfrutas es...
- Cuando el cliente dice que por fin alguien le ha entendido → HC
- Cuando algo queda exactamente como debía quedar → AM
- Cuando el cliente dice «ah, ¿pero era esto de simple?» → IN
- Cuando el cliente ve su negocio de otra manera → MA

**P18.** Un cliente te pide algo que tú no harías. ¿Qué haces?
- Le explico mi preocupación y busco que no salga perjudicado → CU
- Mantengo mi criterio: para eso me ha contratado → GO
- Le explico con argumentos por qué no es buena idea → SA
- Le digo directamente que eso es un error → RE

**P19.** ¿Qué es lo que más te motiva de este trabajo?
- Que nunca es igual y siempre hay algo nuevo → EX
- Ver cómo cambia por completo la situación de alguien → MA
- Entender bien cómo funcionan las cosas → SA
- Conseguir lo que parecía que no se podía → HE

#### 5.3b — Enunciados MODO FUNDADOR
*Mismas opciones, mismos códigos. Solo cambia el enunciado.*

| # | Enunciado modo fundador |
|---|---|
| P8 | Alguien cercano te dice que está perdido y no sabe por dónde empezar. Tú... |
| P9 | *(sin cambios)* |
| P10 | Cuando hablas de tu sector o compartes algo profesional, lo que más te sale es... |
| P11 | Alguien te pregunta qué te diferencia de otros que hacen lo mismo. Tu respuesta natural es... |
| P12 | Piensa en cómo termina una conversación profesional contigo. La otra persona se va... |
| P13 | Alguien te enseña algo suyo que no está bien. ¿Qué haces? |
| P14 | Cuando preparas algo para que lo vea otra persona (una propuesta, un perfil), lo que más te importa que transmita es... |
| P15 | En trabajos anteriores, cuando te preguntaban por precio o condiciones sin más contexto, tú... |
| P16 | *(sin cambios)* |
| P17 | De todo lo que has hecho profesionalmente, lo que más has disfrutado es... |
| P18 | Alguien te pide algo que tú no harías. ¿Qué haces? |
| P19 | *(sin cambios)* |

> *Campo libre opcional.*

---

### BLOQUE 4 — Lo que tu marca nunca haría
*3 preguntas, elección única. La opción elegida **resta 2 puntos**. Los 12 arquetipos aparecen una vez.*

**P20.** ¿Qué te daría más vergüenza que hiciera tu marca?
- Sonar ingenua o naíf → −IN
- Sonar sabelotodo y condescendiente → −SA
- Prometer una transformación que no puede garantizar → −MA
- Presumir de estatus o exclusividad → −GO

**P21.** ¿Cuál de estos comportamientos no va contigo en absoluto?
- Ponerse dramática y motivacional → −HE
- Bromear cuando toca ir en serio → −BU
- Hablar de emociones y de belleza → −AM
- Buscar la polémica a propósito → −RE

**P22.** ¿Qué es lo que menos encaja con tu forma de trabajar?
- Cambiar de rumbo y empezar cosas nuevas continuamente → −EX
- Volcarte tanto en el cliente que te olvidas de ti → −CU
- Tratar a todo el mundo igual, sin distinciones → −HC
- Dedicar tiempo a que las cosas queden bonitas → −CR

---

### BLOQUE 5 — Tensiones
*6 preguntas de dos opciones. **+2** al elegido. Cada arquetipo aparece una vez.*

**P23.** Cuando algo funciona pero está anticuado, tu instinto es...
- Protegerlo y mejorarlo desde dentro → GO
- Tirarlo y hacerlo distinto → RE

**P24.** Prefieres que tu cliente salga de una sesión...
- Sintiéndose seguro y protegido → CU
- Sintiéndose con ganas de arriesgar → EX

**P25.** Si tuvieras que elegir, tu contenido debería...
- Enseñar algo → SA
- Entretener → BU

**P26.** Un cliente lo está pasando mal con un objetivo difícil. Prefieres...
- Empujarle a que se supere → HE
- Simplificarle el camino → IN

**P27.** Quieres que tu cliente piense...
- «Esto es distinto a todo lo que he visto» → MA
- «Esto es exactamente para gente como yo» → HC

**P28.** Cuando entregas algo, prefieres que el cliente diga...
- «Qué bien me hace sentir esto» → AM
- «Esto no lo tiene nadie más» → CR

---

### BLOQUE 6 — Voz y tono
*6 escalas de 1 a 5. Cada arquetipo aparece exactamente dos veces.*
*1 = +2 a los dos de la izquierda · 2 = +1 izquierda · 3 = nada · 4 = +1 derecha · 5 = +2 derecha.*

**Encabezado obligatorio del bloque:**

> **Comparado con otras marcas de tu sector**, ¿dónde se sitúa la tuya?
>
> No pienses en términos absolutos. Lo que es formal en un sector es informalísimo en otro; lo que es rompedor en una notaría es lo normal en una agencia creativa. Sitúate respecto a tu competencia, no respecto al mundo.

*(Modo fundador, añadir: «Si todavía no conoces bien tu sector, sitúate respecto a las marcas que consideras tu referencia».)*

| # | Izquierda | | Derecha |
|---|---|---|---|
| P29 | Cercano (HC, IN) | `1—2—3—4—5` | Con autoridad (GO, SA) |
| P30 | Sereno (SA, CU) | `1—2—3—4—5` | Enérgico (HE, RE) |
| P31 | Continuista (GO, CU) | `1—2—3—4—5` | Rompedor (RE, EX) |
| P32 | Sencillo (IN, HC) | `1—2—3—4—5` | Cuidado y sofisticado (AM, CR) |
| P33 | Pies en la tierra (BU, HE) | `1—2—3—4—5` | Visionario (MA, CR) |
| P34 | Espontáneo (EX, BU) | `1—2—3—4—5` | Todo tiene intención (AM, MA) |

> El marco relativo es lo que evita que el resultado recoja las convenciones del sector en lugar del carácter de la marca. Sin él, todos los despachos de abogados se sitúan en el mismo punto de cada escala y el bloque deja de discriminar.

---

### BLOQUE 7 — Tu categoría
*Ambos modos. La primera no puntúa; las otras dos son abiertas.*

**P35.** Piensa en los tres competidores más visibles de tu sector. ¿Cómo se comportan casi todos?
*(Doce opciones, una por arquetipo, descritas en una línea y sin nombrarlos. Ej.: «Explican mucho y se posicionan como los que más saben» → SA)*

> **No puntúa.** Se guarda como `arquetipo_categoria`.
>
> Elegir un arquetipo distinto al que domina tu categoría es la diferenciación más barata que existe. Pero restar puntos automáticamente al saturado corrompería la medición y podría empujar al cliente fuera de un carácter que sí le encaja. Se mide limpio y la decisión estratégica se toma en sesión.

**P36.** ¿Qué es lo que más te cansa de cómo comunica tu sector? *(abierta)*

**P37.** Si un cliente te compara con la opción más obvia de tu sector, ¿en qué quieres que note la diferencia? *(abierta)*

---

### BLOQUE 8 — Abiertas
*No puntúan. Se guardan tal cual.*

**P38.** ¿Qué marca de cualquier sector te gustaría parecerte, y qué es exactamente lo que te gusta de ella?
**P39.** ¿Qué crees que dirían tus tres mejores clientes de ti si no estuvieras delante? *(Fundador: las personas con las que has trabajado)*
**P40.** ¿Qué es lo que más te cuesta comunicar de tu marca?
**P41.** ¿Qué haces tú que tu competencia directa no hace?
**P42.** Si tu marca pudiera decir una sola frase al mundo, ¿cuál sería?
**P43.** ¿Hay algo que hagas en tu negocio y que sepas que no encaja con cómo quieres que se perciba tu marca?

---

## 6. Lógica de puntuación

Se calculan **dos puntuaciones por arquetipo**.

```
puntuacion_discriminante =
    + 3 por cada "la que MÁS" del Bloque 3
    − 2 por cada "la que MENOS" del Bloque 3
    − 2 por cada opción elegida del Bloque 4
    + 2 por cada opción elegida del Bloque 5
    + 1 o 2 según la posición de cada escala del Bloque 6

ancla_cuadrante =
    + 2 por cada respuesta del Bloque 2 cuya motivación contenga el arquetipo

puntuacion_total = puntuacion_discriminante + ancla_cuadrante
```

Los bloques 1 y 7 no intervienen en ningún cálculo.

**Para ordenar y mostrar el resultado se usa `puntuacion_total`.**
**Para decidir si salta la alerta se usa `puntuacion_discriminante`.**

El ancla da el mismo empujón (hasta +8) a los tres arquetipos del cuadrante ganador, así que arrancan empatados entre sí. Si la alerta se calculara sobre el total, una marca con un cuadrante clarísimo y bien definida dentro de él recibiría el aviso de que no ha elegido carácter, que es justo lo contrario de lo que pasa.

```
Antes de calcular porcentajes, llevar a 0 cualquier puntuacion_total negativa.

Ordenar por puntuacion_total:
  dominante  = p1
  secundario = p2
  tercero    = p3

porcentaje_dominante  = round( p1 / (p1 + p2) * 100 )
porcentaje_secundario = 100 − porcentaje_dominante
```

**Rangos esperados** (para depurar): `puntuacion_total` va aproximadamente de −10 a +26. Un arquetipo del cuadrante ganador tiene 8 puntos de ventaja de salida; es intencionado, y el bloque 3 puede darle la vuelta.

**Empate en el primer puesto:** desempatar por número de marcas "la que MÁS" en el bloque 3. Si persiste, por orden alfabético del nombre del arquetipo, para que el resultado sea reproducible.

### Alerta de marca sin definir

Sobre `puntuacion_discriminante`, ordenada de mayor a menor (d1, d2, d3). Se muestra **en lugar** del resultado normal si:
- `d3 >= d2 - 2`, o
- `d1 / (d1 + d2) * 100 < 55`

> **Tu marca todavía no ha elegido un carácter.**
>
> Tus respuestas reparten la personalidad entre [X], [Y] y [Z] casi por igual. Eso no es un fallo del test: significa que tu marca se comporta de formas distintas según el momento, y es justo lo que hace que a tus clientes les cueste reconocerte.
>
> Es el punto de partida más habitual. Lo resolvemos en la sesión.

Debajo, mostrar igualmente el desglose de los tres.

> *Umbrales provisionales. Revisar tras los primeros clientes reales.*

---

## 7. Contenido del resultado

### 7.1 — Regla de combinación

**El dominante aporta el QUÉ. El secundario aporta el CÓMO.**

```
"Tu marca {promesa[dominante]}, {manera[secundario]}."
```

Ejemplo: Mago + Hombre común → *«Tu marca cambia la manera en que ves tu negocio, hablando como quien habla con un vecino.»*

Doce frases de cada tipo cubren las 132 combinaciones sin escribir ninguna a mano.

### 7.2 — Tensión entre dominante y secundario

Si el par coincide con: `GO–RE` · `CU–EX` · `SA–BU` · `HE–IN` · `MA–HC` · `AM–CR`

> **Tu arquetipo dominante y el secundario tiran en direcciones contrarias.**
>
> [Dominante] quiere [X] y [Secundario] quiere [Y]. No es un error del test: muchas marcas viven en esa tensión y algunas construyen ahí su diferencia. Pero hay que decidir cuál manda cuando chocan, porque si no lo decides tú lo decide cada situación, y la marca se lee como inconsistente.
>
> Este es el tema principal de tu sesión.

Nota de rigor: `GO–RE` y `CU–EX` son oposiciones documentadas en el modelo original. Las otras cuatro son tensiones derivadas para este cuestionario, no oposiciones canónicas.

### 7.3 — Cómo se expresa tu arquetipo en tu contexto

Sección generada a partir de las respuestas del bloque 1. Se muestra siempre que haya al menos una condición activa, justo después de los comportamientos prohibidos.

Encabezado:

> **Tu arquetipo no cambia. La forma de expresarlo, sí.**
>
> Por las condiciones de tu actividad, hay matices que conviene que tengas presentes. No son limitaciones de tu personalidad de marca: son las reglas del terreno donde la vas a jugar.

#### Si `clientes_vulnerables = sí`

Texto general:
> Tus clientes llegan en un momento delicado. Eso no te obliga a cambiar de carácter, pero sí a que el tono nunca vaya por delante del estado de la persona que tienes delante. Lo que en otro sector es simpatía, aquí puede leerse como frivolidad.

Matices por arquetipo dominante:
- **BU** — El humor es para aliviar el peso del momento, nunca para bromear sobre la situación del cliente. La diferencia entre las dos cosas es todo tu negocio.
- **RE** — Tu franqueza va dirigida al sector o al problema, nunca a la persona. Un cliente vulnerable no puede distinguir una crítica honesta de un ataque.
- **HE** — Evita el lenguaje de exigencia y superación. El ritmo lo marca el cliente, no el objetivo.
- **MA** — Cuidado con el lenguaje de transformación espectacular. Con clientes vulnerables genera expectativas que luego pesan.
- **EX** — Comparte lo que exploras en tu propio terreno. Con el cliente en este estado, la sensación que necesita es de suelo firme.
- Resto: sin matiz específico. El texto general basta.

#### Si `restriccion_normativa = sí`

Texto general:
> Tu sector pone límites a lo que se puede decir. Revisa cada afirmación pública con tu normativa o tu colegio antes de publicarla. Dentro de esos límites hay más margen del que parece: casi nadie en tu sector lo aprovecha.

Matices por arquetipo dominante:
- **HE** — Nada de promesas de resultados. Si los casos de éxito están permitidos en tu sector, son tu herramienta; si no, habla de proceso y de método.
- **MA** — Nada de transformación garantizada. Tu terreno seguro es reformular el problema, no prometer el desenlace.
- **GO** — Vigila las afirmaciones de exclusividad y las comparaciones directas con competidores: son de lo primero que se sanciona.
- **RE** — Criticar prácticas de tu sector puede tener coste profesional. Hazlo con datos y sobre la práctica, nunca sobre colegas identificables.
- **AM** y **BU** — La estética y el tono casi nunca están regulados. Suelen ser el único margen de diferenciación que queda en sectores muy normativizados, y por eso están casi siempre libres.
- Resto: sin matiz específico.

#### Si `consecuencias_graves = sí`

Texto general:
> Una decisión equivocada en tu servicio le sale cara al cliente. Eso cambia el orden: primero tiene que percibir solvencia, y solo después, personalidad. No renuncies a tu carácter, pero no lo pongas por delante de la competencia técnica.

Matices por arquetipo dominante:
- **IN** — Simplificar no puede llegar a ocultar riesgos. Di siempre lo que puede salir mal; esa es la versión honesta de tu arquetipo.
- **BU** — Humor sí, pero fuera de los puntos de decisión. En el momento en que el cliente elige, el tono baja.
- **EX** — Experimenta en tus procesos, no con el cliente. Lo que le ofreces debe estar probado.
- **HC** — La cercanía no puede sustituir a la demostración de competencia. Necesitas ambas cosas visibles.
- **CR** — La originalidad va en cómo lo resuelves, no en si el resultado es fiable.
- Resto: sin matiz específico.

#### Si hay dos o tres condiciones activas

Añadir al final de la sección:

> Tu actividad acumula varias de estas condiciones. Es el escenario donde más marcas renuncian a tener personalidad y acaban todas iguales: serias, correctas e indistinguibles. Tu oportunidad es exactamente esa. Mantén tu carácter y ajusta solo la expresión; vas a ser de los pocos que lo hagan.

### 7.4 — Nota de MODO FUNDADOR

> Este resultado retrata cómo trabajas tú, que es de donde nace la personalidad de una marca nueva. Es un punto de partida sólido, pero provisional: cuando lleves seis meses con clientes reales, merece la pena repetirlo.

### 7.5 — Nota de categoría

Si `arquetipo_categoria == dominante`:

> Tu arquetipo coincide con el que ya domina tu categoría. No lo invalida, pero te deja dos caminos: ejecutarlo notablemente mejor que ellos, o apoyarte en tu secundario para distinguirte. Lo decidimos en la sesión.

Si `arquetipo_categoria != dominante` y tampoco coincide con el secundario:

> Tu arquetipo se sale de lo que hace tu categoría. Eso es una ventaja de partida: te van a reconocer antes. También significa que al principio vas a parecer raro a algunos clientes. Es el precio normal de diferenciarse y suele durar poco.

### 7.6 — Fichas de los 12

---

#### IN — El Inocente · Independencia

**Qué es.** Cree que las cosas no tienen por qué ser complicadas. Su fuerza está en quitar capas: donde otros añaden jerga, requisitos y letra pequeña, el Inocente simplifica hasta que el cliente entiende. Transmite transparencia sin esfuerzo, porque no tiene nada que esconder.

**Para qué sirve.** Cuando tu cliente llega quemado de complejidad y de promesas infladas. En sectores donde todos suenan técnicos, ser el que habla claro es un posicionamiento entero.

- `promesa`: hace sencillo lo que otros complican
- `manera`: sin complicar nada, con las cartas boca arriba

**Puede:** precios claros sin letra pequeña · explicar el proceso paso a paso · admitir lo que no hace · diseño limpio, sin ruido.
**No debe:** exagerar resultados · usar urgencia o escasez artificial · fingir que un problema difícil es fácil.
**Sombra:** simplificar de menos es honestidad; simplificar de más es ingenuidad, y el cliente lo descubre al chocar con la realidad.
**Voz:** clara, honesta, tranquila.

---

#### SA — El Sabio · Independencia

**Qué es.** Su valor no es hacer por ti, es que entiendas. Enseña el porqué de cada decisión y entrega criterio, no instrucciones. Se apoya en argumentos, no en entusiasmo.

**Para qué sirve.** Cuando el cliente compra confianza en tu criterio y necesita entender antes de decidir. Encaja en servicios caros o de decisión lenta, donde la objeción real es «no sé si esto funciona».

- `promesa`: te da el criterio para decidir por ti mismo
- `manera`: explicando siempre el porqué

**Puede:** contenido formativo profundo · enseñar el método · citar fuentes · reconocer lo que aún no sabe.
**No debe:** recurrir al hype · vender por urgencia · hablar por encima del cliente.
**Sombra:** condescendencia y parálisis. Explicar tanto que nunca se pasa a la acción, o hacer sentir torpe a quien pregunta.
**Voz:** clara, argumentada, serena.

---

#### EX — El Explorador · Independencia

**Qué es.** Se mueve antes que los demás. Prueba, descarta, vuelve a probar, y comparte el camino mientras lo recorre. Su cliente no quiere el mapa oficial: quiere que alguien vaya delante.

**Para qué sirve.** En sectores que cambian rápido, donde lo valioso no es el conocimiento asentado sino saber qué está pasando ahora. Justifica muy bien un servicio de acompañamiento continuo.

- `promesa`: te lleva a sitios donde no habías estado
- `manera`: probando en vez de teorizando

**Puede:** compartir experimentos, incluidos los fallidos · adoptar cosas nuevas pronto · formatos flexibles · hablar en primera persona de lo que ha probado.
**No debe:** prometer estabilidad o certezas · imponer procesos rígidos · posicionarse como autoridad definitiva.
**Sombra:** dispersión. Empezar mucho y terminar poco; el cliente se queda sin saber qué hacer.
**Voz:** curiosa, directa, en movimiento.

---

#### HE — El Héroe · Maestría

**Qué es.** Cree que el esfuerzo bien dirigido da resultados y organiza todo alrededor de conseguirlos: objetivos, medición, logro. Su cliente quiere conseguir algo concreto, no entenderlo mejor.

**Para qué sirve.** Cuando la transformación es medible y el cliente llega con un objetivo claro. Justifica precios altos porque el resultado se demuestra.

**Aviso importante:** el héroe es el cliente, no la marca. La marca es el entrenador. Las marcas Héroe que se colocan en el papel protagonista se vuelven autocomplacientes y dejan de conectar.

- `promesa`: te hace conseguir lo que no conseguías solo
- `manera`: con objetivos concretos y sin rodeos

**Puede:** hablar de resultados y cifras · plantear retos · casos de éxito · lenguaje de progreso.
**No debe:** presumir de sus logros por encima de los del cliente · culpar al cliente por no esforzarse · prometer resultados que no controla.
**Sombra:** agotar. Convertirlo todo en exigencia hasta que la marca se asocia con presión.
**Voz:** firme, motivadora, concreta.

---

#### RE — El Rebelde · Maestría

**Qué es.** Señala lo que no funciona, aunque sea incómodo. Existe contra algo: una práctica del sector, una creencia instalada, una forma de hacer las cosas que todos aceptan sin discutir.

**Para qué sirve.** Para diferenciarte en un sector homogéneo. Es de los pocos arquetipos que convierte una opinión impopular en un activo, y filtra clientes con una eficacia brutal: repele a quien no encaja antes de hacerte perder el tiempo.

- `promesa`: te quita de encima lo que no funciona
- `manera`: diciendo lo que otros callan

**Puede:** criticar prácticas del sector con argumentos · rechazar clientes abiertamente · formatos poco convencionales · tono sin filtro.
**No debe:** pedir perdón por incomodar · provocar sin fondo · acabar haciendo aquello que critica.
**Sombra:** la provocación vacía. Cuando el titular escandaloso sustituye al argumento, dejas de ser Rebelde y pasas a ser ruido.
**Voz:** directa, sin eufemismos, con criterio detrás.

---

#### MA — El Mago · Maestría

**Qué es.** Cambia la situación de raíz, no la mejora un poco. Trabaja sobre la forma en que el cliente ve su propio problema; cuando esa mirada cambia, todo lo demás se recoloca.

**Para qué sirve.** Cuando el cliente cree que su problema es X y en realidad es Y. Justifica el diagnóstico como servicio con entidad propia y convierte la consultoría en algo más que ejecución.

- `promesa`: cambia la manera en que ves tu negocio
- `manera`: sacando a la luz lo que no se veía

**Puede:** reformular el problema del cliente · vender diagnóstico · contenido que descoloca · mostrar el antes y el después de la perspectiva.
**No debe:** prometer magia · esconder el método · usar el misterio como táctica de venta.
**Sombra:** la manipulación. El Mago tiene el poder de cambiar cómo alguien ve las cosas; usado para vender más y no para ayudar, se convierte en humo.
**Voz:** inspiradora, con visión, apoyada en método.

---

#### HC — El Hombre común · Pertenencia

**Qué es.** Trata a todo el mundo de igual a igual. No se pone por encima ni hace de gurú. Su fuerza es que el cliente se reconoce: «esta persona ha estado donde estoy yo».

**Para qué sirve.** Baja la barrera de entrada. Funciona muy bien con clientes intimidados por el sector o escaldados de proveedores distantes.

- `promesa`: te acompaña de igual a igual
- `manera`: hablando como quien habla con un vecino

**Puede:** lenguaje cotidiano · contar los errores propios · responder personalmente · precios sin misterio.
**No debe:** crear categorías VIP · hablar por encima · distanciarse cuando crece.
**Sombra:** desaparecer. Por no destacar, acaba pareciéndose a todos y sin motivo para que la elijan.
**Voz:** cercana, sencilla, sin postureo.

---

#### AM — El Amante · Pertenencia

**Qué es.** Le importa cómo se siente el cliente en cada punto del recorrido, no solo el resultado final. Cuida el detalle, la estética y la experiencia porque entiende que la forma también comunica.

**Para qué sirve.** En categorías donde el producto es parecido y la diferencia está en cómo se vive. Justifica precio premium sin tener que argumentar funcionalidad.

- `promesa`: hace que la experiencia importe tanto como el resultado
- `manera`: cuidando cada detalle del camino

**Puede:** identidad visual muy trabajada · detalles inesperados · lenguaje sensorial · trato personalizado de verdad.
**No debe:** descuidar el fondo por la forma · decir que sí a todo por agradar · tratar a todos igual.
**Sombra:** perder el criterio por gustar. Cuando la necesidad de agradar decide por encima del juicio profesional, el cliente deja de recibir consejo y empieza a recibir complacencia.
**Voz:** cálida, sensorial, cuidada.

---

#### BU — El Bufón · Pertenencia

**Qué es.** Quita hierro. Usa el humor para que algo difícil se haga llevadero y para que la gente baje la guardia. No es falta de rigor: es una decisión sobre el tono.

**Para qué sirve.** En sectores áridos, técnicos o que dan pereza. El humor es la forma más barata que existe de conseguir que alguien preste atención a algo que le aburre.

- `promesa`: hace llevadero lo que da pereza
- `manera`: sin tomarse a sí misma demasiado en serio

**Puede:** humor en cualquier punto de contacto, incluidos los aburridos · formatos ligeros · reírse de sí misma.
**No debe:** bromear sobre el problema del cliente · usar el humor para esquivar una respuesta seria · sacrificar claridad por el chiste.
**Sombra:** que no la tomen en serio. Si todo es broma, nadie te contrata para lo importante.
**Voz:** desenfadada, ágil, con chispa.

---

#### CU — El Cuidador · Estabilidad

**Qué es.** Su prioridad es que el cliente esté bien atendido, y eso condiciona todas sus decisiones: qué incluye el servicio, cómo responde, cuánto acompaña.

**Para qué sirve.** En servicios donde el cliente llega vulnerable, asustado o quemado de intentos anteriores. La retención suele ser muy alta.

- `promesa`: te acompaña para que no estés solo en esto
- `manera`: sin dejarte tirado en ningún momento

**Puede:** soporte generoso · anticiparse a los problemas · tono protector · garantías reales.
**No debe:** hacer sentir culpable al cliente · crear dependencia · sacrificar su propio negocio por servir.
**Sombra:** anularse. Dar de más y cobrar de menos hasta que el negocio deja de ser viable. Es la sombra más frecuente en consultoría y mentoría.
**Voz:** cálida, tranquilizadora, atenta.

---

#### CR — El Creador · Estabilidad

**Qué es.** Hace cosas que antes no existían y le importa que estén bien hechas. No entrega plantillas: cada trabajo es una pieza. El oficio forma parte del producto.

**Para qué sirve.** Cuando el cliente busca algo a medida y valora el criterio propio de quien lo hace. Justifica plazos y precios más altos.

- `promesa`: construye algo que no existía antes
- `manera`: hecho a medida, no con plantilla

**Puede:** enseñar el proceso · identidad propia reconocible · rechazar encargos que no encajan · formatos originales.
**No debe:** repetir fórmulas prefabricadas · entregar sin criterio propio · copiar las referencias del sector.
**Sombra:** el perfeccionismo. No entregar nunca, o retrasar por pulir algo que el cliente ya daba por bueno.
**Voz:** cuidada, con criterio, expresiva.

---

#### GO — El Gobernante · Estabilidad

**Qué es.** Pone orden. Tiene método, condiciones claras y no las negocia. Su cliente no quiere opciones infinitas: quiere que alguien decida con criterio y se haga responsable.

**Para qué sirve.** Con clientes que han sufrido el caos de proveedores desorganizados. Permite sostener precios altos sin justificar cada partida.

- `promesa`: pone orden donde había improvisación
- `manera`: con método y sin negociar el criterio

**Puede:** procesos y condiciones claros · seleccionar clientes · mantener el criterio frente a la presión · presencia cuidada.
**No debe:** humillar al cliente por no saber · ser rígido ante casos legítimos · usar la exclusividad como reclamo vacío.
**Sombra:** la distancia. Tanto criterio y tanto proceso que el cliente deja de sentirse escuchado.
**Voz:** segura, precisa, con autoridad.

---

## 8. Pantalla de resultado: orden

1. Arquetipo dominante, con su color y porcentaje.
2. Arquetipo secundario, con su color y porcentaje.
3. Frase combinada (7.1).
4. Qué es el dominante.
5. Para qué sirve.
6. Aviso de tensión, si aplica (7.2).
7. Qué puede hacer tu marca — los 4 comportamientos licenciados.
8. Qué no debe hacer nunca — los 3 prohibidos. Tan importante como el anterior; no reducir ni suavizar.
9. Cómo se expresa tu arquetipo en tu contexto (7.3), si hay alguna condición activa.
10. Tu sombra — redactada como aviso útil, no como defecto.
11. Tu voz — los tres adjetivos.
12. Paleta sugerida — dominante como acento, secundario como complemento, sobre blanco y negro.
13. Nota de modo fundador, si aplica (7.4).
14. Nota de categoría (7.5).
15. Botón de descarga de la ficha.
16. Cierre: «Esto es el punto de partida. Lo afinamos juntas en la sesión.»

Las respuestas abiertas de los bloques 7 y 8 no se muestran. Solo se guardan.

---

## 9. Requisitos técnicos

- **Mobile first.** Se va a rellenar desde el móvil más de lo que parece. La doble selección del bloque 3 tiene que funcionar con el pulgar.
- **Guardado automático del progreso.** El cuestionario dura entre 15 y 20 minutos y alguien lo va a dejar a medias. Guardar las respuestas en `localStorage` en cada cambio y ofrecer retomar al volver. Envolver en `try/catch`: si el navegador lo bloquea, la página sigue funcionando.
- **Barra de progreso** con bloque actual, no solo porcentaje.
- **Envío** por POST a la URL de Google Apps Script con `Content-Type: text/plain;charset=utf-8` para evitar el preflight de CORS. No usar `application/json`. Fire and forget: la pantalla de resultado se muestra sin esperar respuesta, y si falla no rompe nada visible.
- **Limpiar `localStorage`** solo tras mostrar el resultado, no antes de enviarlo.

---

## 10. Datos que se envían a Google Sheets

```
fecha
nombre
marca
sector                         (código de la lista cerrada)
sector_otro                    (texto libre, solo si sector = Otro)
email
modo                           (marca / fundador)
clientes_vulnerables           (sí / no)
restriccion_normativa          (sí / no)
consecuencias_graves           (sí / no)
arquetipo_dominante
porcentaje_dominante
arquetipo_secundario
porcentaje_secundario
arquetipo_tercero
alerta_sin_definir             (sí / no)
tension_dominante_secundario   (sí / no)
arquetipo_categoria
categoria_saturada             (sí / no)
puntuaciones_totales           (los 12, en texto)
puntuaciones_discriminantes    (los 12, en texto)
campos_libres
respuestas_abiertas
```

Guardar las dos puntuaciones de los doce. En sesión, ver el orden completo dice mucho más que ver la cabeza, y comparar total con discriminante muestra hasta qué punto el resultado se apoya en el cuadrante o en el comportamiento.

El sector en código y las tres condiciones en campos separados permiten, cuando haya volumen suficiente, comparar a cada cliente con la media de su sector en lugar de con cero.

---

## 11. Cómo usar el resultado en sesión

El cuestionario no cierra nada: abre la conversación.

1. **Empieza por el tercero, no por el primero.** Preguntar «¿te sorprende que [tercero] haya quedado tan arriba?» saca más información que confirmar el dominante, que el cliente casi siempre acepta sin pensar.
2. **Lee los campos libres antes de la sesión.** Quien escribió «ninguna encaja» en un bloque te está diciendo dónde el modelo se queda corto para su caso.
3. **Contrasta lo que dice con lo que hace.** Ten abierta su web mientras repasáis el resultado. La distancia entre el arquetipo que sale y el que transmite su web es el trabajo.
4. **Si su arquetipo coincide con el de su categoría,** esa es la conversación principal: o lo ejecuta mucho mejor que su competencia, o construye la diferencia sobre el secundario.
5. **Usa las condiciones del sector para afinar los prohibidos, no para recortar el arquetipo.** La tentación es corregir un resultado que parece impropio de la categoría. Casi siempre es ahí donde está la diferenciación: una funeraria con alma de Bufón, bien entendida, no hace chistes, quita solemnidad y trata a la gente con humanidad en un sector rígido. Corregirlo habría destruido el hallazgo.
6. **Cierra siempre con la lista de prohibidos.** Es lo que el cliente se lleva y lo que protege la personalidad de marca después, cuando alguien le proponga una táctica que no encaja.
7. **Si saltó la alerta,** la sesión entera va de elegir. No intentes salvar el resultado: la indecisión es el diagnóstico.

---

## 12. Nota de criterio profesional

Los arquetipos de marca son a la vez una de las herramientas más útiles del branding y una de las menos fundamentadas científicamente. Las críticas son conocidas: los arquetipos de Jung se consideran difíciles de falsar, y en marketing se asignan casi siempre a posteriori, sobre marcas que ya triunfaron.

Eso no los invalida. Sirven como brújula: mantienen coherente el carácter de una marca a lo largo de miles de decisiones tomadas por personas distintas durante años. Lo que no son es un microscopio que revela verdades ocultas del cliente.

Presentarlos como brújula refuerza el criterio de quien los usa. Presentarlos como ciencia deja expuesto a quien los vende a la primera pregunta incómoda.

---

## Fuentes

- Mark, M. y Pearson, C. S. (2001). *The Hero and the Outlaw: Building Extraordinary Brands Through the Power of Archetypes*. McGraw-Hill.
- Pearson, C. S. (1991). *Awakening the Heroes Within: Twelve Archetypes to Help Us Find Ourselves and Transform Our World*. HarperSanFrancisco.
- Jung, C. G. (1959). *The Archetypes and the Collective Unconscious*. Collected Works, Vol. 9, Parte 1.
- Bäckström, M. y Björklund, F. (2024). *Why Forced-Choice and Likert Items Provide the Same Information on Personality, Including Social Desirability*. Educational and Psychological Measurement.
- Kreitchmann, R. S. et al. (2019). *Controlling for Response Biases in Self-Report Scales: Forced-Choice vs. Psychometric Modeling of Likert Items*. Frontiers in Psychology.
- Miller, D. (2017). *Building a StoryBrand*. HarperCollins Leadership.
- Aaker, J. L. (1997). *Dimensions of Brand Personality*. Journal of Marketing Research, 34(3).
