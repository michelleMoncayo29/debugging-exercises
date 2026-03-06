# Survey Analyzer

**Tipo**: Error Lógico

## Historia de Usuario

Como analista de datos, necesito calcular percentiles precisos sobre las respuestas de encuestas para segmentar correctamente a los usuarios por nivel de satisfacción.

## Criterios de Aceptación

- El percentil 50 de `[1..10]` debe retornar `5`
- El percentil 90 de `[1..10]` debe retornar `9`
- El percentil 0 debe retornar el primer elemento del arreglo
- El percentil 100 debe retornar el último elemento del arreglo
- El análisis completo de pregunta debe incluir percentil 90 correcto

## Problema Reportado

Los reportes de satisfacción muestran valores de percentil incorrectos. El percentil 90 de un arreglo de 10 elementos retorna el décimo elemento (índice 9, valor 10) en lugar del noveno (índice 8, valor 9). Para percentil 100 el sistema lanza un error de `undefined`.

**Ejemplos del problema**:

- `getPercentile([1,2,3,4,5,6,7,8,9,10], 50)` retorna `6` en vez de `5`
- `getPercentile([1,2,3,4,5,6,7,8,9,10], 90)` retorna `10` en vez de `9`
- `getPercentile([1,2,3,4,5], 100)` retorna `undefined` en vez de `5`

## Archivos

- `buggy-code.js` - Código con el error
- `test.js` - Pruebas para validar la solución (Jest)
- `solution.js` - Solución de referencia (para comparar después)

## Cómo Verificar

```bash
npm test exercises/40-survey-analyzer
```

Todas las pruebas deben pasar para considerar el error corregido.

**Nota**: Los tests están configurados para probar `buggy-code.js` por defecto. Cuando corrijas el error, cambia la línea de importación en `test.js` a `solution.js` para verificar tu solución.

## Nivel de Dificultad

**Nivel**: Intermedio

**Tiempo Estimado**: 15-25 minutos
