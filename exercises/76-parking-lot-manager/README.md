# Ejercicio 76: Parking Lot Manager

**Tipo**: Logical Error | **Dificultad**: Avanzado

## Historia de Usuario

Como administrador de un parqueadero, quiero un sistema que gestione el ingreso y salida de vehículos, calcule las tarifas correspondientes y proporcione estadísticas de operación, para llevar un control preciso de ingresos y ocupación.

## Criterios de Aceptación

- El sistema debe soportar tres tipos de vehículos: automóviles (`car`), motocicletas (`motorcycle`) y camiones (`truck`).
- Cada tipo de vehículo ocupa un tipo de espacio específico: `regular`, `compact` o `large`.
- Al retirar un vehículo se calcula una tarifa basada en el tiempo estacionado y la tarifa por hora según el tipo.
- Las horas parciales se cobran como hora completa.
- El sistema debe registrar el historial de transacciones y exponer estadísticas: ingresos totales, ingresos por tipo, duración promedio, tipo más frecuente, entre otras.

## Problema Reportado

El parqueadero reporta que los ingresos registrados no coinciden con los cobros esperados. Los clientes con estadías cortas reciben cobros por debajo de lo correcto, y el reporte de ingresos acumulados también muestra valores inferiores a los reales.

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `buggy-code.js` | Código con el error que debes encontrar y corregir |
| `solution.js` | Solución correcta con comentario `// CORREGIDO:` |
| `test.js` | Suite de pruebas Jest |

## Cómo Verificar

```bash
# Debe fallar (código con bug)
npm test exercises/76-parking-lot-manager

# Cambia el import en test.js a './solution' y vuelve a correr
npm test exercises/76-parking-lot-manager
```

## Nivel de Dificultad

**Avanzado** — El error está en una operación matemática de una sola línea dentro de un método central, pero su impacto se propaga a múltiples métodos que dependen de las tarifas calculadas.
