# Catálogo de Biblioteca

**Tipo**: Error de Ejecución

## Historia de Usuario

Como bibliotecario de una institución educativa, necesito un sistema que gestione el catálogo de libros para registrar préstamos y devoluciones, y obtener estadísticas actualizadas del inventario.

## Criterios de Aceptación

- `checkoutBook` debe lanzar un error descriptivo cuando el libro no existe, sin colapsar con un error de ejecución
- `returnBook` debe poder procesar la devolución de un libro prestado sin fallar cuando el campo `checkedOutBy` es `null`
- `getStats` debe reportar correctamente el número de libros prestados usando el campo adecuado del modelo
- Todas las funciones deben manejar correctamente los casos de ID inexistente con mensajes claros

## Problema Reportado

El sistema falla inesperadamente en producción con errores del tipo `TypeError: Cannot read properties of null` en operaciones que deberían simplemente lanzar un error descriptivo de negocio.

**Ejemplos del problema**:

- Al intentar prestar un libro con un ID inexistente, el sistema lanza `TypeError: Cannot read properties of null (reading 'available')` en lugar de `"Libro no encontrado"`
- Al devolver un libro disponible (nunca prestado), el sistema lanza `TypeError: Cannot read properties of null (reading 'length')` en lugar de `"El libro no está prestado"`
- Después de prestar 2 libros, `getStats` reporta `checkedOut: 0` en lugar de `checkedOut: 2`

## Archivos

- `buggy-code.js` - Código con los errores
- `test.js` - Pruebas para validar la solución (Jest)
- `solution.js` - Solución de referencia (para comparar después)

## Como Verificar la Solución

```bash
npm test exercises/12-library-catalog
```

Todas las pruebas deben pasar para considerar los errores corregidos.

**Nota**: Los tests están configurados para probar `buggy-code.js` por defecto. Cuando corrijas los errores, cambia la línea de importación en `test.js` a `solution.js` para verificar tu solución.

## Nivel de Dificultad

**Nivel**: Intermedio

**Tiempo Estimado**: 15-25 minutos
