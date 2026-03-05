/**
 * Pruebas para: Catálogo de Biblioteca
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/12-library-catalog
 */

const {
  addBook,
  findBook,
  checkoutBook,
  returnBook,
  getStats,
} = require('./buggy-code.js');
// const { addBook, findBook, checkoutBook, returnBook, getStats } = require('./solution.js');

describe('Catálogo de Biblioteca - Error de Ejecución', () => {
  let catalog;
  const book1 = { id: 'B001', title: 'El Quijote', author: 'Cervantes' };
  const book2 = { id: 'B002', title: 'Cien años de soledad', author: 'García Márquez' };
  const book3 = { id: 'B003', title: '1984', author: 'Orwell' };

  beforeEach(() => {
    catalog = [];
    addBook(catalog, book1);
    addBook(catalog, book2);
    addBook(catalog, book3);
  });

  // ─── addBook ─────────────────────────────────────────────────────────────

  describe('addBook - Agregar libros al catálogo', () => {
    test('debe agregar un libro nuevo con estado disponible', () => {
      const newBook = { id: 'B004', title: 'Dune', author: 'Herbert' };
      addBook(catalog, newBook);
      expect(catalog).toHaveLength(4);
      expect(findBook(catalog, 'B004').available).toBe(true);
    });

    test('debe lanzar error si el libro ya existe en el catálogo', () => {
      expect(() => addBook(catalog, book1)).toThrow('Ya existe un libro');
    });

    test('debe lanzar error si faltan datos obligatorios del libro', () => {
      expect(() => addBook(catalog, { id: 'B005' })).toThrow(
        'Datos del libro incompletos',
      );
    });
  });

  // ─── checkoutBook ─────────────────────────────────────────────────────────

  describe('checkoutBook - Préstamo de libros', () => {
    test('debe marcar el libro como no disponible y registrar el usuario', () => {
      const result = checkoutBook(catalog, 'B001', 'user1');
      expect(result.available).toBe(false);
      expect(result.checkedOutBy).toBe('user1');
    });

    test('debe lanzar un error descriptivo (no TypeError) cuando el libro no existe', () => {
      expect(() => checkoutBook(catalog, 'ID-INEXISTENTE', 'user1')).toThrow(
        'no encontrado',
      );
    });

    test('debe lanzar error cuando el libro ya está prestado', () => {
      checkoutBook(catalog, 'B001', 'user1');
      expect(() => checkoutBook(catalog, 'B001', 'user2')).toThrow(
        'no está disponible',
      );
    });
  });

  // ─── returnBook ───────────────────────────────────────────────────────────

  describe('returnBook - Devolución de libros', () => {
    test('debe marcar el libro como disponible y limpiar el usuario al devolverlo', () => {
      checkoutBook(catalog, 'B002', 'user1');
      const result = returnBook(catalog, 'B002');
      expect(result.available).toBe(true);
      expect(result.checkedOutBy).toBeNull();
    });

    test('debe lanzar error descriptivo (no TypeError) al intentar devolver un libro que no está prestado', () => {
      // B003 nunca fue prestado, checkedOutBy es null
      expect(() => returnBook(catalog, 'B003')).toThrow('no está prestado');
    });

    test('debe lanzar error cuando el libro no existe', () => {
      expect(() => returnBook(catalog, 'NO-EXISTE')).toThrow('no encontrado');
    });
  });

  // ─── getStats ─────────────────────────────────────────────────────────────

  describe('getStats - Estadísticas del catálogo', () => {
    test('debe contar correctamente los libros prestados', () => {
      checkoutBook(catalog, 'B001', 'user1');
      checkoutBook(catalog, 'B002', 'user2');
      const stats = getStats(catalog);
      expect(stats.total).toBe(3);
      expect(stats.available).toBe(1);
      expect(stats.checkedOut).toBe(2);
    });

    test('debe retornar checkedOut:0 cuando ningún libro está prestado', () => {
      const stats = getStats(catalog);
      expect(stats.checkedOut).toBe(0);
    });

    test('debe retornar available:0 cuando todos los libros están prestados', () => {
      checkoutBook(catalog, 'B001', 'u1');
      checkoutBook(catalog, 'B002', 'u2');
      checkoutBook(catalog, 'B003', 'u3');
      const stats = getStats(catalog);
      expect(stats.available).toBe(0);
      expect(stats.checkedOut).toBe(3);
    });
  });
});
