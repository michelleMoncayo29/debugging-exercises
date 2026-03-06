# Ejercicio 38 - Calendar Builder

**Tipo:** Error Lógico

## Historia de Usuario

Como desarrollador de una aplicación de agenda, necesito un módulo que genere la cuadrícula de un mes en forma de semanas que van de lunes a domingo, con celdas `null` para los días anteriores al inicio del mes.

## Criterios de Aceptación

- `getDaysInMonth(year, month)` devuelve el número correcto de días del mes, incluyendo años bisiestos.
- `buildCalendar(year, month)` devuelve un arreglo de semanas, donde cada semana es un arreglo de 7 elementos.
- El índice `0` de cada semana corresponde al **lunes** y el índice `6` al **domingo**.
- Las celdas anteriores al primer día del mes y posteriores al último son `null`.
- Enero de 2024 (que empieza en lunes) debe tener el día 1 en la posición `[0][0]`.

## Problema Reportado

El equipo de diseño reporta que el calendario está desfasado un día: los eventos del lunes aparecen en la columna del domingo y todos los días del mes están corridos una posición a la derecha de donde deberían estar.

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `buggy-code.js` | Código con el bug a corregir |
| `solution.js` | Solución correcta con comentario `// CORREGIDO:` |
| `test.js` | Pruebas Jest (importa `buggy-code.js` por defecto) |

## Cómo Verificar

```bash
# Ver los errores
npm test exercises/38-calendar-builder

# Verificar tu solución
# Cambia el import en test.js a solution.js y ejecuta de nuevo
npm test exercises/38-calendar-builder
```

## Nivel de Dificultad

**Intermedio** — Requiere entender que `Date.getDay()` devuelve `0` para domingo (semana con inicio en domingo), y que se necesita convertir a un sistema con inicio en lunes usando `(day + 6) % 7`.
