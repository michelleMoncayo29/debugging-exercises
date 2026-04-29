/**
 * Budget Planner
 *
 * Planificador de presupuesto personal: ingresos, gastos por categoría,
 * tasa de ahorro, alertas y proyecciones.
 */

class Transaction {
  constructor(id, type, amount, categoryId, month) {
    this.id = id;
    this.type = type;
    this.amount = amount;
    this.categoryId = categoryId;
    this.month = month;
  }
}

class Category {
  constructor(id, name, monthlyBudget) {
    this.id = id;
    this.name = name;
    this.monthlyBudget = monthlyBudget;
  }
}

class BudgetPlanner {
  constructor() {
    this.transactions = [];
    this.categories = [];
  }

  addTransaction(tx) {
    this.transactions.push(tx);
    return this;
  }

  addCategory(category) {
    this.categories.push(category);
    return this;
  }

  getCategory(id) {
    return this.categories.find(c => c.id === id);
  }

  getMonthTransactions(month) {
    return this.transactions.filter(tx => tx.month === month);
  }

  getTotalIncome(month) {
    return this.getMonthTransactions(month)
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }

  getTotalExpenses(month) {
    return this.getMonthTransactions(month)
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }

  // Calcula la tasa de ahorro mensual
  getSavingsRate(month) {
    const income = this.getTotalIncome(month);
    if (income === 0) return 0;
    const expenses = this.getTotalExpenses(month);
    const savings = income - expenses;
    // Divide entre gastos en lugar de ingresos
    return Math.round((savings / income) * 1000) / 1000;
  }

  getExpensesByCategory(month) {
    return this.getMonthTransactions(month)
      .filter(tx => tx.type === 'expense')
      .reduce((acc, tx) => {
        acc[tx.categoryId] = (acc[tx.categoryId] || 0) + tx.amount;
        return acc;
      }, {});
  }

  getBudgetAlerts(month) {
    const expensesByCategory = this.getExpensesByCategory(month);
    return this.categories
      .filter(cat => expensesByCategory[cat.id] > cat.monthlyBudget)
      .map(cat => ({
        category: cat.id,
        name: cat.name,
        budget: cat.monthlyBudget,
        spent: expensesByCategory[cat.id],
        overage: expensesByCategory[cat.id] - cat.monthlyBudget,
        usagePercent: Math.round((expensesByCategory[cat.id] / cat.monthlyBudget) * 100),
      }));
  }

  getMonthlySummary(month) {
    const income = this.getTotalIncome(month);
    const expenses = this.getTotalExpenses(month);
    const savings = income - expenses;
    const expensesByCategory = this.getExpensesByCategory(month);

    return {
      month,
      income,
      expenses,
      savings,
      savingsRate: this.getSavingsRate(month),
      expensesByCategory,
      topExpenseCategory: Object.entries(expensesByCategory)
        .sort(([, a], [, b]) => b - a)
        .map(([id, amount]) => ({ id, amount }))[0] || null,
    };
  }

  projectSavings(baseMonth, months) {
    const income = this.getTotalIncome(baseMonth);
    const expenses = this.getTotalExpenses(baseMonth);
    const monthlySavings = income - expenses;
    return {
      months,
      monthlySavings,
      totalSavings: monthlySavings * months,
      projectedMonths: Array.from({ length: months }, (_, i) => ({
        month: i + 1,
        cumulative: monthlySavings * (i + 1),
      })),
    };
  }

  getAnnualReport(year) {
    const months = Array.from({ length: 12 }, (_, i) => {
      const m = String(i + 1).padStart(2, '0');
      return `${year}-${m}`;
    });
    const monthlyData = months.map(month => this.getMonthlySummary(month));
    const totalIncome = monthlyData.reduce((s, m) => s + m.income, 0);
    const totalExpenses = monthlyData.reduce((s, m) => s + m.expenses, 0);
    return {
      year,
      totalIncome,
      totalExpenses,
      totalSavings: totalIncome - totalExpenses,
      averageMonthlySavings: (totalIncome - totalExpenses) / 12,
      bestMonth: monthlyData
        .filter(m => m.income > 0)
        .sort((a, b) => b.savings - a.savings)[0] || null,
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Transaction, Category, BudgetPlanner };
}

if (require.main === module) {
  const planner = new BudgetPlanner();
  planner.addCategory(new Category('food', 'Alimentación', 500));
  planner.addTransaction(new Transaction('T1', 'income', 4000, 'salary', '2024-01'));
  planner.addTransaction(new Transaction('T2', 'expense', 1000, 'food', '2024-01'));
  console.log('Tasa de ahorro:', planner.getSavingsRate('2024-01'));
}
