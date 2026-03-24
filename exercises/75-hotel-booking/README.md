# 75 - Hotel Booking

**Tipo:** Logical Error

## Historia de Usuario

Como administrador de un hotel, quiero un sistema que gestione las habitaciones y reservas para poder controlar la disponibilidad, calcular costos automáticamente y obtener reportes de ocupación e ingresos.

## Criterios de Aceptación

- Cada habitación tiene número, tipo (single/double/suite), precio por noche y estado de disponibilidad.
- El sistema permite reservar habitaciones disponibles indicando huésped, fecha de entrada y fecha de salida.
- Al reservar, se calcula automáticamente el número de noches y el costo total.
- El sistema impide reservar habitaciones ya ocupadas.
- El check-out libera la habitación para nuevas reservas.
- Se pueden consultar habitaciones disponibles, opcionalmente filtrando por tipo.
- Se pueden consultar habitaciones por rango de precio.
- Los reportes incluyen: ingresos totales, tasa de ocupación, reserva más cara, reservas por huésped y resumen por tipo.

## Problema Reportado

El equipo de contabilidad reportó que los ingresos totales del hotel aparecen como valores negativos en el sistema. Además, al consultar la reserva más cara, el sistema devuelve datos incorrectos.

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `buggy-code.js` | Código con el error a corregir |
| `solution.js` | Implementación correcta |
| `test.js` | Suite de pruebas con Jest |

## Cómo Verificar

```bash
# Ejecutar tests con el código buggy (deben fallar algunos)
npx jest exercises/75-hotel-booking

# Ejecutar tests con la solución (deben pasar todos)
# Cambia el import en test.js de 'buggy-code' a 'solution'
npx jest exercises/75-hotel-booking
```

## Nivel de Dificultad

⭐⭐⭐ Intermedio
