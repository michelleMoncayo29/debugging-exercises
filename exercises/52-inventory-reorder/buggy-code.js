/**
 * Inventory Reorder System
 *
 * Sistema de gestión de inventario con cálculo de punto de reorden,
 * cantidad económica de pedido (EOQ), días de suministro y reportes.
 */

class InventoryItem {
  constructor({
    id,
    name,
    avgDailyDemand,
    leadTimeDays,
    safetyStock,
    currentStock,
    orderCost,
    holdingCostPerUnit,
    annualDemand,
  }) {
    this.id = id;
    this.name = name;
    this.avgDailyDemand = avgDailyDemand;
    this.leadTimeDays = leadTimeDays;
    this.safetyStock = safetyStock;
    this.currentStock = currentStock;
    this.orderCost = orderCost;
    this.holdingCostPerUnit = holdingCostPerUnit;
    this.annualDemand = annualDemand;
  }
}

class Inventory {
  constructor() {
    this.items = [];
    this.transactions = [];
  }

  addItem(itemData) {
    if (this.items.find(i => i.id === itemData.id)) {
      throw new Error(`Item ${itemData.id} already exists`);
    }
    const item = new InventoryItem(itemData);
    this.items.push(item);
    return item;
  }

  getItem(id) {
    const item = this.items.find(i => i.id === id);
    if (!item) throw new Error(`Item ${id} not found`);
    return item;
  }

  updateStock(id, quantity, type = 'adjustment') {
    const item = this.getItem(id);
    if (quantity < 0 && Math.abs(quantity) > item.currentStock) {
      throw new Error(`Insufficient stock for item ${id}`);
    }
    item.currentStock += quantity;
    this.transactions.push({
      itemId: id,
      quantity,
      type,
      date: new Date().toISOString(),
      stockAfter: item.currentStock,
    });
    return item.currentStock;
  }

  // Operandos intercambiados: usa avgDailyDemand * safetyStock + leadTimeDays
  // en lugar de avgDailyDemand * leadTimeDays + safetyStock
  calculateReorderPoint(id) {
    const item = this.getItem(id);
    return item.avgDailyDemand * item.safetyStock + item.leadTimeDays;
  }

  calculateEOQ(id) {
    const item = this.getItem(id);
    return Math.round(
      Math.sqrt((2 * item.annualDemand * item.orderCost) / item.holdingCostPerUnit)
    );
  }

  getDaysOfSupply(id) {
    const item = this.getItem(id);
    if (item.avgDailyDemand === 0) return Infinity;
    return Math.floor(item.currentStock / item.avgDailyDemand);
  }

  needsReorder(id) {
    const item = this.getItem(id);
    return item.currentStock <= this.calculateReorderPoint(id);
  }

  getReorderReport() {
    return this.items
      .filter(item => this.needsReorder(item.id))
      .map(item => ({
        id: item.id,
        name: item.name,
        currentStock: item.currentStock,
        reorderPoint: this.calculateReorderPoint(item.id),
        eoq: this.calculateEOQ(item.id),
        daysOfSupply: this.getDaysOfSupply(item.id),
        shortage: item.currentStock - this.calculateReorderPoint(item.id),
      }))
      .sort((a, b) => a.daysOfSupply - b.daysOfSupply);
  }

  getTransactionHistory(id) {
    return this.transactions.filter(t => t.itemId === id);
  }

  getLowStockItems(threshold) {
    return this.items
      .filter(item => item.currentStock < threshold)
      .map(item => ({
        id: item.id,
        name: item.name,
        currentStock: item.currentStock,
      }));
  }

  getStockTurnover(id) {
    const item = this.getItem(id);
    if (item.currentStock === 0) return Infinity;
    return Math.round((item.annualDemand / item.currentStock) * 100) / 100;
  }

  applyDemandForecast(id, growthRate) {
    const item = this.getItem(id);
    item.avgDailyDemand =
      Math.round(item.avgDailyDemand * (1 + growthRate) * 100) / 100;
    item.annualDemand = Math.round(item.annualDemand * (1 + growthRate));
    return item;
  }

  getTotalInventoryValue(unitCosts) {
    return this.items.reduce((total, item) => {
      const cost = unitCosts[item.id] || 0;
      return total + item.currentStock * cost;
    }, 0);
  }

  getSummaryReport() {
    const totalItems = this.items.length;
    const reorderNeeded = this.items.filter(item =>
      this.needsReorder(item.id)
    ).length;
    const finiteDays = this.items
      .map(item => this.getDaysOfSupply(item.id))
      .filter(d => isFinite(d));
    const avgDaysOfSupply =
      finiteDays.length > 0
        ? finiteDays.reduce((s, d) => s + d, 0) / finiteDays.length
        : 0;

    return {
      totalItems,
      reorderNeeded,
      avgDaysOfSupply: Math.round(avgDaysOfSupply * 10) / 10,
      totalTransactions: this.transactions.length,
    };
  }

  getCriticalItems(maxDaysOfSupply = 3) {
    return this.items
      .filter(item => {
        const days = this.getDaysOfSupply(item.id);
        return isFinite(days) && days <= maxDaysOfSupply;
      })
      .map(item => ({
        id: item.id,
        name: item.name,
        daysOfSupply: this.getDaysOfSupply(item.id),
        currentStock: item.currentStock,
      }))
      .sort((a, b) => a.daysOfSupply - b.daysOfSupply);
  }

  bulkUpdateStock(updates) {
    const results = updates.map(({ id, quantity, type }) => {
      try {
        const newStock = this.updateStock(id, quantity, type);
        return { id, success: true, newStock };
      } catch (err) {
        return { id, success: false, error: err.message };
      }
    });
    return results;
  }

  getItemsByDemandRange(minDemand, maxDemand) {
    return this.items
      .filter(
        item =>
          item.avgDailyDemand >= minDemand &&
          item.avgDailyDemand <= maxDemand
      )
      .map(item => ({
        id: item.id,
        name: item.name,
        avgDailyDemand: item.avgDailyDemand,
      }));
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Inventory, InventoryItem };
}

if (require.main === module) {
  const inv = new Inventory();
  inv.addItem({
    id: 'A001', name: 'Widget Alpha', avgDailyDemand: 10,
    leadTimeDays: 5, safetyStock: 20, currentStock: 100,
    orderCost: 50, holdingCostPerUnit: 2, annualDemand: 3650,
  });
  // Con el bug: 10 * 20 + 5 = 205 (incorrecto), debería ser 10 * 5 + 20 = 70
  console.log('Reorder point (wrong):', inv.calculateReorderPoint('A001'));
}
