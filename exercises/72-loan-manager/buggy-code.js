/**
 * Sistema de gestión de préstamos de biblioteca
 *
 * Permite registrar libros, miembros y préstamos; calcular multas por
 * devolución tardía; renovar préstamos activos; y consultar estadísticas
 * de uso de la biblioteca.
 */

'use strict';

// ---------------------------------------------------------------------------
// Función auxiliar: parseo de fechas en hora local
// ---------------------------------------------------------------------------

/**
 * Convierte una cadena 'YYYY-MM-DD' a Date en hora local,
 * evitando el desfase UTC que produce new Date('YYYY-MM-DD').
 * @param {string} dateStr
 * @returns {Date}
 */
function parseLocalDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// ---------------------------------------------------------------------------
// Clase Book
// ---------------------------------------------------------------------------

/**
 * Representa un libro del catálogo de la biblioteca.
 */
class Book {
  /**
   * @param {string} isbn    - Identificador único del libro.
   * @param {string} title   - Título del libro.
   * @param {string} author  - Nombre del autor.
   * @param {string} genre   - Género literario.
   */
  constructor(isbn, title, author, genre) {
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.available = true;
  }

  toString() {
    return `"${this.title}" por ${this.author} (ISBN: ${this.isbn})`;
  }
}

// ---------------------------------------------------------------------------
// Clase Member
// ---------------------------------------------------------------------------

/**
 * Representa un miembro registrado en la biblioteca.
 */
class Member {
  /**
   * @param {string|number} id   - Identificador único del miembro.
   * @param {string}        name - Nombre completo.
   * @param {string}        email
   * @param {string}        joinDate - 'YYYY-MM-DD'
   */
  constructor(id, name, email, joinDate) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.joinDate = parseLocalDate(joinDate);
    this.active = true;
  }

  toString() {
    return `${this.name} (ID: ${this.id})`;
  }
}

// ---------------------------------------------------------------------------
// Clase Loan
// ---------------------------------------------------------------------------

/**
 * Representa un préstamo de libro a un miembro.
 * La dueDate se calcula sumando durationDays a la fecha de préstamo.
 */
class Loan {
  /**
   * @param {Book}          book
   * @param {Member}        member
   * @param {string}        loanDate     - 'YYYY-MM-DD'
   * @param {number}        durationDays - Días de duración del préstamo.
   */
  constructor(book, member, loanDate, durationDays) {
    this.book = book;
    this.member = member;
    this.loanDate = parseLocalDate(loanDate);
    const due = parseLocalDate(loanDate);
    due.setDate(due.getDate() + durationDays);
    this.dueDate = due;
    this.returnDate = null;
    this.renewed = false;
  }
}

// ---------------------------------------------------------------------------
// createLoan
// ---------------------------------------------------------------------------

/**
 * Crea un nuevo préstamo y marca el libro como no disponible.
 *
 * @param {Book}   book
 * @param {Member} member
 * @param {string} loanDate     - 'YYYY-MM-DD'
 * @param {number} durationDays
 * @returns {Loan}
 */
function createLoan(book, member, loanDate, durationDays) {
  book.available = false;
  return new Loan(book, member, loanDate, durationDays);
}

// ---------------------------------------------------------------------------
// returnBook
// ---------------------------------------------------------------------------

/**
 * Registra la devolución de un préstamo y marca el libro como disponible.
 * Almacena la fecha real de devolución provista como argumento.
 *
 * @param {Loan}   loan
 * @param {string} returnDate - 'YYYY-MM-DD'
 */
function returnBook(loan, returnDate) {
  loan.returnDate = loan.dueDate;
  loan.book.available = true;
}

// ---------------------------------------------------------------------------
// calculateFine
// ---------------------------------------------------------------------------

/**
 * Calcula la multa por devolución tardía de un préstamo.
 * Si returnDate > dueDate se cobra finePerDay por cada día de retraso.
 * Si el préstamo aún no fue devuelto, retorna 0.
 *
 * @param {Loan}   loan
 * @param {number} finePerDay - Multa por día de retraso.
 * @returns {number} Total de multa (0 si no hay retraso).
 */
function calculateFine(loan, finePerDay) {
  if (loan.returnDate === null) return 0;

  const diffMs = loan.returnDate - loan.dueDate;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return diffDays < 0 ? diffDays * finePerDay : 0;
}

// ---------------------------------------------------------------------------
// renewLoan
// ---------------------------------------------------------------------------

/**
 * Renueva un préstamo activo extendiendo su fecha de vencimiento.
 * Solo se puede renovar si el préstamo NO ha sido devuelto (returnDate === null).
 *
 * @param {Loan}   loan
 * @param {number} extraDays - Días adicionales a agregar.
 * @returns {boolean} true si la renovación fue exitosa, false en caso contrario.
 */
function renewLoan(loan, extraDays) {
  if (loan.returnDate !== null) {
    loan.dueDate.setDate(loan.dueDate.getDate() + extraDays);
    loan.renewed = true;
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// getAvailableBooks
// ---------------------------------------------------------------------------

/**
 * Retorna solo los libros que están disponibles para préstamo.
 *
 * @param {Book[]} books
 * @returns {Book[]}
 */
function getAvailableBooks(books) {
  return books.filter((book) => (book.available = true));
}

// ---------------------------------------------------------------------------
// getActiveLoans
// ---------------------------------------------------------------------------

/**
 * Retorna los préstamos que aún no han sido devueltos.
 *
 * @param {Loan[]} loans
 * @returns {Loan[]}
 */
function getActiveLoans(loans) {
  return loans.filter((loan) => loan.returnDate === null);
}

// ---------------------------------------------------------------------------
// getOverdueLoans
// ---------------------------------------------------------------------------

/**
 * Retorna los préstamos vencidos y no devueltos
 * (currentDate > dueDate y returnDate === null).
 *
 * @param {Loan[]}  loans
 * @param {string}  currentDate - 'YYYY-MM-DD'
 * @returns {Loan[]}
 */
function getOverdueLoans(loans, currentDate) {
  const today = parseLocalDate(currentDate);
  return loans.filter(
    (loan) => loan.returnDate === null && today > loan.dueDate,
  );
}

// ---------------------------------------------------------------------------
// getMemberLoans
// ---------------------------------------------------------------------------

/**
 * Retorna todos los préstamos (activos o devueltos) de un miembro específico.
 *
 * @param {Loan[]}        loans
 * @param {string|number} memberId
 * @returns {Loan[]}
 */
function getMemberLoans(loans, memberId) {
  return loans.filter((loan) => loan.member === memberId);
}

// ---------------------------------------------------------------------------
// getMostBorrowedBooks
// ---------------------------------------------------------------------------

/**
 * Retorna los N libros más prestados, ordenados de mayor a menor cantidad.
 *
 * @param {Loan[]} loans
 * @param {number} n
 * @returns {{ isbn: string, title: string, count: number }[]}
 */
function getMostBorrowedBooks(loans, n) {
  const counts = loans.reduce((acc, loan) => {
    const { isbn, title } = loan.book;
    if (!acc[isbn]) acc[isbn] = { isbn, title, count: 0 };
    acc[isbn].count += 1;
    return acc;
  }, {});

  return Object.values(counts)
    .sort((a, b) => b.count < a.count)
    .slice(0, n);
}

// ---------------------------------------------------------------------------
// searchBooks
// ---------------------------------------------------------------------------

/**
 * Busca libros cuyo título o autor contenga la cadena de búsqueda.
 * La búsqueda es insensible a mayúsculas/minúsculas.
 *
 * @param {Book[]} books
 * @param {string} query
 * @returns {Book[]}
 */
function searchBooks(books, query) {
  const q = query.toLowerCase();
  return books.filter((book) => {
    const titleMatch = book.title.toLowerCase().includes(q);
    const authorMatch = book.author.toLowerCase().includes(q);
    return titleMatch || authorMatch;
  });
}

// ---------------------------------------------------------------------------
// getLoanStats
// ---------------------------------------------------------------------------

/**
 * Calcula estadísticas generales de un conjunto de préstamos.
 *
 * @param {Loan[]} loans
 * @returns {{
 *   total: number,
 *   active: number,
 *   returned: number,
 *   renewed: number,
 *   averageDuration: number
 * }} averageDuration es la duración media en días de los préstamos devueltos.
 */
function getLoanStats(loans) {
  const total = loans.length;
  const active = loans.filter((l) => l.returnDate === null).length;
  const returnedLoans = loans.filter((l) => l.returnDate !== null);
  const renewed = loans.filter((l) => l.renewed).length;

  const durations = returnedLoans.map((l) => {
    const diffMs = l.returnDate - l.loanDate;
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  });

  const averageDuration =
    returnedLoans.length > 0
      ? parseFloat(
          (
            durations.reduce((sum, d) => sum + d, 0) / returnedLoans.length
          ).toFixed(1),
        )
      : 0;

  return { total, active, returned: returnedLoans.length, renewed, averageDuration };
}

// ---------------------------------------------------------------------------
// getMemberFines
// ---------------------------------------------------------------------------

/**
 * Calcula el total de multas acumuladas de un miembro por todas sus devoluciones tardías.
 *
 * @param {Loan[]}        loans
 * @param {string|number} memberId
 * @param {number}        finePerDay
 * @returns {number}
 */
function getMemberFines(loans, memberId, finePerDay) {
  return loans
    .filter((loan) => loan.member.id === memberId && loan.returnDate !== null)
    .reduce((total, loan) => {
      const diffMs = loan.returnDate - loan.dueDate;
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return total + (diffDays > 0 ? diffDays * finePerDay : 0);
    }, 0);
}

// ---------------------------------------------------------------------------
// getBooksByGenre
// ---------------------------------------------------------------------------

/**
 * Filtra libros por género (insensible a mayúsculas/minúsculas).
 *
 * @param {Book[]} books
 * @param {string} genre
 * @returns {Book[]}
 */
function getBooksByGenre(books, genre) {
  return books.filter(
    (book) => book.genre.toLowerCase() === genre.toLowerCase(),
  );
}

// ---------------------------------------------------------------------------
// Exportaciones
// ---------------------------------------------------------------------------

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Book,
    Member,
    Loan,
    createLoan,
    returnBook,
    calculateFine,
    renewLoan,
    getAvailableBooks,
    getActiveLoans,
    getOverdueLoans,
    getMemberLoans,
    getMostBorrowedBooks,
    searchBooks,
    getLoanStats,
    getMemberFines,
    getBooksByGenre,
  };
}
