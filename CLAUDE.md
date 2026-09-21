# Cuestionario de Personalidad de Marca — Al Objetivo

Web estática con un cuestionario de 43 preguntas que asigna a una marca un arquetipo dominante y uno secundario (modelo Mark y Pearson). La usa Elizabeth Castillo (Al Objetivo) con clientes de pago de su servicio de branding. Los resultados se guardan en Google Sheets mediante Google Apps Script y se revisan después en sesión.

## Fuente de verdad

`docs/especificacion.md` manda sobre cualquier otra cosa: preguntas, códigos, pesos, reglas de alerta, textos del resultado y columnas de la hoja. Si algo del código contradice la especificación, el código está mal.

## Stack

- HTML, CSS y JavaScript puro (módulos ES). Sin frameworks, sin build.
- Pruebas con `node --test` (Node 18 o superior), sin dependencias.
- Despliegue en GitHub Pages mediante GitHub Actions, publicando la carpeta `src/`.
- Recepción de resultados: Google Apps Script (`docs/apps-script.gs`).

## Estructura

```
docs/        especificación y código de Apps Script (no se publica)
handoff/     documentos que se pasan los agentes entre fases
src/         la web que se publica
tests/       pruebas del motor de puntuación y de los datos
.claude/     agentes y skills del proyecto
```

## Cómo se trabaja en este proyecto

La sesión principal es el agente `orquestador`, configurado en `.claude/settings.json`. No escribe código: planifica, delega en cuatro agentes con una tarea única cada uno y decide cuándo se avanza de fase.

| Fase | Agente | Entrega |
|---|---|---|
| 1. Análisis | `analista` | `handoff/01-plan-tecnico.md` |
| 2. Implementación | `implementador` | código en `src/` y `tests/`, más `handoff/02-implementacion.md` |
| 3. Validación | `validador` | `handoff/03-validacion.md` con veredicto APROBADO o RECHAZADO |
| 4. Despliegue | `desplegador` | `handoff/04-despliegue.md` con la URL publicada |

Los agentes no ven la conversación ni este archivo. Todo lo que necesitan viaja en el mensaje de delegación y en los archivos de `handoff/`.

## Reglas que no se negocian

1. El sector y las condiciones del bloque 1 nunca suman ni restan puntos.
2. La tabla de enfrentamientos del bloque 3 no se modifica sin recalcular sus tres condiciones.
3. El envío usa `Content-Type: text/plain;charset=utf-8`. Nunca `application/json`.
4. Ningún color de arquetipo coincide con los de la marca Al Objetivo.
5. Nada se despliega sin un informe de validación con veredicto APROBADO y sin confirmación explícita de Elizabeth.
6. Idioma de la interfaz y de los textos: español de España.
