// Construcción y envío de la carga a Google Apps Script.
// Fuente: docs/especificacion.md, secciones 9 y 10. No toca el DOM ni localStorage.

import { ORDEN_CODIGOS } from '../data/arquetipos.js';
import { URL_APPS_SCRIPT } from './config.js';
import { esCategoriaSaturada } from './resultado.js';
import { textoSiNo } from './utilidades.js';

// Coincide con COLUMNAS de docs/apps-script.gs: una clave mal escrita llegaría vacía sin error.
export const CLAVES_HOJA = [
  'fecha',
  'nombre',
  'marca',
  'sector',
  'sector_otro',
  'email',
  'modo',
  'clientes_vulnerables',
  'restriccion_normativa',
  'consecuencias_graves',
  'arquetipo_dominante',
  'porcentaje_dominante',
  'arquetipo_secundario',
  'porcentaje_secundario',
  'arquetipo_tercero',
  'alerta_sin_definir',
  'tension_dominante_secundario',
  'arquetipo_categoria',
  'categoria_saturada',
  'puntuaciones_totales',
  'puntuaciones_discriminantes',
  'campos_libres',
  'respuestas_abiertas'
];

const IDS_ABIERTAS = ['P36', 'P37', 'P38', 'P39', 'P40', 'P41', 'P42', 'P43'];

// Evita que Sheets interprete el texto del usuario como fórmula.
function protegerFormula(texto) {
  const t = typeof texto === 'string' ? texto : '';
  return /^[=+\-@]/.test(t) ? `'${t}` : t;
}

function textoPuntuaciones(mapa) {
  return ORDEN_CODIGOS.map((c) => `${c}=${mapa[c]}`).join('; ');
}

function limpio(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

function textoCamposLibres(libres = {}) {
  return Object.keys(libres)
    .map(Number)
    .filter((n) => Number.isInteger(n))
    .sort((a, b) => a - b)
    .filter((n) => limpio(libres[n]) !== '')
    .map((n) => `B${n}: ${limpio(libres[n])}`)
    .join(' | ');
}

function textoAbiertas(respuestas = {}) {
  return IDS_ABIERTAS.filter((id) => limpio(respuestas[id]) !== '')
    .map((id) => `${id}: ${limpio(respuestas[id])}`)
    .join(' | ');
}

// Devuelve un objeto con exactamente CLAVES_HOJA como claves.
export function construirCarga({ datos = {}, respuestas = {}, libres = {}, calculo, resultado, ahora = new Date() }) {
  const esOtro = datos.sector === 'otro';
  const categoria = respuestas.P35 ?? '';
  const pct = (valor) => (valor === null || valor === undefined ? '' : valor);
  const carga = {
    fecha: ahora.toISOString(),
    nombre: protegerFormula(limpio(datos.nombre)),
    marca: protegerFormula(limpio(datos.marca)),
    sector: datos.sector ?? '',
    sector_otro: esOtro ? protegerFormula(limpio(datos.sectorOtro)) : '',
    email: protegerFormula(limpio(datos.email)),
    modo: datos.modo ?? '',
    clientes_vulnerables: textoSiNo(respuestas.P1 === true),
    restriccion_normativa: textoSiNo(respuestas.P2 === true),
    consecuencias_graves: textoSiNo(respuestas.P3 === true),
    arquetipo_dominante: calculo.dominante ?? '',
    porcentaje_dominante: pct(calculo.porcentajeDominante),
    arquetipo_secundario: calculo.secundario ?? '',
    porcentaje_secundario: pct(calculo.porcentajeSecundario),
    arquetipo_tercero: calculo.tercero ?? '',
    alerta_sin_definir: textoSiNo(calculo.alerta),
    tension_dominante_secundario: textoSiNo(calculo.tension),
    arquetipo_categoria: categoria,
    categoria_saturada: textoSiNo(esCategoriaSaturada(calculo.dominante, categoria)),
    puntuaciones_totales: textoPuntuaciones(calculo.total),
    puntuaciones_discriminantes: textoPuntuaciones(calculo.discriminante),
    campos_libres: protegerFormula(textoCamposLibres(libres)),
    respuestas_abiertas: protegerFormula(textoAbiertas(respuestas))
  };
  // Orden y claves exactas de la hoja.
  return Object.fromEntries(CLAVES_HOJA.map((clave) => [clave, carga[clave]]));
}

// Fire and forget. No espera la respuesta y nunca lanza.
export function enviar(carga) {
  if (URL_APPS_SCRIPT === 'PENDIENTE') return;
  try {
    const promesa = fetch(URL_APPS_SCRIPT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(carga)
    });
    if (promesa && typeof promesa.catch === 'function') promesa.catch(() => {});
  } catch {
    // Un fallo de envío no debe romper nada visible.
  }
}
