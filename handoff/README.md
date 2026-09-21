# Handoff

Aquí los agentes dejan lo que entregan y leen lo que necesitan. Es la única memoria compartida entre fases.

| Archivo | Lo escribe | Lo lee |
|---|---|---|
| `01-plan-tecnico.md` | analista | implementador, validador |
| `02-implementacion.md` | implementador | validador |
| `03-validacion.md` | validador | orquestador, implementador (si hay correcciones) |
| `04-despliegue.md` | desplegador | orquestador |

Reglas:
- Cada agente escribe solo su archivo. Si repite fase, lo sobrescribe entero.
- Un archivo de handoff se lee sin contexto previo: nada de "como hablamos" ni referencias a la conversación.
- Rutas siempre relativas a la raíz del proyecto.
