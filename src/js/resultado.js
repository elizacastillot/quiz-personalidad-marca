// Composición del resultado. Funciones puras: sin DOM ni localStorage.
// Fuente: docs/especificacion.md, secciones 6 (alerta), 7 y 8.

import { ARQUETIPOS, TEXTOS } from '../data/arquetipos.js';
import { esTension } from './puntuacion.js';

// Sección 8: orden de la pantalla de resultado. El aviso del Héroe se pinta dentro de `paraQueSirve`.
export const ORDEN_SECCIONES = [
  'dominante',
  'secundario',
  'frase',
  'queEs',
  'paraQueSirve',
  'tension',
  'puede',
  'noDebe',
  'contexto',
  'sombra',
  'voz',
  'paleta',
  'notaFundador',
  'notaCategoria',
  'descarga',
  'cierre'
];

const CONDICIONES = ['clientes_vulnerables', 'restriccion_normativa', 'consecuencias_graves'];

function minusculaInicial(texto) {
  return texto.charAt(0).toLocaleLowerCase('es') + texto.slice(1);
}

// Sección 7.1: el dominante aporta el qué; el secundario, el cómo.
export function fraseCombinada(dominante, secundario) {
  if (dominante === secundario) {
    throw new Error('El dominante y el secundario no pueden ser el mismo arquetipo.');
  }
  return TEXTOS.combinacion
    .replace('{promesa}', ARQUETIPOS[dominante].ficha.promesa)
    .replace('{manera}', ARQUETIPOS[secundario].ficha.manera);
}

// Sección 7.2: null si el par no está en tensión.
export function textoTension(dominante, secundario) {
  if (!esTension(dominante, secundario)) return null;
  const d = ARQUETIPOS[dominante];
  const s = ARQUETIPOS[secundario];
  const sustituir = (texto) =>
    texto
      .replace('{dominante}', d.nombre)
      .replace('{deseoDominante}', minusculaInicial(d.deseoCentral))
      .replace('{secundario}', s.nombre)
      .replace('{deseoSecundario}', minusculaInicial(s.deseoCentral));
  return {
    titulo: sustituir(TEXTOS.tension.titulo),
    cuerpo: sustituir(TEXTOS.tension.cuerpo),
    cierre: sustituir(TEXTOS.tension.cierre)
  };
}

// Sección 7.3: el matiz depende solo del arquetipo dominante.
export function seccionContexto(dominante, condiciones = {}) {
  const activas = CONDICIONES.filter((c) => condiciones[c] === true);
  if (activas.length === 0) return null;
  const bloques = activas.map((condicion) => {
    const texto = TEXTOS.contexto[condicion];
    return {
      condicion,
      general: texto.general,
      matiz: texto.matices[dominante] ?? null
    };
  });
  return {
    encabezado: { ...TEXTOS.contexto.encabezado },
    bloques,
    cierre: activas.length >= 2 ? TEXTOS.contexto.variasCondiciones : null
  };
}

// Sección 7.5. Si la categoría coincide con el secundario no hay texto (null).
export function notaCategoria(dominante, secundario, arquetipoCategoria) {
  if (!arquetipoCategoria) return null;
  if (arquetipoCategoria === dominante) return TEXTOS.notaCategoria.coincideDominante;
  if (arquetipoCategoria === secundario) return null;
  return TEXTOS.notaCategoria.distinta;
}

// Sección 10: «sí» solo si la categoría coincide con el dominante.
export function esCategoriaSaturada(dominante, arquetipoCategoria) {
  return Boolean(arquetipoCategoria) && arquetipoCategoria === dominante;
}

function resultadoAlerta(calculo) {
  const [a, b, c] = calculo.rankingDiscriminante;
  const nombre = (codigo) => ARQUETIPOS[codigo].nombre;
  return {
    alerta: true,
    mensaje: {
      titulo: TEXTOS.alerta.titulo,
      cuerpo: TEXTOS.alerta.cuerpo
        .replace('{a}', nombre(a))
        .replace('{b}', nombre(b))
        .replace('{c}', nombre(c)),
      pie: TEXTOS.alerta.pie
    },
    desglose: [a, b, c].map((codigo) => ({
      codigo,
      nombre: nombre(codigo),
      discriminante: calculo.discriminante[codigo]
    })),
    cierre: TEXTOS.cierre
  };
}

// `contexto` = { modo, clientes_vulnerables, restriccion_normativa, consecuencias_graves, arquetipo_categoria }
export function componerResultado(calculo, contexto = {}) {
  if (calculo.alerta) return resultadoAlerta(calculo);

  const { dominante, secundario } = calculo;
  const d = ARQUETIPOS[dominante];
  const s = ARQUETIPOS[secundario];

  return {
    alerta: false,
    dominante: { codigo: d.codigo, nombre: d.nombre, color: d.color, porcentaje: calculo.porcentajeDominante },
    secundario: { codigo: s.codigo, nombre: s.nombre, color: s.color, porcentaje: calculo.porcentajeSecundario },
    frase: fraseCombinada(dominante, secundario),
    queEs: d.ficha.queEs,
    paraQueSirve: d.ficha.paraQueSirve,
    aviso: d.ficha.aviso ?? null,
    tension: textoTension(dominante, secundario),
    puede: [...d.ficha.puede],
    noDebe: [...d.ficha.noDebe],
    contexto: seccionContexto(dominante, contexto),
    sombra: d.ficha.sombra,
    voz: [...d.ficha.voz],
    paleta: { acento: d.color, complemento: s.color, fondo: '#FFFFFF', texto: '#000000' },
    notaFundador: contexto.modo === 'fundador' ? TEXTOS.notaFundador : null,
    notaCategoria: notaCategoria(dominante, secundario, contexto.arquetipo_categoria),
    cierre: TEXTOS.cierre
  };
}
