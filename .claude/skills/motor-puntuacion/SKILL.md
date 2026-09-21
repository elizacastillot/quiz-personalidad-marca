---
name: motor-puntuacion
description: Reglas exactas de cálculo del cuestionario de arquetipos (puntuación total, discriminante, porcentajes, alerta, empates, tensiones) y cómo probarlas con node --test. Úsala al diseñar, escribir o validar puntuacion.js, resultado.js o sus pruebas.
---

# Motor de puntuación

## Dos puntuaciones por arquetipo

```
discriminante = bloque3(+3 más, −2 menos) + bloque4(−2) + bloque5(+2) + bloque6(escala)
ancla         = bloque2: +2 a cada arquetipo de la motivación elegida, por pregunta
total         = discriminante + ancla
```

Escala del bloque 6: posición 1 → +2 a los dos de la izquierda; 2 → +1 izquierda; 3 → nada; 4 → +1 derecha; 5 → +2 derecha.

- **Ordenar y mostrar:** por `total`.
- **Alerta:** por `discriminante`. Salta si `d3 >= d2 - 2` o `d1 / (d1 + d2) * 100 < 55`.
- **Porcentajes:** negativas a 0 antes de calcular; `dom = round(p1 / (p1 + p2) * 100)`, `sec = 100 - dom`.
- **Empate en el primer puesto:** más marcas "MÁS" en bloque 3; si persiste, orden alfabético del nombre del arquetipo.

## Casos que rompen implementaciones ingenuas

- `p1 + p2 = 0` (todo negativo o cero): no dividas por cero. Trátalo como alerta.
- `d1 + d2 <= 0` en la alerta: trátalo como alerta.
- Porcentaje de alerta con discriminantes negativas: aplica también el corte a 0 antes de la división.
- Tensiones: `GO–RE`, `CU–EX`, `SA–BU`, `HE–IN`, `MA–HC`, `AM–CR`, en cualquier orden.

## Diseño

- Funciones puras, sin DOM ni `localStorage`, exportadas como módulos ES.
- Entrada: objeto de respuestas por id de pregunta. Salida: objeto con `total`, `discriminante`, `dominante`, `secundario`, `tercero`, porcentajes y banderas.

## Pruebas

`node --test tests/` sin dependencias. Usa `node:test` y `node:assert/strict`.

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcular } from '../src/js/puntuacion.js';
```

Pruebas mínimas:
- Cada peso de cada bloque aislado.
- Bloques 1 y 7 no cambian nada (misma entrada, variando solo esos bloques).
- Alerta: un caso que salta y uno que no, con cuadrante fuerte y bien definido dentro.
- Empate y desempate.
- División por cero.
- Caso «Al Objetivo» → Mago dominante, Hombre común secundario.
- Integridad de la tabla del bloque 3 (las tres condiciones), calculada desde los datos.
