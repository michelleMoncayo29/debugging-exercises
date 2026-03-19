# Gestor de Préstamos de Biblioteca

**Tipo**: Logical Error

## 📋 Historia de Usuario

Como bibliotecario responsable del sistema de préstamos, necesito una aplicación que registre libros y miembros, gestione préstamos y devoluciones, calcule multas por retraso, permita renovar préstamos activos, y genere estadísticas de uso del catálogo.

## 🎯 Criterios de Aceptación

- [ ] Al registrar la devolución de un libro, el sistema debe almacenar la fecha real de devolución proporcionada, y el libro debe volver a quedar disponible.
- [ ] El sistema debe calcular correctamente la multa por retraso: solo se cobra cuando la devolución ocurre después de la fecha de vencimiento.
- [ ] El sistema debe permitir renovar únicamente los préstamos que aún no han sido devueltos, extendiendo la fecha de vencimiento el número de días indicado.
- [ ] La consulta de libros disponibles debe excluir todos los libros que se encuentran actualmente prestados.
- [ ] La consulta de préstamos por miembro debe retornar todos los préstamos (activos y devueltos) asociados al identificador del miembro.
- [ ] El ranking de libros más prestados debe presentarse ordenado de mayor a menor número de préstamos.

## 🐛 Problema Reportado

Se reportan múltiples comportamientos incorrectos en distintas operaciones del sistema:

- Al devolver un libro con retraso, la multa calculada es siempre `0`, independientemente de cuántos días haya transcurrido desde el vencimiento.
- Al consultar los libros disponibles, el sistema retorna libros que en ese momento están prestados y no deberían estar disponibles.
- Al consultar el historial de préstamos de un miembro por su identificador numérico, el sistema retorna una lista vacía aunque el miembro tenga préstamos registrados.
- Al intentar renovar un préstamo que ya fue devuelto, el sistema modifica igualmente la fecha de vencimiento y marca el préstamo como renovado.
- El ranking de libros más prestados no aparece ordenado correctamente: el libro con mayor número de préstamos no siempre ocupa la primera posición.
- La fecha almacenada al registrar una devolución no coincide con la fecha real provista: el sistema registra una fecha incorrecta, lo que hace que los cálculos posteriores de multas y estadísticas produzcan resultados erróneos.

## 📂 Archivos

- `buggy-code.js` - Código con los errores
- `test.js` - Pruebas para validar la solución (Jest)
- `solution.js` - Solución de referencia (para comparar después)

## ✅ Cómo Verificar la Solución

```bash
npm test exercises/72-loan-manager
```

Todas las pruebas deben pasar para considerar los errores corregidos.

**Nota**: Los tests están configurados para probar `buggy-code.js` por defecto.
Cuando corrijas los errores, cambia la línea de importación en `test.js` a `solution.js`
para verificar tu solución.

## ⚙️ Nivel de Dificultad

**Nivel**: Avanzado

**Tiempo Estimado**: 30-50 minutos
