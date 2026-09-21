// Motor de puntuación. Funciones puras: sin DOM ni localStorage.
// Fuente: docs/especificacion.md, sección 6.

import { ARQUETIPOS, MOTIVACIONES, ORDEN_CODIGOS, TENSIONES } from '../data/arquetipos.js';
import { PREGUNTAS } from '../data/cuestionario.js';

const IDS_BLOQUE_2 = ['P4', 'P5', 'P6', 'P7'];
const IDS_BLOQUE_3 = ['P8', 'P9', 'P10', 'P11', 'P12', 'P13', 'P14', 'P15', 'P16', 'P17', 'P18', 'P19'];
const IDS_BLOQUE_4 = ['P20', 'P21', 'P22'];
const IDS_BLOQUE_5 = ['P23', 'P24', 'P25', 'P26', 'P27', 'P28'];
const IDS_BLOQUE_6 = ['P29', 'P30', 'P31', 'P32', 'P33', 'P34'];

const ESCALAS = Object.fromEntries(
  PREGUNTAS.filter((p) => p.tipo === 'escala').map((p) => [p.id, p])
);

const COLLATOR = new Intl.Collator('es');

function ceros() {
  return Object.fromEntries(ORDEN_CODIGOS.map((c) => [c, 0]));
}

function esCodigo(valor) {
  return typeof valor === 'string' && Object.hasOwn(ARQUETIPOS, valor);
}

// Bloque 2: +2 a cada arquetipo de la motivación elegida, por pregunta.
export function puntuarAncla(respuestas = {}) {
  const ancla = ceros();
  for (const id of IDS_BLOQUE_2) {
    const grupo = MOTIVACIONES[respuestas[id]];
    if (!Array.isArray(grupo) || !Object.hasOwn(MOTIVACIONES, respuestas[id])) continue;
    for (const codigo of grupo) ancla[codigo] += 2;
  }
  return ancla;
}

// Bloques 3 a 6.
export function puntuarDiscriminante(respuestas = {}) {
  const d = ceros();

  for (const id of IDS_BLOQUE_3) {
    const r = respuestas[id];
    if (!r || !esCodigo(r.mas) || !esCodigo(r.menos) || r.mas === r.menos) continue;
    d[r.mas] += 3;
    d[r.menos] -= 2;
  }

  for (const id of IDS_BLOQUE_4) {
    if (esCodigo(respuestas[id])) d[respuestas[id]] -= 2;
  }

  for (const id of IDS_BLOQUE_5) {
    if (esCodigo(respuestas[id])) d[respuestas[id]] += 2;
  }

  for (const id of IDS_BLOQUE_6) {
    const posicion = respuestas[id];
    const escala = ESCALAS[id];
    if (!escala || !Number.isInteger(posicion) || posicion < 1 || posicion > 5) continue;
    if (posicion === 3) continue;
    const lado = posicion < 3 ? escala.izquierda : escala.derecha;
    const peso = Math.abs(posicion - 3);
    for (const codigo of lado.codigos) d[codigo] += peso;
  }

  return d;
}

// Número de veces que cada código es «MÁS» en el bloque 3 (para el desempate).
export function contarMarcasMas(respuestas = {}) {
  const marcas = ceros();
  for (const id of IDS_BLOQUE_3) {
    const r = respuestas[id];
    if (!r || !esCodigo(r.mas) || !esCodigo(r.menos) || r.mas === r.menos) continue;
    marcas[r.mas] += 1;
  }
  return marcas;
}

// Puntuación descendente; empate: más marcas «MÁS»; si persiste, alfabético por nombre.
export function ordenarArquetipos(puntuaciones, marcasMas = {}) {
  return [...ORDEN_CODIGOS].sort((a, b) => {
    const porPuntos = (puntuaciones[b] ?? 0) - (puntuaciones[a] ?? 0);
    if (porPuntos !== 0) return porPuntos;
    const porMarcas = (marcasMas[b] ?? 0) - (marcasMas[a] ?? 0);
    if (porMarcas !== 0) return porMarcas;
    return COLLATOR.compare(ARQUETIPOS[a].nombreCorto, ARQUETIPOS[b].nombreCorto);
  });
}

// p1 y p2 son los totales de las posiciones 1 y 2, sin recortar.
export function calcularPorcentajes(p1, p2) {
  const a = Math.max(0, p1);
  const b = Math.max(0, p2);
  if (a + b <= 0) return { dominante: null, secundario: null };
  const dominante = Math.round((a * 100) / (a + b));
  return { dominante, secundario: 100 - dominante };
}

// Alerta de marca sin definir, sobre la puntuación discriminante.
export function detectarAlerta(discriminante, marcasMas = {}) {
  const orden = ordenarArquetipos(discriminante, marcasMas);
  const d1 = discriminante[orden[0]];
  const d2 = discriminante[orden[1]];
  const d3 = discriminante[orden[2]];
  if (d3 >= d2 - 2) return true;
  const c1 = Math.max(0, d1);
  const c2 = Math.max(0, d2);
  if (c1 + c2 <= 0) return true;
  return c1 * 100 < 55 * (c1 + c2);
}

export function esTension(a, b) {
  if (a === b) return false;
  return TENSIONES.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}

// Sin parámetro por defecto a propósito: calcular.length === 1 (no recibe el modo ni los datos).
export function calcular(respuestas) {
  const ancla = puntuarAncla(respuestas);
  const discriminante = puntuarDiscriminante(respuestas);
  const marcasMas = contarMarcasMas(respuestas);
  const total = Object.fromEntries(ORDEN_CODIGOS.map((c) => [c, discriminante[c] + ancla[c]]));

  const ranking = ordenarArquetipos(total, marcasMas);
  const rankingDiscriminante = ordenarArquetipos(discriminante, marcasMas);
  const [dominante, secundario, tercero] = ranking;
  const porcentajes = calcularPorcentajes(total[dominante], total[secundario]);

  return {
    total,
    discriminante,
    ancla,
    marcasMas,
    ranking,
    rankingDiscriminante,
    dominante,
    secundario,
    tercero,
    porcentajeDominante: porcentajes.dominante,
    porcentajeSecundario: porcentajes.secundario,
    alerta: detectarAlerta(discriminante, marcasMas),
    tension: esTension(dominante, secundario)
  };
}
