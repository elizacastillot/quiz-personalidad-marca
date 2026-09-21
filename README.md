# Cuestionario de Personalidad de Marca — Al Objetivo

Proyecto preparado para construirse con Claude Code mediante un sistema de agentes.

## Qué hay en cada carpeta

```
quiz-personalidad-marca/
├── CLAUDE.md                     contexto del proyecto para el orquestador
├── README.md                     este archivo
├── package.json                  solo para ejecutar las pruebas con Node
├── .claude/
│   ├── settings.json             arranca cada sesión como orquestador
│   ├── agents/
│   │   ├── orquestador.md        capa de mando: planifica y delega
│   │   ├── analista.md           especificación → plan técnico
│   │   ├── implementador.md      plan → código y pruebas
│   │   ├── validador.md          código → veredicto APROBADO / RECHAZADO
│   │   └── desplegador.md        aprobado → publicado en GitHub Pages
│   └── skills/
│       ├── especificacion-cuestionario/   cómo leer y respetar la especificación
│       ├── motor-puntuacion/              reglas de cálculo y cómo probarlas
│       ├── marca-al-objetivo/             sistema visual de la interfaz
│       ├── envio-resultados/              contrato con Apps Script y guardado de progreso
│       └── despliegue-github-pages/       procedimiento de publicación
├── .github/workflows/pages.yml   pruebas + publicación automática de src/
├── docs/
│   ├── especificacion.md         fuente de verdad del cuestionario
│   └── apps-script.gs            receptor de resultados para Google Sheets
├── handoff/                      documentos que se pasan los agentes
├── src/                          la web (la construye el implementador)
└── tests/                        pruebas (las escribe el implementador)
```

## Cómo funciona el sistema de agentes

Al abrir Claude Code en esta carpeta, la sesión principal ya es el **orquestador** (lo fija `.claude/settings.json`). Tú hablas solo con él.

El orquestador no programa. Divide el trabajo en cuatro fases y encarga cada una a un agente distinto. Cada agente arranca con el contexto limpio: no ve la conversación, ni el CLAUDE.md, ni lo que hicieron los demás. Solo recibe una instrucción cerrada (tarea, qué leer, qué entregar, cuándo ha terminado) y los archivos de `handoff/`. Así cada uno se concentra en lo suyo y ningún error de una fase contamina la siguiente.

Los agentes tampoco pueden crear otros agentes: solo el orquestador delega.

Dos puertas de control:
- Si el validador rechaza, el trabajo vuelve al implementador con la lista de fallos. Máximo dos vueltas; si sigue fallando, el orquestador te lo explica y decides tú.
- Nada se publica sin validación aprobada y sin que tú digas que sí.

## Puesta en marcha

### 1. Requisitos
- Claude Code actualizado. Los agentes usan el campo `omitClaudeMd`, que necesita la versión 2.1.271 o posterior; en versiones anteriores funcionan igual, pero cargan el CLAUDE.md.
- Node 18 o superior (`node --version`).
- Git y una cuenta de GitHub. La CLI `gh` es opcional pero ayuda al desplegador a seguir el despliegue.

### 2. Google Sheets (diez minutos, una sola vez)
Sigue las instrucciones de la cabecera de `docs/apps-script.gs`. Al final tendrás una URL que termina en `/exec`. Guárdala.

### 3. Repositorio
```bash
cd quiz-personalidad-marca
git init
git add .
git commit -m "Estructura inicial del proyecto"
git branch -M main
git remote add origin https://github.com/<tu-usuario>/quiz-personalidad-marca.git
git push -u origin main
```
En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

### 4. Arrancar

**En VS Code, usa la terminal integrada, no el panel gráfico.** Abre la carpeta del proyecto en VS Code, abre la terminal (Terminal → Nuevo terminal) y ejecuta:

```bash
claude
```

Motivo: el sistema depende de que la sesión arranque como orquestador (`"agent"` en `.claude/settings.json`) y de los agentes de `.claude/agents/`. Eso funciona siempre en la terminal; el panel gráfico de la extensión ha tenido problemas con ambas cosas. Con la extensión instalada, la terminal sigue usando el visor de diferencias de VS Code, así que no pierdes nada.

Comprobación rápida al arrancar: en la cabecera debe aparecer `@orquestador`.
Primer mensaje sugerido:

> Empieza el proyecto desde la fase de análisis. La URL de Apps Script es: https://script.google.com/macros/s/…/exec

Si aún no tienes la URL, arranca igual: el implementador dejará la configuración como `PENDIENTE` y el desplegador no publicará hasta que la añadas.

## Test de aceptación

Antes de dar el cuestionario a ningún cliente, rellénalo tú como Al Objetivo. Debe salir Mago dominante y Hombre común secundario, y debe aparecer la fila en tu hoja de cálculo. Si no sale así, díselo al orquestador antes de seguir.

## Cambiar el cuestionario más adelante

1. Edita `docs/especificacion.md`.
2. Dile al orquestador qué has cambiado. Él decide si hace falta un plan nuevo o basta con implementar y validar.
