// Interfaz del cuestionario: navegación, validación, progreso, resultado y envío.
// Punto de entrada (módulo ES). Toda la lógica de cálculo vive en puntuacion.js y resultado.js.

import {
  BLOQUES,
  PREGUNTAS,
  PREGUNTA_MODO,
  SECTORES,
  ENCABEZADO_BLOQUE_6,
  NOTA_FUNDADOR_BLOQUE_6
} from '../data/cuestionario.js';
import { ARQUETIPOS, TEXTOS } from '../data/arquetipos.js';
import { calcular } from './puntuacion.js';
import { componerResultado, ORDEN_SECCIONES } from './resultado.js';
import { construirCarga, enviar } from './envio.js';
import { barajar, colorTextoSobre } from './utilidades.js';

// ---------------------------------------------------------------------------
// Textos de interfaz que NO dicta la especificación (provisionales, para revisión).
// ---------------------------------------------------------------------------
const UI = {
  tituloApp: 'Cuestionario de Personalidad de Marca',
  marca: 'Al Objetivo',
  bienvenida:
    'Responde con calma y con sinceridad. No hay respuestas buenas ni malas: lo que importa es cómo trabajas de verdad. Tardarás entre 15 y 20 minutos y tu progreso se guarda solo.',
  retomarTitulo: 'Tienes un cuestionario a medias',
  retomarTexto: 'Puedes seguir donde lo dejaste o empezar de nuevo.',
  continuar: 'Continuar donde lo dejaste',
  empezarDeNuevo: 'Empezar de nuevo',
  datosTitulo: 'Tus datos',
  nombre: 'Nombre y apellidos',
  marcaCampo: 'Nombre de la marca',
  email: 'Email',
  sector: 'Sector',
  sectorOtro: 'Cuéntanos cuál es tu sector',
  sectorElige: 'Elige una opción',
  anterior: 'Anterior',
  siguiente: 'Siguiente',
  verResultado: 'Ver resultado',
  si: 'Sí',
  no: 'No',
  mas: 'Más me describe',
  menos: 'Menos me describe',
  ayudaMasMenos: 'Elige la opción que más te describe y otra distinta que menos te describe.',
  opcional: 'Esta pregunta es opcional.',
  libre: '¿Quieres añadir algo sobre este bloque? (opcional)',
  datosIniciales: 'Datos iniciales',
  progreso: 'Progreso del cuestionario',
  errorElige: 'Elige una opción para continuar.',
  errorRellena: 'Rellena este campo para continuar.',
  errorEmail: 'Escribe un email válido, por ejemplo nombre@dominio.com.',
  errorMasMenos: 'Marca una opción como «Más me describe» y otra distinta como «Menos me describe».',
  rolDominante: 'Arquetipo dominante',
  rolSecundario: 'Arquetipo secundario',
  descargar: 'Descargar ficha',
  ayudaDescarga: 'Se abrirá el diálogo de impresión. Elige «Guardar como PDF» para descargarla.',
  desgloseTitulo: 'Así se reparten tus respuestas',
  puntoSingular: 'punto',
  puntoPlural: 'puntos',
  paleta: { acento: 'Acento', complemento: 'Complemento', fondo: 'Fondo', texto: 'Texto' }
};

// ---------------------------------------------------------------------------
// Constantes y estado
// ---------------------------------------------------------------------------
const CLAVE_PROGRESO = 'alobjetivo-quiz-progreso';
const VERSION = 1;
const PASOS = ['modo', 'datos', ...PREGUNTAS.map((p) => p.id)];
const PREGUNTA_POR_ID = Object.fromEntries(PREGUNTAS.map((p) => [p.id, p]));
const ULTIMA_DEL_BLOQUE = {};
for (const p of PREGUNTAS) ULTIMA_DEL_BLOQUE[p.bloque] = p.id;
const OBLIGATORIAS_HASTA = 35; // P1 a P35 obligatorias; P36 a P43 opcionales

let estado = estadoNuevo();
let orden = {}; // id de pregunta -> opciones barajadas (solo en memoria)
let refs = null;
let enviado = false;

function estadoNuevo() {
  return {
    version: VERSION,
    paso: 'modo',
    datos: { modo: '', nombre: '', marca: '', email: '', sector: '', sectorOtro: '' },
    respuestas: {},
    libres: {}
  };
}

// ---------------------------------------------------------------------------
// Persistencia (todo dentro de try/catch: si el navegador la bloquea, la página sigue)
// ---------------------------------------------------------------------------
function guardar() {
  try {
    localStorage.setItem(CLAVE_PROGRESO, JSON.stringify(estado));
  } catch {
    // Sin almacenamiento: la app funciona igualmente, sin guardar.
  }
}

function borrarProgreso() {
  try {
    localStorage.removeItem(CLAVE_PROGRESO);
  } catch {
    // Nada que hacer.
  }
}

function leerProgreso() {
  try {
    const bruto = localStorage.getItem(CLAVE_PROGRESO);
    if (!bruto) return null;
    const p = JSON.parse(bruto);
    const valido =
      p && p.version === VERSION && PASOS.includes(p.paso) &&
      p.datos && typeof p.datos === 'object' &&
      p.respuestas && typeof p.respuestas === 'object' &&
      p.libres && typeof p.libres === 'object';
    if (!valido) return null;
    return {
      version: VERSION,
      paso: p.paso,
      datos: { ...estadoNuevo().datos, ...p.datos },
      respuestas: p.respuestas,
      libres: p.libres
    };
  } catch {
    return null;
  }
}

function hayAvance(p) {
  return p.paso !== 'modo' || Boolean(p.datos.modo);
}

// ---------------------------------------------------------------------------
// Utilidades de DOM
// ---------------------------------------------------------------------------
function h(etiqueta, props = {}, ...hijos) {
  const el = document.createElement(etiqueta);
  for (const [clave, valor] of Object.entries(props)) {
    if (valor === false || valor === null || valor === undefined) continue;
    if (clave === 'class') el.className = valor;
    else if (clave.startsWith('on')) el.addEventListener(clave.slice(2).toLowerCase(), valor);
    else el.setAttribute(clave, valor === true ? '' : String(valor));
  }
  anadir(el, hijos);
  return el;
}

function anadir(el, hijos) {
  for (const hijo of hijos.flat(Infinity)) {
    if (hijo === null || hijo === undefined || hijo === false) continue;
    el.append(hijo instanceof Node ? hijo : document.createTextNode(String(hijo)));
  }
}

function montar() {
  const texto = h('span', {}, '');
  const pct = h('span', {}, '');
  const relleno = h('div', { class: 'progreso-relleno' });
  const barra = h(
    'div',
    { class: 'progreso-pista', role: 'progressbar', 'aria-label': UI.progreso, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': 0 },
    relleno
  );
  const progreso = h('div', { class: 'progreso' }, h('p', { class: 'progreso-texto' }, texto, pct), barra);
  const contenido = h('main', { id: 'contenido' });
  refs = { texto, pct, relleno, barra, progreso, contenido, error: null };
  document.getElementById('app').replaceChildren(
    h('header', { class: 'cabecera' }, h('h1', { class: 'marca' }, UI.tituloApp), progreso),
    contenido
  );
}

function pintar(...nodos) {
  refs.contenido.replaceChildren(...nodos);
  window.scrollTo(0, 0);
  const foco = refs.contenido.querySelector('[data-foco]');
  if (foco) foco.focus({ preventScroll: true });
}

// ---------------------------------------------------------------------------
// Ayudas de estado
// ---------------------------------------------------------------------------
function indicePaso() {
  return PASOS.indexOf(estado.paso);
}

function enunciadoDe(p) {
  const fundador = estado.datos.modo === 'fundador' && p.enunciado.fundador;
  return fundador || p.enunciado.marca;
}

function opcionesBarajadas(p) {
  if (!orden[p.id]) orden[p.id] = barajar(p.opciones);
  return orden[p.id];
}

function responder(id, valor) {
  estado.respuestas[id] = valor;
  guardar();
}

function textoAbierto(id, valor) {
  if (valor.trim() === '') delete estado.respuestas[id];
  else estado.respuestas[id] = valor;
  guardar();
}

// ---------------------------------------------------------------------------
// Validación (obligatorios: modo, datos y P1 a P35; opcionales: P36 a P43 y campos libres)
// ---------------------------------------------------------------------------
function validarDatos() {
  const d = estado.datos;
  if (d.nombre.trim() === '') return { campo: 'nombre', mensaje: UI.errorRellena };
  if (d.marca.trim() === '') return { campo: 'marca', mensaje: UI.errorRellena };
  if (d.email.trim() === '') return { campo: 'email', mensaje: UI.errorRellena };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) return { campo: 'email', mensaje: UI.errorEmail };
  if (d.sector === '' || !SECTORES.some((s) => s.id === d.sector)) return { campo: 'sector', mensaje: UI.errorElige };
  if (d.sector === 'otro' && d.sectorOtro.trim() === '') return { campo: 'sectorOtro', mensaje: UI.errorRellena };
  return null;
}

function errorDe(id) {
  if (id === 'modo') return estado.datos.modo ? null : UI.errorElige;
  if (id === 'datos') return validarDatos()?.mensaje ?? null;
  const p = PREGUNTA_POR_ID[id];
  if (p.tipo === 'abierta') return null;
  const v = estado.respuestas[id];
  switch (p.tipo) {
    case 'si-no':
      return typeof v === 'boolean' ? null : UI.errorElige;
    case 'mas-menos':
      return v && v.mas && v.menos && v.mas !== v.menos ? null : UI.errorMasMenos;
    case 'escala':
      return Number.isInteger(v) && v >= 1 && v <= 5 ? null : UI.errorElige;
    default:
      return typeof v === 'string' && v !== '' ? null : UI.errorElige;
  }
}

function mostrarError(mensaje) {
  if (refs.error) refs.error.textContent = mensaje;
}

// ---------------------------------------------------------------------------
// Componentes
// ---------------------------------------------------------------------------
function grupoRadios({ nombre, opciones, actual, alCambiar, etiquetadoPor, etiquetaAria, clase = '' }) {
  const grupo = h('div', {
    class: `grupo ${clase}`.trim(),
    role: 'radiogroup',
    'aria-labelledby': etiquetadoPor,
    'aria-label': etiquetaAria
  });
  const marcar = () => {
    for (const input of grupo.querySelectorAll('input')) {
      input.parentElement.classList.toggle('seleccionada', input.checked);
    }
  };
  for (const o of opciones) {
    const input = h('input', { type: 'radio', name: nombre, 'aria-label': o.aria });
    input.checked = o.valor === actual;
    input.addEventListener('change', () => {
      alCambiar(o.valor);
      marcar();
    });
    grupo.append(h('label', { class: 'opcion' }, input, h('span', {}, o.texto)));
  }
  marcar();
  return grupo;
}

function campoTexto({ id, etiqueta, tipo = 'text', valor, autocompletar, alCambiar }) {
  const error = h('p', { class: 'error-campo', id: `error-${id}` });
  const input = h('input', {
    type: tipo,
    id,
    value: valor,
    autocomplete: autocompletar,
    'aria-describedby': `error-${id}`
  });
  input.addEventListener('input', () => {
    alCambiar(input.value);
    input.removeAttribute('aria-invalid');
    error.textContent = '';
  });
  return h('div', { class: 'campo', id: `campo-${id}` }, h('label', { for: id }, etiqueta), input, error);
}

function campoLibre(bloque) {
  const id = `libre-${bloque}`;
  const area = h('textarea', { id, rows: 4 });
  area.value = estado.libres[bloque] ?? '';
  area.addEventListener('input', () => {
    if (area.value.trim() === '') delete estado.libres[bloque];
    else estado.libres[bloque] = area.value;
    guardar();
  });
  return h('div', { class: 'campo-libre' }, h('label', { for: id, class: 'etiqueta-campo' }, UI.libre), area);
}

// ---------------------------------------------------------------------------
// Vistas del cuestionario
// ---------------------------------------------------------------------------
function vistaRetomar(guardado) {
  const continuar = h('button', { type: 'button', class: 'boton principal' }, UI.continuar);
  const nuevo = h('button', { type: 'button', class: 'boton secundario' }, UI.empezarDeNuevo);
  continuar.addEventListener('click', () => {
    estado = guardado;
    orden = {};
    renderPaso();
  });
  nuevo.addEventListener('click', () => {
    borrarProgreso();
    estado = estadoNuevo();
    orden = {};
    renderPaso();
  });
  refs.progreso.hidden = true;
  pintar(
    h(
      'section',
      { class: 'pantalla' },
      h('h2', { tabindex: -1, 'data-foco': true }, UI.retomarTitulo),
      h('p', {}, UI.retomarTexto),
      h('div', { class: 'retomar' }, continuar, nuevo)
    )
  );
}

function vistaModo() {
  const idTitulo = 'enunciado-modo';
  const grupo = grupoRadios({
    nombre: 'modo',
    etiquetadoPor: idTitulo,
    opciones: PREGUNTA_MODO.opciones.map((o) => ({ valor: o.valor, texto: o.texto })),
    actual: estado.datos.modo,
    alCambiar: (valor) => {
      estado.datos.modo = valor;
      guardar();
    }
  });
  return [
    h('p', {}, UI.bienvenida),
    h('h2', { id: idTitulo, tabindex: -1, 'data-foco': true }, PREGUNTA_MODO.enunciado),
    grupo
  ];
}

function vistaDatos() {
  const d = estado.datos;
  const selector = h('select', { id: 'sector', 'aria-describedby': 'error-sector' });
  selector.append(h('option', { value: '' }, UI.sectorElige));
  for (const s of SECTORES) selector.append(h('option', { value: s.id }, s.texto));
  selector.value = d.sector;

  const otro = campoTexto({
    id: 'sectorOtro',
    etiqueta: UI.sectorOtro,
    valor: d.sectorOtro,
    alCambiar: (v) => {
      estado.datos.sectorOtro = v;
      guardar();
    }
  });
  otro.hidden = d.sector !== 'otro';

  selector.addEventListener('change', () => {
    estado.datos.sector = selector.value;
    selector.removeAttribute('aria-invalid');
    document.getElementById('error-sector').textContent = '';
    const esOtro = selector.value === 'otro';
    otro.hidden = !esOtro;
    if (!esOtro) {
      estado.datos.sectorOtro = '';
      otro.querySelector('input').value = '';
    }
    guardar();
  });

  return [
    h('h2', { tabindex: -1, 'data-foco': true }, UI.datosTitulo),
    campoTexto({ id: 'nombre', etiqueta: UI.nombre, valor: d.nombre, autocompletar: 'name', alCambiar: (v) => { estado.datos.nombre = v; guardar(); } }),
    campoTexto({ id: 'marca', etiqueta: UI.marcaCampo, valor: d.marca, autocompletar: 'organization', alCambiar: (v) => { estado.datos.marca = v; guardar(); } }),
    campoTexto({ id: 'email', etiqueta: UI.email, tipo: 'email', valor: d.email, autocompletar: 'email', alCambiar: (v) => { estado.datos.email = v; guardar(); } }),
    h(
      'div',
      { class: 'campo' },
      h('label', { for: 'sector' }, UI.sector),
      selector,
      h('p', { class: 'error-campo', id: 'error-sector' })
    ),
    otro
  ];
}

function vistaMasMenos(p, idTitulo) {
  const grupo = h('div', { class: 'grupo', role: 'group', 'aria-labelledby': idTitulo });
  const botones = [];
  const refrescar = () => {
    const r = estado.respuestas[p.id] ?? {};
    for (const { boton, codigo, tipo } of botones) {
      boton.setAttribute('aria-pressed', String(r[tipo] === codigo));
    }
  };
  for (const o of opcionesBarajadas(p)) {
    const crear = (tipo, texto) => {
      const boton = h('button', { type: 'button', class: `boton-mm ${tipo}`, 'aria-pressed': 'false', 'aria-label': `${texto}: ${o.texto}` }, texto);
      boton.addEventListener('click', () => {
        const r = { ...(estado.respuestas[p.id] ?? {}) };
        const otro = tipo === 'mas' ? 'menos' : 'mas';
        if (r[tipo] === o.codigo) delete r[tipo];
        else {
          r[tipo] = o.codigo;
          if (r[otro] === o.codigo) delete r[otro]; // la misma opción no puede ser «más» y «menos»
        }
        responder(p.id, r);
        refrescar();
      });
      botones.push({ boton, codigo: o.codigo, tipo });
      return boton;
    };
    grupo.append(
      h('div', { class: 'opcion-mm' }, h('p', {}, o.texto), h('div', { class: 'botones-mm' }, crear('mas', UI.mas), crear('menos', UI.menos)))
    );
  }
  refrescar();
  return [h('p', { class: 'ayuda' }, UI.ayudaMasMenos), grupo];
}

function vistaEscala(p) {
  const nombre = `esc-${p.id}`;
  const etiquetaGrupo = `${p.izquierda.etiqueta} o ${p.derecha.etiqueta}`;
  const opciones = [1, 2, 3, 4, 5].map((n) => ({
    valor: n,
    texto: String(n),
    aria:
      n === 1 ? `1 de 5, ${p.izquierda.etiqueta}` : n === 5 ? `5 de 5, ${p.derecha.etiqueta}` : `${n} de 5`
  }));
  const grupo = grupoRadios({
    nombre,
    opciones,
    actual: estado.respuestas[p.id],
    etiquetaAria: etiquetaGrupo,
    alCambiar: (valor) => responder(p.id, valor)
  });
  grupo.classList.remove('grupo');
  grupo.classList.add('escala');
  return [
    h(
      'div',
      { class: 'encabezado-bloque' },
      h('h2', { tabindex: -1, 'data-foco': true }, ENCABEZADO_BLOQUE_6.titulo),
      h('p', {}, ENCABEZADO_BLOQUE_6.cuerpo),
      estado.datos.modo === 'fundador' ? h('p', {}, NOTA_FUNDADOR_BLOQUE_6) : null
    ),
    h('div', { class: 'escala-extremos', 'aria-hidden': 'true' }, h('span', {}, p.izquierda.etiqueta), h('span', {}, p.derecha.etiqueta)),
    grupo
  ];
}

function vistaAbierta(p, idTitulo) {
  const area = h('textarea', { id: `abierta-${p.id}`, rows: 6, 'aria-labelledby': idTitulo, 'aria-describedby': `opc-${p.id}` });
  area.value = typeof estado.respuestas[p.id] === 'string' ? estado.respuestas[p.id] : '';
  area.addEventListener('input', () => textoAbierto(p.id, area.value));
  return [h('p', { class: 'ayuda', id: `opc-${p.id}` }, UI.opcional), area];
}

function vistaPregunta(p) {
  const idTitulo = `enunciado-${p.id}`;
  const partes = [];
  if (p.tipo === 'escala') {
    partes.push(...vistaEscala(p));
  } else {
    partes.push(h('h2', { id: idTitulo, tabindex: -1, 'data-foco': true }, enunciadoDe(p)));
    if (p.tipo === 'si-no') {
      partes.push(
        grupoRadios({
          nombre: p.id,
          etiquetadoPor: idTitulo,
          opciones: [{ valor: true, texto: UI.si }, { valor: false, texto: UI.no }],
          actual: estado.respuestas[p.id],
          alCambiar: (valor) => responder(p.id, valor)
        })
      );
    } else if (p.tipo === 'mas-menos') {
      partes.push(...vistaMasMenos(p, idTitulo));
    } else if (p.tipo === 'abierta') {
      partes.push(...vistaAbierta(p, idTitulo));
    } else {
      partes.push(
        grupoRadios({
          nombre: p.id,
          etiquetadoPor: idTitulo,
          opciones: opcionesBarajadas(p).map((o) => ({ valor: o.codigo, texto: o.texto })),
          actual: estado.respuestas[p.id],
          alCambiar: (valor) => responder(p.id, valor)
        })
      );
    }
  }
  if (ULTIMA_DEL_BLOQUE[p.bloque] === p.id) partes.push(campoLibre(p.bloque));
  return partes;
}

// ---------------------------------------------------------------------------
// Navegación
// ---------------------------------------------------------------------------
function actualizarProgreso(id) {
  const i = PASOS.indexOf(id);
  const pct = Math.round((i / PASOS.length) * 100);
  const p = PREGUNTA_POR_ID[id];
  const texto = p ? `Bloque ${p.bloque} de ${BLOQUES.length}: ${BLOQUES[p.bloque - 1].nombre}` : UI.datosIniciales;
  refs.progreso.hidden = false;
  refs.texto.textContent = texto;
  refs.pct.textContent = `${pct} %`;
  refs.relleno.style.width = `${pct}%`;
  refs.barra.setAttribute('aria-valuenow', String(pct));
  refs.barra.setAttribute('aria-valuetext', `${texto}, ${pct} %`);
}

function renderPaso() {
  const id = estado.paso;
  const i = indicePaso();
  actualizarProgreso(id);

  let contenido;
  if (id === 'modo') contenido = vistaModo();
  else if (id === 'datos') contenido = vistaDatos();
  else contenido = vistaPregunta(PREGUNTA_POR_ID[id]);

  const esUltimo = i === PASOS.length - 1;
  const anterior = h('button', { type: 'button', class: 'boton secundario' }, UI.anterior);
  anterior.hidden = i === 0;
  anterior.addEventListener('click', () => irA(PASOS[i - 1]));
  const siguiente = h('button', { type: 'submit', class: 'boton principal' }, esUltimo ? UI.verResultado : UI.siguiente);
  refs.error = h('p', { class: 'error', role: 'alert' });

  const formulario = h(
    'form',
    { class: 'pantalla', novalidate: true },
    contenido,
    refs.error,
    h('div', { class: 'navegacion' }, anterior, siguiente)
  );
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    intentarAvanzar();
  });
  pintar(formulario);
}

function irA(id) {
  estado.paso = id;
  guardar();
  renderPaso();
}

function señalarCampo(problema) {
  const input = document.getElementById(problema.campo);
  const mensaje = document.getElementById(`error-${problema.campo}`);
  if (mensaje) mensaje.textContent = problema.mensaje;
  if (input) {
    input.setAttribute('aria-invalid', 'true');
    input.focus();
  }
  mostrarError('');
}

function intentarAvanzar() {
  const id = estado.paso;
  if (id === 'datos') {
    const problema = validarDatos();
    if (problema) {
      señalarCampo(problema);
      return;
    }
  } else {
    const mensaje = errorDe(id);
    if (mensaje) {
      mostrarError(mensaje);
      return;
    }
  }
  const i = indicePaso();
  if (i === PASOS.length - 1) finalizar();
  else irA(PASOS[i + 1]);
}

// ---------------------------------------------------------------------------
// Finalización: cálculo, resultado, envío y limpieza
// ---------------------------------------------------------------------------
function finalizar() {
  if (enviado) return;
  const pendiente = PASOS.find((id) => {
    const n = Number(id.slice(1));
    return (id === 'modo' || id === 'datos' || n <= OBLIGATORIAS_HASTA) && errorDe(id);
  });
  if (pendiente) {
    irA(pendiente);
    return;
  }
  enviado = true;
  const r = estado.respuestas;
  const calculo = calcular(r);
  const contexto = {
    modo: estado.datos.modo,
    clientes_vulnerables: r.P1 === true,
    restriccion_normativa: r.P2 === true,
    consecuencias_graves: r.P3 === true,
    arquetipo_categoria: r.P35 ?? ''
  };
  const resultado = componerResultado(calculo, contexto);
  pintarResultado(resultado);
  // El envío no espera respuesta; el progreso solo se borra después de mostrar el resultado.
  enviar(construirCarga({ datos: estado.datos, respuestas: r, libres: estado.libres, calculo, resultado }));
  borrarProgreso();
}

// ---------------------------------------------------------------------------
// Resultado
// ---------------------------------------------------------------------------
function tarjetaArquetipo(rol, arq, secundaria) {
  const tarjeta = h(
    'section',
    { class: `tarjeta-arquetipo${secundaria ? ' secundaria' : ''}` },
    h('p', { class: 'rol' }, rol),
    h('h2', { class: 'nombre', tabindex: -1, 'data-foco': secundaria ? null : true }, arq.nombre),
    arq.porcentaje === null ? null : h('p', { class: 'porcentaje' }, `${arq.porcentaje} %`)
  );
  tarjeta.style.backgroundColor = arq.color;
  tarjeta.style.color = colorTextoSobre(arq.color);
  return tarjeta;
}

function listaResultado(titulo, items) {
  return h('section', {}, h('h2', { class: 'etiqueta' }, titulo), h('ul', { class: 'lista-resultado' }, items.map((t) => h('li', {}, t))));
}

function muestraColor(etiqueta, color) {
  const m = h('div', { class: 'muestra' }, etiqueta, h('small', {}, color));
  m.style.backgroundColor = color;
  m.style.color = colorTextoSobre(color);
  return m;
}

function pintarResultado(r) {
  refs.progreso.hidden = true;
  if (r.alerta) {
    pintarAlerta(r);
    return;
  }
  const E = TEXTOS.etiquetasResultado;
  const constructores = {
    dominante: () => tarjetaArquetipo(UI.rolDominante, r.dominante, false),
    secundario: () => tarjetaArquetipo(UI.rolSecundario, r.secundario, true),
    frase: () => h('section', {}, h('p', { class: 'frase' }, r.frase)),
    queEs: () => h('section', {}, h('h2', { class: 'etiqueta' }, E.queEs), h('p', {}, r.queEs)),
    paraQueSirve: () =>
      h(
        'section',
        {},
        h('h2', { class: 'etiqueta' }, E.paraQueSirve),
        h('p', {}, r.paraQueSirve),
        r.aviso ? h('p', { class: 'aviso-heroe' }, h('strong', {}, `${E.aviso}: `), r.aviso) : null
      ),
    tension: () =>
      r.tension
        ? h(
            'section',
            { class: 'bloque-oscuro a' },
            h('h2', {}, r.tension.titulo),
            h('p', {}, r.tension.cuerpo),
            h('p', {}, r.tension.cierre)
          )
        : null,
    puede: () => listaResultado(E.puede, r.puede),
    noDebe: () => listaResultado(E.noDebe, r.noDebe),
    contexto: () =>
      r.contexto
        ? h(
            'section',
            { class: 'bloque-oscuro b' },
            h('h2', {}, r.contexto.encabezado.titulo),
            h('p', {}, r.contexto.encabezado.cuerpo),
            r.contexto.bloques.map((b) => [
              h('div', { class: 'separador' }),
              h('p', {}, b.general),
              b.matiz ? h('p', {}, b.matiz) : null
            ]),
            r.contexto.cierre ? [h('div', { class: 'separador' }), h('p', {}, r.contexto.cierre)] : null
          )
        : null,
    sombra: () => h('section', {}, h('h2', { class: 'etiqueta' }, E.sombra), h('p', {}, `Sombra: ${r.sombra}`)),
    voz: () => h('section', {}, h('h2', { class: 'etiqueta' }, E.voz), h('ul', { class: 'voz' }, r.voz.map((v) => h('li', {}, v)))),
    paleta: () =>
      h(
        'section',
        {},
        h('h2', { class: 'etiqueta' }, E.paleta),
        h(
          'div',
          { class: 'paleta' },
          muestraColor(UI.paleta.acento, r.paleta.acento),
          muestraColor(UI.paleta.complemento, r.paleta.complemento),
          muestraColor(UI.paleta.fondo, r.paleta.fondo),
          muestraColor(UI.paleta.texto, r.paleta.texto)
        )
      ),
    notaFundador: () => (r.notaFundador ? h('section', { class: 'bloque-oscuro a' }, h('p', {}, r.notaFundador)) : null),
    notaCategoria: () => (r.notaCategoria ? h('section', { class: 'bloque-oscuro b' }, h('p', {}, r.notaCategoria)) : null),
    descarga: () => {
      const boton = h('button', { type: 'button', class: 'boton principal' }, UI.descargar);
      boton.addEventListener('click', () => {
        if (typeof window.print === 'function') window.print();
      });
      return h('section', { class: 'no-imprimir' }, boton, h('p', { class: 'ayuda' }, UI.ayudaDescarga));
    },
    cierre: () => h('p', { class: 'cierre' }, r.cierre)
  };
  const secciones = ORDEN_SECCIONES.map((id) => constructores[id]());
  pintar(h('div', { class: 'resultado' }, secciones));
}

function pintarAlerta(r) {
  const nodos = [
    h(
      'section',
      { class: 'bloque-oscuro b' },
      h('h2', { tabindex: -1, 'data-foco': true }, r.mensaje.titulo),
      h('p', {}, r.mensaje.cuerpo),
      h('p', {}, r.mensaje.pie)
    ),
    h('h3', {}, UI.desgloseTitulo),
    h(
      'ul',
      { class: 'desglose' },
      r.desglose.map((d) =>
        h(
          'li',
          {},
          h('span', {}, d.nombre),
          h('span', {}, `${d.discriminante} ${Math.abs(d.discriminante) === 1 ? UI.puntoSingular : UI.puntoPlural}`)
        )
      )
    ),
    h('p', { class: 'cierre' }, r.cierre)
  ];
  pintar(h('div', { class: 'resultado' }, nodos));
}

// ---------------------------------------------------------------------------
// Arranque
// ---------------------------------------------------------------------------
function iniciar() {
  montar();
  const guardado = leerProgreso();
  if (guardado && hayAvance(guardado)) vistaRetomar(guardado);
  else renderPaso();
}

iniciar();
