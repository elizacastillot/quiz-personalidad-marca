import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CLAVES_HOJA, construirCarga, enviar } from '../src/js/envio.js';
import { URL_APPS_SCRIPT } from '../src/js/config.js';
import { calcular } from '../src/js/puntuacion.js';
import { componerResultado } from '../src/js/resultado.js';
import { ORDEN_CODIGOS, TEXTOS } from '../src/data/arquetipos.js';
import { alObjetivo, datosAlObjetivo, respuestasAlerta } from './fixtures.js';

const AHORA = new Date('2026-01-15T10:00:00.000Z');

function cargaDe(respuestas, datos = datosAlObjetivo, libres = {}) {
  const calculo = calcular(respuestas);
  const contexto = {
    modo: datos.modo,
    clientes_vulnerables: respuestas.P1 === true,
    restriccion_normativa: respuestas.P2 === true,
    consecuencias_graves: respuestas.P3 === true,
    arquetipo_categoria: respuestas.P35
  };
  const resultado = componerResultado(calculo, contexto);
  return construirCarga({ datos, respuestas, libres, calculo, resultado, ahora: AHORA });
}

test('CLAVES_HOJA: 23 claves que coinciden con COLUMNAS de docs/apps-script.gs', () => {
  assert.equal(CLAVES_HOJA.length, 23);
  const script = readFileSync(new URL('../docs/apps-script.gs', import.meta.url), 'utf8');
  const bloque = script.match(/const COLUMNAS = \[([\s\S]*?)\];/)[1];
  const columnas = [...bloque.matchAll(/'([^']+)'/g)].map((m) => m[1]);
  assert.deepEqual(CLAVES_HOJA, columnas);
});

test('construirCarga: exactamente las 23 claves y los valores de «Al Objetivo»', () => {
  const carga = cargaDe(alObjetivo);
  assert.deepEqual(Object.keys(carga), CLAVES_HOJA);
  assert.equal(carga.fecha, '2026-01-15T10:00:00.000Z');
  assert.equal(carga.nombre, 'Elizabeth Castillo');
  assert.equal(carga.marca, 'Al Objetivo');
  assert.equal(carga.email, 'hola@example.com');
  assert.equal(carga.modo, 'marca');
  assert.equal(carga.sector, 'servicios_profesionales');
  assert.equal(carga.sector_otro, '');
  assert.equal(carga.arquetipo_dominante, 'MA');
  assert.equal(carga.porcentaje_dominante, 62);
  assert.equal(carga.arquetipo_secundario, 'HC');
  assert.equal(carga.porcentaje_secundario, 38);
  assert.equal(carga.arquetipo_tercero, 'BU');
  assert.equal(carga.alerta_sin_definir, 'no');
  assert.equal(carga.tension_dominante_secundario, 'sí');
  assert.equal(carga.arquetipo_categoria, 'SA');
  assert.equal(carga.categoria_saturada, 'no');
  assert.equal(carga.puntuaciones_totales, 'IN=3; SA=1; EX=-1; HE=2; RE=4; MA=23; HC=14; AM=4; BU=5; CU=3; CR=-2; GO=-2');
  assert.equal(carga.puntuaciones_discriminantes, 'IN=3; SA=1; EX=-1; HE=-4; RE=-2; MA=17; HC=12; AM=2; BU=3; CU=3; CR=-2; GO=-2');
});

test('sí/no con tilde y sector_otro solo si el sector es «otro»', () => {
  const carga = cargaDe({ ...alObjetivo, P1: true, P3: true });
  assert.equal(carga.clientes_vulnerables, 'sí');
  assert.equal(carga.restriccion_normativa, 'no');
  assert.equal(carga.consecuencias_graves, 'sí');

  const otro = cargaDe(alObjetivo, { ...datosAlObjetivo, sector: 'otro', sectorOtro: 'Cerámica' });
  assert.equal(otro.sector, 'otro');
  assert.equal(otro.sector_otro, 'Cerámica');
  const noOtro = cargaDe(alObjetivo, { ...datosAlObjetivo, sector: 'legal_y_fiscal', sectorOtro: 'resto de un cambio' });
  assert.equal(noOtro.sector_otro, '');
});

test('El sector sale como identificador, no como texto largo', () => {
  const carga = cargaDe(alObjetivo);
  assert.equal(carga.sector, 'servicios_profesionales');
  assert.doesNotMatch(carga.sector, /[ (]/);
});

test('Arquetipos como códigos de dos letras; sin P35, categoría vacía', () => {
  const carga = cargaDe(alObjetivo);
  for (const k of ['arquetipo_dominante', 'arquetipo_secundario', 'arquetipo_tercero', 'arquetipo_categoria']) {
    assert.match(carga[k], /^[A-Z]{2}$/, k);
  }
  const sinP35 = { ...alObjetivo };
  delete sinP35.P35;
  const c2 = cargaDe(sinP35);
  assert.equal(c2.arquetipo_categoria, '');
  assert.equal(c2.categoria_saturada, 'no');
});

test('categoria_saturada: sí solo si coincide con el dominante', () => {
  assert.equal(cargaDe({ ...alObjetivo, P35: 'MA' }).categoria_saturada, 'sí');
  assert.equal(cargaDe({ ...alObjetivo, P35: 'HC' }).categoria_saturada, 'no');
  assert.equal(cargaDe({ ...alObjetivo, P35: 'SA' }).categoria_saturada, 'no');
});

test('Puntuaciones: 12 pares CODIGO=valor en orden', () => {
  const carga = cargaDe(alObjetivo);
  for (const k of ['puntuaciones_totales', 'puntuaciones_discriminantes']) {
    const pares = carga[k].split('; ');
    assert.equal(pares.length, 12);
    assert.deepEqual(pares.map((p) => p.split('=')[0]), ORDEN_CODIGOS);
    for (const p of pares) assert.match(p, /^[A-Z]{2}=-?\d+$/);
  }
});

test('campos_libres y respuestas_abiertas: solo con texto', () => {
  const vacio = cargaDe(alObjetivo);
  assert.equal(vacio.campos_libres, '');
  assert.equal(vacio.respuestas_abiertas, '');

  const lleno = cargaDe(
    { ...alObjetivo, P36: 'Me cansa el humo', P39: '  Que soy cercana  ', P40: '   ' },
    datosAlObjetivo,
    { 2: 'ninguna encaja', 3: '', 5: '  otra cosa ' }
  );
  assert.equal(lleno.campos_libres, 'B2: ninguna encaja | B5: otra cosa');
  assert.equal(lleno.respuestas_abiertas, 'P36: Me cansa el humo | P39: Que soy cercana');
});

test('Sin respuestas: porcentajes vacíos y alerta sí', () => {
  const carga = cargaDe({}, { ...datosAlObjetivo });
  assert.equal(carga.porcentaje_dominante, '');
  assert.equal(carga.porcentaje_secundario, '');
  assert.equal(carga.alerta_sin_definir, 'sí');
  assert.deepEqual(Object.keys(carga), CLAVES_HOJA);
});

test('Los valores que empiezan por = + - @ salen con apóstrofo delante', () => {
  const carga = cargaDe(alObjetivo, {
    ...datosAlObjetivo,
    nombre: '=SUMA(1;2)',
    marca: '+34 marca',
    email: '@raro',
    sector: 'otro',
    sectorOtro: '-fórmula'
  });
  assert.equal(carga.nombre, "'=SUMA(1;2)");
  assert.equal(carga.marca, "'+34 marca");
  assert.equal(carga.email, "'@raro");
  assert.equal(carga.sector_otro, "'-fórmula");
});

test('enviar: POST text/plain, una sola llamada y cuerpo JSON', () => {
  const original = globalThis.fetch;
  const llamadas = [];
  globalThis.fetch = (url, opciones) => {
    llamadas.push({ url, opciones });
    return Promise.resolve({ ok: true });
  };
  try {
    const carga = cargaDe(alObjetivo);
    enviar(carga);
    assert.equal(llamadas.length, 1);
    assert.equal(llamadas[0].url, URL_APPS_SCRIPT);
    assert.equal(llamadas[0].opciones.method, 'POST');
    assert.equal(llamadas[0].opciones.headers['Content-Type'], 'text/plain;charset=utf-8');
    for (const v of Object.values(llamadas[0].opciones.headers)) assert.doesNotMatch(v, /application\/json/);
    assert.equal(llamadas[0].opciones.body, JSON.stringify(carga));
  } finally {
    globalThis.fetch = original;
  }
});

test('enviar no lanza si fetch falla, de forma asíncrona o síncrona', async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = () => Promise.reject(new Error('sin red'));
    assert.doesNotThrow(() => enviar({}));
    await new Promise((r) => setTimeout(r, 10)); // sin rechazo sin capturar
    globalThis.fetch = () => {
      throw new Error('fallo síncrono');
    };
    assert.doesNotThrow(() => enviar({}));
  } finally {
    globalThis.fetch = original;
  }
});

test('URL_APPS_SCRIPT configurada', () => {
  assert.equal(
    URL_APPS_SCRIPT,
    'https://script.google.com/macros/s/AKfycbz6j99B4irmmeFJbqub6H2LAr7vYh7rUxJ17Ljzq593Oj4_ZgXmOvE04YJSZfOAdCWylw/exec'
  );
});

test('La carga no cambia con la alerta: mismas 23 claves y sin textos de la pantalla', () => {
  for (const modo of ['marca', 'fundador']) {
    const carga = cargaDe(respuestasAlerta, { ...datosAlObjetivo, modo });
    assert.deepEqual(Object.keys(carga), CLAVES_HOJA);
    assert.equal(carga.alerta_sin_definir, 'sí');
    assert.equal(carga.arquetipo_dominante, 'HE');
    assert.equal(carga.arquetipo_secundario, 'MA');
    assert.equal(carga.arquetipo_tercero, 'RE');
    const textos = [TEXTOS.alerta.explicacion, ...Object.values(TEXTOS.alerta.arquetipos)];
    for (const valor of Object.values(carga)) {
      for (const t of textos) assert.ok(!String(valor).includes(t));
    }
  }
});
