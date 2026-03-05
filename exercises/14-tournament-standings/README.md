# Tabla de Posiciones de Torneo

**Tipo**: Error Lógico

## Historia de Usuario

Como organizador de un torneo de fútbol, necesito un módulo que registre los resultados de los partidos y genere la tabla de posiciones oficial para determinar qué equipos avanzan a la siguiente ronda.

## Criterios de Aceptación

- `calculatePoints` debe asignar 3 puntos por victoria y 1 por empate (sistema FIFA estándar)
- `recordMatch` debe registrar correctamente los goles a favor y en contra de cada equipo por separado
- `getStandings` debe ordenar los equipos de mayor a menor puntaje, desempatando por diferencia de goles
- La tabla generada no debe modificar el array original de equipos

## Problema Reportado

El módulo produce clasificaciones incorrectas que no coinciden con los resultados reales del torneo.

**Ejemplos del problema**:

- Una victoria debería sumar 3 puntos, pero el sistema otorga solo 2
- Después de registrar un partido 3-1, ambos equipos aparecen con `goalsFor: 3` y `goalsAgainst: 1`, en lugar de que cada equipo refleje sus propios goles
- La tabla de posiciones aparece en orden inverso: el equipo con menos puntos aparece primero

## Archivos

- `buggy-code.js` - Código con los errores
- `test.js` - Pruebas para validar la solución (Jest)
- `solution.js` - Solución de referencia (para comparar después)

## Como Verificar la Solución

```bash
npm test exercises/14-tournament-standings
```

Todas las pruebas deben pasar para considerar los errores corregidos.

**Nota**: Los tests están configurados para probar `buggy-code.js` por defecto. Cuando corrijas los errores, cambia la línea de importación en `test.js` a `solution.js` para verificar tu solución.

## Nivel de Dificultad

**Nivel**: Avanzado

**Tiempo Estimado**: 25-40 minutos
