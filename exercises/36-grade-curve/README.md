# Ejercicio 36 - Grade Curve

**Tipo:** Error Lógico

## Historia de Usuario

Como docente universitario, necesito un módulo que aplique una curva de escala a las notas de un examen: la nota más alta del grupo sube automáticamente a 100 y todas las demás se escalan proporcionalmente, preservando las diferencias relativas entre estudiantes.

## Criterios de Aceptación

- `applyCurve(scores)` recibe un arreglo de notas y devuelve las notas curvadas.
- La nota más alta del arreglo siempre debe ser 100 en el resultado.
- Las demás notas se escalan proporcionalmente: si la máxima era 80 y alguien tenía 40, ahora tendrá 50.
- Si la nota máxima ya es 100, las notas no cambian.
- `getLetterGrade(score)` devuelve A, B, C, D o F según rangos estándar.

## Problema Reportado

Los estudiantes reportan que las notas curvadas no son correctas. Cuando la distribución de notas es desigual, algunos estudiantes obtienen notas curvadas por encima de 100, y quien sacó la mayor nota no obtiene exactamente 100.

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `buggy-code.js` | Código con el bug a corregir |
| `solution.js` | Solución correcta con comentario `// CORREGIDO:` |
| `test.js` | Pruebas Jest (importa `buggy-code.js` por defecto) |

## Cómo Verificar

```bash
# Ver los errores
npm test exercises/36-grade-curve

# Verificar tu solución
# Cambia el import en test.js a solution.js y ejecuta de nuevo
npm test exercises/36-grade-curve
```

## Nivel de Dificultad

**Intermedio** — Requiere entender que la curva de escala debe usar el valor máximo como denominador, no el promedio, para que las proporciones y el techo de 100 sean correctos.
