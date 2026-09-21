// Datos de los 12 arquetipos y textos del resultado.
// Fuente: docs/especificacion.md, secciones 3, 6, 7 y 8. Solo datos: sin lógica ni DOM.

export const ORDEN_CODIGOS = ['IN', 'SA', 'EX', 'HE', 'RE', 'MA', 'HC', 'AM', 'BU', 'CU', 'CR', 'GO'];

export const MOTIVACIONES = {
  INDEPENDENCIA: ['IN', 'SA', 'EX'],
  MAESTRIA: ['HE', 'RE', 'MA'],
  PERTENENCIA: ['HC', 'AM', 'BU'],
  ESTABILIDAD: ['CU', 'CR', 'GO']
};

// Pares en tensión (sección 7.2), sin orden.
export const TENSIONES = [
  ['GO', 'RE'],
  ['CU', 'EX'],
  ['SA', 'BU'],
  ['HE', 'IN'],
  ['MA', 'HC'],
  ['AM', 'CR']
];

export const ARQUETIPOS = {
  IN: {
    codigo: 'IN',
    nombre: 'El Inocente',
    nombreCorto: 'Inocente',
    motivacion: 'INDEPENDENCIA',
    deseoCentral: 'Sencillez y seguridad',
    sombraCorta: 'Negar los problemas',
    color: '#F0E6D2',
    ficha: {
      queEs: 'Cree que las cosas no tienen por qué ser complicadas. Su fuerza está en quitar capas: donde otros añaden jerga, requisitos y letra pequeña, el Inocente simplifica hasta que el cliente entiende. Transmite transparencia sin esfuerzo, porque no tiene nada que esconder.',
      paraQueSirve: 'Cuando tu cliente llega quemado de complejidad y de promesas infladas. En sectores donde todos suenan técnicos, ser el que habla claro es un posicionamiento entero.',
      aviso: null,
      promesa: 'hace sencillo lo que otros complican',
      manera: 'sin complicar nada, con las cartas boca arriba',
      puede: ['precios claros sin letra pequeña', 'explicar el proceso paso a paso', 'admitir lo que no hace', 'diseño limpio, sin ruido'],
      noDebe: ['exagerar resultados', 'usar urgencia o escasez artificial', 'fingir que un problema difícil es fácil'],
      sombra: 'simplificar de menos es honestidad; simplificar de más es ingenuidad, y el cliente lo descubre al chocar con la realidad.',
      voz: ['clara', 'honesta', 'tranquila']
    }
  },
  SA: {
    codigo: 'SA',
    nombre: 'El Sabio',
    nombreCorto: 'Sabio',
    motivacion: 'INDEPENDENCIA',
    deseoCentral: 'Comprender la verdad',
    sombraCorta: 'Condescendencia, parálisis',
    color: '#2C3E50',
    ficha: {
      queEs: 'Su valor no es hacer por ti, es que entiendas. Enseña el porqué de cada decisión y entrega criterio, no instrucciones. Se apoya en argumentos, no en entusiasmo.',
      paraQueSirve: 'Cuando el cliente compra confianza en tu criterio y necesita entender antes de decidir. Encaja en servicios caros o de decisión lenta, donde la objeción real es «no sé si esto funciona».',
      aviso: null,
      promesa: 'te da el criterio para decidir por ti mismo',
      manera: 'explicando siempre el porqué',
      puede: ['contenido formativo profundo', 'enseñar el método', 'citar fuentes', 'reconocer lo que aún no sabe'],
      noDebe: ['recurrir al hype', 'vender por urgencia', 'hablar por encima del cliente'],
      sombra: 'condescendencia y parálisis. Explicar tanto que nunca se pasa a la acción, o hacer sentir torpe a quien pregunta.',
      voz: ['clara', 'argumentada', 'serena']
    }
  },
  EX: {
    codigo: 'EX',
    nombre: 'El Explorador',
    nombreCorto: 'Explorador',
    motivacion: 'INDEPENDENCIA',
    deseoCentral: 'Libertad para descubrir',
    sombraCorta: 'Dispersión',
    color: '#4A5D45',
    ficha: {
      queEs: 'Se mueve antes que los demás. Prueba, descarta, vuelve a probar, y comparte el camino mientras lo recorre. Su cliente no quiere el mapa oficial: quiere que alguien vaya delante.',
      paraQueSirve: 'En sectores que cambian rápido, donde lo valioso no es el conocimiento asentado sino saber qué está pasando ahora. Justifica muy bien un servicio de acompañamiento continuo.',
      aviso: null,
      promesa: 'te lleva a sitios donde no habías estado',
      manera: 'probando en vez de teorizando',
      puede: ['compartir experimentos, incluidos los fallidos', 'adoptar cosas nuevas pronto', 'formatos flexibles', 'hablar en primera persona de lo que ha probado'],
      noDebe: ['prometer estabilidad o certezas', 'imponer procesos rígidos', 'posicionarse como autoridad definitiva'],
      sombra: 'dispersión. Empezar mucho y terminar poco; el cliente se queda sin saber qué hacer.',
      voz: ['curiosa', 'directa', 'en movimiento']
    }
  },
  HE: {
    codigo: 'HE',
    nombre: 'El Héroe',
    nombreCorto: 'Héroe',
    motivacion: 'MAESTRIA',
    deseoCentral: 'Demostrar valía con logros',
    sombraCorta: 'Agotar al cliente',
    color: '#B03A2E',
    ficha: {
      queEs: 'Cree que el esfuerzo bien dirigido da resultados y organiza todo alrededor de conseguirlos: objetivos, medición, logro. Su cliente quiere conseguir algo concreto, no entenderlo mejor.',
      paraQueSirve: 'Cuando la transformación es medible y el cliente llega con un objetivo claro. Justifica precios altos porque el resultado se demuestra.',
      aviso: 'el héroe es el cliente, no la marca. La marca es el entrenador. Las marcas Héroe que se colocan en el papel protagonista se vuelven autocomplacientes y dejan de conectar.',
      promesa: 'te hace conseguir lo que no conseguías solo',
      manera: 'con objetivos concretos y sin rodeos',
      puede: ['hablar de resultados y cifras', 'plantear retos', 'casos de éxito', 'lenguaje de progreso'],
      noDebe: ['presumir de sus logros por encima de los del cliente', 'culpar al cliente por no esforzarse', 'prometer resultados que no controla'],
      sombra: 'agotar. Convertirlo todo en exigencia hasta que la marca se asocia con presión.',
      voz: ['firme', 'motivadora', 'concreta']
    }
  },
  RE: {
    codigo: 'RE',
    nombre: 'El Rebelde',
    nombreCorto: 'Rebelde',
    motivacion: 'MAESTRIA',
    deseoCentral: 'Cambiar lo que no funciona',
    sombraCorta: 'Provocación vacía',
    color: '#1A1A1A',
    ficha: {
      queEs: 'Señala lo que no funciona, aunque sea incómodo. Existe contra algo: una práctica del sector, una creencia instalada, una forma de hacer las cosas que todos aceptan sin discutir.',
      paraQueSirve: 'Para diferenciarte en un sector homogéneo. Es de los pocos arquetipos que convierte una opinión impopular en un activo, y filtra clientes con una eficacia brutal: repele a quien no encaja antes de hacerte perder el tiempo.',
      aviso: null,
      promesa: 'te quita de encima lo que no funciona',
      manera: 'diciendo lo que otros callan',
      puede: ['criticar prácticas del sector con argumentos', 'rechazar clientes abiertamente', 'formatos poco convencionales', 'tono sin filtro'],
      noDebe: ['pedir perdón por incomodar', 'provocar sin fondo', 'acabar haciendo aquello que critica'],
      sombra: 'la provocación vacía. Cuando el titular escandaloso sustituye al argumento, dejas de ser Rebelde y pasas a ser ruido.',
      voz: ['directa', 'sin eufemismos', 'con criterio detrás']
    }
  },
  MA: {
    codigo: 'MA',
    nombre: 'El Mago',
    nombreCorto: 'Mago',
    motivacion: 'MAESTRIA',
    deseoCentral: 'Transformar la realidad',
    sombraCorta: 'Manipulación, humo',
    color: '#2E7D8C',
    ficha: {
      queEs: 'Cambia la situación de raíz, no la mejora un poco. Trabaja sobre la forma en que el cliente ve su propio problema; cuando esa mirada cambia, todo lo demás se recoloca.',
      paraQueSirve: 'Cuando el cliente cree que su problema es X y en realidad es Y. Justifica el diagnóstico como servicio con entidad propia y convierte la consultoría en algo más que ejecución.',
      aviso: null,
      promesa: 'cambia la manera en que ves tu negocio',
      manera: 'sacando a la luz lo que no se veía',
      puede: ['reformular el problema del cliente', 'vender diagnóstico', 'contenido que descoloca', 'mostrar el antes y el después de la perspectiva'],
      noDebe: ['prometer magia', 'esconder el método', 'usar el misterio como táctica de venta'],
      sombra: 'la manipulación. El Mago tiene el poder de cambiar cómo alguien ve las cosas; usado para vender más y no para ayudar, se convierte en humo.',
      voz: ['inspiradora', 'con visión', 'apoyada en método']
    }
  },
  HC: {
    codigo: 'HC',
    nombre: 'El Hombre común',
    nombreCorto: 'Hombre común',
    motivacion: 'PERTENENCIA',
    deseoCentral: 'Pertenecer y conectar',
    sombraCorta: 'Desaparecer entre todos',
    color: '#8B7355',
    ficha: {
      queEs: 'Trata a todo el mundo de igual a igual. No se pone por encima ni hace de gurú. Su fuerza es que el cliente se reconoce: «esta persona ha estado donde estoy yo».',
      paraQueSirve: 'Baja la barrera de entrada. Funciona muy bien con clientes intimidados por el sector o escaldados de proveedores distantes.',
      aviso: null,
      promesa: 'te acompaña de igual a igual',
      manera: 'hablando como quien habla con un vecino',
      puede: ['lenguaje cotidiano', 'contar los errores propios', 'responder personalmente', 'precios sin misterio'],
      noDebe: ['crear categorías VIP', 'hablar por encima', 'distanciarse cuando crece'],
      sombra: 'desaparecer. Por no destacar, acaba pareciéndose a todos y sin motivo para que la elijan.',
      voz: ['cercana', 'sencilla', 'sin postureo']
    }
  },
  AM: {
    codigo: 'AM',
    nombre: 'El Amante',
    nombreCorto: 'Amante',
    motivacion: 'PERTENENCIA',
    deseoCentral: 'Conexión e intimidad',
    sombraCorta: 'Perder criterio por agradar',
    color: '#A64B6B',
    ficha: {
      queEs: 'Le importa cómo se siente el cliente en cada punto del recorrido, no solo el resultado final. Cuida el detalle, la estética y la experiencia porque entiende que la forma también comunica.',
      paraQueSirve: 'En categorías donde el producto es parecido y la diferencia está en cómo se vive. Justifica precio premium sin tener que argumentar funcionalidad.',
      aviso: null,
      promesa: 'hace que la experiencia importe tanto como el resultado',
      manera: 'cuidando cada detalle del camino',
      puede: ['identidad visual muy trabajada', 'detalles inesperados', 'lenguaje sensorial', 'trato personalizado de verdad'],
      noDebe: ['descuidar el fondo por la forma', 'decir que sí a todo por agradar', 'tratar a todos igual'],
      sombra: 'perder el criterio por gustar. Cuando la necesidad de agradar decide por encima del juicio profesional, el cliente deja de recibir consejo y empieza a recibir complacencia.',
      voz: ['cálida', 'sensorial', 'cuidada']
    }
  },
  BU: {
    codigo: 'BU',
    nombre: 'El Bufón',
    nombreCorto: 'Bufón',
    motivacion: 'PERTENENCIA',
    deseoCentral: 'Disfrutar el momento',
    sombraCorta: 'Que no le tomen en serio',
    color: '#E8B84B',
    ficha: {
      queEs: 'Quita hierro. Usa el humor para que algo difícil se haga llevadero y para que la gente baje la guardia. No es falta de rigor: es una decisión sobre el tono.',
      paraQueSirve: 'En sectores áridos, técnicos o que dan pereza. El humor es la forma más barata que existe de conseguir que alguien preste atención a algo que le aburre.',
      aviso: null,
      promesa: 'hace llevadero lo que da pereza',
      manera: 'sin tomarse a sí misma demasiado en serio',
      puede: ['humor en cualquier punto de contacto, incluidos los aburridos', 'formatos ligeros', 'reírse de sí misma'],
      noDebe: ['bromear sobre el problema del cliente', 'usar el humor para esquivar una respuesta seria', 'sacrificar claridad por el chiste'],
      sombra: 'que no la tomen en serio. Si todo es broma, nadie te contrata para lo importante.',
      voz: ['desenfadada', 'ágil', 'con chispa']
    }
  },
  CU: {
    codigo: 'CU',
    nombre: 'El Cuidador',
    nombreCorto: 'Cuidador',
    motivacion: 'ESTABILIDAD',
    deseoCentral: 'Proteger a los demás',
    sombraCorta: 'Anularse',
    color: '#6B8E7F',
    ficha: {
      queEs: 'Su prioridad es que el cliente esté bien atendido, y eso condiciona todas sus decisiones: qué incluye el servicio, cómo responde, cuánto acompaña.',
      paraQueSirve: 'En servicios donde el cliente llega vulnerable, asustado o quemado de intentos anteriores. La retención suele ser muy alta.',
      aviso: null,
      promesa: 'te acompaña para que no estés solo en esto',
      manera: 'sin dejarte tirado en ningún momento',
      puede: ['soporte generoso', 'anticiparse a los problemas', 'tono protector', 'garantías reales'],
      noDebe: ['hacer sentir culpable al cliente', 'crear dependencia', 'sacrificar su propio negocio por servir'],
      sombra: 'anularse. Dar de más y cobrar de menos hasta que el negocio deja de ser viable. Es la sombra más frecuente en consultoría y mentoría.',
      voz: ['cálida', 'tranquilizadora', 'atenta']
    }
  },
  CR: {
    codigo: 'CR',
    nombre: 'El Creador',
    nombreCorto: 'Creador',
    motivacion: 'ESTABILIDAD',
    deseoCentral: 'Crear algo duradero',
    sombraCorta: 'Perfeccionismo',
    color: '#6B4C93',
    ficha: {
      queEs: 'Hace cosas que antes no existían y le importa que estén bien hechas. No entrega plantillas: cada trabajo es una pieza. El oficio forma parte del producto.',
      paraQueSirve: 'Cuando el cliente busca algo a medida y valora el criterio propio de quien lo hace. Justifica plazos y precios más altos.',
      aviso: null,
      promesa: 'construye algo que no existía antes',
      manera: 'hecho a medida, no con plantilla',
      puede: ['enseñar el proceso', 'identidad propia reconocible', 'rechazar encargos que no encajan', 'formatos originales'],
      noDebe: ['repetir fórmulas prefabricadas', 'entregar sin criterio propio', 'copiar las referencias del sector'],
      sombra: 'el perfeccionismo. No entregar nunca, o retrasar por pulir algo que el cliente ya daba por bueno.',
      voz: ['cuidada', 'con criterio', 'expresiva']
    }
  },
  GO: {
    codigo: 'GO',
    nombre: 'El Gobernante',
    nombreCorto: 'Gobernante',
    motivacion: 'ESTABILIDAD',
    deseoCentral: 'Liderar y ordenar',
    sombraCorta: 'Distancia con el cliente',
    color: '#5B2333',
    ficha: {
      queEs: 'Pone orden. Tiene método, condiciones claras y no las negocia. Su cliente no quiere opciones infinitas: quiere que alguien decida con criterio y se haga responsable.',
      paraQueSirve: 'Con clientes que han sufrido el caos de proveedores desorganizados. Permite sostener precios altos sin justificar cada partida.',
      aviso: null,
      promesa: 'pone orden donde había improvisación',
      manera: 'con método y sin negociar el criterio',
      puede: ['procesos y condiciones claros', 'seleccionar clientes', 'mantener el criterio frente a la presión', 'presencia cuidada'],
      noDebe: ['humillar al cliente por no saber', 'ser rígido ante casos legítimos', 'usar la exclusividad como reclamo vacío'],
      sombra: 'la distancia. Tanto criterio y tanto proceso que el cliente deja de sentirse escuchado.',
      voz: ['segura', 'precisa', 'con autoridad']
    }
  }
};

export const TEXTOS = {
  // Sección 7.1
  combinacion: 'Tu marca {promesa}, {manera}.',

  // Sección 7.2. Marcadores: {dominante}, {deseoDominante}, {secundario}, {deseoSecundario}.
  tension: {
    titulo: 'Tu arquetipo dominante y el secundario tiran en direcciones contrarias.',
    cuerpo: '{dominante} quiere {deseoDominante} y {secundario} quiere {deseoSecundario}. No es un error del test: muchas marcas viven en esa tensión y algunas construyen ahí su diferencia. Pero hay que decidir cuál manda cuando chocan, porque si no lo decides tú lo decide cada situación, y la marca se lee como inconsistente.',
    cierre: 'Este es el tema principal de tu sesión.'
  },

  // Sección 7.3. La ausencia de clave en `matices` significa «solo el texto general».
  contexto: {
    encabezado: {
      titulo: 'Tu arquetipo no cambia. La forma de expresarlo, sí.',
      cuerpo: 'Por las condiciones de tu actividad, hay matices que conviene que tengas presentes. No son limitaciones de tu personalidad de marca: son las reglas del terreno donde la vas a jugar.'
    },
    clientes_vulnerables: {
      general: 'Tus clientes llegan en un momento delicado. Eso no te obliga a cambiar de carácter, pero sí a que el tono nunca vaya por delante del estado de la persona que tienes delante. Lo que en otro sector es simpatía, aquí puede leerse como frivolidad.',
      matices: {
        BU: 'El humor es para aliviar el peso del momento, nunca para bromear sobre la situación del cliente. La diferencia entre las dos cosas es todo tu negocio.',
        RE: 'Tu franqueza va dirigida al sector o al problema, nunca a la persona. Un cliente vulnerable no puede distinguir una crítica honesta de un ataque.',
        HE: 'Evita el lenguaje de exigencia y superación. El ritmo lo marca el cliente, no el objetivo.',
        MA: 'Cuidado con el lenguaje de transformación espectacular. Con clientes vulnerables genera expectativas que luego pesan.',
        EX: 'Comparte lo que exploras en tu propio terreno. Con el cliente en este estado, la sensación que necesita es de suelo firme.'
      }
    },
    restriccion_normativa: {
      general: 'Tu sector pone límites a lo que se puede decir. Revisa cada afirmación pública con tu normativa o tu colegio antes de publicarla. Dentro de esos límites hay más margen del que parece: casi nadie en tu sector lo aprovecha.',
      matices: {
        HE: 'Nada de promesas de resultados. Si los casos de éxito están permitidos en tu sector, son tu herramienta; si no, habla de proceso y de método.',
        MA: 'Nada de transformación garantizada. Tu terreno seguro es reformular el problema, no prometer el desenlace.',
        GO: 'Vigila las afirmaciones de exclusividad y las comparaciones directas con competidores: son de lo primero que se sanciona.',
        RE: 'Criticar prácticas de tu sector puede tener coste profesional. Hazlo con datos y sobre la práctica, nunca sobre colegas identificables.',
        AM: 'La estética y el tono casi nunca están regulados. Suelen ser el único margen de diferenciación que queda en sectores muy normativizados, y por eso están casi siempre libres.',
        BU: 'La estética y el tono casi nunca están regulados. Suelen ser el único margen de diferenciación que queda en sectores muy normativizados, y por eso están casi siempre libres.'
      }
    },
    consecuencias_graves: {
      general: 'Una decisión equivocada en tu servicio le sale cara al cliente. Eso cambia el orden: primero tiene que percibir solvencia, y solo después, personalidad. No renuncies a tu carácter, pero no lo pongas por delante de la competencia técnica.',
      matices: {
        IN: 'Simplificar no puede llegar a ocultar riesgos. Di siempre lo que puede salir mal; esa es la versión honesta de tu arquetipo.',
        BU: 'Humor sí, pero fuera de los puntos de decisión. En el momento en que el cliente elige, el tono baja.',
        EX: 'Experimenta en tus procesos, no con el cliente. Lo que le ofreces debe estar probado.',
        HC: 'La cercanía no puede sustituir a la demostración de competencia. Necesitas ambas cosas visibles.',
        CR: 'La originalidad va en cómo lo resuelves, no en si el resultado es fiable.'
      }
    },
    variasCondiciones: 'Tu actividad acumula varias de estas condiciones. Es el escenario donde más marcas renuncian a tener personalidad y acaban todas iguales: serias, correctas e indistinguibles. Tu oportunidad es exactamente esa. Mantén tu carácter y ajusta solo la expresión; vas a ser de los pocos que lo hagan.'
  },

  // Sección 7.4
  notaFundador: 'Este resultado retrata cómo trabajas tú, que es de donde nace la personalidad de una marca nueva. Es un punto de partida sólido, pero provisional: cuando lleves seis meses con clientes reales, merece la pena repetirlo.',

  // Sección 7.5. No hay texto para «coincide con el secundario».
  notaCategoria: {
    coincideDominante: 'Tu arquetipo coincide con el que ya domina tu categoría. No lo invalida, pero te deja dos caminos: ejecutarlo notablemente mejor que ellos, o apoyarte en tu secundario para distinguirte. Lo decidimos en la sesión.',
    distinta: 'Tu arquetipo se sale de lo que hace tu categoría. Eso es una ventaja de partida: te van a reconocer antes. También significa que al principio vas a parecer raro a algunos clientes. Es el precio normal de diferenciarse y suele durar poco.'
  },

  // Sección 6. Marcadores: {a}, {b}, {c}.
  alerta: {
    titulo: 'Tu marca todavía no ha elegido un carácter.',
    cuerpo: 'Tus respuestas reparten la personalidad entre {a}, {b} y {c} casi por igual. Eso no es un fallo del test: significa que tu marca se comporta de formas distintas según el momento, y es justo lo que hace que a tus clientes les cueste reconocerte.',
    pie: 'Es el punto de partida más habitual. Lo resolvemos en la sesión.'
  },

  // Sección 8, elemento 16
  cierre: 'Esto es el punto de partida. Lo afinamos juntas en la sesión.',

  // Rótulos de las secciones del resultado (secciones 7.6 y 8)
  etiquetasResultado: {
    queEs: 'Qué es',
    paraQueSirve: 'Para qué sirve',
    aviso: 'Aviso importante',
    puede: 'Qué puede hacer tu marca',
    noDebe: 'Qué no debe hacer nunca',
    sombra: 'Tu sombra',
    voz: 'Tu voz',
    paleta: 'Paleta sugerida'
  }
};
