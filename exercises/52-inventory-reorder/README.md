# Inventory Reorder System

**Tipo**: Error Lógico

## Historia de Usuario

Como responsable de almacén, necesito que el sistema calcule correctamente el punto de reorden de cada artículo para saber cuándo realizar un nuevo pedido y evitar roturas de stock.

## Criterios de Aceptación

- El punto de reorden se calcula como `demandaDiaria × tiempoEntrega + stockSeguridad`
- Un artículo con demanda=10, tiempoEntrega=5 y stockSeguridad=20 debe tener punto de reorden=70
- Un artículo con demanda=4, tiempoEntrega=7 y stockSeguridad=10 debe tener punto de reorden=38
- Los artículos cuyo stock actual ≤ punto de reorden deben aparecer en el reporte de reorden

## Problema Reportado

El sistema genera puntos de reorden incorrectos. Para un artículo con demanda diaria=10, tiempo de entrega=5 días y stock de seguridad=20, retorna 205 en lugar de 70.

**Ejemplos del problema**:

- Artículo A001 (demanda=10, lead=5, safety=20) → punto de reorden reportado: 205 (debería ser 70)
- Artículo B002 (demanda=4, lead=7, safety=10) → punto de reorden reportado: 87 (debería ser 38)
- El error provoca que artículos sin problemas de stock aparezcan incorrectamente en el reporte de reorden

## Archivos

- `buggy-code.js` - Código con el error
- `test.js` - Pruebas para validar la solución (Jest)
- `solution.js` - Solución de referencia (para comparar después)

## Cómo Verificar

```bash
npm test exercises/52-inventory-reorder
```

Todas las pruebas deben pasar para considerar el error corregido.

**Nota**: Los tests están configurados para probar `buggy-code.js` por defecto. Cuando corrijas el error, cambia la línea de importación en `test.js` a `solution.js` para verificar tu solución.

## Nivel de Dificultad

**Nivel**: Principiante

**Tiempo Estimado**: 10-15 minutos
