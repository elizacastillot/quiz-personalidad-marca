// Gráficos propios en SVG (sin recursos externos). Solo dibujo: sin lógica del cuestionario.
// Módulo con DOM: no se prueba con Node.

const BLANCO = '#FFFFFF';
const NARANJA = '#D8851F';
const ANILLOS = [
  { r: 54, opacidad: 0.28 },
  { r: 40, opacidad: 0.45 },
  { r: 26, opacidad: 0.7 }
];
const CENTRO = { x: 252, y: 60 };

function desdeMarcado(marcado) {
  const plantilla = document.createElement('template');
  plantilla.innerHTML = marcado.trim();
  return plantilla.content.firstElementChild;
}

// Flecha dibujada en horizontal desde (0, 0) hasta (largo, 0): astil, punta y plumas.
function marcadoFlecha(largo) {
  return `
    <path d="M0 0H${largo - 6}" stroke="${BLANCO}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M${largo - 8} -6 ${largo + 2} 0 ${largo - 8} 6z" fill="${BLANCO}"/>
    <path d="M-2 -7 5 0 -2 7M8 -7 15 0 8 7" fill="none" stroke="${BLANCO}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
}

// Escena decorativa: un arco, una flecha en el aire y la diana.
// `acierto: true`  -> la flecha da en el centro (resultado, bienvenida).
// `acierto: false` -> la flecha se queda en un anillo (alerta: todavía sin carácter definido).
export function escena({ acierto = true } = {}) {
  const anillos = ANILLOS.map(
    (a) =>
      `<circle cx="${CENTRO.x}" cy="${CENTRO.y}" r="${a.r}" fill="none" stroke="${BLANCO}" stroke-opacity="${a.opacidad}" stroke-width="1.5"/>`
  ).join('');
  // Punta de la flecha: en el centro, o desviada hacia arriba a la izquierda dentro del anillo medio.
  const punta = acierto ? { x: CENTRO.x, y: CENTRO.y } : { x: 236, y: 36 };
  const cola = acierto ? { x: 92, y: 60 } : { x: 92, y: 72 };
  const dx = punta.x - cola.x;
  const dy = punta.y - cola.y;
  const largo = Math.round(Math.hypot(dx, dy));
  const angulo = ((Math.atan2(dy, dx) * 180) / Math.PI).toFixed(2);
  return desdeMarcado(`
    <svg class="escena-svg" viewBox="0 0 320 120" aria-hidden="true" focusable="false">
      <path d="M40 12Q6 60 40 108" fill="none" stroke="${NARANJA}" stroke-width="4" stroke-linecap="round"/>
      <path d="M40 12V108" stroke="${BLANCO}" stroke-opacity="0.6" stroke-width="1"/>
      ${anillos}
      <circle cx="${CENTRO.x}" cy="${CENTRO.y}" r="12" fill="${NARANJA}"/>
      <g transform="translate(${cola.x} ${cola.y}) rotate(${angulo})">${marcadoFlecha(largo)}</g>
    </svg>`);
}
