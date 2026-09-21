---
name: marca-al-objetivo
description: Sistema visual y tono de la interfaz del cuestionario de Al Objetivo (paleta, tipografía, espaciado, móvil, accesibilidad y la regla de separar colores de marca y de arquetipos). Úsala al escribir o revisar HTML y CSS de este proyecto.
---

# Marca Al Objetivo en la interfaz

## Paleta de la interfaz

| Uso | Color |
|---|---|
| Fondo | `#FFFFFF` |
| Texto | `#000000` |
| Énfasis: botones principales, barra de progreso, enlaces | `#D8851F` |
| Secciones y bloques de fondo | `#3D391F` y `#1A2B32` |

Sobre `#3D391F` y `#1A2B32` el texto va en blanco. Sobre `#D8851F`, texto negro para contraste suficiente en tamaños pequeños.

## Dos paletas separadas

Los colores de los arquetipos (sección 3 de la especificación) son contenido del resultado y no se usan en la interfaz. Ninguno coincide con los de Al Objetivo. El resultado del cliente no debe parecer parte de la marca que firma la herramienta.

En la ficha de resultado, el color del arquetipo va en una franja o tarjeta; comprueba el contraste del texto sobre él (el Inocente, `#F0E6D2`, necesita texto oscuro).

## Tipografía

Tipografía provisional, cercana al estilo de los materiales de la marca: `Kanit` de Google Fonts para titulares y `Nunito Sans` para texto, con pila de respaldo `system-ui, -apple-system, "Segoe UI", sans-serif`. Carga con `display=swap`. Si Elizabeth indica la tipografía oficial de Al Objetivo, sustituye estas dos y no uses ninguna otra.

## Criterios

- Móvil primero. Ancho mínimo de diseño: 360 px. Áreas táctiles de al menos 44 × 44 px.
- La doble selección del bloque 3: por opción, dos botones claramente diferenciados («Más me describe» / «Menos me describe»), nunca dos casillas diminutas.
- Una pregunta por pantalla en móvil; en escritorio, un bloque por pantalla está bien si no obliga a hacer scroll largo.
- Barra de progreso con el nombre del bloque actual.
- Tono: cercano y profesional, de tú, sin tecnicismos. Frases cortas.
- Accesibilidad: etiquetas en todos los controles, foco visible, navegable con teclado, `lang="es"`.
- Nada de emojis en la interfaz.
