/**
 * Pruebas para Discount Engine
 * Ejecutar con: npm test exercises/53-discount-engine
 */

const {
  applyPercentageDiscount,
  applyFlatDiscount,
  stackDiscounts,
  calculateCouponDiscount,
  getBestOffer,
  calculateOrderTotal,
  applyVolumeDiscount,
  calculateBuyXGetY,
  applyOrderThresholdDiscount,
  redeemPoints,
  formatDiscountSummary,
} = require('./buggy-code.js');

describe('Discount Engine', () => {
  describe('applyPercentageDiscount - descuento porcentual', () => {
    test('debe aplicar un descuento del 20%', () => {
      expect(applyPercentageDiscount(100, 0.2)).toBe(80);
    });

    test('debe aplicar un descuento del 10% con decimales', () => {
      expect(applyPercentageDiscount(99.99, 0.1)).toBeCloseTo(89.99, 1);
    });
  });

  describe('applyFlatDiscount - descuento fijo', () => {
    test('debe restar un monto fijo del precio', () => {
      expect(applyFlatDiscount(100, 15)).toBe(85);
    });

    test('no debe retornar precio negativo', () => {
      expect(applyFlatDiscount(10, 50)).toBe(0);
    });
  });

  describe('stackDiscounts - descuentos apilados', () => {
    test('debe aplicar descuentos de forma secuencial', () => {
      // 100 → 10% off → 90 → 20% off → 72
      expect(stackDiscounts(100, [0.1, 0.2])).toBe(72);
    });

    test('resultado secuencial debe ser mayor que aplicar la suma una sola vez', () => {
      // secuencial: 100 → -10% → 90 → -20% → 72
      // suma directa: 100 - 30% = 70 (sobreestima el descuento)
      const sequential = stackDiscounts(100, [0.1, 0.2]);
      const combined = applyPercentageDiscount(100, 0.3);
      expect(sequential).toBeGreaterThan(combined);
    });

    test('sin descuentos debe retornar el precio original', () => {
      expect(stackDiscounts(50, [])).toBe(50);
    });

    test('debe manejar un solo descuento', () => {
      expect(stackDiscounts(200, [0.25])).toBe(150);
    });
  });

  describe('calculateCouponDiscount - cupones', () => {
    test('debe aplicar cupón de porcentaje', () => {
      const coupon = { type: 'percentage', value: 0.15, expired: false };
      expect(calculateCouponDiscount(100, coupon)).toBe(85);
    });

    test('debe aplicar cupón de monto fijo', () => {
      const coupon = { type: 'flat', value: 20, expired: false };
      expect(calculateCouponDiscount(100, coupon)).toBe(80);
    });

    test('debe ignorar cupones expirados', () => {
      const coupon = { type: 'percentage', value: 0.5, expired: true };
      expect(calculateCouponDiscount(100, coupon)).toBe(100);
    });

    test('debe retornar precio original si no hay cupón', () => {
      expect(calculateCouponDiscount(100, null)).toBe(100);
    });
  });

  describe('getBestOffer - mejor oferta', () => {
    test('debe retornar el precio más bajo entre grupos de descuentos', () => {
      const price = 100;
      const offerGroups = [
        [0.1, 0.1],  // 100 → 90 → 81
        [0.2],       // 100 → 80
        [0.15, 0.05] // 100 → 85 → 80.75
      ];
      expect(getBestOffer(price, offerGroups)).toBe(80);
    });
  });

  describe('calculateOrderTotal - total de pedido', () => {
    test('debe sumar precio × cantidad de cada artículo', () => {
      const items = [
        { price: 10, quantity: 3 },
        { price: 25, quantity: 2 },
      ];
      expect(calculateOrderTotal(items)).toBe(80);
    });

    test('pedido vacío debe ser 0', () => {
      expect(calculateOrderTotal([])).toBe(0);
    });
  });

  describe('applyVolumeDiscount - descuento por volumen', () => {
    const tiers = [
      { minQuantity: 1, rate: 0 },
      { minQuantity: 10, rate: 0.05 },
      { minQuantity: 50, rate: 0.1 },
      { minQuantity: 100, rate: 0.15 },
    ];

    test('debe retornar la tasa del tier más alto aplicable', () => {
      expect(applyVolumeDiscount(50, tiers)).toBe(0.1);
      expect(applyVolumeDiscount(100, tiers)).toBe(0.15);
    });

    test('debe retornar 0 si no aplica ningún tier', () => {
      expect(applyVolumeDiscount(0, tiers)).toBe(0);
    });
  });

  describe('calculateBuyXGetY - compra X lleva Y', () => {
    test('debe calcular el descuento de promoción buy X get Y', () => {
      const items = [{ id: 'P1', price: 10, quantity: 6 }];
      const rule = { buyX: 2, getY: 1, productId: 'P1', discountRate: 1 };
      // 6 / (2+1) = 2 sets → 2 × 1 × 10 × 1 = 20 de descuento
      expect(calculateBuyXGetY(items, rule)).toBe(20);
    });

    test('debe retornar 0 si el producto no está en el pedido', () => {
      const items = [{ id: 'P2', price: 10, quantity: 6 }];
      const rule = { buyX: 2, getY: 1, productId: 'P1', discountRate: 1 };
      expect(calculateBuyXGetY(items, rule)).toBe(0);
    });
  });

  describe('applyOrderThresholdDiscount - descuento por monto mínimo', () => {
    const thresholds = [
      { minAmount: 50, rate: 0.05 },
      { minAmount: 100, rate: 0.1 },
      { minAmount: 200, rate: 0.15 },
    ];

    test('debe aplicar el descuento del umbral más alto alcanzado', () => {
      expect(applyOrderThresholdDiscount(150, thresholds)).toBe(0.1);
      expect(applyOrderThresholdDiscount(200, thresholds)).toBe(0.15);
    });

    test('debe retornar 0 si no alcanza ningún umbral', () => {
      expect(applyOrderThresholdDiscount(30, thresholds)).toBe(0);
    });
  });

  describe('redeemPoints - canjear puntos', () => {
    test('debe descontar el valor de los puntos del total', () => {
      // 500 puntos × $0.01 = $5 de descuento sobre $100
      expect(redeemPoints(100, 500, 0.01)).toBe(95);
    });

    test('el descuento no puede superar el total del pedido', () => {
      expect(redeemPoints(10, 9999, 0.01)).toBe(0);
    });
  });

  describe('formatDiscountSummary - resumen de descuento', () => {
    test('debe calcular el total ahorrado y el porcentaje de ahorro', () => {
      const summary = formatDiscountSummary(100, 72, null, [0.1, 0.2]);
      expect(summary.totalSaved).toBe(28);
      expect(summary.savingsPercent).toBe(28);
      expect(summary.discountsApplied).toBe(2);
      expect(summary.couponApplied).toBeNull();
    });
  });
});
