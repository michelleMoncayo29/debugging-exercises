# Ejercicio 77: Tournament Manager

**Tipo**: Logical Error | **Dificultad**: Avanzado

## Historia de Usuario

Como administrador de una liga de fútbol, quiero un sistema que registre equipos y resultados de partidos, calcule automáticamente la tabla de posiciones y proporcione estadísticas del torneo, para llevar un seguimiento preciso de cada jornada y conocer el rendimiento de cada equipo.

## Criterios de Aceptación

- El sistema debe registrar equipos con nombre y grupo, y partidos con ambos equipos, marcador y jornada.
- Al consultar las estadísticas de un equipo se deben retornar victorias, empates, derrotas, goles a favor, goles en contra, diferencia de goles y puntos totales.
- La puntuación debe seguir el sistema moderno: **3 puntos por victoria**, 1 por empate, 0 por derrota.
- La tabla de posiciones debe ordenarse por puntos (descendente), y en caso de empate por diferencia de goles y luego goles a favor.
- El sistema debe exponer análisis adicionales: mejor ataque, mejor defensa, equipos invictos, equipos sin victorias, historial cara a cara y los N primeros de la tabla.

## Problema Reportado

Los usuarios reportan que la tabla de posiciones no refleja correctamente los méritos de los equipos. Equipos que ganaron partidos aparecen con menos puntos de los esperados, y en algunos casos equipos con más victorias quedan rezagados frente a equipos con puros empates.

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `buggy-code.js` | Código con el error que debes encontrar y corregir |
| `solution.js` | Solución correcta con comentario `// CORREGIDO:` |
| `test.js` | Suite de pruebas Jest |

## Cómo Verificar

```bash
# Debe fallar (código con bug)
npm test exercises/77-tournament-manager

# Cambia el import en test.js a './solution' y vuelve a correr
npm test exercises/77-tournament-manager
```

## Nivel de Dificultad

**Avanzado** — El error es un único valor numérico incorrecto dentro de la lógica de acumulación de puntos. Su impacto se propaga silenciosamente a toda la tabla de posiciones y a cualquier análisis que dependa de ella.
