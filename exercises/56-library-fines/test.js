/**
 * Pruebas para Library Fines
 * Ejecutar con: npm test exercises/56-library-fines
 */

const { LibrarySystem } = require('./buggy-code.js');

describe('Library Fines', () => {
  let library;

  beforeEach(() => {
    library = new LibrarySystem({ dailyFineRate: 0.5 });
    library.addBook({ id: 'B001', title: 'Clean Code', author: 'Robert Martin', copies: 2 });
    library.addBook({ id: 'B002', title: 'Refactoring', author: 'Martin Fowler', copies: 1 });
    library.addMember({ id: 'M001', name: 'Alice' });
    library.addMember({ id: 'M002', name: 'Bob' });
  });

  describe('addBook / addMember', () => {
    test('debe agregar libros correctamente', () => {
      expect(library.getBook('B001').title).toBe('Clean Code');
    });

    test('debe lanzar error al agregar libro duplicado', () => {
      expect(() => library.addBook({ id: 'B001', title: 'Dup', author: 'X', copies: 1 })).toThrow();
    });
  });

  describe('checkout - préstamo de libro', () => {
    test('debe crear un préstamo y reducir las copias disponibles', () => {
      const loan = library.checkout('M001', 'B001', '2024-03-10');
      expect(loan.id).toBeDefined();
      expect(library.getAvailableCopies('B001')).toBe(1);
    });

    test('debe lanzar error si no hay copias disponibles', () => {
      library.checkout('M001', 'B002', '2024-03-10');
      expect(() => library.checkout('M002', 'B002', '2024-03-10')).toThrow('No copies available');
    });
  });

  describe('calculateFine - cálculo de multa', () => {
    test('debe retornar 0 si se devuelve a tiempo', () => {
      const fine = library.calculateFine('2024-03-10', '2024-03-08');
      expect(fine).toBe(0);
    });

    test('debe retornar 0 si se devuelve el mismo día del vencimiento', () => {
      const fine = library.calculateFine('2024-03-10', '2024-03-10');
      expect(fine).toBe(0);
    });

    test('debe cobrar multa por días de atraso', () => {
      // 5 días tarde × $0.50 = $2.50
      const fine = library.calculateFine('2024-03-10', '2024-03-15');
      expect(fine).toBe(2.5);
    });

    test('la multa nunca debe ser negativa', () => {
      // Devuelto 3 días antes → multa = 0, no negativa
      const fine = library.calculateFine('2024-03-10', '2024-03-07');
      expect(fine).toBeGreaterThanOrEqual(0);
    });
  });

  describe('returnBook - devolución de libro', () => {
    test('debe registrar la devolución y aumentar copias disponibles', () => {
      const loan = library.checkout('M001', 'B001', '2024-03-10');
      library.returnBook(loan.id, '2024-03-12');
      expect(library.getAvailableCopies('B001')).toBe(2);
    });

    test('debe calcular y registrar la multa correctamente', () => {
      const loan = library.checkout('M001', 'B001', '2024-03-10');
      const result = library.returnBook(loan.id, '2024-03-15'); // 5 días tarde
      expect(result.fine).toBe(2.5);
    });

    test('devolución anticipada no debe generar multa', () => {
      const loan = library.checkout('M001', 'B001', '2024-03-10');
      const result = library.returnBook(loan.id, '2024-03-08');
      expect(result.fine).toBe(0);
    });
  });

  describe('getMemberFines - multas de un miembro', () => {
    test('debe retornar el total de multas pendientes del miembro', () => {
      const loan = library.checkout('M001', 'B001', '2024-03-10');
      library.returnBook(loan.id, '2024-03-16'); // 6 días tarde → $3.00
      expect(library.getMemberFines('M001').totalPending).toBe(3.0);
    });
  });

  describe('payFine - pago de multa', () => {
    test('debe reducir el saldo de multas al pagar', () => {
      const loan = library.checkout('M001', 'B001', '2024-03-10');
      library.returnBook(loan.id, '2024-03-14'); // 4 días → $2.00
      library.payFine('M001', 1.0);
      expect(library.getMemberFines('M001').totalPending).toBe(1.0);
    });

    test('el pago no puede exceder la deuda total', () => {
      const loan = library.checkout('M001', 'B001', '2024-03-10');
      library.returnBook(loan.id, '2024-03-14'); // $2.00 de deuda
      library.payFine('M001', 999);
      expect(library.getMemberFines('M001').totalPending).toBe(0);
    });
  });

  describe('getOverdueLoans - préstamos vencidos', () => {
    test('debe retornar préstamos cuya fecha de vencimiento ya pasó', () => {
      library.checkout('M001', 'B001', '2020-01-01'); // vencido
      library.checkout('M002', 'B001', '2099-12-31'); // vigente
      const overdue = library.getOverdueLoans(new Date('2024-01-01'));
      expect(overdue.length).toBeGreaterThanOrEqual(1);
      const overdueDates = overdue.map(l => l.dueDate);
      expect(overdueDates).toContain('2020-01-01');
    });
  });
});
