// Respuestas del caso «Al Objetivo» (consultora Mago con Hombre común). Se guardan códigos, no ids de opción.
// Nota: este archivo no contiene pruebas; `node --test` solo descubre *.test.js.
export const alObjetivo = {
  P1: false, P2: false, P3: false,
  P4: 'MAESTRIA', P5: 'MAESTRIA', P6: 'PERTENENCIA', P7: 'MAESTRIA',
  P8: { mas: 'SA', menos: 'IN' }, P9: { mas: 'EX', menos: 'GO' },
  P10: { mas: 'AM', menos: 'SA' }, P11: { mas: 'HC', menos: 'HE' },
  P12: { mas: 'MA', menos: 'GO' }, P13: { mas: 'MA', menos: 'CR' },
  P14: { mas: 'HC', menos: 'AM' }, P15: { mas: 'HC', menos: 'CU' },
  P16: { mas: 'BU', menos: 'CR' }, P17: { mas: 'MA', menos: 'AM' },
  P18: { mas: 'CU', menos: 'RE' }, P19: { mas: 'MA', menos: 'EX' },
  P20: 'SA', P21: 'HE', P22: 'EX',
  P23: 'GO', P24: 'CU', P25: 'SA', P26: 'IN', P27: 'MA', P28: 'AM',
  P29: 1, P30: 3, P31: 3, P32: 2, P33: 5, P34: 4,
  P35: 'SA'
};

export const datosAlObjetivo = {
  modo: 'marca',
  nombre: 'Elizabeth Castillo',
  marca: 'Al Objetivo',
  email: 'hola@example.com',
  sector: 'servicios_profesionales',
  sectorOtro: ''
};

// Alerta: cuadrante claro (MAESTRIA) y comportamiento plano. Discriminante GO=CU=SA=2, resto 0.
export const respuestasAlerta = {
  P4: 'MAESTRIA', P5: 'MAESTRIA', P6: 'MAESTRIA', P7: 'MAESTRIA',
  P23: 'GO', P24: 'CU', P25: 'SA'
};

// Alerta donde los tres de la alerta (por discriminante: AM, IN, MA) no son los tres primeros por total (CR, CU, GO).
export const alertaPorEstabilidad = {
  P4: 'ESTABILIDAD', P5: 'ESTABILIDAD', P6: 'ESTABILIDAD', P7: 'ESTABILIDAD',
  P26: 'IN', P27: 'MA', P28: 'AM'
};
