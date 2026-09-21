import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  fraseCombinada,
  textoTension,
  seccionContexto,
  notaCategoria,
  esCategoriaSaturada,
  componerResultado,
  parrafosAlerta,
  ORDEN_SECCIONES,
  ORDEN_SECCIONES_ALERTA
} from '../src/js/resultado.js';
import { calcular } from '../src/js/puntuacion.js';
import { ARQUETIPOS, ORDEN_CODIGOS, TEXTOS, TENSIONES } from '../src/data/arquetipos.js';
import { alObjetivo, respuestasAlerta, alertaPorEstabilidad } from './fixtures.js';

const CODIGOS = [...ORDEN_CODIGOS];
const sinCondiciones = {
  modo: 'marca',
  clientes_vulnerables: false,
  restriccion_normativa: false,
  consecuencias_graves: false,
  arquetipo_categoria: 'SA'
};
const minuscula = (t) => t.charAt(0).toLocaleLowerCase('es') + t.slice(1);

test('Frase combinada: 132 combinaciones', () => {
  let n = 0;
  for (const d of CODIGOS) {
    for (const s of CODIGOS) {
      if (d === s) continue;
      const frase = fraseCombinada(d, s);
      n += 1;
      assert.ok(frase.startsWith('Tu marca '));
      assert.ok(frase.endsWith('.'));
      assert.ok(frase.includes(ARQUETIPOS[d].ficha.promesa));
      assert.ok(frase.includes(ARQUETIPOS[s].ficha.manera));
      assert.ok(!frase.includes('{'));
    }
  }
  assert.equal(n, 132);
  assert.equal(
    fraseCombinada('MA', 'HC'),
    'Tu marca cambia la manera en que ves tu negocio, hablando como quien habla con un vecino.'
  );
  assert.throws(() => fraseCombinada('IN', 'IN'));
});

test('Tensión: 6 pares en ambos órdenes, con el dominante primero', () => {
  for (const [a, b] of TENSIONES) {
    for (const [d, s] of [[a, b], [b, a]]) {
      const t = textoTension(d, s);
      const esperado = `${ARQUETIPOS[d].nombre} quiere ${minuscula(ARQUETIPOS[d].deseoCentral)} y ${ARQUETIPOS[s].nombre} quiere ${minuscula(ARQUETIPOS[s].deseoCentral)}`;
      assert.ok(t.cuerpo.startsWith(esperado), `${d}-${s}`);
      assert.equal(t.titulo, TEXTOS.tension.titulo);
      assert.equal(t.cierre, TEXTOS.tension.cierre);
      assert.doesNotMatch(t.titulo + t.cuerpo + t.cierre, /[{}]/);
    }
  }
  assert.ok(textoTension('SA', 'BU').cuerpo.includes('El Sabio quiere comprender la verdad y El Bufón quiere disfrutar el momento'));
  assert.ok(textoTension('BU', 'SA').cuerpo.includes('El Bufón quiere disfrutar el momento y El Sabio quiere comprender la verdad'));
  assert.ok(textoTension('MA', 'HC').cuerpo.includes('El Mago quiere transformar la realidad y El Hombre común quiere pertenecer y conectar.'));
  assert.equal(textoTension('IN', 'SA'), null);
});

test('Contexto 7.3', () => {
  const cond = (v, r, g) => ({ clientes_vulnerables: v, restriccion_normativa: r, consecuencias_graves: g });
  assert.equal(seccionContexto('MA', cond(false, false, false)), null);

  const bu = seccionContexto('BU', cond(true, false, false));
  assert.equal(bu.bloques.length, 1);
  assert.equal(bu.bloques[0].condicion, 'clientes_vulnerables');
  assert.equal(bu.bloques[0].general, TEXTOS.contexto.clientes_vulnerables.general);
  assert.equal(bu.bloques[0].matiz, TEXTOS.contexto.clientes_vulnerables.matices.BU);
  assert.equal(bu.cierre, null);
  assert.equal(bu.encabezado.titulo, 'Tu arquetipo no cambia. La forma de expresarlo, sí.');

  const inn = seccionContexto('IN', cond(true, false, false));
  assert.equal(inn.bloques[0].matiz, null);
  assert.ok(inn.bloques[0].general.length > 0);

  const am = seccionContexto('AM', cond(false, true, false));
  const bu2 = seccionContexto('BU', cond(false, true, false));
  assert.equal(am.bloques[0].matiz, bu2.bloques[0].matiz);
  assert.ok(am.bloques[0].matiz);

  const hc = seccionContexto('HC', cond(false, false, true));
  assert.equal(hc.bloques[0].matiz, TEXTOS.contexto.consecuencias_graves.matices.HC);

  const dos = seccionContexto('MA', cond(true, false, true));
  assert.equal(dos.bloques.length, 2);
  assert.equal(dos.cierre, TEXTOS.contexto.variasCondiciones);
  const tres = seccionContexto('MA', cond(true, true, true));
  assert.equal(tres.cierre, TEXTOS.contexto.variasCondiciones);
  assert.deepEqual(tres.bloques.map((b) => b.condicion), ['clientes_vulnerables', 'restriccion_normativa', 'consecuencias_graves']);
});

test('El matiz depende del dominante, no del secundario', () => {
  // MA dominante con HE secundario: el matiz es el de MA, no el de HE.
  const c = calcular(alObjetivo);
  const r = componerResultado({ ...c, dominante: 'MA', secundario: 'HE', tension: false }, { ...sinCondiciones, clientes_vulnerables: true });
  assert.equal(r.contexto.bloques[0].matiz, TEXTOS.contexto.clientes_vulnerables.matices.MA);
});

test('Nota de modo fundador', () => {
  const c = calcular(alObjetivo);
  assert.equal(componerResultado(c, { ...sinCondiciones, modo: 'fundador' }).notaFundador, TEXTOS.notaFundador);
  assert.equal(componerResultado(c, { ...sinCondiciones, modo: 'marca' }).notaFundador, null);
});

test('Nota de categoría', () => {
  assert.equal(notaCategoria('MA', 'HC', 'MA'), TEXTOS.notaCategoria.coincideDominante);
  assert.equal(notaCategoria('MA', 'HC', 'SA'), TEXTOS.notaCategoria.distinta);
  assert.equal(notaCategoria('MA', 'HC', 'HC'), null);
  assert.equal(notaCategoria('MA', 'HC', undefined), null);
  assert.equal(notaCategoria('MA', 'HC', ''), null);
});

test('esCategoriaSaturada', () => {
  assert.equal(esCategoriaSaturada('MA', 'MA'), true);
  assert.equal(esCategoriaSaturada('MA', 'HC'), false);
  assert.equal(esCategoriaSaturada('MA', 'SA'), false);
  assert.equal(esCategoriaSaturada('MA', undefined), false);
  assert.equal(esCategoriaSaturada('MA', ''), false);
});

test('Paleta y colores', () => {
  const r = componerResultado(calcular(alObjetivo), sinCondiciones);
  assert.deepEqual(r.paleta, { acento: '#2E7D8C', complemento: '#8B7355', fondo: '#FFFFFF', texto: '#000000' });
  assert.equal(r.dominante.color, '#2E7D8C');
  assert.equal(r.secundario.color, '#8B7355');
});

test('Orden de la pantalla de resultado (sección 8)', () => {
  assert.deepEqual(ORDEN_SECCIONES, [
    'dominante', 'secundario', 'frase', 'queEs', 'paraQueSirve', 'tension', 'puede', 'noDebe',
    'contexto', 'sombra', 'voz', 'paleta', 'notaFundador', 'notaCategoria', 'descarga', 'cierre'
  ]);
});

test('Aviso del Héroe: solo si HE es dominante', () => {
  const c = calcular(alObjetivo);
  const base = { ...c, tension: false };
  const heDom = componerResultado({ ...base, dominante: 'HE', secundario: 'MA' }, sinCondiciones);
  assert.equal(heDom.aviso, ARQUETIPOS.HE.ficha.aviso);
  const heSec = componerResultado({ ...base, dominante: 'MA', secundario: 'HE' }, sinCondiciones);
  assert.equal(heSec.aviso, null);
  assert.equal(componerResultado(c, sinCondiciones).aviso, null);
});

test('Alerta: mensaje, explicación, párrafos, desglose y cierre', () => {
  const c = calcular(respuestasAlerta);
  assert.equal(c.alerta, true);
  for (const modo of ['marca', 'fundador']) {
    const r = componerResultado(c, { ...sinCondiciones, modo });
    assert.deepEqual(Object.keys(r).sort(), ['alerta', 'arquetipos', 'cierre', 'desglose', 'explicacion', 'mensaje']);
    for (const clave of ['frase', 'puede', 'noDebe', 'notaFundador', 'notaCategoria', 'descarga']) assert.ok(!(clave in r), clave);
    assert.equal(r.alerta, true);
    assert.ok(r.mensaje.cuerpo.includes('El Cuidador, El Gobernante y El Sabio'));
    assert.doesNotMatch(r.mensaje.cuerpo, /[{}]/);
    assert.equal(r.mensaje.titulo, 'Tu marca todavía no ha elegido un carácter.');
    assert.deepEqual(r.desglose, [
      { codigo: 'CU', nombre: 'El Cuidador', discriminante: 2 },
      { codigo: 'GO', nombre: 'El Gobernante', discriminante: 2 },
      { codigo: 'SA', nombre: 'El Sabio', discriminante: 2 }
    ]);
    assert.equal(r.cierre, 'Esto es el punto de partida. Lo afinamos juntas en la sesión.');
  }
});

test('Caso «Al Objetivo» completo', () => {
  const c = calcular(alObjetivo);
  const r = componerResultado(c, sinCondiciones);
  assert.equal(r.alerta, false);
  assert.equal(r.dominante.codigo, 'MA');
  assert.equal(r.dominante.porcentaje, 62);
  assert.equal(r.secundario.codigo, 'HC');
  assert.equal(r.secundario.porcentaje, 38);
  assert.equal(r.frase, 'Tu marca cambia la manera en que ves tu negocio, hablando como quien habla con un vecino.');
  assert.ok(r.tension.cuerpo.includes('El Mago quiere transformar la realidad y El Hombre común quiere pertenecer y conectar.'));
  assert.equal(r.aviso, null);
  assert.equal(r.contexto, null);
  assert.equal(r.notaFundador, null);
  assert.equal(r.notaCategoria, TEXTOS.notaCategoria.distinta);
  assert.equal(r.puede.length, 4);
  assert.equal(r.noDebe.length, 3);
  assert.equal(r.voz.length, 3);

  const vul = componerResultado(c, { ...sinCondiciones, clientes_vulnerables: true });
  assert.equal(vul.contexto.bloques.length, 1);
  assert.equal(vul.contexto.bloques[0].matiz, TEXTOS.contexto.clientes_vulnerables.matices.MA);
  assert.equal(vul.contexto.cierre, null);

  const fundador = componerResultado(c, { ...sinCondiciones, modo: 'fundador' });
  assert.equal(fundador.notaFundador, TEXTOS.notaFundador);
  assert.deepEqual(calcular(alObjetivo).total, c.total);
});

test('El resultado no incluye las respuestas abiertas', () => {
  const abiertas = { ...alObjetivo, P36: 'ZZZ-secreto-36', P42: 'ZZZ-secreto-42' };
  const r = componerResultado(calcular(abiertas), sinCondiciones);
  assert.ok(!JSON.stringify(r).includes('ZZZ-secreto'));
});

test('Alerta: la explicación es la misma en modo marca y fundador', () => {
  const c = calcular(respuestasAlerta);
  for (const modo of ['marca', 'fundador']) {
    assert.equal(componerResultado(c, { ...sinCondiciones, modo }).explicacion, TEXTOS.alerta.explicacion);
  }
});

test('Alerta: un párrafo por arquetipo, en el orden del mensaje y del desglose', () => {
  const r = componerResultado(calcular(respuestasAlerta), sinCondiciones);
  assert.equal(r.arquetipos.length, 3);
  assert.deepEqual(r.arquetipos.map((a) => a.codigo), ['CU', 'GO', 'SA']);
  assert.deepEqual(r.arquetipos.map((a) => a.codigo), r.desglose.map((d) => d.codigo));
  assert.deepEqual(r.arquetipos.map((a) => a.nombre), ['El Cuidador', 'El Gobernante', 'El Sabio']);
  for (const a of r.arquetipos) {
    assert.deepEqual(Object.keys(a).sort(), ['codigo', 'nombre', 'texto']);
    assert.equal(a.nombre, ARQUETIPOS[a.codigo].nombre);
    assert.equal(a.texto, TEXTOS.alerta.arquetipos[a.codigo]);
  }
});

test('Alerta: los tres párrafos siguen al discriminante, no al total', () => {
  const c = calcular(alertaPorEstabilidad);
  assert.equal(c.alerta, true);
  for (const k of CODIGOS) assert.equal(c.discriminante[k], ['AM', 'IN', 'MA'].includes(k) ? 2 : 0, k);
  assert.deepEqual(c.ranking.slice(0, 3), ['CR', 'CU', 'GO']);
  const r = componerResultado(c, sinCondiciones);
  assert.deepEqual(r.arquetipos.map((a) => a.codigo), ['AM', 'IN', 'MA']);
  assert.deepEqual(r.desglose.map((d) => d.codigo), ['AM', 'IN', 'MA']);
  assert.ok(r.mensaje.cuerpo.includes('El Amante, El Inocente y El Mago'));
});

test('ORDEN_SECCIONES_ALERTA (sección 8)', () => {
  assert.deepEqual([...ORDEN_SECCIONES_ALERTA], ['mensaje', 'explicacion', 'arquetipos', 'desglose', 'descarga', 'cierre']);
  const r = componerResultado(calcular(respuestasAlerta), sinCondiciones);
  for (const id of ORDEN_SECCIONES_ALERTA.filter((x) => x !== 'descarga')) assert.ok(id in r, id);
});

test('parrafosAlerta', () => {
  const p = parrafosAlerta(['CU', 'GO', 'SA']);
  assert.deepEqual(p.map((x) => x.codigo), ['CU', 'GO', 'SA']);
  assert.throws(() => parrafosAlerta(['ZZ']));
  assert.deepEqual(parrafosAlerta([]), []);
});

test('La alerta no contamina el resultado normal', () => {
  const r = componerResultado(calcular(alObjetivo), { ...sinCondiciones, arquetipo_categoria: 'SA' });
  assert.equal(r.alerta, false);
  for (const clave of ['explicacion', 'arquetipos', 'mensaje', 'desglose']) assert.ok(!(clave in r), clave);
});

test('calcular({}) compone la alerta sin error', () => {
  const r = componerResultado(calcular({}), sinCondiciones);
  assert.equal(r.alerta, true);
  assert.deepEqual(r.arquetipos.map((a) => a.codigo), ['AM', 'BU', 'CR']);
  assert.deepEqual(r.desglose.map((d) => d.discriminante), [0, 0, 0]);
});
