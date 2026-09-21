---
name: envio-resultados
description: Contrato de envío de resultados del cuestionario a Google Apps Script y guardado de progreso en localStorage. Úsala al escribir o validar envio.js, config.js o cualquier código que persista respuestas.
---

# Envío de resultados y guardado de progreso

## Envío

```js
fetch(URL_APPS_SCRIPT, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  body: JSON.stringify(datos)
}).catch(() => {});
```

- `text/plain` evita la petición previa de CORS que Apps Script no sabe contestar. Con `application/json` falla siempre, aunque el script esté bien.
- Fire and forget: la pantalla de resultado se muestra sin esperar la respuesta.
- Si `URL_APPS_SCRIPT === "PENDIENTE"`, no se envía.
- `datos` lleva exactamente las claves de la sección 10 de la especificación, en minúsculas y con guion bajo. `docs/apps-script.gs` escribe las columnas por nombre, así que una clave mal escrita llega vacía sin dar error.
- Valores sí/no como `"sí"` / `"no"`. Listas (puntuaciones, campos libres, abiertas) como texto legible, no como JSON anidado.

## Progreso

- Clave única: `alobjetivo-quiz-progreso`.
- Guardar en cada cambio de respuesta, dentro de `try/catch`.
- Al cargar, si hay progreso, ofrecer «Continuar donde lo dejaste» o «Empezar de nuevo».
- Borrar la clave solo después de mostrar el resultado.
