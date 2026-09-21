import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calcular,
  puntuarAncla,
  puntuarDiscriminante,
  ordenarArquetipos,
  calcularPorcentajes,
  detectarAlerta,
  esTension
} from '../src/js/puntuacion.js';
import { ORDEN_CODIGOS } from '../src/data/arquetipos.js';
import { alObjetivo } from './fixtures.js';

const CODIGOS = [...ORDEN_CODIGOS];

function esperar(mapa, esperados) {
  for (const c of CODIGOS) assert.equal(mapa[c], esperados[c] ?? 0, `${c}`);
}

function mapa(valores) {
  return Object.fromEntries(CODIGOS.map((c) => [c, valores[c] ?? 0]));
}

test('Bloque 2: pesos aislados', () => {
  const r = { P4: 'ESTABILIDAD' };
  esperar(puntuarAncla(r), { CU: 2, CR: 2, GO: 2 });
  esperar(puntuarDiscriminante(r), {});
  const cuatro = { P4: 'MAESTRIA', P5: 'MAESTRIA', P6: 'MAESTRIA', P7: 'MAESTRIA' };
  esperar(puntuarAncla(cuatro), { HE: 8, RE: 8, MA: 8 });
  esperar(puntuarAncla({ P4: 'INVENTADA' }), {});
});

test('Bloque 3: +3 al más, -2 al menos; la misma opción en ambos se ignora', () => {
  const r = { P8: { mas: 'IN', menos: 'SA' } };
  esperar(puntuarDiscriminante(r), { IN: 3, SA: -2 });
  assert.equal(calcular(r).marcasMas.IN, 1);
  esperar(puntuarDiscriminante({ P8: { mas: 'IN', menos: 'IN' } }), {});
  esperar(puntuarDiscriminante({ P8: { mas: 'IN' } }), {});
});

test('Bloque 4: -2 al elegido', () => {
  esperar(puntuarDiscriminante({ P20: 'GO' }), { GO: -2 });
});

test('Bloque 5: +2 al elegido', () => {
  esperar(puntuarDiscriminante({ P23: 'RE' }), { RE: 2 });
});

test('Bloque 6: pesos por posición, leyendo la tabla de datos', () => {
  // P29: izquierda HC, IN; derecha GO, SA
  esperar(puntuarDiscriminante({ P29: 1 }), { HC: 2, IN: 2 });
  esperar(puntuarDiscriminante({ P29: 2 }), { HC: 1, IN: 1 });
  esperar(puntuarDiscriminante({ P29: 3 }), {});
  esperar(puntuarDiscriminante({ P29: 4 }), { GO: 1, SA: 1 });
  esperar(puntuarDiscriminante({ P29: 5 }), { GO: 2, SA: 2 });
  // P34: izquierda EX, BU; derecha AM, MA
  esperar(puntuarDiscriminante({ P34: 1 }), { EX: 2, BU: 2 });
  esperar(puntuarDiscriminante({ P34: 2 }), { EX: 1, BU: 1 });
  esperar(puntuarDiscriminante({ P34: 4 }), { AM: 1, MA: 1 });
  esperar(puntuarDiscriminante({ P34: 5 }), { AM: 2, MA: 2 });
  // Valores fuera de rango se ignoran.
  esperar(puntuarDiscriminante({ P29: 0 }), {});
  esperar(puntuarDiscriminante({ P29: 6 }), {});
});

test('Los bloques 1 y 7 (y el sector) no cambian nada', () => {
  const base = calcular(alObjetivo);
  const variada = {
    ...alObjetivo,
    P1: true, P2: true, P3: true,
    P35: 'MA',
    P36: 'texto', P37: 'texto', P38: 'x', P39: 'x', P40: 'x', P41: 'x', P42: 'x', P43: 'x'
  };
  assert.deepEqual(calcular(variada), base);
  const sinNada = { ...alObjetivo };
  for (const id of ['P1', 'P2', 'P3', 'P35']) delete sinNada[id];
  assert.deepEqual(calcular(sinNada), base);
});

test('El sector no interviene: calcular solo lee las respuestas', () => {
  assert.equal(calcular.length, 1);
  const a = calcular(alObjetivo);
  const b = calcular(alObjetivo, { sector: 'legal_y_fiscal', modo: 'fundador' });
  assert.deepEqual(a, b);
  // Una clave «datos» dentro de las respuestas tampoco cuenta.
  assert.deepEqual(calcular({ ...alObjetivo, datos: { sector: 'otro' }, sector: 'otro' }), a);
});

test('Suma de rangos', () => {
  const r = calcular(alObjetivo);
  const suma = (m) => CODIGOS.reduce((acc, c) => acc + m[c], 0);
  assert.equal(suma(r.total), 54);
  assert.equal(suma(r.discriminante), 30);
  assert.equal(suma(r.ancla), 24);

  // Mejor caso: MA gana los 4 «MÁS» y elige 4 veces su motivación; sube al máximo del bloque 5 y 6.
  const mejor = {
    P4: 'MAESTRIA', P5: 'MAESTRIA', P6: 'MAESTRIA', P7: 'MAESTRIA',
    P12: { mas: 'MA', menos: 'HE' }, P13: { mas: 'MA', menos: 'RE' },
    P17: { mas: 'MA', menos: 'HC' }, P19: { mas: 'MA', menos: 'SA' },
    P27: 'MA',
    P33: 5, P34: 5
  };
  assert.equal(calcular(mejor).total.MA, 8 + 12 + 2 + 2 + 2);
  assert.equal(calcular(mejor).total.MA, 26);

  // Peor caso: CR, 4 veces «MENOS» (-8) y elegido en el bloque 4 (-2).
  const peor = {
    P11: { mas: 'HE', menos: 'CR' }, P13: { mas: 'RE', menos: 'CR' },
    P14: { mas: 'HC', menos: 'CR' }, P16: { mas: 'AM', menos: 'CR' },
    P22: 'CR'
  };
  assert.equal(calcular(peor).total.CR, -10);
});

test('Alerta que salta con un cuadrante claro pero comportamiento plano', () => {
  const r = calcular({
    P4: 'MAESTRIA', P5: 'MAESTRIA', P6: 'MAESTRIA', P7: 'MAESTRIA',
    P23: 'GO', P24: 'CU', P25: 'SA'
  });
  esperar(r.total, { HE: 8, RE: 8, MA: 8, GO: 2, CU: 2, SA: 2 });
  esperar(r.discriminante, { GO: 2, CU: 2, SA: 2 });
  assert.equal(r.alerta, true);
  assert.deepEqual([r.dominante, r.secundario, r.tercero], ['HE', 'MA', 'RE']);
  assert.deepEqual(r.rankingDiscriminante.slice(0, 3), ['CU', 'GO', 'SA']);
});

test('Alerta que no salta con cuadrante claro y comportamiento definido', () => {
  const r = calcular(alObjetivo);
  assert.equal(r.alerta, false);
  assert.equal(r.ancla.HE, r.ancla.RE);
  assert.equal(r.ancla.RE, r.ancla.MA);
});

test('Límites de la alerta', () => {
  const d = (a, b, c) => mapa({ IN: a, SA: b, EX: c });
  assert.equal(detectarAlerta(d(10, 9, 6)), true); // 10/19 = 52,6 %
  assert.equal(detectarAlerta(d(11, 9, 6)), false); // 55 % exacto, 6 < 7
  assert.equal(detectarAlerta(d(12, 9, 7)), true); // 7 >= 7
  assert.equal(detectarAlerta(d(12, 9, 6)), false); // 57,1 %, 6 < 7
  // d3 = d2 - 3 no salta por la condición 1: con proporción alta, no hay alerta.
  assert.equal(detectarAlerta(d(20, 10, 7)), false);
  assert.equal(detectarAlerta(d(20, 10, 8)), true);
});

test('Discriminantes negativas', () => {
  assert.doesNotThrow(() => detectarAlerta(mapa({ IN: -1, SA: -3, EX: -5, HE: -6, RE: -7, MA: -8, HC: -9, AM: -9, BU: -9, CU: -9, CR: -9, GO: -9 })));
  assert.equal(
    detectarAlerta(mapa({ IN: -1, SA: -3, EX: -5, HE: -6, RE: -7, MA: -8, HC: -9, AM: -9, BU: -9, CU: -9, CR: -9, GO: -9 })),
    true
  );
  // d = (5, -4, -9): d2 se recorta a 0 -> 100 %; -9 >= -6 es falso -> no salta.
  const m = mapa({ IN: 5, SA: -4, EX: -9, HE: -20, RE: -20, MA: -20, HC: -20, AM: -20, BU: -20, CU: -20, CR: -20, GO: -20 });
  assert.equal(detectarAlerta(m), false);
});

test('Empate en el primero: gana quien tiene más marcas «MÁS»', () => {
  const orden = ordenarArquetipos(mapa({ IN: 5, SA: 5 }), mapa({ IN: 0, SA: 1 }));
  assert.equal(orden[0], 'SA');
  assert.equal(orden[1], 'IN');
});

test('Empate persistente: orden alfabético del nombre', () => {
  const orden = ordenarArquetipos(mapa({ IN: 5, SA: 5 }), mapa({}));
  assert.deepEqual(orden.slice(0, 2), ['IN', 'SA']);
  const r = calcular({ P4: 'INDEPENDENCIA', P5: 'INDEPENDENCIA', P6: 'INDEPENDENCIA', P7: 'INDEPENDENCIA' });
  assert.deepEqual([r.dominante, r.secundario, r.tercero], ['EX', 'IN', 'SA']);
});

test('Empate en segunda y tercera posición', () => {
  const total = mapa({ MA: 10, HE: 6, RE: 6, CU: 6 });
  assert.deepEqual(ordenarArquetipos(total, mapa({ HE: 0, RE: 2, CU: 1 })).slice(0, 4), ['MA', 'RE', 'CU', 'HE']);
  assert.deepEqual(ordenarArquetipos(total, mapa({})).slice(0, 4), ['MA', 'CU', 'HE', 'RE']);
});

test('Orden alfabético completo', () => {
  const orden = ordenarArquetipos(mapa({}), mapa({}));
  const nombres = {
    AM: 'Amante', BU: 'Bufón', CR: 'Creador', CU: 'Cuidador', EX: 'Explorador', GO: 'Gobernante',
    HE: 'Héroe', HC: 'Hombre común', IN: 'Inocente', MA: 'Mago', RE: 'Rebelde', SA: 'Sabio'
  };
  assert.deepEqual(orden.map((c) => nombres[c]), [
    'Amante', 'Bufón', 'Creador', 'Cuidador', 'Explorador', 'Gobernante',
    'Héroe', 'Hombre común', 'Inocente', 'Mago', 'Rebelde', 'Sabio'
  ]);
});

test('División por cero', () => {
  const r = calcular({});
  assert.equal(r.alerta, true);
  assert.equal(r.porcentajeDominante, null);
  assert.equal(r.porcentajeSecundario, null);
  assert.doesNotThrow(() => calcular(undefined));
  assert.deepEqual(calcularPorcentajes(0, 0), { dominante: null, secundario: null });
  assert.deepEqual(calcularPorcentajes(-3, 0), { dominante: null, secundario: null });
});

test('Porcentajes', () => {
  assert.deepEqual(calcularPorcentajes(23, 14), { dominante: 62, secundario: 38 });
  assert.deepEqual(calcularPorcentajes(10, 10), { dominante: 50, secundario: 50 });
  assert.deepEqual(calcularPorcentajes(10, -3), { dominante: 100, secundario: 0 });
  assert.deepEqual(calcularPorcentajes(5, 3), { dominante: 63, secundario: 37 });
  assert.deepEqual(calcularPorcentajes(29, 11), { dominante: 73, secundario: 27 });
});

test('Tensiones', () => {
  const pares = [['GO', 'RE'], ['CU', 'EX'], ['SA', 'BU'], ['HE', 'IN'], ['MA', 'HC'], ['AM', 'CR']];
  for (const [a, b] of pares) {
    assert.equal(esTension(a, b), true, `${a}-${b}`);
    assert.equal(esTension(b, a), true, `${b}-${a}`);
  }
  assert.equal(esTension('IN', 'SA'), false);
  assert.equal(esTension('GO', 'CU'), false);
  assert.equal(esTension('MA', 'MA'), false);
  assert.equal(esTension('HC', 'BU'), false);
});

test('Caso «Al Objetivo»: Mago dominante, Hombre común secundario', () => {
  const r = calcular(alObjetivo);
  esperar(r.discriminante, { IN: 3, SA: 1, EX: -1, HE: -4, RE: -2, MA: 17, HC: 12, AM: 2, BU: 3, CU: 3, CR: -2, GO: -2 });
  esperar(r.ancla, { HE: 6, RE: 6, MA: 6, HC: 2, AM: 2, BU: 2 });
  esperar(r.total, { IN: 3, SA: 1, EX: -1, HE: 2, RE: 4, MA: 23, HC: 14, AM: 4, BU: 5, CU: 3, CR: -2, GO: -2 });
  esperar(r.marcasMas, { SA: 1, EX: 1, MA: 4, HC: 3, AM: 1, BU: 1, CU: 1 });
  assert.equal(r.dominante, 'MA');
  assert.equal(r.secundario, 'HC');
  assert.equal(r.tercero, 'BU');
  assert.equal(r.porcentajeDominante, 62);
  assert.equal(r.porcentajeSecundario, 38);
  assert.equal(r.alerta, false);
  assert.equal(r.tension, true);
});
