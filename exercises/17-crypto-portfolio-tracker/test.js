/**
 * Pruebas para: Seguimiento de Portafolio de Criptomonedas
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/17-crypto-portfolio-tracker
 */

// IMPORTANTE: Cambiar esta línea para probar tu solución
const { Asset, Portfolio } = require('./buggy-code.js');
// const { } = require('./solution.js');

describe('Portafolio de Criptomonedas - Asset', () => {
  describe('getAverageCost - Cálculo de costo promedio por unidad', () => {
    test('debe calcular el costo promedio con una sola compra de múltiples unidades', () => {
      const asset = new Asset('bitcoin');
      asset.addTransaction(2, 100);
      // 2 unidades a $100 cada una → total invertido $200, promedio = $200 / 2 = $100
      expect(asset.getAverageCost()).toBe(100);
    });

    test('debe calcular el costo promedio ponderado con dos compras de distinto precio y cantidad', () => {
      const asset = new Asset('bitcoin');
      asset.addTransaction(1, 100);
      asset.addTransaction(3, 200);
      // Total invertido: $100 + $600 = $700
      // Total unidades: 1 + 3 = 4
      // Promedio correcto: $700 / 4 = $175
      expect(asset.getAverageCost()).toBe(175);
    });

    test('debe calcular el costo promedio ponderado con tres compras de distinto tamaño', () => {
      const asset = new Asset('ethereum');
      asset.addTransaction(2, 50);
      asset.addTransaction(2, 150);
      asset.addTransaction(1, 100);
      // Total invertido: $100 + $300 + $100 = $500
      // Total unidades: 2 + 2 + 1 = 5
      // Promedio correcto: $500 / 5 = $100
      expect(asset.getAverageCost()).toBe(100);
    });

    test('debe calcular el costo promedio con compras de igual precio pero distinta cantidad', () => {
      const asset = new Asset('bitcoin');
      asset.addTransaction(5, 200);
      asset.addTransaction(5, 200);
      // Total invertido: $1000 + $1000 = $2000, total unidades: 10
      // Promedio: $2000 / 10 = $200
      expect(asset.getAverageCost()).toBe(200);
    });

    test('debe calcular el costo promedio con una compra pequeña seguida de una grande', () => {
      const asset = new Asset('bitcoin');
      asset.addTransaction(1, 60000);
      asset.addTransaction(9, 40000);
      // Total invertido: $60000 + $360000 = $420000
      // Total unidades: 1 + 9 = 10
      // Promedio correcto: $420000 / 10 = $42000
      expect(asset.getAverageCost()).toBe(42000);
    });

    test('debe retornar 0 cuando no hay transacciones', () => {
      const asset = new Asset('bitcoin');
      expect(asset.getAverageCost()).toBe(0);
    });
  });

  describe('getTotalUnits - Suma de unidades compradas', () => {
    test('debe sumar correctamente el total de unidades de múltiples compras', () => {
      const asset = new Asset('bitcoin');
      asset.addTransaction(0.5, 40000);
      asset.addTransaction(0.3, 45000);
      expect(asset.getTotalUnits()).toBeCloseTo(0.8, 5);
    });
  });

  describe('getTotalInvested - Total invertido en el activo', () => {
    test('debe calcular correctamente el total invertido (monto × precio)', () => {
      const asset = new Asset('bitcoin');
      asset.addTransaction(1, 100);
      asset.addTransaction(3, 200);
      // 1*100 + 3*200 = 100 + 600 = 700
      expect(asset.getTotalInvested()).toBe(700);
    });
  });

  describe('getProfitLoss - Ganancia o pérdida respecto al precio actual', () => {
    test('debe calcular ganancia cuando el precio sube', () => {
      const asset = new Asset('bitcoin');
      asset.addTransaction(2, 100);
      // Valor actual: 2 * $150 = $300, invertido: $200, ganancia: $100
      expect(asset.getProfitLoss(150)).toBe(100);
    });

    test('debe calcular pérdida cuando el precio baja', () => {
      const asset = new Asset('bitcoin');
      asset.addTransaction(2, 100);
      // Valor actual: 2 * $50 = $100, invertido: $200, pérdida: -$100
      expect(asset.getProfitLoss(50)).toBe(-100);
    });

    test('debe retornar 0 cuando el precio actual es igual al costo promedio', () => {
      const asset = new Asset('ethereum');
      asset.addTransaction(4, 100);
      // Precio actual igual al de compra → ganancia/pérdida = 0
      expect(asset.getProfitLoss(100)).toBe(0);
    });
  });
});

describe('Portafolio de Criptomonedas - Portfolio', () => {
  describe('getTotalInvested - Total invertido en todos los activos', () => {
    test('debe sumar el total invertido en todos los activos del portafolio', () => {
      const portfolio = new Portfolio('Test');
      portfolio.buy('bitcoin', 1, 100);
      portfolio.buy('ethereum', 2, 50);
      // Total: $100 + $100 = $200
      expect(portfolio.getTotalInvested()).toBe(200);
    });
  });

  describe('getTotalProfitLoss - Ganancia/pérdida total del portafolio', () => {
    test('debe calcular correctamente la ganancia total del portafolio', () => {
      const portfolio = new Portfolio('Test');
      portfolio.buy('bitcoin', 2, 100);
      portfolio.buy('ethereum', 1, 50);
      const prices = { bitcoin: 150, ethereum: 75 };
      // Bitcoin: 2*150 - 200 = 100, Ethereum: 75 - 50 = 25, Total: 125
      expect(portfolio.getTotalProfitLoss(prices)).toBe(125);
    });

    test('debe mostrar pérdida total cuando los precios bajan', () => {
      const portfolio = new Portfolio('Test');
      portfolio.buy('bitcoin', 1, 1000);
      portfolio.buy('ethereum', 1, 500);
      const prices = { bitcoin: 800, ethereum: 400 };
      // Bitcoin: 800 - 1000 = -200, Ethereum: 400 - 500 = -100, Total: -300
      expect(portfolio.getTotalProfitLoss(prices)).toBe(-300);
    });
  });
});
