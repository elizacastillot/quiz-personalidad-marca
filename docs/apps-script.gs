/**
 * Receptor de resultados del Cuestionario de Personalidad de Marca — Al Objetivo
 *
 * Instalación (una sola vez):
 * 1. Crea una hoja de cálculo nueva en Google Drive.
 * 2. Extensiones → Apps Script. Borra lo que haya y pega este archivo.
 * 3. Implementar → Nueva implementación → Tipo: Aplicación web.
 *    Ejecutar como: Yo. Quién tiene acceso: Cualquier usuario.
 * 4. Copia la URL que termina en /exec y pégala en src/js/config.js.
 *
 * Cada vez que cambies este script, crea una versión nueva de la implementación
 * (Implementar → Gestionar implementaciones → Editar → Versión nueva).
 * Si no, seguirá ejecutándose la versión anterior.
 *
 * Las columnas se escriben por nombre. La primera vez crea la fila de cabecera.
 * Debe coincidir con la sección 10 de docs/especificacion.md.
 */

const COLUMNAS = [
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

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (hoja.getLastRow() === 0) {
      hoja.appendRow(COLUMNAS);
      hoja.setFrozenRows(1);
    }
    const datos = JSON.parse(e.postData.contents);
    hoja.appendRow(COLUMNAS.map(function (c) {
      return datos[c] === undefined || datos[c] === null ? '' : datos[c];
    }));
    return respuesta({ ok: true });
  } catch (error) {
    return respuesta({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

function respuesta(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}
