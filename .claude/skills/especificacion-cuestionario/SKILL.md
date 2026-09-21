---
name: especificacion-cuestionario
description: Cómo leer y respetar docs/especificacion.md del cuestionario de arquetipos de Al Objetivo. Úsala siempre que trabajes con preguntas, códigos de arquetipo, bloques, textos del resultado o columnas de la hoja de cálculo de este proyecto.
---

# Especificación del cuestionario

`docs/especificacion.md` es la fuente de verdad. Esta skill te dice dónde está cada cosa y qué reglas no se pueden romper.

## Mapa de la especificación

| Sección | Contiene |
|---|---|
| 1–2 | Marco teórico y principios de diseño |
| 3 | Ficha técnica de los 12 arquetipos: código, motivación, color |
| 4 | Modo marca y modo fundador |
| 5 | Las 43 preguntas por bloques, con sus códigos |
| 6 | Lógica de puntuación y alerta |
| 7 | Textos del resultado: combinación, tensiones, contexto, notas, fichas |
| 8 | Orden de la pantalla de resultado |
| 9 | Requisitos técnicos |
| 10 | Columnas que se envían a Google Sheets |
| 11–12 | Uso en sesión y nota de criterio (no afectan al código) |

## Códigos

`IN SA EX HE RE MA HC AM BU CU CR GO`. Motivaciones: `INDEPENDENCIA` (IN, SA, EX), `MAESTRIA` (HE, RE, MA), `PERTENENCIA` (HC, AM, BU), `ESTABILIDAD` (CU, CR, GO). En el código usa las motivaciones sin tilde como claves.

## Bloques y si puntúan

| Bloque | Preguntas | Puntúa | Formato |
|---|---|---|---|
| Datos iniciales | — | No | Texto, email, lista de sector, modo |
| 1 Condiciones | P1–P3 | **No** | Sí/No |
| 2 Transformación | P4–P7 | Sí (ancla) | Elección única por motivación |
| 3 Comportamiento | P8–P19 | Sí | Doble selección más/menos |
| 4 Nunca haría | P20–P22 | Sí (resta) | Elección única |
| 5 Tensiones | P23–P28 | Sí | Dos opciones |
| 6 Voz y tono | P29–P34 | Sí | Escala 1–5, relativa al sector |
| 7 Categoría | P35–P37 | **No** | P35 lista de 12; P36–P37 abiertas |
| 8 Abiertas | P38–P43 | No | Texto libre |

Cada bloque, salvo datos iniciales, admite un campo libre opcional que no puntúa y se guarda en `campos_libres`.

## Reglas intocables

1. El sector, el bloque 1 y el bloque 7 nunca modifican puntuaciones.
2. La tabla de enfrentamientos del bloque 3 cumple tres condiciones: 4 apariciones por arquetipo, ninguna pareja más de 2 veces, las 12 parejas intracuadrante al menos 1 vez.
3. Los textos se copian literalmente. Si falta uno, es una duda, no una invención.
4. En modo fundador cambian enunciados (bloques 2 y 3) y se añade una nota; las opciones y los códigos no cambian.
5. Las opciones se barajan en cada carga; el código viaja con la opción.
