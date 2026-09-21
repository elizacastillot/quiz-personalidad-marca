import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PREGUNTAS, SECTORES, BLOQUES, PREGUNTA_MODO } from '../src/data/cuestionario.js';
import { ARQUETIPOS, MOTIVACIONES, ORDEN_CODIGOS, TEXTOS, TENSIONES } from '../src/data/arquetipos.js';
import { barajar, colorTextoSobre } from '../src/js/utilidades.js';

const CODIGOS = ['IN', 'SA', 'EX', 'HE', 'RE', 'MA', 'HC', 'AM', 'BU', 'CU', 'CR', 'GO'];
const porId = Object.fromEntries(PREGUNTAS.map((p) => [p.id, p]));
const delBloque = (n) => PREGUNTAS.filter((p) => p.bloque === n);

// Tabla de la sección 5 (bloque 3), fijada aquí para que un cambio accidental en los datos falle.
const TABLA_BLOQUE_3 = {
  P8: ['IN', 'SA', 'HE', 'CU'],
  P9: ['IN', 'EX', 'RE', 'GO'],
  P10: ['SA', 'EX', 'AM', 'BU'],
  P11: ['HE', 'RE', 'HC', 'CR'],
  P12: ['HE', 'MA', 'BU', 'GO'],
  P13: ['RE', 'MA', 'CR', 'CU'],
  P14: ['HC', 'AM', 'CR', 'GO'],
  P15: ['HC', 'BU', 'IN', 'CU'],
  P16: ['AM', 'BU', 'EX', 'CR'],
  P17: ['HC', 'AM', 'IN', 'MA'],
  P18: ['CU', 'GO', 'SA', 'RE'],
  P19: ['EX', 'MA', 'SA', 'HE']
};

test('43 preguntas con ids P1 a P43 únicos y distribución por bloque', () => {
  assert.equal(PREGUNTAS.length, 43);
  const ids = PREGUNTAS.map((p) => p.id);
  assert.deepEqual(ids, Array.from({ length: 43 }, (_, i) => `P${i + 1}`));
  assert.equal(new Set(ids).size, 43);
  assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8].map((n) => delBloque(n).length), [3, 4, 12, 3, 6, 6, 3, 6]);
  assert.equal(BLOQUES.length, 8);
  assert.deepEqual(BLOQUES.map((b) => b.puntua), [false, true, true, true, true, true, false, false]);
});

test('Tabla del bloque 3: coincide con la especificación y cumple las tres condiciones', () => {
  const preguntas = delBloque(3);
  assert.equal(preguntas.length, 12);
  for (const p of preguntas) {
    assert.equal(p.opciones.length, 4);
    const codigos = p.opciones.map((o) => o.codigo);
    assert.equal(new Set(codigos).size, 4, `${p.id} repite códigos`);
    assert.deepEqual(codigos, TABLA_BLOQUE_3[p.id], `${p.id} no coincide con la tabla`);
  }

  // (a) cada arquetipo aparece exactamente 4 veces
  const apariciones = Object.fromEntries(CODIGOS.map((c) => [c, 0]));
  // (b) ninguna pareja más de 2 veces
  const parejas = {};
  for (const p of preguntas) {
    const codigos = p.opciones.map((o) => o.codigo);
    for (const c of codigos) apariciones[c] += 1;
    for (let i = 0; i < codigos.length; i++) {
      for (let j = i + 1; j < codigos.length; j++) {
        const clave = [codigos[i], codigos[j]].sort().join('-');
        parejas[clave] = (parejas[clave] ?? 0) + 1;
      }
    }
  }
  for (const c of CODIGOS) assert.equal(apariciones[c], 4, `${c} no aparece 4 veces`);
  assert.equal(Object.values(parejas).reduce((a, b) => a + b, 0), 72);
  for (const [clave, n] of Object.entries(parejas)) assert.ok(n <= 2, `la pareja ${clave} aparece ${n} veces`);

  // (c) las 12 parejas intracuadrante aparecen al menos una vez
  let intracuadrante = 0;
  for (const grupo of Object.values(MOTIVACIONES)) {
    for (let i = 0; i < grupo.length; i++) {
      for (let j = i + 1; j < grupo.length; j++) {
        intracuadrante += 1;
        const clave = [grupo[i], grupo[j]].sort().join('-');
        assert.ok((parejas[clave] ?? 0) >= 1, `la pareja intracuadrante ${clave} no aparece`);
      }
    }
  }
  assert.equal(intracuadrante, 12);
});

test('Bloques 4, 5 y 6: cobertura por arquetipo', () => {
  const contar = (lista) => {
    const m = Object.fromEntries(CODIGOS.map((c) => [c, 0]));
    for (const c of lista) m[c] += 1;
    return m;
  };
  const b4 = contar(delBloque(4).flatMap((p) => p.opciones.map((o) => o.codigo)));
  const b5 = contar(delBloque(5).flatMap((p) => p.opciones.map((o) => o.codigo)));
  const b6 = contar(delBloque(6).flatMap((p) => [...p.izquierda.codigos, ...p.derecha.codigos]));
  for (const c of CODIGOS) {
    assert.equal(b4[c], 1, `bloque 4: ${c}`);
    assert.equal(b5[c], 1, `bloque 5: ${c}`);
    assert.equal(b6[c], 2, `bloque 6: ${c}`);
  }
  for (const p of delBloque(6)) {
    assert.equal(p.izquierda.codigos.length, 2);
    assert.equal(p.derecha.codigos.length, 2);
  }
});

test('Bloque 2: cada pregunta tiene las 4 motivaciones una vez', () => {
  for (const p of delBloque(2)) {
    assert.deepEqual(
      p.opciones.map((o) => o.codigo).sort(),
      ['ESTABILIDAD', 'INDEPENDENCIA', 'MAESTRIA', 'PERTENENCIA']
    );
  }
});

test('Todo código de opción o escala es válido y no hay textos vacíos', () => {
  for (const p of PREGUNTAS) {
    for (const o of p.opciones ?? []) {
      assert.ok(o.texto && o.texto.trim() !== '', `${o.id} sin texto`);
      if (p.bloque === 2) assert.ok(Object.hasOwn(MOTIVACIONES, o.codigo), `${o.id}: motivación inválida`);
      else assert.ok(CODIGOS.includes(o.codigo), `${o.id}: código inválido`);
    }
    if (p.tipo === 'escala') {
      for (const c of [...p.izquierda.codigos, ...p.derecha.codigos]) assert.ok(CODIGOS.includes(c));
      assert.ok(p.izquierda.etiqueta && p.derecha.etiqueta);
    } else {
      assert.ok(p.enunciado.marca && p.enunciado.marca.trim() !== '', `${p.id} sin enunciado`);
    }
  }
  assert.equal(PREGUNTA_MODO.opciones.length, 2);
});

test('Variantes de modo fundador: solo donde las define la especificación', () => {
  const conVariante = PREGUNTAS.filter((p) => p.enunciado.fundador !== null).map((p) => p.id);
  assert.deepEqual(conVariante, ['P4', 'P5', 'P6', 'P8', 'P10', 'P11', 'P12', 'P13', 'P14', 'P15', 'P17', 'P18', 'P39']);
  // Las opciones no dependen del modo: no viven dentro de `enunciado`.
  for (const p of PREGUNTAS) assert.deepEqual(Object.keys(p.enunciado).sort(), ['fundador', 'marca']);
});

test('Lista de sectores', () => {
  const textos = [
    'Servicios profesionales (consultoría, asesoría, coaching)',
    'Legal y fiscal',
    'Salud y bienestar',
    'Estética y belleza',
    'Deporte y fitness',
    'Educación y formación',
    'Marketing, publicidad y comunicación',
    'Tecnología y software',
    'Diseño y creatividad',
    'Arquitectura, construcción y reformas',
    'Inmobiliario',
    'Finanzas y seguros',
    'Hostelería y restauración',
    'Turismo y viajes',
    'Comercio minorista y ecommerce',
    'Alimentación',
    'Industria y B2B',
    'Eventos',
    'Servicios a domicilio y oficios',
    'ONG, asociaciones y sector público',
    'Otro'
  ];
  assert.equal(SECTORES.length, 21);
  assert.deepEqual(SECTORES.map((s) => s.texto), textos);
  const ultimo = SECTORES[20];
  assert.equal(ultimo.texto, 'Otro');
  assert.equal(ultimo.requiereTexto, true);
  assert.equal(SECTORES.filter((s) => s.requiereTexto).length, 1);
});

test('Identificadores de sector', () => {
  const ids = SECTORES.map((s) => s.id);
  assert.equal(new Set(ids).size, 21);
  // Minúsculas, guion bajo, sin tildes, comas ni paréntesis (se admiten dígitos: «b2b»).
  for (const id of ids) assert.match(id, /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/, id);
  assert.equal(ids[0], 'servicios_profesionales');
  assert.equal(ids[20], 'otro');
});

test('Colores de arquetipo: válidos, distintos y ajenos a la interfaz', () => {
  const interfaz = ['#FFFFFF', '#000000', '#D8851F', '#3D391F', '#1A2B32'];
  const esperados = {
    IN: '#F0E6D2', SA: '#2C3E50', EX: '#4A5D45', HE: '#B03A2E', RE: '#1A1A1A', MA: '#2E7D8C',
    HC: '#8B7355', AM: '#A64B6B', BU: '#E8B84B', CU: '#6B8E7F', CR: '#6B4C93', GO: '#5B2333'
  };
  const colores = CODIGOS.map((c) => ARQUETIPOS[c].color);
  assert.equal(new Set(colores.map((c) => c.toUpperCase())).size, 12);
  for (const c of CODIGOS) {
    assert.match(ARQUETIPOS[c].color, /^#[0-9A-Fa-f]{6}$/);
    assert.equal(ARQUETIPOS[c].color.toUpperCase(), esperados[c]);
    assert.ok(!interfaz.includes(ARQUETIPOS[c].color.toUpperCase()));
  }
});

test('Contraste del texto sobre el color de cada arquetipo', () => {
  assert.equal(colorTextoSobre(ARQUETIPOS.IN.color), '#000000'); // el Inocente lleva texto oscuro
  assert.equal(colorTextoSobre(ARQUETIPOS.BU.color), '#000000');
  assert.equal(colorTextoSobre(ARQUETIPOS.RE.color), '#FFFFFF');
  assert.equal(colorTextoSobre(ARQUETIPOS.GO.color), '#FFFFFF');
  assert.equal(colorTextoSobre('#FFFFFF'), '#000000');
  assert.equal(colorTextoSobre('#000000'), '#FFFFFF');
});

test('Fichas de los 12 arquetipos', () => {
  assert.deepEqual(Object.keys(ARQUETIPOS).sort(), [...CODIGOS].sort());
  assert.deepEqual([...ORDEN_CODIGOS], CODIGOS);
  for (const c of CODIGOS) {
    const a = ARQUETIPOS[c];
    assert.equal(a.codigo, c);
    for (const campo of ['queEs', 'paraQueSirve', 'promesa', 'manera', 'sombra']) {
      assert.ok(a.ficha[campo].trim() !== '', `${c}.${campo}`);
    }
    assert.ok(a.deseoCentral.trim() !== '');
    // La especificación da 4 comportamientos licenciados en todos los arquetipos salvo el Bufón (3).
    assert.equal(a.ficha.puede.length, c === 'BU' ? 3 : 4, `${c}.puede`);
    assert.equal(a.ficha.noDebe.length, 3, `${c}.noDebe`);
    assert.equal(a.ficha.voz.length, 3, `${c}.voz`);
    assert.ok(MOTIVACIONES[a.motivacion].includes(c));
    if (c === 'HE') {
      assert.ok(a.ficha.aviso.startsWith('el héroe es el cliente'));
    } else {
      assert.equal(a.ficha.aviso, null, `${c}.aviso`);
    }
  }
  for (const grupo of Object.values(MOTIVACIONES)) assert.equal(grupo.length, 3);
  assert.equal(TENSIONES.length, 6);
});

test('Textos de contexto (7.3) y nota de categoría (7.5)', () => {
  const claves = (o) => Object.keys(o.matices).sort();
  assert.deepEqual(claves(TEXTOS.contexto.clientes_vulnerables), ['BU', 'EX', 'HE', 'MA', 'RE']);
  assert.deepEqual(claves(TEXTOS.contexto.restriccion_normativa), ['AM', 'BU', 'GO', 'HE', 'MA', 'RE']);
  assert.deepEqual(claves(TEXTOS.contexto.consecuencias_graves), ['BU', 'CR', 'EX', 'HC', 'IN']);
  const n = TEXTOS.contexto.restriccion_normativa.matices;
  assert.equal(n.AM, n.BU);
  assert.deepEqual(Object.keys(TEXTOS.notaCategoria).sort(), ['coincideDominante', 'distinta']);
});

test('P35: 12 opciones, una por arquetipo; solo la del Sabio es literal', () => {
  const p = porId.P35;
  assert.equal(p.opciones.length, 12);
  assert.equal(new Set(p.opciones.map((o) => o.codigo)).size, 12);
  const nombres = CODIGOS.flatMap((c) => [ARQUETIPOS[c].nombre, ARQUETIPOS[c].nombreCorto]);
  for (const o of p.opciones) {
    assert.ok(o.texto.trim() !== '');
    for (const nombre of nombres) {
      assert.ok(!o.texto.toLowerCase().includes(nombre.toLowerCase()), `${o.id} nombra a ${nombre}`);
    }
  }
  const sabio = p.opciones.find((o) => o.codigo === 'SA');
  assert.equal(sabio.texto, 'Explican mucho y se posicionan como los que más saben');
  assert.ok(!sabio.provisional);
  for (const o of p.opciones.filter((x) => x.codigo !== 'SA')) assert.equal(o.provisional, true, o.id);
});

test('barajar: permutación, no muta y conserva el código de cada opción', () => {
  const original = porId.P8.opciones;
  const copiaProfunda = JSON.parse(JSON.stringify(original));
  const barajada = barajar(original);
  assert.notEqual(barajada, original);
  assert.deepEqual(original, copiaProfunda);
  assert.equal(barajada.length, original.length);
  assert.deepEqual([...barajada].sort((a, b) => a.id.localeCompare(b.id)), [...original].sort((a, b) => a.id.localeCompare(b.id)));
  for (const o of barajada) assert.equal(o.codigo, original.find((x) => x.id === o.id).codigo);

  // Determinista con generador inyectado.
  const secuencia = () => {
    let i = 0;
    const valores = [0.1, 0.7, 0.4];
    return () => valores[i++ % valores.length];
  };
  assert.deepEqual(barajar([1, 2, 3, 4], secuencia()), barajar([1, 2, 3, 4], secuencia()));
  assert.deepEqual(barajar([1, 2, 3, 4], () => 0), [2, 3, 4, 1]);
});
