/**
 * Library Fines
 *
 * Sistema de biblioteca: préstamos, devoluciones, cálculo de multas
 * por retraso, pagos de multas y reportes de préstamos vencidos.
 */

const MS_PER_DAY = 1000 * 60 * 60 * 24;

class LibrarySystem {
  constructor({ dailyFineRate = 0.5 } = {}) {
    this.dailyFineRate = dailyFineRate;
    this.books = new Map();
    this.members = new Map();
    this.loans = new Map();
    this.fines = new Map(); // memberId → { total, paid }
    this._loanCounter = 1;
  }

  addBook({ id, title, author, copies }) {
    if (this.books.has(id)) throw new Error(`Book ${id} already exists`);
    this.books.set(id, { id, title, author, totalCopies: copies, availableCopies: copies });
  }

  addMember({ id, name }) {
    if (this.members.has(id)) throw new Error(`Member ${id} already exists`);
    this.members.set(id, { id, name });
    this.fines.set(id, { total: 0, paid: 0 });
  }

  getBook(id) {
    const book = this.books.get(id);
    if (!book) throw new Error(`Book ${id} not found`);
    return book;
  }

  getMember(id) {
    const member = this.members.get(id);
    if (!member) throw new Error(`Member ${id} not found`);
    return member;
  }

  getAvailableCopies(bookId) {
    return this.getBook(bookId).availableCopies;
  }

  checkout(memberId, bookId, dueDate) {
    this.getMember(memberId);
    const book = this.getBook(bookId);
    if (book.availableCopies < 1) {
      throw new Error(`No copies available for book ${bookId}`);
    }
    book.availableCopies -= 1;
    const loanId = `L${String(this._loanCounter++).padStart(4, '0')}`;
    const loan = {
      id: loanId,
      memberId,
      bookId,
      dueDate,
      checkoutDate: new Date().toISOString().split('T')[0],
      returned: false,
      returnDate: null,
    };
    this.loans.set(loanId, loan);
    return loan;
  }

  calculateFine(dueDate, returnDate) {
    const due = new Date(dueDate);
    const returned = new Date(returnDate);

    const daysOverdue = Math.floor((returned - due) / MS_PER_DAY);
    return Math.max(0, daysOverdue) * this.dailyFineRate;
  }

  returnBook(loanId, returnDate) {
    const loan = this.loans.get(loanId);
    if (!loan) throw new Error(`Loan ${loanId} not found`);
    if (loan.returned) throw new Error(`Loan ${loanId} already returned`);

    const book = this.getBook(loan.bookId);
    book.availableCopies += 1;

    const fine = this.calculateFine(loan.dueDate, returnDate);
    loan.returned = true;
    loan.returnDate = returnDate;
    loan.fine = fine;

    const memberFine = this.fines.get(loan.memberId);
    memberFine.total += fine;

    return { loan, fine };
  }

  getMemberFines(memberId) {
    this.getMember(memberId);
    const fineRecord = this.fines.get(memberId);
    return {
      totalCharged: Math.round(fineRecord.total * 100) / 100,
      totalPaid: Math.round(fineRecord.paid * 100) / 100,
      totalPending: Math.round((fineRecord.total - fineRecord.paid) * 100) / 100,
    };
  }

  payFine(memberId, amount) {
    this.getMember(memberId);
    const fineRecord = this.fines.get(memberId);
    const pending = fineRecord.total - fineRecord.paid;
    fineRecord.paid += Math.min(amount, pending);
  }

  getActiveLoansByMember(memberId) {
    this.getMember(memberId);
    return [...this.loans.values()].filter(
      l => l.memberId === memberId && !l.returned
    );
  }

  getOverdueLoans(asOfDate = new Date()) {
    const asOf = new Date(asOfDate);
    return [...this.loans.values()].filter(loan => {
      if (loan.returned) return false;
      return new Date(loan.dueDate) < asOf;
    });
  }

  getMemberLoanHistory(memberId) {
    this.getMember(memberId);
    return [...this.loans.values()]
      .filter(l => l.memberId === memberId)
      .map(l => ({
        loanId: l.id,
        bookId: l.bookId,
        dueDate: l.dueDate,
        returnDate: l.returnDate,
        fine: l.fine || 0,
        returned: l.returned,
      }));
  }

  getTopDebtors(n = 5) {
    return [...this.fines.entries()]
      .map(([memberId, record]) => ({
        memberId,
        name: this.members.get(memberId).name,
        pending: Math.round((record.total - record.paid) * 100) / 100,
      }))
      .filter(m => m.pending > 0)
      .sort((a, b) => b.pending - a.pending)
      .slice(0, n);
  }

  getLibrarySummary() {
    const totalBooks = [...this.books.values()].reduce(
      (s, b) => s + b.totalCopies, 0
    );
    const totalLoaned = [...this.books.values()].reduce(
      (s, b) => s + (b.totalCopies - b.availableCopies), 0
    );
    const totalFinesCollected = [...this.fines.values()].reduce(
      (s, f) => s + f.paid, 0
    );
    const totalFinesPending = [...this.fines.values()].reduce(
      (s, f) => s + (f.total - f.paid), 0
    );
    return {
      totalBooks,
      totalLoaned,
      totalAvailable: totalBooks - totalLoaned,
      activeLoans: [...this.loans.values()].filter(l => !l.returned).length,
      totalFinesCollected: Math.round(totalFinesCollected * 100) / 100,
      totalFinesPending: Math.round(totalFinesPending * 100) / 100,
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LibrarySystem };
}

