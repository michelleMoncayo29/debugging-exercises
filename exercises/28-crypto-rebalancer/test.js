/**
 * Pruebas para: Rebalanceador Automático de Portafolio de Criptomonedas
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/28-crypto-rebalancer
 */

// IMPORTANTE: Cambiar esta línea para probar tu solución
const { Asset, Portfolio } = require('./buggy-code.js');
// const { } = require('./solution.js');

describe('Rebalanceador Automático de Portafolio de Criptomonedas', () => {
  describe('Portfolio.getRebalancePlan - Plan de rebalanceo usando porcentajes objetivo', () => {
    test('debe calcular el valor objetivo de BTC como 70% del total, no como 50%', () => {
      const portfolio = new Portfolio('Test');
      // BTC: objetivo 70%, valor actual $5000
      portfolio.addAsset(new Asset('bitcoin', 70, 1));
      // ETH: objetivo 30%, valor actual $5000
      portfolio.addAsset(new Asset('ethereum', 30, 2));
      const prices = { bitcoin: 5000, ethereum: 2500 };
      // Total = $5000 + $5000 = $10000
      // Objetivo BTC: 70% de $10000 = $7000 → comprar $2000
      // Objetivo ETH: 30% de $10000 = $3000 → vender $2000
      const plan = portfolio.getRebalancePlan(prices);
      const btcPlan = plan.find((p) => p.coinId === 'bitcoin');
      expect(btcPlan.targetValue).toBeCloseTo(7000, 2);
    });

    test('debe recomendar comprar BTC cuando está por debajo de su objetivo', () => {
      const portfolio = new Portfolio('Test');
      portfolio.addAsset(new Asset('bitcoin', 70, 1));
      portfolio.addAsset(new Asset('ethereum', 30, 2));
      const prices = { bitcoin: 5000, ethereum: 2500 };
      const plan = portfolio.getRebalancePlan(prices);
      const btcPlan = plan.find((p) => p.coinId === 'bitcoin');
      // BTC tiene $5000 pero debería tener $7000 → debe comprar
      expect(btcPlan.action).toBe('comprar');
      expect(btcPlan.amountUsd).toBeCloseTo(2000, 2);
    });

    test('debe recomendar vender ETH cuando está por encima de su objetivo', () => {
      const portfolio = new Portfolio('Test');
      portfolio.addAsset(new Asset('bitcoin', 70, 1));
      portfolio.addAsset(new Asset('ethereum', 30, 2));
      const prices = { bitcoin: 5000, ethereum: 2500 };
      const plan = portfolio.getRebalancePlan(prices);
      const ethPlan = plan.find((p) => p.coinId === 'ethereum');
      // ETH tiene $5000 pero debería tener $3000 → debe vender
      expect(ethPlan.action).toBe('vender');
      expect(ethPlan.amountUsd).toBeCloseTo(2000, 2);
    });

    test('debe retornar mantener cuando el activo ya está en su porcentaje objetivo', () => {
      const portfolio = new Portfolio('Test');
      // Ambos al 50%, ambos con $5000 → ya están balanceados
      portfolio.addAsset(new Asset('bitcoin', 50, 1));
      portfolio.addAsset(new Asset('ethereum', 50, 2));
      const prices = { bitcoin: 5000, ethereum: 2500 };
      const plan = portfolio.getRebalancePlan(prices);
      plan.forEach((item) => {
        expect(item.action).toBe('mantener');
        expect(item.amountUsd).toBe(0);
      });
    });

    test('debe calcular valores objetivo correctos para un portafolio de 3 activos', () => {
      const portfolio = new Portfolio('Test');
      portfolio.addAsset(new Asset('bitcoin', 60, 1));
      portfolio.addAsset(new Asset('ethereum', 30, 1));
      portfolio.addAsset(new Asset('litecoin', 10, 1));
      // Todos valen $1000 → total $3000
      const prices = { bitcoin: 1000, ethereum: 1000, litecoin: 1000 };
      const plan = portfolio.getRebalancePlan(prices);
      const btcPlan = plan.find((p) => p.coinId === 'bitcoin');
      const ethPlan = plan.find((p) => p.coinId === 'ethereum');
      const ltcPlan = plan.find((p) => p.coinId === 'litecoin');
      // Objetivos: BTC 60%=$1800, ETH 30%=$900, LTC 10%=$300
      expect(btcPlan.targetValue).toBeCloseTo(1800, 2);
      expect(ethPlan.targetValue).toBeCloseTo(900, 2);
      expect(ltcPlan.targetValue).toBeCloseTo(300, 2);
    });

    test('debe retornar arreglo vacío cuando el valor total del portafolio es 0', () => {
      const portfolio = new Portfolio('Vacío');
      portfolio.addAsset(new Asset('bitcoin', 100, 0));
      const prices = { bitcoin: 50000 };
      expect(portfolio.getRebalancePlan(prices)).toEqual([]);
    });
  });

  describe('Portfolio.getTotalCurrentValue - Valor total del portafolio', () => {
    test('debe calcular el valor total sumando todos los activos a sus precios actuales', () => {
      const portfolio = new Portfolio('Test');
      portfolio.addAsset(new Asset('bitcoin', 70, 0.5));
      portfolio.addAsset(new Asset('ethereum', 30, 4));
      const prices = { bitcoin: 10000, ethereum: 500 };
      // BTC: 0.5 * 10000 = 5000, ETH: 4 * 500 = 2000, Total: 7000
      expect(portfolio.getTotalCurrentValue(prices)).toBe(7000);
    });
  });

  describe('Asset.getCurrentValue - Valor actual del activo', () => {
    test('debe calcular el valor multiplicando unidades por precio', () => {
      const asset = new Asset('bitcoin', 60, 0.5);
      expect(asset.getCurrentValue(40000)).toBe(20000);
    });

    test('debe retornar 0 si no hay unidades', () => {
      const asset = new Asset('bitcoin', 60, 0);
      expect(asset.getCurrentValue(50000)).toBe(0);
    });
  });
});
