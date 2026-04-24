/**
 * Restaurant Billing System
 *
 * Sistema de facturación para restaurante: ítems, órdenes, impuestos,
 * división de cuenta entre comensales y resumen por categoría.
 */

class MenuItem {
  constructor(id, name, price, category) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
  }
}

class Order {
  constructor(tableId) {
    this.tableId = tableId;
    this.items = []; // [{ menuItem, quantity }]
  }

  addItem(menuItem, quantity = 1) {
    const existing = this.items.find(i => i.menuItem.id === menuItem.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ menuItem, quantity });
    }
    return this;
  }

  removeItem(menuItemId) {
    const idx = this.items.findIndex(i => i.menuItem.id === menuItemId);
    if (idx === -1) throw new Error(`Item ${menuItemId} no está en la orden`);
    this.items.splice(idx, 1);
    return this;
  }

  getSubtotal() {
    return this.items.reduce(
      (total, { menuItem, quantity }) => total + menuItem.price * quantity,
      0
    );
  }

  getItemCount() {
    return this.items.reduce((count, { quantity }) => count + quantity, 0);
  }
}

class BillingSystem {
  constructor(taxRate) {
    this.taxRate = taxRate;
    this.menu = [];
  }

  addMenuItem(item) {
    this.menu.push(item);
    return this;
  }

  getMenuItem(id) {
    const item = this.menu.find(m => m.id === id);
    if (!item) throw new Error(`Item ${id} no existe en el menú`);
    return item;
  }

  generateBill(order, options = {}) {
    const { memberDiscount = 0 } = options;
    const subtotal = order.getSubtotal();
    const discount = subtotal * memberDiscount;
    const discountedSubtotal = subtotal - discount;
    const tax = discountedSubtotal * this.taxRate;
    const total = discountedSubtotal + tax;

    return {
      tableId: order.tableId,
      items: order.items.map(({ menuItem, quantity }) => ({
        name: menuItem.name,
        quantity,
        unitPrice: menuItem.price,
        lineTotal: menuItem.price * quantity,
      })),
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      discountedSubtotal: Math.round(discountedSubtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }

  // Divide la cuenta entre los comensales de la mesa
  splitBill(order, diners) {
    if (diners <= 0) throw new Error('El número de comensales debe ser mayor a 0');
    const bill = this.generateBill(order);
    // Divide entre la cantidad de ítems en lugar del número de comensales
    return {
      diners,
      perPerson: Math.round((bill.total / diners) * 100) / 100,
      total: bill.total,
    };
  }

  getCategorySummary(order) {
    return order.items.reduce((summary, { menuItem, quantity }) => {
      const category = menuItem.category;
      const lineTotal = menuItem.price * quantity;
      summary[category] = (summary[category] || 0) + lineTotal;
      return summary;
    }, {});
  }

  getDailyReport(orders) {
    const allItems = orders.flatMap(o => o.items);
    const totalRevenue = orders.reduce((sum, o) => {
      const bill = this.generateBill(o);
      return sum + bill.total;
    }, 0);

    const topItems = Object.entries(
      allItems.reduce((acc, { menuItem, quantity }) => {
        acc[menuItem.name] = (acc[menuItem.name] || 0) + quantity;
        return acc;
      }, {})
    )
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, quantity }));

    return {
      ordersCount: orders.length,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      averageOrderValue: Math.round((totalRevenue / orders.length) * 100) / 100,
      topItems,
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MenuItem, Order, BillingSystem };
}

if (require.main === module) {
  const billing = new BillingSystem(0.08);
  billing.addMenuItem(new MenuItem('M001', 'Burger', 12.00, 'main'));
  billing.addMenuItem(new MenuItem('M002', 'Fries', 4.00, 'side'));

  const order = new Order('Table 5');
  order.addItem(billing.getMenuItem('M001'), 2);
  order.addItem(billing.getMenuItem('M002'), 3);

  console.log('Factura:', billing.generateBill(order));
  console.log('División 4 personas:', billing.splitBill(order, 4));
}
