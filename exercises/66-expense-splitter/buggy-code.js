/**
 * expense-splitter.js
 *
 * Funciones para dividir gastos grupales entre amigos, estilo Splitwise.
 * Permite registrar gastos con pagador y participantes, calcular balances
 * netos por persona y simplificar las deudas para liquidarlas con el
 * mínimo número de transferencias.
 *
 * Convenciones:
 *   - balance positivo → la persona tiene crédito (le deben dinero)
 *   - balance negativo → la persona tiene deuda (debe dinero)
 *   - Los gastos se reparten en partes iguales entre los participantes
 */

// ---------------------------------------------------------------------------
// createExpense
// ---------------------------------------------------------------------------

/**
 * Crea un objeto de gasto listo para ser añadido a la lista de gastos.
 *
 * @param {string}   description  - Descripción del gasto
 * @param {number}   amount       - Importe total (debe ser > 0)
 * @param {string}   payer        - Nombre de quien pagó
 * @param {string[]} participants - Lista de personas que comparten el gasto (incluye al pagador)
 * @param {string}   category     - Categoría del gasto (e.g. 'comida', 'transporte')
 * @returns {{ description, amount, payer, participants, category, perPersonCost }}
 */
function createExpense(description, amount, payer, participants, category) {
  if (amount <= 0) {
    throw new Error('El importe del gasto debe ser mayor que cero.');
  }
  if (!participants || participants.length === 0) {
    throw new Error('Debe haber al menos un participante en el gasto.');
  }
  if (!participants.includes(payer)) {
    throw new Error('El pagador debe estar incluido en la lista de participantes.');
  }

  const perPersonCost = amount / participants.length;

  return {
    description,
    amount,
    payer,
    participants: [...participants],
    category,
    perPersonCost,
  };
}

// ---------------------------------------------------------------------------
// addExpense
// ---------------------------------------------------------------------------

/**
 * Devuelve un nuevo arreglo con el gasto añadido al final.
 * No muta el arreglo original.
 *
 * @param {Object[]} expenses - Arreglo de gastos existente
 * @param {Object}   expense  - Gasto a añadir (creado con createExpense)
 * @returns {Object[]} Nuevo arreglo con el gasto añadido
 */
function addExpense(expenses, expense) {
  return [...expenses, expense];
}

// ---------------------------------------------------------------------------
// getTotalPaid
// ---------------------------------------------------------------------------

/**
 * Suma el importe total pagado por una persona determinada.
 *
 * @param {Object[]} expenses - Lista de gastos
 * @param {string}   person   - Nombre de la persona
 * @returns {number} Total pagado por la persona
 */
function getTotalPaid(expenses, person) {
  return expenses
    .filter((e) => e.payer === person)
    .reduce((sum, e) => sum + e.amount, 0);
}

// ---------------------------------------------------------------------------
// getTotalOwed
// ---------------------------------------------------------------------------

/**
 * Suma el importe que debe una persona considerando todos los gastos
 * en los que participa (su parte proporcional en cada gasto).
 *
 * @param {Object[]} expenses - Lista de gastos
 * @param {string}   person   - Nombre de la persona
 * @returns {number} Total que debe la persona
 */
function getTotalOwed(expenses, person) {
  return expenses
    .filter((e) => e.participants.includes(person))
    .reduce((sum, e) => sum + e.perPersonCost, 0);
}

// ---------------------------------------------------------------------------
// getNetBalance
// ---------------------------------------------------------------------------

/**
 * Calcula el balance neto de una persona: total pagado menos total que debe.
 * Positivo → le deben dinero. Negativo → debe dinero.
 *
 * @param {Object[]} expenses - Lista de gastos
 * @param {string}   person   - Nombre de la persona
 * @returns {number} Balance neto
 */
function getNetBalance(expenses, person) {
  return getTotalPaid(expenses, person) - getTotalOwed(expenses, person);
}

// ---------------------------------------------------------------------------
// getAllBalances
// ---------------------------------------------------------------------------

/**
 * Devuelve el balance neto de cada participante único que aparece en los gastos.
 *
 * @param {Object[]} expenses - Lista de gastos
 * @returns {Array<{ person: string, balance: number }>} Lista de balances
 */
function getAllBalances(expenses) {
  const participants = expenses
    .flatMap((e) => e.participants)
    .filter((person, index, arr) => arr.indexOf(person) === index);

  return participants.map((person) => ({
    person,
    balance: getNetBalance(expenses, person),
  }));
}

// ---------------------------------------------------------------------------
// getExpensesByCategory
// ---------------------------------------------------------------------------

/**
 * Filtra los gastos por categoría.
 *
 * @param {Object[]} expenses  - Lista de gastos
 * @param {string}   category  - Categoría a filtrar
 * @returns {Object[]} Gastos que pertenecen a la categoría indicada
 */
function getExpensesByCategory(expenses, category) {
  return expenses.filter((e) => e.category === category);
}

// ---------------------------------------------------------------------------
// getPersonHistory
// ---------------------------------------------------------------------------

/**
 * Devuelve todos los gastos en los que participa una persona.
 *
 * @param {Object[]} expenses - Lista de gastos
 * @param {string}   person   - Nombre de la persona
 * @returns {Object[]} Gastos en los que participa la persona
 */
function getPersonHistory(expenses, person) {
  return expenses.filter((e) => e.participants.includes(person));
}

// ---------------------------------------------------------------------------
// getHighestSpender
// ---------------------------------------------------------------------------

/**
 * Devuelve el nombre de la persona que más dinero ha pagado en total.
 *
 * @param {Object[]} expenses - Lista de gastos (no puede estar vacía)
 * @returns {string} Nombre de quien más ha pagado
 */
function getHighestSpender(expenses) {
  if (expenses.length === 0) {
    throw new Error('No hay gastos registrados.');
  }

  const totals = expenses.reduce((map, e) => {
    map[e.payer] = (map[e.payer] || 0) + e.amount;
    return map;
  }, {});

  return Object.entries(totals).reduce(
    (best, [person, total]) => (total > best.total ? { person, total } : best),
    { person: '', total: -Infinity }
  ).person;
}

// ---------------------------------------------------------------------------
// simplifyDebts
// ---------------------------------------------------------------------------

/**
 * Calcula el conjunto mínimo de transferencias para liquidar todas las deudas.
 * Utiliza el algoritmo greedy: el mayor deudor paga al mayor acreedor.
 *
 * @param {Object[]} expenses - Lista de gastos
 * @returns {Array<{ from: string, to: string, amount: number }>} Transferencias necesarias
 */
function simplifyDebts(expenses) {
  const balances = getAllBalances(expenses);

  const working = balances.map((b) => ({ ...b }));

  const transactions = [];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const debtors = working.filter((b) => b.balance < -0.001).sort((a, b) => a.balance - b.balance);
    const creditors = working.filter((b) => b.balance > 0.001).sort((a, b) => b.balance - a.balance);

    if (debtors.length === 0 || creditors.length === 0) break;

    const debtor = debtors[0];
    const creditor = creditors[0];

    const amount = Math.min(-debtor.balance, creditor.balance);

    transactions.push({
      from: debtor.person,
      to: creditor.person,
      amount: Math.round(amount * 100) / 100,
    });

    const debtorEntry = working.find((b) => b.person === debtor.person);
    const creditorEntry = working.find((b) => b.person === creditor.person);
    debtorEntry.balance += amount;
    creditorEntry.balance -= amount;
  }

  return transactions;
}

// ---------------------------------------------------------------------------
// getSummaryReport
// ---------------------------------------------------------------------------

/**
 * Genera un informe resumido de todos los gastos del grupo.
 *
 * @param {Object[]} expenses - Lista de gastos (no puede estar vacía)
 * @returns {{
 *   totalExpenses: number,
 *   participantCount: number,
 *   byCategory: Object,
 *   highestBalance: { person: string, balance: number },
 *   lowestBalance:  { person: string, balance: number }
 * }}
 */
function getSummaryReport(expenses) {
  if (expenses.length === 0) {
    throw new Error('No hay gastos registrados.');
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const uniqueParticipants = expenses
    .flatMap((e) => e.participants)
    .filter((p, i, arr) => arr.indexOf(p) === i);
  const participantCount = uniqueParticipants.length;

  const byCategory = expenses.reduce((map, e) => {
    map[e.category] = (map[e.category] || 0) + e.amount;
    return map;
  }, {});

  const balances = getAllBalances(expenses);

  const highestBalance = balances.reduce(
    (best, b) => (b.balance > best.balance ? b : best),
    balances[0]
  );
  const lowestBalance = balances.reduce(
    (worst, b) => (b.balance < worst.balance ? b : worst),
    balances[0]
  );

  return {
    totalExpenses,
    participantCount,
    byCategory,
    highestBalance,
    lowestBalance,
  };
}

// ---------------------------------------------------------------------------
// Exportaciones
// ---------------------------------------------------------------------------

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createExpense,
    addExpense,
    getTotalPaid,
    getTotalOwed,
    getNetBalance,
    getAllBalances,
    getExpensesByCategory,
    getPersonHistory,
    getHighestSpender,
    simplifyDebts,
    getSummaryReport,
  };
}
