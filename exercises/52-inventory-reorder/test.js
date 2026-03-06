/**
 * Pruebas para Inventory Reorder
 * Ejecutar con: npm test exercises/52-inventory-reorder
 */

const { Inventory } = require('./solution.js');

describe('Inventory Reorder System', () => {
  let inventory;
  const itemA = {
    id: 'A001',
    name: 'Widget Alpha',
    avgDailyDemand: 10,
    leadTimeDays: 5,
    safetyStock: 20,
    currentStock: 100,
    orderCost: 50,
    holdingCostPerUnit: 2,
    annualDemand: 3650,
  };
  const itemB = {
    id: 'B002',
    name: 'Gadget Beta',
    avgDailyDemand: 4,
    leadTimeDays: 7,
    safetyStock: 10,
    currentStock: 30,
    orderCost: 80,
    holdingCostPerUnit: 5,
    annualDemand: 1460,
  };

  beforeEach(() => {
    inventory = new Inventory();
    inventory.addItem(itemA);
    inventory.addItem(itemB);
  });

  describe('addItem - agregar artículos', () => {
    test('debe agregar un artículo correctamente', () => {
      const inv = new Inventory();
      const item = inv.addItem(itemA);
      expect(item.id).toBe('A001');
      expect(item.currentStock).toBe(100);
    });

    test('debe lanzar error al agregar artículo duplicado', () => {
      expect(() => inventory.addItem(itemA)).toThrow('A001');
    });
  });

  describe('calculateReorderPoint - punto de reorden', () => {
    test('debe calcular el punto de reorden correctamente', () => {
      // reorderPoint = avgDailyDemand * leadTimeDays + safetyStock
      // = 10 * 5 + 20 = 70
      expect(inventory.calculateReorderPoint('A001')).toBe(70);
    });

    test('debe calcular el punto de reorden para otro artículo', () => {
      // = 4 * 7 + 10 = 38
      expect(inventory.calculateReorderPoint('B002')).toBe(38);
    });
  });

  describe('calculateEOQ - cantidad económica de pedido', () => {
    test('debe calcular la EOQ correctamente', () => {
      // EOQ = sqrt(2 * 3650 * 50 / 2) = sqrt(182500) ≈ 427
      expect(inventory.calculateEOQ('A001')).toBe(427);
    });
  });

  describe('getDaysOfSupply - días de inventario', () => {
    test('debe calcular los días de suministro', () => {
      // 100 / 10 = 10 días
      expect(inventory.getDaysOfSupply('A001')).toBe(10);
    });

    test('debe retornar Infinity si demanda es 0', () => {
      inventory.addItem({ ...itemA, id: 'C003', avgDailyDemand: 0 });
      expect(inventory.getDaysOfSupply('C003')).toBe(Infinity);
    });
  });

  describe('needsReorder - requiere reorden', () => {
    test('debe detectar que B002 necesita reorden', () => {
      // stock=30, reorderPoint=38 → necesita reorden
      expect(inventory.needsReorder('B002')).toBe(true);
    });

    test('debe detectar que A001 no necesita reorden', () => {
      // stock=100, reorderPoint=70 → no necesita reorden
      expect(inventory.needsReorder('A001')).toBe(false);
    });
  });

  describe('updateStock - actualizar inventario', () => {
    test('debe actualizar el stock correctamente', () => {
      inventory.updateStock('A001', -20, 'sale');
      expect(inventory.getItem('A001').currentStock).toBe(80);
    });

    test('debe lanzar error si no hay stock suficiente', () => {
      expect(() => inventory.updateStock('A001', -200, 'sale')).toThrow('Insufficient stock');
    });

    test('debe registrar la transacción', () => {
      inventory.updateStock('A001', -10, 'sale');
      const history = inventory.getTransactionHistory('A001');
      expect(history).toHaveLength(1);
      expect(history[0].type).toBe('sale');
    });
  });

  describe('getReorderReport - reporte de reorden', () => {
    test('debe incluir solo artículos que necesitan reorden', () => {
      const report = inventory.getReorderReport();
      const ids = report.map(r => r.id);
      expect(ids).toContain('B002');
      expect(ids).not.toContain('A001');
    });

    test('debe ordenar por días de suministro ascendente', () => {
      inventory.addItem({ ...itemA, id: 'D004', avgDailyDemand: 8, leadTimeDays: 5, safetyStock: 15, currentStock: 20, orderCost: 40, holdingCostPerUnit: 3, annualDemand: 2920 });
      const report = inventory.getReorderReport();
      for (let i = 1; i < report.length; i++) {
        expect(report[i].daysOfSupply).toBeGreaterThanOrEqual(report[i - 1].daysOfSupply);
      }
    });
  });

  describe('getStockTurnover - rotación de inventario', () => {
    test('debe calcular la rotación de inventario', () => {
      // 3650 / 100 = 36.5
      expect(inventory.getStockTurnover('A001')).toBe(36.5);
    });
  });

  describe('getSummaryReport - reporte resumen', () => {
    test('debe contar artículos y cuántos necesitan reorden', () => {
      const report = inventory.getSummaryReport();
      expect(report.totalItems).toBe(2);
      expect(report.reorderNeeded).toBe(1);
    });
  });

  describe('applyDemandForecast - proyección de demanda', () => {
    test('debe actualizar la demanda según la tasa de crecimiento', () => {
      inventory.applyDemandForecast('A001', 0.1);
      expect(inventory.getItem('A001').avgDailyDemand).toBeCloseTo(11, 0);
    });
  });

  describe('getTotalInventoryValue - valor total del inventario', () => {
    test('debe calcular el valor total usando costos unitarios', () => {
      const value = inventory.getTotalInventoryValue({ A001: 5, B002: 10 });
      // 100*5 + 30*10 = 800
      expect(value).toBe(800);
    });
  });
});
