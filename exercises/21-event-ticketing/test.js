/**
 * Pruebas para: Sistema de Venta de Tickets para Eventos
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/21-event-ticketing
 */

// IMPORTANTE: Cambiar esta línea para probar tu solución
const { Event, DiscountEngine, Order } = require('./buggy-code.js');
// const { } = require('./solution.js');

describe('Sistema de Venta de Tickets para Eventos', () => {
  let engine;

  beforeEach(() => {
    engine = new DiscountEngine();
  });

  describe('DiscountEngine.calculateGroupDiscount - Descuento de grupo', () => {
    test('debe aplicar descuento de grupo al comprar exactamente el mínimo requerido (10 tickets)', () => {
      // Comprar exactamente 10 tickets debe calificar para el descuento de grupo
      expect(engine.calculateGroupDiscount(10)).toBe(0.15);
    });

    test('debe aplicar descuento de grupo al comprar más del mínimo requerido', () => {
      expect(engine.calculateGroupDiscount(11)).toBe(0.15);
      expect(engine.calculateGroupDiscount(50)).toBe(0.15);
    });

    test('debe no aplicar descuento con 9 tickets (menor al mínimo)', () => {
      expect(engine.calculateGroupDiscount(9)).toBe(0);
    });

    test('debe no aplicar descuento con 1 ticket', () => {
      expect(engine.calculateGroupDiscount(1)).toBe(0);
    });

    test('debe no aplicar descuento con 0 tickets', () => {
      expect(engine.calculateGroupDiscount(0)).toBe(0);
    });
  });

  describe('DiscountEngine.calculateEarlyBirdDiscount - Descuento de compra anticipada', () => {
    test('debe aplicar descuento early bird con exactamente 30 días de anticipación', () => {
      expect(engine.calculateEarlyBirdDiscount(30)).toBe(0.1);
    });

    test('debe aplicar descuento early bird con más de 30 días', () => {
      expect(engine.calculateEarlyBirdDiscount(60)).toBe(0.1);
    });

    test('debe no aplicar descuento early bird con 29 días', () => {
      expect(engine.calculateEarlyBirdDiscount(29)).toBe(0);
    });
  });

  describe('DiscountEngine.getBestDiscount - Mejor descuento disponible', () => {
    test('debe aplicar descuento de grupo cuando es mayor que early bird', () => {
      // 10 tickets con 5 días de anticipación → grupo=15%, early bird=0% → best=15%
      expect(engine.getBestDiscount(10, 5)).toBe(0.15);
    });

    test('debe aplicar early bird cuando no hay suficientes tickets para grupo', () => {
      // 5 tickets con 45 días → grupo=0%, early bird=10% → best=10%
      expect(engine.getBestDiscount(5, 45)).toBe(0.1);
    });

    test('debe retornar el grupo cuando ambos aplican y es mayor', () => {
      // 10 tickets, 45 días → grupo=15%, early bird=10% → best=15%
      expect(engine.getBestDiscount(10, 45)).toBe(0.15);
    });
  });

  describe('Order - Cálculo del total de la orden', () => {
    test('debe aplicar descuento de grupo al comprar exactamente 10 tickets', () => {
      const event = new Event(1, 'Concierto Rock', 100, 500);
      const order = new Order('cliente-1', engine);
      order.addItem(event, 10);
      // Subtotal: 10 * $100 = $1000
      // Descuento grupo (10 >= 10): 15% → $150
      // Total: $1000 - $150 = $850
      expect(order.getTotal(0)).toBeCloseTo(850, 2);
    });

    test('debe no aplicar descuento con menos de 10 tickets', () => {
      const event = new Event(1, 'Concierto Rock', 100, 500);
      const order = new Order('cliente-2', engine);
      order.addItem(event, 9);
      // Subtotal: $900, sin descuento → total: $900
      expect(order.getTotal(0)).toBeCloseTo(900, 2);
    });

    test('debe calcular el subtotal correctamente sin descuento', () => {
      const event = new Event(1, 'Teatro', 50, 200);
      const order = new Order('cliente-3', engine);
      order.addItem(event, 4);
      expect(order.getSubtotal()).toBe(200);
    });

    test('debe retornar el descuento correcto en el resumen con 10 tickets exactos', () => {
      const event = new Event(1, 'Festival', 80, 1000);
      const order = new Order('cliente-4', engine);
      order.addItem(event, 10);
      const summary = order.getSummary(0);
      expect(summary.discountRate).toBe(0.15);
      expect(summary.discountAmount).toBeCloseTo(120, 2);
    });
  });
});
