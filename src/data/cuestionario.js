// Datos del cuestionario: bloques, preguntas, opciones y sectores.
// Fuente: docs/especificacion.md, secciones 4, 5 y 6. Solo datos: sin lógica ni DOM.
// El orden de las opciones es el de la especificación; en pantalla se baraja.

export const BLOQUES = [
  { numero: 1, nombre: 'Condiciones de tu actividad', puntua: false, campoLibre: true },
  { numero: 2, nombre: 'La transformación del cliente', puntua: true, campoLibre: true },
  { numero: 3, nombre: 'Comportamiento real', puntua: true, campoLibre: true },
  { numero: 4, nombre: 'Lo que tu marca nunca haría', puntua: true, campoLibre: true },
  { numero: 5, nombre: 'Tensiones', puntua: true, campoLibre: true },
  { numero: 6, nombre: 'Voz y tono', puntua: true, campoLibre: true },
  { numero: 7, nombre: 'Tu categoría', puntua: false, campoLibre: true },
  { numero: 8, nombre: 'Abiertas', puntua: false, campoLibre: true }
];

// Sección 4: primera pregunta del cuestionario.
export const PREGUNTA_MODO = {
  enunciado: '¿En qué punto está tu marca?',
  opciones: [
    { valor: 'marca', texto: 'Ya está en marcha: tengo clientes y una forma de trabajar rodada' },
    { valor: 'fundador', texto: 'Estoy empezando o construyéndola desde cero' }
  ]
};

// Sección 5, datos iniciales. `id` es el valor que se envía a la hoja.
export const SECTORES = [
  { id: 'servicios_profesionales', texto: 'Servicios profesionales (consultoría, asesoría, coaching)', requiereTexto: false },
  { id: 'legal_y_fiscal', texto: 'Legal y fiscal', requiereTexto: false },
  { id: 'salud_y_bienestar', texto: 'Salud y bienestar', requiereTexto: false },
  { id: 'estetica_y_belleza', texto: 'Estética y belleza', requiereTexto: false },
  { id: 'deporte_y_fitness', texto: 'Deporte y fitness', requiereTexto: false },
  { id: 'educacion_y_formacion', texto: 'Educación y formación', requiereTexto: false },
  { id: 'marketing_publicidad_y_comunicacion', texto: 'Marketing, publicidad y comunicación', requiereTexto: false },
  { id: 'tecnologia_y_software', texto: 'Tecnología y software', requiereTexto: false },
  { id: 'diseno_y_creatividad', texto: 'Diseño y creatividad', requiereTexto: false },
  { id: 'arquitectura_construccion_y_reformas', texto: 'Arquitectura, construcción y reformas', requiereTexto: false },
  { id: 'inmobiliario', texto: 'Inmobiliario', requiereTexto: false },
  { id: 'finanzas_y_seguros', texto: 'Finanzas y seguros', requiereTexto: false },
  { id: 'hosteleria_y_restauracion', texto: 'Hostelería y restauración', requiereTexto: false },
  { id: 'turismo_y_viajes', texto: 'Turismo y viajes', requiereTexto: false },
  { id: 'comercio_minorista_y_ecommerce', texto: 'Comercio minorista y ecommerce', requiereTexto: false },
  { id: 'alimentacion', texto: 'Alimentación', requiereTexto: false },
  { id: 'industria_y_b2b', texto: 'Industria y B2B', requiereTexto: false },
  { id: 'eventos', texto: 'Eventos', requiereTexto: false },
  { id: 'servicios_a_domicilio_y_oficios', texto: 'Servicios a domicilio y oficios', requiereTexto: false },
  { id: 'ong_asociaciones_y_sector_publico', texto: 'ONG, asociaciones y sector público', requiereTexto: false },
  { id: 'otro', texto: 'Otro', requiereTexto: true }
];

// Sección 5, bloque 6.
export const ENCABEZADO_BLOQUE_6 = {
  titulo: 'Comparado con otras marcas de tu sector, ¿dónde se sitúa la tuya?',
  cuerpo: 'No pienses en términos absolutos. Lo que es formal en un sector es informalísimo en otro; lo que es rompedor en una notaría es lo normal en una agencia creativa. Sitúate respecto a tu competencia, no respecto al mundo.'
};

export const NOTA_FUNDADOR_BLOQUE_6 =
  'Si todavía no conoces bien tu sector, sitúate respecto a las marcas que consideras tu referencia.';

export const PREGUNTAS = [
  // ---------- BLOQUE 1: condiciones (no puntúan) ----------
  {
    id: 'P1', bloque: 1, tipo: 'si-no', clave: 'clientes_vulnerables',
    enunciado: { marca: '¿Tus clientes suelen llegar a ti en un momento delicado o vulnerable?', fundador: null }
  },
  {
    id: 'P2', bloque: 1, tipo: 'si-no', clave: 'restriccion_normativa',
    enunciado: { marca: '¿Tu sector tiene límites legales, deontológicos o de colegio profesional sobre cómo se puede comunicar o qué se puede prometer?', fundador: null }
  },
  {
    id: 'P3', bloque: 1, tipo: 'si-no', clave: 'consecuencias_graves',
    enunciado: { marca: '¿Una decisión equivocada en tu servicio tiene consecuencias graves para el cliente (salud, dinero, legalidad, seguridad)?', fundador: null }
  },

  // ---------- BLOQUE 2: transformación (ancla). El código es una motivación ----------
  {
    id: 'P4', bloque: 2, tipo: 'motivacion',
    enunciado: { marca: '¿Qué cambia en la vida de tu cliente después de trabajar contigo?', fundador: '¿Qué quieres que cambie?' },
    opciones: [
      { id: 'P4a', texto: 'Entiende algo que antes no entendía y gana criterio propio', codigo: 'INDEPENDENCIA' },
      { id: 'P4b', texto: 'Consigue algo difícil que antes no lograba', codigo: 'MAESTRIA' },
      { id: 'P4c', texto: 'Deja de sentirse solo en esto', codigo: 'PERTENENCIA' },
      { id: 'P4d', texto: 'Su negocio deja de ir a golpe de improvisación', codigo: 'ESTABILIDAD' }
    ]
  },
  {
    id: 'P5', bloque: 2, tipo: 'motivacion',
    enunciado: { marca: 'Cuando un cliente te cuenta por qué te eligió, lo que más repite es...', fundador: '¿Por cuál de estas razones te gustaría que te eligieran?' },
    opciones: [
      { id: 'P5a', texto: '«Nadie me lo había explicado así»', codigo: 'INDEPENDENCIA' },
      { id: 'P5b', texto: '«Contigo por fin lo conseguí»', codigo: 'MAESTRIA' },
      { id: 'P5c', texto: '«Me sentí cómodo desde el primer minuto»', codigo: 'PERTENENCIA' },
      { id: 'P5d', texto: '«Por fin tengo esto bajo control»', codigo: 'ESTABILIDAD' }
    ]
  },
  {
    id: 'P6', bloque: 2, tipo: 'motivacion',
    enunciado: { marca: 'Si tu marca desapareciera mañana, lo que más echarían de menos tus clientes sería...', fundador: 'Si tu marca nunca llegara a existir, ¿qué se perdería tu cliente?' },
    opciones: [
      { id: 'P6a', texto: 'La claridad con la que les enseñas a mirar las cosas', codigo: 'INDEPENDENCIA' },
      { id: 'P6b', texto: 'El empujón para atreverse', codigo: 'MAESTRIA' },
      { id: 'P6c', texto: 'La sensación de estar acompañados', codigo: 'PERTENENCIA' },
      { id: 'P6d', texto: 'La tranquilidad de saber que todo está en su sitio', codigo: 'ESTABILIDAD' }
    ]
  },
  {
    id: 'P7', bloque: 2, tipo: 'motivacion',
    enunciado: { marca: 'La frase que mejor describe la promesa de tu marca:', fundador: null },
    opciones: [
      { id: 'P7a', texto: '«Aquí vas a entender lo que nadie te ha explicado»', codigo: 'INDEPENDENCIA' },
      { id: 'P7b', texto: '«Aquí vas a conseguir lo que hasta ahora no has conseguido»', codigo: 'MAESTRIA' },
      { id: 'P7c', texto: '«Aquí vas a encontrar a los tuyos»', codigo: 'PERTENENCIA' },
      { id: 'P7d', texto: '«Aquí vas a dejar de improvisar»', codigo: 'ESTABILIDAD' }
    ]
  },

  // ---------- BLOQUE 3: comportamiento real (más +3 / menos -2) ----------
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
  },
  {
    id: 'P9', bloque: 3, tipo: 'mas-menos',
    enunciado: {
      marca: 'Sale un método nuevo del que todo el mundo habla en tu sector. Tu reacción real es...',
      fundador: null
    },
    opciones: [
      { id: 'P9a', texto: 'Preguntarme si hace falta de verdad o es complicar por complicar', codigo: 'IN' },
      { id: 'P9b', texto: 'Probarlo enseguida, por curiosidad', codigo: 'EX' },
      { id: 'P9c', texto: 'Desconfiar del ruido y decirlo en voz alta', codigo: 'RE' },
      { id: 'P9d', texto: 'Comprobar si supera a lo que ya uso; si no, sigo con lo mío', codigo: 'GO' }
    ]
  },
  {
    id: 'P10', bloque: 3, tipo: 'mas-menos',
    enunciado: {
      marca: 'Tu forma de crear contenido se parece más a...',
      fundador: 'Cuando hablas de tu sector o compartes algo profesional, lo que más te sale es...'
    },
    opciones: [
      { id: 'P10a', texto: 'Explicar bien cómo funciona algo', codigo: 'SA' },
      { id: 'P10b', texto: 'Contar lo que estoy probando ahora mismo', codigo: 'EX' },
      { id: 'P10c', texto: 'Cuidar mucho cómo queda, no solo qué dice', codigo: 'AM' },
      { id: 'P10d', texto: 'Buscar que se lea con gusto y saque una sonrisa', codigo: 'BU' }
    ]
  },
  {
    id: 'P11', bloque: 3, tipo: 'mas-menos',
    enunciado: {
      marca: 'Un cliente te pregunta qué te diferencia. Tu respuesta natural es...',
      fundador: 'Alguien te pregunta qué te diferencia de otros que hacen lo mismo. Tu respuesta natural es...'
    },
    opciones: [
      { id: 'P11a', texto: 'Que conmigo se consiguen resultados', codigo: 'HE' },
      { id: 'P11b', texto: 'Que no te voy a contar lo mismo que los demás', codigo: 'RE' },
      { id: 'P11c', texto: 'Que te entiendo porque he estado donde estás', codigo: 'HC' },
      { id: 'P11d', texto: 'Que lo que hago no sale de una plantilla', codigo: 'CR' }
    ]
  },
  {
    id: 'P12', bloque: 3, tipo: 'mas-menos',
    enunciado: {
      marca: 'Piensa en cómo termina una sesión contigo. El cliente se va...',
      fundador: 'Piensa en cómo termina una conversación profesional contigo. La otra persona se va...'
    },
    opciones: [
      { id: 'P12a', texto: 'Con una tarea clara y ganas de ponerse', codigo: 'HE' },
      { id: 'P12b', texto: 'Viendo su situación de otra manera', codigo: 'MA' },
      { id: 'P12c', texto: 'De buen humor, con el tema más ligero', codigo: 'BU' },
      { id: 'P12d', texto: 'Con la sensación de que ya está decidido y en orden', codigo: 'GO' }
    ]
  },
  {
    id: 'P13', bloque: 3, tipo: 'mas-menos',
    enunciado: {
      marca: 'Un cliente te enseña algo suyo que no está bien. ¿Qué haces?',
      fundador: 'Alguien te enseña algo suyo que no está bien. ¿Qué haces?'
    },
    opciones: [
      { id: 'P13a', texto: 'Se lo digo claramente, sin adornos', codigo: 'RE' },
      { id: 'P13b', texto: 'Le enseño que el problema real es otro distinto', codigo: 'MA' },
      { id: 'P13c', texto: 'Le propongo rehacerlo bien desde cero', codigo: 'CR' },
      { id: 'P13d', texto: 'Le señalo primero lo que sí funciona, y luego lo demás', codigo: 'CU' }
    ]
  },
  {
    id: 'P14', bloque: 3, tipo: 'mas-menos',
    enunciado: {
      marca: 'Piensa en tu web o tu perfil tal y como están hoy. ¿Qué transmiten más?',
      fundador: 'Cuando preparas algo para que lo vea otra persona (una propuesta, un perfil), lo que más te importa que transmita es...'
    },
    opciones: [
      { id: 'P14a', texto: 'Que detrás hay una persona normal y accesible', codigo: 'HC' },
      { id: 'P14b', texto: 'Que está cuidado hasta el último detalle', codigo: 'AM' },
      { id: 'P14c', texto: 'Que tiene un estilo propio, reconocible', codigo: 'CR' },
      { id: 'P14d', texto: 'Que sabes lo que haces y no necesitas demostrarlo', codigo: 'GO' }
    ]
  },
  {
    id: 'P15', bloque: 3, tipo: 'mas-menos',
    enunciado: {
      marca: 'Un cliente potencial te escribe pidiendo precio, sin más contexto.',
      fundador: 'En trabajos anteriores, cuando te preguntaban por precio o condiciones sin más contexto, tú...'
    },
    opciones: [
      { id: 'P15a', texto: 'Le contesto como a un conocido y le pregunto qué necesita', codigo: 'HC' },
      { id: 'P15b', texto: 'Le respondo con naturalidad y algo de humor', codigo: 'BU' },
      { id: 'P15c', texto: 'Le mando el precio sin rodeos: no tengo nada que esconder', codigo: 'IN' },
      { id: 'P15d', texto: 'Le pregunto primero por su situación, sin hablar de dinero todavía', codigo: 'CU' }
    ]
  },
  {
    id: 'P16', bloque: 3, tipo: 'mas-menos',
    enunciado: { marca: 'Si tu marca fuera un lugar físico, sería...', fundador: null },
    opciones: [
      { id: 'P16a', texto: 'Un espacio cuidado donde apetece quedarse', codigo: 'AM' },
      { id: 'P16b', texto: 'Un sitio donde la gente se ríe mientras trabaja', codigo: 'BU' },
      { id: 'P16c', texto: 'Un campamento base, siempre a punto de salir', codigo: 'EX' },
      { id: 'P16d', texto: 'Un taller lleno de cosas a medio hacer', codigo: 'CR' }
    ]
  },
  {
    id: 'P17', bloque: 3, tipo: 'mas-menos',
    enunciado: {
      marca: 'De todo tu trabajo, lo que más disfrutas es...',
      fundador: 'De todo lo que has hecho profesionalmente, lo que más has disfrutado es...'
    },
    opciones: [
      { id: 'P17a', texto: 'Cuando el cliente dice que por fin alguien le ha entendido', codigo: 'HC' },
      { id: 'P17b', texto: 'Cuando algo queda exactamente como debía quedar', codigo: 'AM' },
      { id: 'P17c', texto: 'Cuando el cliente dice «ah, ¿pero era esto de simple?»', codigo: 'IN' },
      { id: 'P17d', texto: 'Cuando el cliente ve su negocio de otra manera', codigo: 'MA' }
    ]
  },
  {
    id: 'P18', bloque: 3, tipo: 'mas-menos',
    enunciado: {
      marca: 'Un cliente te pide algo que tú no harías. ¿Qué haces?',
      fundador: 'Alguien te pide algo que tú no harías. ¿Qué haces?'
    },
    opciones: [
      { id: 'P18a', texto: 'Le explico mi preocupación y busco que no salga perjudicado', codigo: 'CU' },
      { id: 'P18b', texto: 'Mantengo mi criterio: para eso me ha contratado', codigo: 'GO' },
      { id: 'P18c', texto: 'Le explico con argumentos por qué no es buena idea', codigo: 'SA' },
      { id: 'P18d', texto: 'Le digo directamente que eso es un error', codigo: 'RE' }
    ]
  },
  {
    id: 'P19', bloque: 3, tipo: 'mas-menos',
    enunciado: { marca: '¿Qué es lo que más te motiva de este trabajo?', fundador: null },
    opciones: [
      { id: 'P19a', texto: 'Que nunca es igual y siempre hay algo nuevo', codigo: 'EX' },
      { id: 'P19b', texto: 'Ver cómo cambia por completo la situación de alguien', codigo: 'MA' },
      { id: 'P19c', texto: 'Entender bien cómo funcionan las cosas', codigo: 'SA' },
      { id: 'P19d', texto: 'Conseguir lo que parecía que no se podía', codigo: 'HE' }
    ]
  },

  // ---------- BLOQUE 4: lo que tu marca nunca haría (resta 2) ----------
  {
    id: 'P20', bloque: 4, tipo: 'resta',
    enunciado: { marca: '¿Qué te daría más vergüenza que hiciera tu marca?', fundador: null },
    opciones: [
      { id: 'P20a', texto: 'Sonar ingenua o naíf', codigo: 'IN' },
      { id: 'P20b', texto: 'Sonar sabelotodo y condescendiente', codigo: 'SA' },
      { id: 'P20c', texto: 'Prometer una transformación que no puede garantizar', codigo: 'MA' },
      { id: 'P20d', texto: 'Presumir de estatus o exclusividad', codigo: 'GO' }
    ]
  },
  {
    id: 'P21', bloque: 4, tipo: 'resta',
    enunciado: { marca: '¿Cuál de estos comportamientos no va contigo en absoluto?', fundador: null },
    opciones: [
      { id: 'P21a', texto: 'Ponerse dramática y motivacional', codigo: 'HE' },
      { id: 'P21b', texto: 'Bromear cuando toca ir en serio', codigo: 'BU' },
      { id: 'P21c', texto: 'Hablar de emociones y de belleza', codigo: 'AM' },
      { id: 'P21d', texto: 'Buscar la polémica a propósito', codigo: 'RE' }
    ]
  },
  {
    id: 'P22', bloque: 4, tipo: 'resta',
    enunciado: { marca: '¿Qué es lo que menos encaja con tu forma de trabajar?', fundador: null },
    opciones: [
      { id: 'P22a', texto: 'Cambiar de rumbo y empezar cosas nuevas continuamente', codigo: 'EX' },
      { id: 'P22b', texto: 'Volcarte tanto en el cliente que te olvidas de ti', codigo: 'CU' },
      { id: 'P22c', texto: 'Tratar a todo el mundo igual, sin distinciones', codigo: 'HC' },
      { id: 'P22d', texto: 'Dedicar tiempo a que las cosas queden bonitas', codigo: 'CR' }
    ]
  },

  // ---------- BLOQUE 5: tensiones (+2 al elegido) ----------
  {
    id: 'P23', bloque: 5, tipo: 'dos-opciones',
    enunciado: { marca: 'Cuando algo funciona pero está anticuado, tu instinto es...', fundador: null },
    opciones: [
      { id: 'P23a', texto: 'Protegerlo y mejorarlo desde dentro', codigo: 'GO' },
      { id: 'P23b', texto: 'Tirarlo y hacerlo distinto', codigo: 'RE' }
    ]
  },
  {
    id: 'P24', bloque: 5, tipo: 'dos-opciones',
    enunciado: { marca: 'Prefieres que tu cliente salga de una sesión...', fundador: null },
    opciones: [
      { id: 'P24a', texto: 'Sintiéndose seguro y protegido', codigo: 'CU' },
      { id: 'P24b', texto: 'Sintiéndose con ganas de arriesgar', codigo: 'EX' }
    ]
  },
  {
    id: 'P25', bloque: 5, tipo: 'dos-opciones',
    enunciado: { marca: 'Si tuvieras que elegir, tu contenido debería...', fundador: null },
    opciones: [
      { id: 'P25a', texto: 'Enseñar algo', codigo: 'SA' },
      { id: 'P25b', texto: 'Entretener', codigo: 'BU' }
    ]
  },
  {
    id: 'P26', bloque: 5, tipo: 'dos-opciones',
    enunciado: { marca: 'Un cliente lo está pasando mal con un objetivo difícil. Prefieres...', fundador: null },
    opciones: [
      { id: 'P26a', texto: 'Empujarle a que se supere', codigo: 'HE' },
      { id: 'P26b', texto: 'Simplificarle el camino', codigo: 'IN' }
    ]
  },
  {
    id: 'P27', bloque: 5, tipo: 'dos-opciones',
    enunciado: { marca: 'Quieres que tu cliente piense...', fundador: null },
    opciones: [
      { id: 'P27a', texto: '«Esto es distinto a todo lo que he visto»', codigo: 'MA' },
      { id: 'P27b', texto: '«Esto es exactamente para gente como yo»', codigo: 'HC' }
    ]
  },
  {
    id: 'P28', bloque: 5, tipo: 'dos-opciones',
    enunciado: { marca: 'Cuando entregas algo, prefieres que el cliente diga...', fundador: null },
    opciones: [
      { id: 'P28a', texto: '«Qué bien me hace sentir esto»', codigo: 'AM' },
      { id: 'P28b', texto: '«Esto no lo tiene nadie más»', codigo: 'CR' }
    ]
  },

  // ---------- BLOQUE 6: voz y tono (escalas 1 a 5) ----------
  {
    id: 'P29', bloque: 6, tipo: 'escala',
    enunciado: { marca: null, fundador: null },
    izquierda: { etiqueta: 'Cercano', codigos: ['HC', 'IN'] },
    derecha: { etiqueta: 'Con autoridad', codigos: ['GO', 'SA'] }
  },
  {
    id: 'P30', bloque: 6, tipo: 'escala',
    enunciado: { marca: null, fundador: null },
    izquierda: { etiqueta: 'Sereno', codigos: ['SA', 'CU'] },
    derecha: { etiqueta: 'Enérgico', codigos: ['HE', 'RE'] }
  },
  {
    id: 'P31', bloque: 6, tipo: 'escala',
    enunciado: { marca: null, fundador: null },
    izquierda: { etiqueta: 'Continuista', codigos: ['GO', 'CU'] },
    derecha: { etiqueta: 'Rompedor', codigos: ['RE', 'EX'] }
  },
  {
    id: 'P32', bloque: 6, tipo: 'escala',
    enunciado: { marca: null, fundador: null },
    izquierda: { etiqueta: 'Sencillo', codigos: ['IN', 'HC'] },
    derecha: { etiqueta: 'Cuidado y sofisticado', codigos: ['AM', 'CR'] }
  },
  {
    id: 'P33', bloque: 6, tipo: 'escala',
    enunciado: { marca: null, fundador: null },
    izquierda: { etiqueta: 'Pies en la tierra', codigos: ['BU', 'HE'] },
    derecha: { etiqueta: 'Visionario', codigos: ['MA', 'CR'] }
  },
  {
    id: 'P34', bloque: 6, tipo: 'escala',
    enunciado: { marca: null, fundador: null },
    izquierda: { etiqueta: 'Espontáneo', codigos: ['EX', 'BU'] },
    derecha: { etiqueta: 'Todo tiene intención', codigos: ['AM', 'MA'] }
  },

  // ---------- BLOQUE 7: categoría (no puntúa) ----------
  {
    id: 'P35', bloque: 7, tipo: 'lista-arquetipo',
    enunciado: {
      marca: 'Piensa en los tres competidores más visibles de tu sector. ¿Cómo se comportan casi todos?',
      fundador: null
    },
    // Solo la del Sabio (SA) es literal de la especificación. Las otras 11 son borradores
    // PROVISIONAL redactados por el implementador: pendientes de revisión de Elizabeth.
    opciones: [
      { id: 'P35a', texto: 'Simplifican todo y hablan sin rodeos ni tecnicismos', codigo: 'IN', provisional: true }, // PROVISIONAL
      { id: 'P35b', texto: 'Explican mucho y se posicionan como los que más saben', codigo: 'SA' },
      { id: 'P35c', texto: 'Prueban cosas nuevas antes que nadie y lo cuentan mientras las hacen', codigo: 'EX', provisional: true }, // PROVISIONAL
      { id: 'P35d', texto: 'Hablan de resultados y de objetivos, y retan al cliente a superarse', codigo: 'HE', provisional: true }, // PROVISIONAL
      { id: 'P35e', texto: 'Cuestionan lo establecido y dicen en voz alta lo que otros callan', codigo: 'RE', provisional: true }, // PROVISIONAL
      { id: 'P35f', texto: 'Cambian la manera de ver el problema y prometen una transformación', codigo: 'MA', provisional: true }, // PROVISIONAL
      { id: 'P35g', texto: 'Hablan como uno más y se presentan como gente normal y cercana', codigo: 'HC', provisional: true }, // PROVISIONAL
      { id: 'P35h', texto: 'Cuidan al detalle la estética y la experiencia de cada contacto', codigo: 'AM', provisional: true }, // PROVISIONAL
      { id: 'P35i', texto: 'Usan el humor y un tono ligero para quitarle peso al tema', codigo: 'BU', provisional: true }, // PROVISIONAL
      { id: 'P35j', texto: 'Se centran en acompañar y en que el cliente se sienta protegido', codigo: 'CU', provisional: true }, // PROVISIONAL
      { id: 'P35k', texto: 'Presumen de trabajar a medida, con un estilo propio y reconocible', codigo: 'CR', provisional: true }, // PROVISIONAL
      { id: 'P35l', texto: 'Se presentan como la referencia que marca las reglas y decide cómo se hace', codigo: 'GO', provisional: true } // PROVISIONAL
    ]
  },
  {
    id: 'P36', bloque: 7, tipo: 'abierta',
    enunciado: { marca: '¿Qué es lo que más te cansa de cómo comunica tu sector?', fundador: null }
  },
  {
    id: 'P37', bloque: 7, tipo: 'abierta',
    enunciado: { marca: 'Si un cliente te compara con la opción más obvia de tu sector, ¿en qué quieres que note la diferencia?', fundador: null }
  },

  // ---------- BLOQUE 8: abiertas (no puntúan) ----------
  {
    id: 'P38', bloque: 8, tipo: 'abierta',
    enunciado: { marca: '¿Qué marca de cualquier sector te gustaría parecerte, y qué es exactamente lo que te gusta de ella?', fundador: null }
  },
  {
    id: 'P39', bloque: 8, tipo: 'abierta',
    enunciado: {
      marca: '¿Qué crees que dirían tus tres mejores clientes de ti si no estuvieras delante?',
      // La especificación solo indica «las personas con las que has trabajado»; la frase se compone sustituyendo «tus tres mejores clientes».
      fundador: '¿Qué crees que dirían las personas con las que has trabajado de ti si no estuvieras delante?'
    }
  },
  {
    id: 'P40', bloque: 8, tipo: 'abierta',
    enunciado: { marca: '¿Qué es lo que más te cuesta comunicar de tu marca?', fundador: null }
  },
  {
    id: 'P41', bloque: 8, tipo: 'abierta',
    enunciado: { marca: '¿Qué haces tú que tu competencia directa no hace?', fundador: null }
  },
  {
    id: 'P42', bloque: 8, tipo: 'abierta',
    enunciado: { marca: 'Si tu marca pudiera decir una sola frase al mundo, ¿cuál sería?', fundador: null }
  },
  {
    id: 'P43', bloque: 8, tipo: 'abierta',
    enunciado: { marca: '¿Hay algo que hagas en tu negocio y que sepas que no encaja con cómo quieres que se perciba tu marca?', fundador: null }
  }
];
