// Utilidades puras (sin DOM ni localStorage).

// Fisher-Yates. Devuelve una copia; no muta la entrada. `aleatorio` es inyectable para pruebas.
export function barajar(lista, aleatorio = Math.random) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function textoSiNo(valor) {
  return valor ? 'sí' : 'no';
}

function luminancia(hex) {
  const canales = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * canales[0] + 0.7152 * canales[1] + 0.0722 * canales[2];
}

// Devuelve '#000000' o '#FFFFFF', el que dé más contraste sobre el color de fondo (formato #RRGGBB).
export function colorTextoSobre(fondoHex) {
  const l = luminancia(fondoHex);
  const conNegro = (l + 0.05) / 0.05;
  const conBlanco = 1.05 / (l + 0.05);
  return conNegro >= conBlanco ? '#000000' : '#FFFFFF';
}
