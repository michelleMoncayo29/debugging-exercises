# Parking Lot Manager

**Tipo**: Error Lógico

## Historia de Usuario

Como administrador de un estacionamiento, necesito que el sistema asigne a cada vehículo el spot del tamaño apropiado para no desperdiciar espacios grandes en vehículos pequeños.

## Criterios de Aceptación

- Un vehículo compact debe recibir un spot compact si hay disponibles
- Un vehículo compact puede usar un spot standard o large solo si no hay compact libres
- Un vehículo large solo puede usar spots large (no cabe en compact ni standard)
- Debe lanzar error si no hay spots compatibles disponibles

## Problema Reportado

El sistema asigna el primer spot libre sin importar si el tipo es compatible. Un vehículo compact recibe un spot large cuando hay compacts disponibles, y la lógica de fallback entre tipos no funciona correctamente.

**Ejemplos del problema**:

- Vehículo compact con spots large disponibles primero → se asigna el spot large en vez del compact
- Vehículo compact al que se le deberían asignar spots standard (si no hay compact) los ignora

## Archivos

- `buggy-code.js` - Código con el error
- `test.js` - Pruebas para validar la solución (Jest)
- `solution.js` - Solución de referencia (para comparar después)

## Cómo Verificar

```bash
npm test exercises/47-parking-lot
```

Todas las pruebas deben pasar para considerar el error corregido.

**Nota**: Los tests están configurados para probar `buggy-code.js` por defecto. Cuando corrijas el error, cambia la línea de importación en `test.js` a `solution.js` para verificar tu solución.

## Nivel de Dificultad

**Nivel**: Intermedio

**Tiempo Estimado**: 15-20 minutos
