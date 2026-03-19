/**
 * Pruebas para Stock Portfolio
 * Ejecutar con: npm test exercises/57-stock-portfolio
 */

const { StockPortfolio } = require('./buggy-code.js');

describe('Stock Portfolio', () => {
  let portfolio;
  const currentPrices = { AAPL: 200, GOOG: 150, MSFT: 400 };

  beforeEach(() => {
    portfolio = new StockPortfolio();
    portfolio.addPosition('AAPL', 10, 100, '2022-01-01');  // costBasis: $1000
    portfolio.addPosition('GOOG', 5, 100, '2022-01-01');   // costBasis: $500
    portfolio.addPosition('MSFT', 2, 200, '2022-01-01');   // costBasis: $400
  });

  describe('addPosition - agregar posición', () => {
    test('debe agregar posición correctamente', () => {
      const pos = portfolio.getPosition('AAPL');
      expect(pos.shares).toBe(10);
      expect(pos.purchasePrice).toBe(100);
    });

    test('debe acumular shares si ya existe la posición', () => {
      portfolio.addPosition('AAPL', 5, 120, '2023-01-01');
      const pos = portfolio.getPosition('AAPL');
      expect(pos.shares).toBe(15);
    });

    test('debe lanzar error con datos inválidos', () => {
      expect(() => portfolio.addPosition('XYZ', -1, 100, '2023-01-01')).toThrow();
    });
  });

  describe('getPositionValue - valor de posición', () => {
    test('debe calcular el valor actual de la posición', () => {
      // 10 acciones × $200 = $2000
      expect(portfolio.getPositionValue('AAPL', 200)).toBe(2000);
    });
  });

  describe('getPositionReturn - retorno de posición', () => {
    test('debe calcular el retorno porcentual', () => {
      // AAPL: comprado a $100, ahora $200 → 100% de retorno
      expect(portfolio.getPositionReturn('AAPL', 200)).toBe(1.0);
    });

    test('posición en pérdida debe retornar negativo', () => {
      expect(portfolio.getPositionReturn('AAPL', 50)).toBe(-0.5);
    });
  });

  describe('getPortfolioValue - valor total del portafolio', () => {
    test('debe sumar el valor de todas las posiciones', () => {
      // AAPL: 10×200=2000, GOOG: 5×150=750, MSFT: 2×400=800 → total: 3550
      expect(portfolio.getPortfolioValue(currentPrices)).toBe(3550);
    });
  });

  describe('getCostBasis - costo base total', () => {
    test('debe calcular el costo total invertido', () => {
      // 1000 + 500 + 400 = 1900
      expect(portfolio.getCostBasis()).toBe(1900);
    });
  });

  describe('getAnnualizedReturn - retorno anualizado', () => {
    test('debe usar la fórmula de crecimiento compuesto, no promedio simple', () => {
      // Retorno total 100% en 2 años
      // Compuesto: (1 + 1.0)^(1/2) - 1 = sqrt(2) - 1 ≈ 0.4142
      // Simple (incorrecto): 1.0 / 2 = 0.5
      const annualized = portfolio.getAnnualizedReturn(1.0, 2);
      expect(annualized).toBeCloseTo(Math.sqrt(2) - 1, 4);
    });

    test('resultado de crecimiento compuesto debe ser menor que la división simple', () => {
      const annualized = portfolio.getAnnualizedReturn(1.0, 2);
      expect(annualized).toBeLessThan(0.5);
    });

    test('retorno 0% debe ser 0% anualizado', () => {
      expect(portfolio.getAnnualizedReturn(0, 5)).toBeCloseTo(0, 5);
    });
  });

  describe('getDiversification - diversificación', () => {
    test('debe calcular el porcentaje de cada posición sobre el total', () => {
      const div = portfolio.getDiversification(currentPrices);
      // AAPL: 2000/3550 ≈ 56.34%
      expect(div.find(d => d.symbol === 'AAPL').percentage).toBeCloseTo(56.34, 1);
    });

    test('la suma de los porcentajes debe ser 100', () => {
      const div = portfolio.getDiversification(currentPrices);
      const total = div.reduce((s, d) => s + d.percentage, 0);
      expect(total).toBeCloseTo(100, 1);
    });
  });

  describe('getTopPerformers - mejores posiciones', () => {
    test('debe retornar las posiciones ordenadas por retorno descendente', () => {
      const performers = portfolio.getTopPerformers(currentPrices);
      for (let i = 1; i < performers.length; i++) {
        expect(performers[i].returnPct).toBeLessThanOrEqual(performers[i - 1].returnPct);
      }
    });
  });

  describe('getTotalReturn - retorno total del portafolio', () => {
    test('debe calcular el retorno total del portafolio sobre el costo base', () => {
      // totalValue: 3550, costBasis: 1900 → return = (3550-1900)/1900 ≈ 0.868
      const ret = portfolio.getTotalReturn(currentPrices);
      expect(ret).toBeCloseTo((3550 - 1900) / 1900, 4);
    });
  });

  describe('removePosition - eliminar posición', () => {
    test('debe eliminar la posición del portafolio', () => {
      portfolio.removePosition('GOOG');
      expect(() => portfolio.getPosition('GOOG')).toThrow();
    });
  });
});
