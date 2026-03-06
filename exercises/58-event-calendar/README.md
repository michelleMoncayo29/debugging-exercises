# Event Calendar

**Tipo**: Error Lógico

## Historia de Usuario

Como usuario de agenda, necesito que los eventos recurrentes se generen a partir de la fecha indicada para que la primera ocurrencia sea el día de inicio y no una semana después.

## Criterios de Aceptación

- La primera ocurrencia de un evento recurrente debe ser la fecha de inicio (`i = 0`)
- Un evento semanal desde el 01/03 con 3 ocurrencias debe generar: 01/03, 08/03 y 15/03
- El número total de ocurrencias generadas debe coincidir con el parámetro `count`
- Las fechas deben estar separadas exactamente por el número de días indicado

## Problema Reportado

Los eventos recurrentes no incluyen la fecha de inicio: la primera ocurrencia aparece un intervalo más tarde de lo esperado.

**Ejemplos del problema**:

- Evento semanal desde 2024-03-01, 3 ocurrencias → genera: 2024-03-08, 2024-03-15, 2024-03-22 (debería ser: 2024-03-01, 2024-03-08, 2024-03-15)
- El día de inicio queda sin evento registrado
- Todos los eventos del ciclo aparecen desplazados un intervalo hacia adelante

## Archivos

- `buggy-code.js` - Código con el error
- `test.js` - Pruebas para validar la solución (Jest)
- `solution.js` - Solución de referencia (para comparar después)

## Cómo Verificar

```bash
npm test exercises/58-event-calendar
```

Todas las pruebas deben pasar para considerar el error corregido.

**Nota**: Los tests están configurados para probar `buggy-code.js` por defecto. Cuando corrijas el error, cambia la línea de importación en `test.js` a `solution.js` para verificar tu solución.

## Nivel de Dificultad

**Nivel**: Principiante

**Tiempo Estimado**: 10-15 minutos
