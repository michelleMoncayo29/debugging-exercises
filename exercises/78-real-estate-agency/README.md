# Ejercicio 78: Real Estate Agency

**Tipo**: Logical Error (múltiple) | **Dificultad**: Avanzado

## Historia de Usuario

Como administrador de una inmobiliaria, quiero un sistema que gestione el inventario de propiedades, registre ventas, calcule comisiones de agentes y genere estadísticas de mercado, para tomar decisiones basadas en datos reales sobre el desempeño del negocio.

## Criterios de Aceptación

- El sistema debe manejar propiedades con tipo, área, precio, ubicación y agente responsable.
- Debe calcular el precio por metro cuadrado de cada propiedad.
- Al registrar una venta debe calcularse el porcentaje de descuento respecto al precio listado.
- El reporte de agentes debe ordenarse de mayor a menor volumen de ventas.
- El precio promedio de venta debe calcularse sobre los precios reales negociados, no los precios listados.
- Las estadísticas de descuento deben reflejar correctamente el promedio, máximo y mínimo del mercado.

## Problema Reportado

El equipo de análisis detectó múltiples inconsistencias en los reportes: los precios por metro cuadrado parecen invertidos, los porcentajes de descuento no coinciden con los calculados manualmente, el ranking de agentes no refleja quién más vendió, y el precio promedio de venta aparece inflado respecto a los cierres reales.

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `buggy-code.js` | Código con los errores que debes encontrar y corregir |
| `solution.js` | Solución correcta con comentarios `// CORREGIDO:` |
| `test.js` | Suite de pruebas Jest (50 tests) |

## Cómo Verificar

```bash
# Debe fallar (código con bugs)
npm test exercises/78-real-estate-agency

# Cambia el import en test.js a './solution' y vuelve a correr
npm test exercises/78-real-estate-agency
```

## Nivel de Dificultad

**Avanzado** — El ejercicio contiene cuatro bugs independientes distribuidos en distintas clases y métodos. Cada error es un cambio mínimo pero con impacto medible: dos están en métodos de clases auxiliares (`Property`, `Transaction`) y dos en la clase principal (`RealEstateAgency`).
