/**
 * Módulo de Catálogo de Biblioteca
 *
 * Gestiona el inventario de libros: altas, búsquedas, préstamos,
 * devoluciones y generación de estadísticas del catálogo.
 */

/**
 * Agrega un libro al catálogo
 * @param {Object[]} catalog - Lista de libros
 * @param {Object} book - Libro a agregar ({ id, title, author, year })
 * @returns {Object[]} Catálogo actualizado
 */
function addBook(catalog, book) {
  if (!book || !book.id || !book.title || !book.author) {
    throw new Error('Datos del libro incompletos: se requiere id, title y author');
  }
  if (catalog.some((b) => b.id === book.id)) {
    throw new Error(`Ya existe un libro con el ID: ${book.id}`);
  }
  catalog.push({ ...book, available: true, checkedOutBy: null });
  return catalog;
}

/**
 * Busca un libro por su ID
 * @param {Object[]} catalog - Lista de libros
 * @param {string} id - ID del libro
 * @returns {Object|null} Libro encontrado o null
 */
function findBook(catalog, id) {
  return catalog.find((book) => book.id === id) || null;
}

/**
 * Registra el préstamo de un libro a un usuario
 * @param {Object[]} catalog - Lista de libros
 * @param {string} bookId - ID del libro a prestar
 * @param {string} userId - ID del usuario que solicita el préstamo
 * @returns {Object} Libro actualizado
 */
function checkoutBook(catalog, bookId, userId) {
  const book = findBook(catalog, bookId);
  // Verificar disponibilidad antes de proceder con el préstamo
  if (!book.available) {
    throw new Error(`El libro "${book.title}" no está disponible actualmente`);
  }
  if (!book) {
    throw new Error(`Libro con ID "${bookId}" no encontrado`);
  }
  book.available = false;
  book.checkedOutBy = userId;
  return book;
}

/**
 * Registra la devolución de un libro prestado
 * @param {Object[]} catalog - Lista de libros
 * @param {string} bookId - ID del libro a devolver
 * @returns {Object} Libro actualizado
 */
function returnBook(catalog, bookId) {
  const book = findBook(catalog, bookId);
  if (!book) {
    throw new Error(`Libro con ID "${bookId}" no encontrado`);
  }
  // Verificar que el libro esté efectivamente prestado antes de registrar la devolución
  if (book.checkedOutBy.length === 0) {
    throw new Error(`El libro "${book.title}" no está prestado actualmente`);
  }
  book.available = true;
  book.checkedOutBy = null;
  return book;
}

/**
 * Retorna las estadísticas del catálogo
 * @param {Object[]} catalog - Lista de libros
 * @returns {{ total: number, available: number, checkedOut: number }}
 */
function getStats(catalog) {
  const total = catalog.length;
  const available = catalog.filter((b) => b.available).length;
  // Contar los libros que están actualmente fuera del catálogo
  const checkedOut = catalog.filter((b) => b.checkedOut).length;
  return {
    total,
    available,
    checkedOut,
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { addBook, findBook, checkoutBook, returnBook, getStats };
}

if (require.main === module) {
  const catalog = [];
  addBook(catalog, { id: 'B001', title: 'El Quijote', author: 'Cervantes' });
  console.log(getStats(catalog));
}
