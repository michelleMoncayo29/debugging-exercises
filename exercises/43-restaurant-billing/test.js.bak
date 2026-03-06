/**
 * Pruebas para Restaurant Billing
 * Ejecutar con: npm test exercises/43-restaurant-billing
 */

const { MenuItem, Order, BillingSystem } = require('./buggy-code.js');

describe('Restaurant Billing', () => {
  let billing;

  beforeEach(() => {
    billing = new BillingSystem(0.08); // 8% impuesto
    billing.addMenuItem(new MenuItem('M001', 'Burger', 12.00, 'main'));
    billing.addMenuItem(new MenuItem('M002', 'Fries', 4.00, 'side'));
    billing.addMenuItem(new MenuItem('M003', 'Soda', 3.00, 'drink'));
    billing.addMenuItem(new MenuItem('M004', 'Salad', 8.00, 'main'));
  });

  describe('MenuItem - creación', () => {
    test('debe crear un item con sus propiedades', () => {
      const item = new MenuItem('X001', 'Pizza', 15.00, 'main');
      expect(item.id).toBe('X001');
      expect(item.name).toBe('Pizza');
      expect(item.price).toBe(15.00);
      expect(item.category).toBe('main');
    });
  });

  describe('Order - agregar y calcular subtotal', () => {
    test('debe calcular el subtotal de una orden simple', () => {
      const order = new Order('T1');
      order.addItem(billing.getMenuItem('M001'), 2); // 2 burgers = 24
      order.addItem(billing.getMenuItem('M003'), 1); // 1 soda = 3
      expect(order.getSubtotal()).toBe(27.00);
    });

    test('debe calcular subtotal con múltiples items', () => {
      const order = new Order('T2');
      order.addItem(billing.getMenuItem('M001'), 1); // 12
      order.addItem(billing.getMenuItem('M002'), 2); // 8
      order.addItem(billing.getMenuItem('M004'), 1); // 8
      expect(order.getSubtotal()).toBe(28.00);
    });
  });

  describe('BillingSystem - factura con impuesto', () => {
    test('debe aplicar el impuesto correctamente', () => {
      const order = new Order('T3');
      order.addItem(billing.getMenuItem('M001'), 1); // 12
      const bill = billing.generateBill(order);
      expect(bill.subtotal).toBeCloseTo(12.00);
      expect(bill.tax).toBeCloseTo(0.96);
      expect(bill.total).toBeCloseTo(12.96);
    });
  });

  describe('BillingSystem - división de cuenta', () => {
    test('debe dividir la cuenta entre el número de comensales correcto', () => {
      const order = new Order('T4');
      order.addItem(billing.getMenuItem('M001'), 2); // 24
      order.addItem(billing.getMenuItem('M003'), 2); // 6
      // subtotal=30, tax=2.4, total=32.4 / 2 personas = 16.20
      const split = billing.splitBill(order, 2);
      expect(split.perPerson).toBeCloseTo(16.20);
      expect(split.diners).toBe(2);
    });

    test('debe dividir entre 3 comensales correctamente', () => {
      const order = new Order('T5');
      order.addItem(billing.getMenuItem('M001'), 3); // 36
      // subtotal=36, tax=2.88, total=38.88 / 3 = 12.96
      const split = billing.splitBill(order, 3);
      expect(split.perPerson).toBeCloseTo(12.96);
      expect(split.diners).toBe(3);
    });

    test('debe lanzar error si se intenta dividir entre 0 comensales', () => {
      const order = new Order('T6');
      order.addItem(billing.getMenuItem('M001'), 1);
      expect(() => billing.splitBill(order, 0)).toThrow();
    });
  });

  describe('BillingSystem - resumen por categoría', () => {
    test('debe agrupar ventas por categoría', () => {
      const order = new Order('T7');
      order.addItem(billing.getMenuItem('M001'), 2); // main: 24
      order.addItem(billing.getMenuItem('M002'), 1); // side: 4
      order.addItem(billing.getMenuItem('M003'), 3); // drink: 9
      const summary = billing.getCategorySummary(order);
      expect(summary['main']).toBeCloseTo(24.00);
      expect(summary['side']).toBeCloseTo(4.00);
      expect(summary['drink']).toBeCloseTo(9.00);
    });
  });

  describe('BillingSystem - descuento por membresía', () => {
    test('debe aplicar descuento del 10% para miembros antes del impuesto', () => {
      const order = new Order('T8');
      order.addItem(billing.getMenuItem('M001'), 1); // 12 - 10% = 10.8, tax=0.864, total=11.664
      const bill = billing.generateBill(order, { memberDiscount: 0.10 });
      expect(bill.discount).toBeCloseTo(1.20);
      expect(bill.total).toBeCloseTo(11.664);
    });
  });
});
