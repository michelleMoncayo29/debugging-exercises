/**
 * Tests para el ejercicio 72: loan-manager
 *
 * Por defecto importa desde buggy-code.js.
 * Para verificar la solución, cambia la línea de import activa
 * y comenta la de buggy-code.js.
 */

const {
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
} = require('./buggy-code');
// const {
//   Book, Member, Loan, createLoan, returnBook, calculateFine, renewLoan,
//   getAvailableBooks, getActiveLoans, getOverdueLoans, getMemberLoans,
//   getMostBorrowedBooks, searchBooks, getLoanStats, getMemberFines, getBooksByGenre,
// } = require('./solution');

// ---------------------------------------------------------------------------
// Utilidad de fecha local (misma lógica que la solución)
// ---------------------------------------------------------------------------
function localDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// ---------------------------------------------------------------------------
// Fixtures reutilizables
// ---------------------------------------------------------------------------
let bookA, bookB, bookC, bookD;
let memberX, memberY;

beforeEach(() => {
  bookA = new Book('ISBN-001', 'El Quijote', 'Miguel de Cervantes', 'Novela');
  bookB = new Book('ISBN-002', 'Cien Años de Soledad', 'Gabriel García Márquez', 'Ficción');
  bookC = new Book('ISBN-003', 'La Odisea', 'Homero', 'Épica');
  bookD = new Book('ISBN-004', 'Don Juan Tenorio', 'José Zorrilla', 'Drama');

  memberX = new Member(1, 'Ana López', 'ana@mail.com', '2023-01-15');
  memberY = new Member(2, 'Bruno Ruiz', 'bruno@mail.com', '2023-06-01');
});

// ---------------------------------------------------------------------------
// Clases: Book
// ---------------------------------------------------------------------------
describe('Clase Book', () => {
  test('debería crear un libro con los campos correctos', () => {
    const book = new Book('ISBN-999', 'Titulo', 'Autor', 'Terror');
    expect(book.isbn).toBe('ISBN-999');
    expect(book.title).toBe('Titulo');
    expect(book.author).toBe('Autor');
    expect(book.genre).toBe('Terror');
  });

  test('debería inicializarse con available = true', () => {
    const book = new Book('ISBN-999', 'Titulo', 'Autor', 'Terror');
    expect(book.available).toBe(true);
  });

  test('debería retornar una representación en string correcta', () => {
    expect(bookA.toString()).toBe('"El Quijote" por Miguel de Cervantes (ISBN: ISBN-001)');
  });
});

// ---------------------------------------------------------------------------
// Clases: Member
// ---------------------------------------------------------------------------
describe('Clase Member', () => {
  test('debería crear un miembro con los campos correctos', () => {
    expect(memberX.id).toBe(1);
    expect(memberX.name).toBe('Ana López');
    expect(memberX.email).toBe('ana@mail.com');
  });

  test('debería inicializarse con active = true', () => {
    expect(memberX.active).toBe(true);
  });

  test('debería parsear joinDate como fecha local', () => {
    expect(memberX.joinDate).toEqual(localDate('2023-01-15'));
  });

  test('debería retornar una representación en string correcta', () => {
    expect(memberX.toString()).toBe('Ana López (ID: 1)');
  });
});

// ---------------------------------------------------------------------------
// Clases: Loan
// ---------------------------------------------------------------------------
describe('Clase Loan', () => {
  test('debería calcular dueDate sumando durationDays a loanDate', () => {
    const loan = new Loan(bookA, memberX, '2024-03-01', 14);
    expect(loan.dueDate).toEqual(localDate('2024-03-15'));
  });

  test('debería inicializar returnDate en null', () => {
    const loan = new Loan(bookA, memberX, '2024-03-01', 14);
    expect(loan.returnDate).toBeNull();
  });

  test('debería inicializar renewed en false', () => {
    const loan = new Loan(bookA, memberX, '2024-03-01', 14);
    expect(loan.renewed).toBe(false);
  });

  test('debería parsear loanDate como fecha local', () => {
    const loan = new Loan(bookA, memberX, '2024-06-10', 7);
    expect(loan.loanDate).toEqual(localDate('2024-06-10'));
  });
});

// ---------------------------------------------------------------------------
// createLoan
// ---------------------------------------------------------------------------
describe('createLoan', () => {
  test('debería retornar una instancia de Loan', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    expect(loan).toBeInstanceOf(Loan);
  });

  test('debería marcar el libro como no disponible', () => {
    createLoan(bookA, memberX, '2024-05-01', 14);
    expect(bookA.available).toBe(false);
  });

  test('debería establecer loanDate correctamente', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    expect(loan.loanDate).toEqual(localDate('2024-05-01'));
  });

  test('debería calcular dueDate con la duración indicada', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    expect(loan.dueDate).toEqual(localDate('2024-05-15'));
  });

  test('debería inicializar returnDate en null', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    expect(loan.returnDate).toBeNull();
  });

  test('debería asociar el libro y el miembro correctamente', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    expect(loan.book).toBe(bookA);
    expect(loan.member).toBe(memberX);
  });

  test('debería calcular dueDate cruzando fin de mes', () => {
    const loan = createLoan(bookA, memberX, '2024-01-28', 7);
    expect(loan.dueDate).toEqual(localDate('2024-02-04'));
  });
});

// ---------------------------------------------------------------------------
// returnBook
// ---------------------------------------------------------------------------
describe('returnBook', () => {
  test('debería marcar el libro como disponible', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    returnBook(loan, '2024-05-14');
    expect(bookA.available).toBe(true);
  });

  test('debería asignar la fecha de devolución provista (no dueDate)', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    // La devolución ocurre 3 días después del vencimiento
    returnBook(loan, '2024-05-18');
    expect(loan.returnDate).toEqual(localDate('2024-05-18'));
  });

  test('test crítico: returnDate debe ser la fecha pasada, no dueDate', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    // dueDate = 2024-05-15; devolvemos en 2024-05-20
    returnBook(loan, '2024-05-20');
    expect(loan.returnDate).not.toEqual(loan.dueDate);
    expect(loan.returnDate).toEqual(localDate('2024-05-20'));
  });

  test('debería asignar returnDate cuando se devuelve antes del vencimiento', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    returnBook(loan, '2024-05-10');
    expect(loan.returnDate).toEqual(localDate('2024-05-10'));
    expect(bookA.available).toBe(true);
  });

  test('debería asignar returnDate exactamente en dueDate (devolución puntual)', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    returnBook(loan, '2024-05-15');
    expect(loan.returnDate).toEqual(localDate('2024-05-15'));
  });
});

// ---------------------------------------------------------------------------
// calculateFine
// ---------------------------------------------------------------------------
describe('calculateFine', () => {
  test('debería retornar 0 si el préstamo no ha sido devuelto', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    expect(calculateFine(loan, 2)).toBe(0);
  });

  test('debería retornar 0 si la devolución fue puntual', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    returnBook(loan, '2024-05-15');
    expect(calculateFine(loan, 2)).toBe(0);
  });

  test('debería retornar 0 si la devolución fue anticipada', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    returnBook(loan, '2024-05-10');
    expect(calculateFine(loan, 2)).toBe(0);
  });

  test('debería calcular multa por 3 días de retraso a $2/día = $6', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    // dueDate = 2024-05-15; devolución = 2024-05-18 → 3 días tarde
    returnBook(loan, '2024-05-18');
    expect(calculateFine(loan, 2)).toBe(6);
  });

  test('debería calcular multa por 1 día de retraso', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    returnBook(loan, '2024-05-16');
    expect(calculateFine(loan, 5)).toBe(5);
  });

  test('debería calcular multa por 7 días de retraso a $1/día = $7', () => {
    const loan = createLoan(bookA, memberX, '2024-06-01', 10);
    // dueDate = 2024-06-11; devolución = 2024-06-18 → 7 días tarde
    returnBook(loan, '2024-06-18');
    expect(calculateFine(loan, 1)).toBe(7);
  });

  test('test crítico: multa debe calcularse respecto a la fecha real de devolución, no a loanDate', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    returnBook(loan, '2024-05-20');
    // dueDate=15, returnDate=20 → 5 días tarde × $3 = $15
    expect(calculateFine(loan, 3)).toBe(15);
  });
});

// ---------------------------------------------------------------------------
// renewLoan
// ---------------------------------------------------------------------------
describe('renewLoan', () => {
  test('debería extender dueDate en los días indicados para un préstamo activo', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    // dueDate original = 2024-05-15
    renewLoan(loan, 7);
    expect(loan.dueDate).toEqual(localDate('2024-05-22'));
  });

  test('debería marcar renewed = true al renovar un préstamo activo', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    renewLoan(loan, 7);
    expect(loan.renewed).toBe(true);
  });

  test('debería retornar true al renovar un préstamo activo', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    const result = renewLoan(loan, 7);
    expect(result).toBe(true);
  });

  test('debería retornar false al intentar renovar un préstamo ya devuelto', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    returnBook(loan, '2024-05-15');
    const result = renewLoan(loan, 7);
    expect(result).toBe(false);
  });

  test('test crítico: no debe cambiar dueDate si el préstamo ya fue devuelto', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    returnBook(loan, '2024-05-15');
    const dueDateBefore = new Date(loan.dueDate.getTime());
    renewLoan(loan, 7);
    expect(loan.dueDate).toEqual(dueDateBefore);
  });

  test('test crítico: renewed debe permanecer false si el préstamo ya fue devuelto', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    returnBook(loan, '2024-05-15');
    renewLoan(loan, 7);
    expect(loan.renewed).toBe(false);
  });

  test('debería extender dueDate por 14 días adicionales', () => {
    const loan = createLoan(bookA, memberX, '2024-06-01', 10);
    // dueDate = 2024-06-11
    renewLoan(loan, 14);
    expect(loan.dueDate).toEqual(localDate('2024-06-25'));
  });
});

// ---------------------------------------------------------------------------
// getAvailableBooks
// ---------------------------------------------------------------------------
describe('getAvailableBooks', () => {
  test('debería retornar todos los libros cuando todos están disponibles', () => {
    const result = getAvailableBooks([bookA, bookB, bookC]);
    expect(result).toHaveLength(3);
  });

  test('debería retornar lista vacía cuando ningún libro está disponible', () => {
    bookA.available = false;
    bookB.available = false;
    const result = getAvailableBooks([bookA, bookB]);
    expect(result).toHaveLength(0);
  });

  test('test crítico: libros con available = false NO deben aparecer', () => {
    createLoan(bookA, memberX, '2024-05-01', 14); // bookA.available = false
    const result = getAvailableBooks([bookA, bookB, bookC]);
    expect(result).not.toContain(bookA);
    expect(result).toContain(bookB);
    expect(result).toContain(bookC);
  });

  test('debería retornar exactamente los libros disponibles', () => {
    bookB.available = false;
    bookD.available = false;
    const result = getAvailableBooks([bookA, bookB, bookC, bookD]);
    expect(result).toHaveLength(2);
    expect(result).toContain(bookA);
    expect(result).toContain(bookC);
  });

  test('debería retornar lista vacía para arreglo vacío', () => {
    expect(getAvailableBooks([])).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// getActiveLoans
// ---------------------------------------------------------------------------
describe('getActiveLoans', () => {
  test('debería retornar préstamos con returnDate = null', () => {
    const loan1 = createLoan(bookA, memberX, '2024-05-01', 14);
    const loan2 = createLoan(bookB, memberY, '2024-05-05', 7);
    returnBook(loan2, '2024-05-12');
    const result = getActiveLoans([loan1, loan2]);
    expect(result).toHaveLength(1);
    expect(result).toContain(loan1);
  });

  test('debería excluir préstamos devueltos', () => {
    const loan1 = createLoan(bookA, memberX, '2024-05-01', 14);
    returnBook(loan1, '2024-05-10');
    const result = getActiveLoans([loan1]);
    expect(result).toHaveLength(0);
  });

  test('debería retornar todos si ninguno fue devuelto', () => {
    const loan1 = createLoan(bookA, memberX, '2024-05-01', 14);
    const loan2 = createLoan(bookB, memberY, '2024-05-03', 10);
    const result = getActiveLoans([loan1, loan2]);
    expect(result).toHaveLength(2);
  });

  test('debería retornar lista vacía para arreglo vacío', () => {
    expect(getActiveLoans([])).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// getOverdueLoans
// ---------------------------------------------------------------------------
describe('getOverdueLoans', () => {
  test('debería retornar préstamos vencidos no devueltos', () => {
    const loan = createLoan(bookA, memberX, '2024-04-01', 7);
    // dueDate = 2024-04-08; hoy = 2024-05-01 → vencido
    const result = getOverdueLoans([loan], '2024-05-01');
    expect(result).toContain(loan);
  });

  test('debería excluir préstamos devueltos aunque estén vencidos', () => {
    const loan = createLoan(bookA, memberX, '2024-04-01', 7);
    returnBook(loan, '2024-04-20'); // se devolvió tarde pero ya devuelto
    const result = getOverdueLoans([loan], '2024-05-01');
    expect(result).toHaveLength(0);
  });

  test('debería excluir préstamos activos cuya dueDate no ha pasado', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    // dueDate = 2024-05-15; hoy = 2024-05-10 → no vencido
    const result = getOverdueLoans([loan], '2024-05-10');
    expect(result).toHaveLength(0);
  });

  test('debería excluir préstamo con dueDate igual a currentDate (no vencido todavía)', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    // dueDate = 2024-05-15; hoy = 2024-05-15 → no vencido aún
    const result = getOverdueLoans([loan], '2024-05-15');
    expect(result).toHaveLength(0);
  });

  test('debería identificar múltiples préstamos vencidos', () => {
    const loan1 = createLoan(bookA, memberX, '2024-03-01', 7);
    const loan2 = createLoan(bookB, memberY, '2024-03-05', 5);
    const loan3 = createLoan(bookC, memberX, '2024-05-10', 30);
    // loan3 no ha vencido al 2024-05-20
    const result = getOverdueLoans([loan1, loan2, loan3], '2024-05-20');
    expect(result).toHaveLength(2);
    expect(result).toContain(loan1);
    expect(result).toContain(loan2);
  });
});

// ---------------------------------------------------------------------------
// getMemberLoans
// ---------------------------------------------------------------------------
describe('getMemberLoans', () => {
  test('debería retornar solo los préstamos del miembro indicado', () => {
    const loan1 = createLoan(bookA, memberX, '2024-05-01', 14);
    const loan2 = createLoan(bookB, memberY, '2024-05-03', 7);
    const result = getMemberLoans([loan1, loan2], 1);
    expect(result).toHaveLength(1);
    expect(result).toContain(loan1);
  });

  test('test crítico: comparar por member.id, no por el objeto member', () => {
    const loan1 = createLoan(bookA, memberX, '2024-05-01', 14);
    const loan2 = createLoan(bookB, memberY, '2024-05-03', 7);
    // Se busca por el id numérico 2, no por la referencia al objeto memberY
    const result = getMemberLoans([loan1, loan2], 2);
    expect(result).toHaveLength(1);
    expect(result[0].member.id).toBe(2);
  });

  test('debería retornar lista vacía si el id no existe', () => {
    const loan1 = createLoan(bookA, memberX, '2024-05-01', 14);
    const result = getMemberLoans([loan1], 99);
    expect(result).toHaveLength(0);
  });

  test('debería incluir tanto préstamos activos como devueltos del miembro', () => {
    const loan1 = createLoan(bookA, memberX, '2024-05-01', 14);
    const loan2 = createLoan(bookB, memberX, '2024-05-05', 7);
    returnBook(loan2, '2024-05-12');
    const result = getMemberLoans([loan1, loan2], 1);
    expect(result).toHaveLength(2);
  });

  test('debería retornar lista vacía para arreglo vacío', () => {
    expect(getMemberLoans([], 1)).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// getMostBorrowedBooks
// ---------------------------------------------------------------------------
describe('getMostBorrowedBooks', () => {
  test('test crítico: debe ordenar de mayor a menor conteo', () => {
    // bookC prestado 8 veces, bookA 5 veces, bookB 3 veces
    const loans = [
      ...Array(8).fill(null).map(() => ({ book: bookC })),
      ...Array(5).fill(null).map(() => ({ book: bookA })),
      ...Array(3).fill(null).map(() => ({ book: bookB })),
    ];
    const result = getMostBorrowedBooks(loans, 3);
    expect(result[0].count).toBe(8);
    expect(result[1].count).toBe(5);
    expect(result[2].count).toBe(3);
  });

  test('debería respetar el límite n', () => {
    const loans = [
      { book: bookA }, { book: bookA }, { book: bookA },
      { book: bookB }, { book: bookB },
      { book: bookC },
    ];
    const result = getMostBorrowedBooks(loans, 2);
    expect(result).toHaveLength(2);
  });

  test('debería retornar el isbn y el título del libro', () => {
    const loans = [{ book: bookA }, { book: bookA }];
    const result = getMostBorrowedBooks(loans, 1);
    expect(result[0].isbn).toBe('ISBN-001');
    expect(result[0].title).toBe('El Quijote');
  });

  test('debería contar un préstamo de un solo libro correctamente', () => {
    const loans = [{ book: bookA }];
    const result = getMostBorrowedBooks(loans, 1);
    expect(result[0].count).toBe(1);
  });

  test('debería retornar lista vacía para arreglo vacío de préstamos', () => {
    expect(getMostBorrowedBooks([], 3)).toHaveLength(0);
  });

  test('debería poner el libro más prestado en la posición 0', () => {
    const loans = [
      { book: bookB }, { book: bookB }, { book: bookB },
      { book: bookA }, { book: bookA },
    ];
    const result = getMostBorrowedBooks(loans, 2);
    expect(result[0].isbn).toBe('ISBN-002');
  });
});

// ---------------------------------------------------------------------------
// searchBooks
// ---------------------------------------------------------------------------
describe('searchBooks', () => {
  test('debería encontrar libros por título (coincidencia parcial)', () => {
    const result = searchBooks([bookA, bookB, bookC], 'quijote');
    expect(result).toContain(bookA);
    expect(result).toHaveLength(1);
  });

  test('debería encontrar libros por autor (coincidencia parcial)', () => {
    const result = searchBooks([bookA, bookB, bookC], 'homero');
    expect(result).toContain(bookC);
    expect(result).toHaveLength(1);
  });

  test('test crítico: búsqueda insensible a mayúsculas en título', () => {
    const result = searchBooks([bookA, bookB], 'EL QUIJOTE');
    expect(result).toContain(bookA);
  });

  test('test crítico: búsqueda insensible a mayúsculas en autor', () => {
    const result = searchBooks([bookA, bookB], 'GABRIEL');
    expect(result).toContain(bookB);
  });

  test('debería retornar múltiples resultados si coinciden varios libros', () => {
    // bookA y bookD comparten "don" en el título si buscamos "don"
    const result = searchBooks([bookA, bookB, bookC, bookD], 'don');
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  test('debería retornar lista vacía si no hay coincidencias', () => {
    const result = searchBooks([bookA, bookB, bookC], 'xyz123');
    expect(result).toHaveLength(0);
  });

  test('debería retornar todos los libros si la búsqueda coincide con todos', () => {
    // "de" aparece en el autor de bookA (Miguel de Cervantes) y en el título de bookB
    const result = searchBooks([bookA, bookB], 'de');
    expect(result).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// getLoanStats
// ---------------------------------------------------------------------------
describe('getLoanStats', () => {
  test('debería contar el total de préstamos', () => {
    const loan1 = createLoan(bookA, memberX, '2024-05-01', 14);
    const loan2 = createLoan(bookB, memberY, '2024-05-05', 7);
    const stats = getLoanStats([loan1, loan2]);
    expect(stats.total).toBe(2);
  });

  test('debería contar préstamos activos (returnDate = null)', () => {
    const loan1 = createLoan(bookA, memberX, '2024-05-01', 14);
    const loan2 = createLoan(bookB, memberY, '2024-05-05', 7);
    returnBook(loan2, '2024-05-12');
    const stats = getLoanStats([loan1, loan2]);
    expect(stats.active).toBe(1);
  });

  test('debería contar préstamos devueltos', () => {
    const loan1 = createLoan(bookA, memberX, '2024-05-01', 14);
    const loan2 = createLoan(bookB, memberY, '2024-05-05', 7);
    returnBook(loan1, '2024-05-10');
    returnBook(loan2, '2024-05-12');
    const stats = getLoanStats([loan1, loan2]);
    expect(stats.returned).toBe(2);
  });

  test('debería contar préstamos renovados', () => {
    const loan1 = createLoan(bookA, memberX, '2024-05-01', 14);
    const loan2 = createLoan(bookB, memberY, '2024-05-05', 7);
    renewLoan(loan1, 7);
    const stats = getLoanStats([loan1, loan2]);
    expect(stats.renewed).toBe(1);
  });

  test('debería calcular averageDuration = 0 cuando no hay devueltos', () => {
    const loan1 = createLoan(bookA, memberX, '2024-05-01', 14);
    const stats = getLoanStats([loan1]);
    expect(stats.averageDuration).toBe(0);
  });

  test('debería calcular averageDuration correctamente para un préstamo de 10 días', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    // loanDate = 2024-05-01, returnDate = 2024-05-11 → 10 días
    returnBook(loan, '2024-05-11');
    const stats = getLoanStats([loan]);
    expect(stats.averageDuration).toBe(10);
  });

  test('debería calcular averageDuration promediando varios préstamos', () => {
    const loan1 = createLoan(bookA, memberX, '2024-05-01', 14);
    const loan2 = createLoan(bookB, memberY, '2024-05-01', 14);
    returnBook(loan1, '2024-05-06'); // 5 días
    returnBook(loan2, '2024-05-16'); // 15 días → promedio = 10
    const stats = getLoanStats([loan1, loan2]);
    expect(stats.averageDuration).toBe(10);
  });

  test('debería retornar estructura correcta para lista vacía', () => {
    const stats = getLoanStats([]);
    expect(stats.total).toBe(0);
    expect(stats.active).toBe(0);
    expect(stats.returned).toBe(0);
    expect(stats.renewed).toBe(0);
    expect(stats.averageDuration).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// getMemberFines
// ---------------------------------------------------------------------------
describe('getMemberFines', () => {
  test('debería retornar 0 si el miembro no tiene préstamos tardíos', () => {
    const loan = createLoan(bookA, memberX, '2024-05-01', 14);
    returnBook(loan, '2024-05-15'); // puntual
    expect(getMemberFines([loan], 1, 2)).toBe(0);
  });

  test('debería sumar multas de todas las devoluciones tardías del miembro', () => {
    const loan1 = createLoan(bookA, memberX, '2024-05-01', 14);
    const loan2 = createLoan(bookB, memberX, '2024-05-10', 7);
    returnBook(loan1, '2024-05-18'); // 3 días tarde × $2 = $6
    returnBook(loan2, '2024-05-20'); // 3 días tarde × $2 = $6 → total $12
    expect(getMemberFines([loan1, loan2], 1, 2)).toBe(12);
  });

  test('debería contar solo préstamos del miembro indicado', () => {
    const loan1 = createLoan(bookA, memberX, '2024-05-01', 14);
    const loan2 = createLoan(bookB, memberY, '2024-05-01', 14);
    returnBook(loan1, '2024-05-20'); // memberX: 5 días tarde
    returnBook(loan2, '2024-05-20'); // memberY: 5 días tarde (no debe contar)
    // Solo multas de memberX (id=1), finePerDay=1 → 5 días × $1 = $5
    expect(getMemberFines([loan1, loan2], 1, 1)).toBe(5);
  });

  test('debería retornar 0 si el miembro no tiene préstamos', () => {
    const loan = createLoan(bookA, memberY, '2024-05-01', 14);
    returnBook(loan, '2024-05-20');
    expect(getMemberFines([loan], 1, 2)).toBe(0);
  });

  test('debería retornar 0 para préstamos activos (no devueltos)', () => {
    const loan = createLoan(bookA, memberX, '2024-01-01', 7);
    // Sin devolución → no se cobra multa
    expect(getMemberFines([loan], 1, 2)).toBe(0);
  });

  test('debería calcular multa total correctamente con devolución anticipada incluida', () => {
    const loan1 = createLoan(bookA, memberX, '2024-05-01', 14);
    const loan2 = createLoan(bookB, memberX, '2024-05-01', 14);
    returnBook(loan1, '2024-05-10'); // anticipada → $0
    returnBook(loan2, '2024-05-20'); // 5 días tarde × $3 = $15
    expect(getMemberFines([loan1, loan2], 1, 3)).toBe(15);
  });
});

// ---------------------------------------------------------------------------
// getBooksByGenre
// ---------------------------------------------------------------------------
describe('getBooksByGenre', () => {
  test('debería filtrar libros por género exacto', () => {
    const result = getBooksByGenre([bookA, bookB, bookC], 'Novela');
    expect(result).toContain(bookA);
    expect(result).toHaveLength(1);
  });

  test('debería ser insensible a mayúsculas/minúsculas', () => {
    const result = getBooksByGenre([bookA, bookB, bookC], 'novela');
    expect(result).toContain(bookA);
    expect(result).toHaveLength(1);
  });

  test('debería ser insensible a mayúsculas al buscar en mayúsculas', () => {
    const result = getBooksByGenre([bookA, bookB, bookC], 'FICCIÓN');
    expect(result).toContain(bookB);
    expect(result).toHaveLength(1);
  });

  test('debería retornar múltiples libros del mismo género', () => {
    const bookE = new Book('ISBN-005', 'Otra Novela', 'Autor E', 'Novela');
    const result = getBooksByGenre([bookA, bookB, bookE], 'Novela');
    expect(result).toHaveLength(2);
  });

  test('debería retornar lista vacía si ningún libro coincide con el género', () => {
    const result = getBooksByGenre([bookA, bookB, bookC], 'Ciencia Ficción');
    expect(result).toHaveLength(0);
  });

  test('debería retornar lista vacía para arreglo vacío', () => {
    expect(getBooksByGenre([], 'Novela')).toHaveLength(0);
  });
});
