/**
 * Sistema de venta de tickets para eventos
 * Obtiene el catálogo de eventos desde JSONPlaceholder API
 */

class Event {
  constructor(id, name, ticketPrice, maxAttendees) {
    this.id = id;
    this.name = name;
    this.ticketPrice = ticketPrice;
    this.maxAttendees = maxAttendees;
  }
}

class DiscountEngine {
  constructor() {
    this.GROUP_MIN = 10;
    this.GROUP_DISCOUNT = 0.15;
    this.EARLY_BIRD_DISCOUNT = 0.1;
  }

  // Calcula el porcentaje de descuento según la cantidad de tickets
  calculateGroupDiscount(quantity) {
    if (quantity >= this.GROUP_MIN) {
      return this.GROUP_DISCOUNT;
    }
    return 0;
  }

  calculateEarlyBirdDiscount(daysUntilEvent) {
    if (daysUntilEvent >= 30) {
      return this.EARLY_BIRD_DISCOUNT;
    }
    return 0;
  }

  getBestDiscount(quantity, daysUntilEvent) {
    const groupDiscount = this.calculateGroupDiscount(quantity);
    const earlyBirdDiscount = this.calculateEarlyBirdDiscount(daysUntilEvent);
    return Math.max(groupDiscount, earlyBirdDiscount);
  }
}

class Order {
  constructor(customerId, discountEngine) {
    this.customerId = customerId;
    this.discountEngine = discountEngine;
    this.items = [];
  }

  addItem(event, quantity) {
    this.items.push({ event, quantity });
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + item.event.ticketPrice * item.quantity, 0);
  }

  getTotalQuantity() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotal(daysUntilEvent = 0) {
    const subtotal = this.getSubtotal();
    const quantity = this.getTotalQuantity();
    const discountRate = this.discountEngine.getBestDiscount(quantity, daysUntilEvent);
    return subtotal * (1 - discountRate);
  }

  getSummary(daysUntilEvent = 0) {
    const subtotal = this.getSubtotal();
    const quantity = this.getTotalQuantity();
    const discountRate = this.discountEngine.getBestDiscount(quantity, daysUntilEvent);
    return {
      customerId: this.customerId,
      quantity,
      subtotal,
      discountRate,
      discountAmount: subtotal * discountRate,
      total: subtotal * (1 - discountRate),
    };
  }
}

// Obtiene el catálogo de eventos desde JSONPlaceholder (simulado con posts)
async function fetchEvents(limit = 10) {
  const url = `https://jsonplaceholder.typicode.com/posts?_limit=${limit}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error al obtener eventos: ${response.status}`);
  const posts = await response.json();
  return posts.map(
    (post) =>
      new Event(
        post.id,
        post.title.slice(0, 30),
        Math.round(50 + (post.id * 7.3) % 150),
        100 + post.id * 10,
      ),
  );
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Event, DiscountEngine, Order, fetchEvents };
}

if (require.main === module) {
  (async () => {
    const events = await fetchEvents(3);
    const engine = new DiscountEngine();
    const order = new Order('cliente-001', engine);
    order.addItem(events[0], 10);
    console.log('Resumen de la orden:', order.getSummary(45));
  })();
}
