# Restaurant Billing System

**Tipo**: Error Lógico

## Historia de Usuario

Como cajero de un restaurante, necesito que el sistema divida la cuenta correctamente entre los comensales de una mesa para que cada persona pague su parte proporcional del total.

## Criterios de Aceptación

- La división debe hacerse entre el número de **comensales**, no entre el número de ítems
- El resultado `perPerson` debe reflejar el total (con impuesto) dividido entre los comensales
- El campo `diners` debe conservar el valor pasado como argumento
- Debe lanzar error si se intenta dividir entre 0 comensales

## Problema Reportado

Al solicitar la división de cuenta para una mesa de 2 personas que ordenaron 4 ítems, el sistema divide el total entre 4 en vez de entre 2, generando un monto por persona incorrecto.

**Ejemplos del problema**:

- Mesa con 2 personas, 4 ítems, total $32.40 → retorna $8.10/persona en vez de $16.20
- Mesa con 3 personas, 3 ítems, total $38.88 → parece correcto solo por coincidencia (3==3)
- `split.diners` siempre retorna el valor correcto, pero `split.perPerson` no

## Archivos

- `buggy-code.js` - Código con el error
- `test.js` - Pruebas para validar la solución (Jest)
- `solution.js` - Solución de referencia (para comparar después)

## Cómo Verificar

```bash
npm test exercises/43-restaurant-billing
```

Todas las pruebas deben pasar para considerar el error corregido.

**Nota**: Los tests están configurados para probar `buggy-code.js` por defecto. Cuando corrijas el error, cambia la línea de importación en `test.js` a `solution.js` para verificar tu solución.

## Nivel de Dificultad

**Nivel**: Principiante

**Tiempo Estimado**: 10-15 minutos
