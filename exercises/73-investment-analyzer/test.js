/**
 * Tests para el ejercicio 73-investment-analyzer.
 * Por defecto prueba buggy-code.js (contiene el bug que el estudiante debe corregir).
 * Para verificar la solución, cambia la línea de import a:
 *   const { ... } = require('./buggy-code');
 */

const {
  Investment,
  calculateROI,
  calculateAnnualizedROI,
  calculateFutureValue,
  calculatePresentValue,
  calculateCAGR,
  calculatePaybackPeriod,
  calculateRuleOf72,
  calculateBreakEven,
  calculateVolatility,
  getPortfolioWeights,
  calculatePortfolioROI,
  filterByMinROI,
  rankByROI,
  getInvestmentStats,
} = require('./buggy-code');
// const {
//   Investment,
//   calculateROI,
//   calculateAnnualizedROI,
//   calculateFutureValue,
//   calculatePresentValue,
//   calculateCAGR,
//   calculatePaybackPeriod,
//   calculateRuleOf72,
//   calculateBreakEven,
//   calculateVolatility,
//   getPortfolioWeights,
//   calculatePortfolioROI,
//   filterByMinROI,
//   rankByROI,
//   getInvestmentStats,
// } = require('./solution');

// ---------------------------------------------------------------------------
// Fixtures compartidos
// ---------------------------------------------------------------------------

let inv1, inv2, inv3, portfolio;

beforeEach(() => {
  inv1 = new Investment('Acciones Tech', 1000, 1500, 2);
  inv2 = new Investment('Bonos Estado', 2000, 2200, 3);
  inv3 = new Investment('Fondo Índice', 500, 350, 1);
  portfolio = [inv1, inv2, inv3];
});

// ---------------------------------------------------------------------------
// calculateROI
// ---------------------------------------------------------------------------

describe('calculateROI', () => {
  test('debería retornar 50% cuando se pasa de 1000 a 1500', () => {
    expect(calculateROI(1000, 1500)).toBeCloseTo(50, 4);
  });

  test('debería retornar -20% cuando se pasa de 1000 a 800 (pérdida)', () => {
    expect(calculateROI(1000, 800)).toBeCloseTo(-20, 4);
  });

  test('debería retornar 0% cuando el valor no cambia', () => {
    expect(calculateROI(1000, 1000)).toBe(0);
  });

  test('debería retornar 100% cuando se duplica la inversión (1000→2000)', () => {
    // Test crítico: si el denominador es finalValue en lugar de initialValue,
    // el resultado sería 50% en lugar de 100%
    expect(calculateROI(1000, 2000)).toBeCloseTo(100, 4);
  });

  test('debería retornar 25% para una ganancia del 25% sobre el capital inicial', () => {
    expect(calculateROI(2000, 2500)).toBeCloseTo(25, 4);
  });

  test('debería retornar 200% cuando el valor se triplica', () => {
    expect(calculateROI(1000, 3000)).toBeCloseTo(200, 4);
  });
});

// ---------------------------------------------------------------------------
// calculateAnnualizedROI
// ---------------------------------------------------------------------------

describe('calculateAnnualizedROI', () => {
  test('debería retornar 100% cuando el ROI total es 100% en 1 año', () => {
    expect(calculateAnnualizedROI(100, 1)).toBeCloseTo(100, 4);
  });

  test('debería retornar ~41.4214% cuando el ROI total es 100% en 2 años', () => {
    expect(calculateAnnualizedROI(100, 2)).toBeCloseTo(41.4214, 3);
  });

  test('debería retornar 0% para un ROI total de 0% en cualquier cantidad de años', () => {
    expect(calculateAnnualizedROI(0, 5)).toBeCloseTo(0, 4);
  });

  test('debería retornar un valor menor a la tasa total cuando se distribuye en varios años', () => {
    const annualized = calculateAnnualizedROI(50, 3);
    expect(annualized).toBeGreaterThan(0);
    expect(annualized).toBeLessThan(50);
  });

  test('debería retornar ~14.4714% para un ROI de 50% en 3 años', () => {
    const expected = (Math.pow(1.5, 1 / 3) - 1) * 100;
    expect(calculateAnnualizedROI(50, 3)).toBeCloseTo(expected, 3);
  });
});

// ---------------------------------------------------------------------------
// calculateFutureValue
// ---------------------------------------------------------------------------

describe('calculateFutureValue', () => {
  test('debería retornar 1100 para 1000 al 10% durante 1 año', () => {
    expect(calculateFutureValue(1000, 0.10, 1)).toBeCloseTo(1100, 2);
  });

  test('debería retornar 1210 para 1000 al 10% durante 2 años (interés compuesto)', () => {
    // Test crítico: con interés simple daría 1200; el compuesto correcto es 1210
    expect(calculateFutureValue(1000, 0.10, 2)).toBeCloseTo(1210, 2);
  });

  test('debería retornar 2158.92 para 1000 al 8% durante 10 años', () => {
    // Test crítico: un error de multiplicación lineal daría 1800
    expect(calculateFutureValue(1000, 0.08, 10)).toBeCloseTo(2158.92, 1);
  });

  test('debería retornar el mismo valor cuando la tasa es 0%', () => {
    expect(calculateFutureValue(5000, 0, 10)).toBeCloseTo(5000, 2);
  });

  test('debería escalar linealmente con el capital inicial (mismo porcentaje)', () => {
    const fv1 = calculateFutureValue(1000, 0.05, 3);
    const fv2 = calculateFutureValue(2000, 0.05, 3);
    expect(fv2).toBeCloseTo(fv1 * 2, 1);
  });
});

// ---------------------------------------------------------------------------
// calculatePresentValue
// ---------------------------------------------------------------------------

describe('calculatePresentValue', () => {
  test('debería retornar 1000 para un valor futuro de 1100 al 10% en 1 año', () => {
    expect(calculatePresentValue(1100, 0.10, 1)).toBeCloseTo(1000, 2);
  });

  test('debería retornar 1000 para un valor futuro de 1210 al 10% en 2 años', () => {
    expect(calculatePresentValue(1210, 0.10, 2)).toBeCloseTo(1000, 2);
  });

  test('debería ser la función inversa de calculateFutureValue', () => {
    const presentValue = 3500;
    const rate = 0.07;
    const years = 5;
    const futureValue = calculateFutureValue(presentValue, rate, years);
    expect(calculatePresentValue(futureValue, rate, years)).toBeCloseTo(presentValue, 1);
  });

  test('debería retornar el mismo valor cuando la tasa es 0%', () => {
    expect(calculatePresentValue(8000, 0, 10)).toBeCloseTo(8000, 2);
  });

  test('debería retornar un valor menor al valor futuro con tasa positiva', () => {
    const pv = calculatePresentValue(5000, 0.05, 3);
    expect(pv).toBeLessThan(5000);
  });
});

// ---------------------------------------------------------------------------
// calculateCAGR
// ---------------------------------------------------------------------------

describe('calculateCAGR', () => {
  test('debería retornar 100% cuando el valor se duplica en 1 año', () => {
    expect(calculateCAGR(1000, 2000, 1)).toBeCloseTo(100, 4);
  });

  test('debería retornar ~41.4214% cuando el valor se duplica en 2 años (no 100%)', () => {
    expect(calculateCAGR(1000, 2000, 2)).toBeCloseTo(41.4214, 3);
  });

  test('debería retornar ~8.4472% para 1000→1500 en 5 años', () => {
    // Test crítico: si se usa el exponente 5 en vez de 1/5, el resultado es enorme
    expect(calculateCAGR(1000, 1500, 5)).toBeCloseTo(8.4472, 3);
  });

  test('debería retornar 0% cuando el valor no cambia', () => {
    expect(calculateCAGR(1000, 1000, 5)).toBeCloseTo(0, 4);
  });

  test('debería coincidir con calculateAnnualizedROI cuando se parte del mismo ROI', () => {
    // CAGR(1000, 2000, 3) debe ser igual a calculateAnnualizedROI(100, 3)
    const cagr = calculateCAGR(1000, 2000, 3);
    const annualized = calculateAnnualizedROI(100, 3);
    expect(cagr).toBeCloseTo(annualized, 3);
  });
});

// ---------------------------------------------------------------------------
// calculatePaybackPeriod
// ---------------------------------------------------------------------------

describe('calculatePaybackPeriod', () => {
  test('debería retornar 5 para una inversión de 10000 con retorno anual de 2000', () => {
    expect(calculatePaybackPeriod(10000, 2000)).toBeCloseTo(5, 2);
  });

  test('debería retornar 2.5 para una inversión de 5000 con retorno anual de 2000', () => {
    expect(calculatePaybackPeriod(5000, 2000)).toBeCloseTo(2.5, 2);
  });

  test('debería retornar Infinity cuando el retorno anual es 0', () => {
    expect(calculatePaybackPeriod(10000, 0)).toBe(Infinity);
  });

  test('debería retornar Infinity cuando el retorno anual es negativo', () => {
    expect(calculatePaybackPeriod(10000, -500)).toBe(Infinity);
  });

  test('debería retornar 1 cuando el retorno anual es igual a la inversión', () => {
    expect(calculatePaybackPeriod(3000, 3000)).toBeCloseTo(1, 2);
  });
});

// ---------------------------------------------------------------------------
// calculateRuleOf72
// ---------------------------------------------------------------------------

describe('calculateRuleOf72', () => {
  test('debería retornar 9 años para una tasa del 8%', () => {
    // Test crítico: si la fórmula está invertida (rate/72), daría 0.111
    expect(calculateRuleOf72(8)).toBeCloseTo(9, 2);
  });

  test('debería retornar 12 años para una tasa del 6%', () => {
    expect(calculateRuleOf72(6)).toBeCloseTo(12, 2);
  });

  test('debería retornar 1 año para una tasa del 72%', () => {
    expect(calculateRuleOf72(72)).toBeCloseTo(1, 2);
  });

  test('debería retornar 7.2 años para una tasa del 10%', () => {
    expect(calculateRuleOf72(10)).toBeCloseTo(7.2, 2);
  });

  test('debería retornar un número mayor a 1 para tasas menores al 72%', () => {
    expect(calculateRuleOf72(9)).toBeGreaterThan(1);
  });
});

// ---------------------------------------------------------------------------
// calculateBreakEven
// ---------------------------------------------------------------------------

describe('calculateBreakEven', () => {
  test('debería retornar 500 unidades para costos fijos 10000, precio 50, variable 30', () => {
    // Test crítico: sin restar el costo variable, daría solo 200 (10000/50)
    expect(calculateBreakEven(10000, 50, 30)).toBe(500);
  });

  test('debería retornar Infinity cuando el margen de contribución es 0', () => {
    expect(calculateBreakEven(10000, 30, 30)).toBe(Infinity);
  });

  test('debería retornar Infinity cuando el costo variable supera al precio', () => {
    expect(calculateBreakEven(10000, 20, 30)).toBe(Infinity);
  });

  test('debería redondear hacia arriba (Math.ceil) para cubrir el costo completo', () => {
    // 1000 / (15 - 8) = 1000/7 ≈ 142.857 → debe ser 143
    expect(calculateBreakEven(1000, 15, 8)).toBe(143);
  });

  test('debería ser exacto cuando la división no tiene residuo', () => {
    // 6000 / (25 - 10) = 6000/15 = 400 exacto
    expect(calculateBreakEven(6000, 25, 10)).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// calculateVolatility
// ---------------------------------------------------------------------------

describe('calculateVolatility', () => {
  test('debería retornar 0 para un arreglo vacío', () => {
    expect(calculateVolatility([])).toBe(0);
  });

  test('debería retornar 0 para un arreglo de un solo elemento', () => {
    expect(calculateVolatility([15])).toBe(0);
  });

  test('debería retornar ~6.6833 para los retornos [10, -5, 8, 3] (desviación muestral)', () => {
    expect(calculateVolatility([10, -5, 8, 3])).toBeCloseTo(6.6833, 3);
  });

  test('debería retornar ~2.1381 para [2,4,4,4,5,5,7,9] (divisor n-1, NO n)', () => {
    // Test crítico: con divisor n (poblacional) daría exactamente 2.0
    // Con divisor n-1 (muestral, correcto) da ~2.1381
    expect(calculateVolatility([2, 4, 4, 4, 5, 5, 7, 9])).toBeCloseTo(2.1381, 3);
  });

  test('debería retornar 0 cuando todos los retornos son iguales', () => {
    expect(calculateVolatility([5, 5, 5, 5])).toBeCloseTo(0, 4);
  });

  test('debería retornar un valor mayor al resultado poblacional (n vs n-1)', () => {
    // La desviación muestral (n-1) siempre es mayor que la poblacional (n)
    const data = [2, 4, 4, 4, 5, 5, 7, 9];
    const volatility = calculateVolatility(data);
    // Desviación poblacional exacta es 2.0; la muestral debe superarla
    expect(volatility).toBeGreaterThan(2.0);
  });
});

// ---------------------------------------------------------------------------
// getPortfolioWeights
// ---------------------------------------------------------------------------

describe('getPortfolioWeights', () => {
  test('debería retornar un objeto por cada inversión', () => {
    const weights = getPortfolioWeights(portfolio);
    expect(weights).toHaveLength(3);
  });

  test('debería retornar el peso correcto para cada inversión', () => {
    // inv1=1000, inv2=2000, inv3=500 → total=3500
    const weights = getPortfolioWeights(portfolio);
    const w1 = weights.find((w) => w.name === 'Acciones Tech');
    const w2 = weights.find((w) => w.name === 'Bonos Estado');
    const w3 = weights.find((w) => w.name === 'Fondo Índice');
    expect(w1.weight).toBeCloseTo((1000 / 3500) * 100, 1);
    expect(w2.weight).toBeCloseTo((2000 / 3500) * 100, 1);
    expect(w3.weight).toBeCloseTo((500 / 3500) * 100, 1);
  });

  test('debería retornar 25% para una inversión de 500 en un portafolio total de 2000', () => {
    const invA = new Investment('A', 500, 600, 1);
    const invB = new Investment('B', 1500, 1800, 1);
    const weights = getPortfolioWeights([invA, invB]);
    const wA = weights.find((w) => w.name === 'A');
    expect(wA.weight).toBeCloseTo(25, 2);
  });

  test('los pesos deberían sumar aproximadamente 100%', () => {
    const weights = getPortfolioWeights(portfolio);
    const total = weights.reduce((sum, w) => sum + w.weight, 0);
    expect(total).toBeCloseTo(100, 1);
  });

  test('debería retornar 100% para un portafolio con una sola inversión', () => {
    const weights = getPortfolioWeights([inv1]);
    expect(weights[0].weight).toBeCloseTo(100, 2);
  });
});

// ---------------------------------------------------------------------------
// calculatePortfolioROI
// ---------------------------------------------------------------------------

describe('calculatePortfolioROI', () => {
  test('debería calcular el ROI global ponderado del portafolio', () => {
    // inv1: 1000→1500, inv2: 2000→2200, inv3: 500→350
    // totalInitial=3500, totalFinal=4050 → ROI=(4050-3500)/3500*100 ≈ 15.71%
    expect(calculatePortfolioROI(portfolio)).toBeCloseTo(15.71, 1);
  });

  test('debería retornar 0% cuando los valores iniciales y finales son iguales', () => {
    const flat = [
      new Investment('A', 1000, 1000, 1),
      new Investment('B', 2000, 2000, 1),
    ];
    expect(calculatePortfolioROI(flat)).toBeCloseTo(0, 2);
  });

  test('debería reflejar el ROI negativo de inversiones con pérdidas globales', () => {
    const losing = [
      new Investment('A', 1000, 800, 1),
      new Investment('B', 2000, 1500, 1),
    ];
    expect(calculatePortfolioROI(losing)).toBeLessThan(0);
  });

  test('debería coincidir con calculateROI directo para un portafolio de una sola inversión', () => {
    const roi = calculatePortfolioROI([inv1]);
    expect(roi).toBeCloseTo(calculateROI(1000, 1500), 2);
  });
});

// ---------------------------------------------------------------------------
// filterByMinROI
// ---------------------------------------------------------------------------

describe('filterByMinROI', () => {
  test('debería incluir inversiones con ROI exactamente igual al mínimo (>=)', () => {
    // inv1 ROI = 50%; filtrar por minROI=50 debe incluirla
    const result = filterByMinROI(portfolio, 50);
    expect(result).toContain(inv1);
  });

  test('debería excluir inversiones con ROI por debajo del mínimo', () => {
    // inv3 ROI = -30%; no debe aparecer con minROI=0
    const result = filterByMinROI(portfolio, 0);
    expect(result).not.toContain(inv3);
  });

  test('debería retornar todas las inversiones cuando el mínimo es muy bajo', () => {
    const result = filterByMinROI(portfolio, -100);
    expect(result).toHaveLength(3);
  });

  test('debería retornar un arreglo vacío cuando ninguna inversión supera el mínimo', () => {
    const result = filterByMinROI(portfolio, 200);
    expect(result).toHaveLength(0);
  });

  test('debería incluir solo las inversiones con ganancia cuando minROI=0', () => {
    // inv1 (50%) e inv2 (10%) pasan; inv3 (-30%) no
    const result = filterByMinROI(portfolio, 0);
    expect(result).toHaveLength(2);
    expect(result).toContain(inv1);
    expect(result).toContain(inv2);
  });
});

// ---------------------------------------------------------------------------
// rankByROI
// ---------------------------------------------------------------------------

describe('rankByROI', () => {
  test('debería ordenar las inversiones de mayor a menor ROI (descendente)', () => {
    // inv1 ROI=50%, inv2 ROI=10%, inv3 ROI=-30%
    const ranked = rankByROI(portfolio);
    expect(ranked[0].name).toBe('Acciones Tech');
    expect(ranked[1].name).toBe('Bonos Estado');
    expect(ranked[2].name).toBe('Fondo Índice');
  });

  test('debería poner el ROI más alto en el primer lugar', () => {
    const ranked = rankByROI(portfolio);
    expect(ranked[0].getROI()).toBeGreaterThanOrEqual(ranked[1].getROI());
  });

  test('debería poner el ROI más bajo en el último lugar', () => {
    const ranked = rankByROI(portfolio);
    const last = ranked[ranked.length - 1];
    expect(last.getROI()).toBeLessThanOrEqual(ranked[0].getROI());
  });

  test('debería ordenar correctamente: [50%, -10%, 30%] → [50%, 30%, -10%]', () => {
    // Test crítico: orden ascendente daría [-10%, 30%, 50%]
    const invA = new Investment('A', 1000, 1500, 1); // ROI 50%
    const invB = new Investment('B', 1000, 900, 1);  // ROI -10%
    const invC = new Investment('C', 1000, 1300, 1); // ROI 30%
    const ranked = rankByROI([invA, invB, invC]);
    expect(ranked[0].name).toBe('A');
    expect(ranked[1].name).toBe('C');
    expect(ranked[2].name).toBe('B');
  });

  test('no debería modificar el arreglo original', () => {
    const original = [inv1, inv2, inv3];
    const originalOrder = original.map((i) => i.name);
    rankByROI(original);
    expect(original.map((i) => i.name)).toEqual(originalOrder);
  });

  test('debería retornar un arreglo con la misma cantidad de elementos', () => {
    const ranked = rankByROI(portfolio);
    expect(ranked).toHaveLength(portfolio.length);
  });
});

// ---------------------------------------------------------------------------
// getInvestmentStats
// ---------------------------------------------------------------------------

describe('getInvestmentStats', () => {
  test('debería retornar todos los campos en 0 para un arreglo vacío', () => {
    const stats = getInvestmentStats([]);
    expect(stats.count).toBe(0);
    expect(stats.totalInvested).toBe(0);
    expect(stats.totalValue).toBe(0);
    expect(stats.portfolioROI).toBe(0);
    expect(stats.bestROI).toBe(0);
    expect(stats.worstROI).toBe(0);
    expect(stats.averageROI).toBe(0);
  });

  test('debería contar correctamente la cantidad de inversiones', () => {
    const stats = getInvestmentStats(portfolio);
    expect(stats.count).toBe(3);
  });

  test('debería sumar correctamente el capital total invertido', () => {
    // 1000 + 2000 + 500 = 3500
    const stats = getInvestmentStats(portfolio);
    expect(stats.totalInvested).toBeCloseTo(3500, 2);
  });

  test('debería sumar correctamente el valor total actual', () => {
    // 1500 + 2200 + 350 = 4050
    const stats = getInvestmentStats(portfolio);
    expect(stats.totalValue).toBeCloseTo(4050, 2);
  });

  test('debería calcular el bestROI (máximo) correctamente', () => {
    // inv1=50%, inv2=10%, inv3=-30% → mejor es 50%
    const stats = getInvestmentStats(portfolio);
    expect(stats.bestROI).toBeCloseTo(50, 2);
  });

  test('debería calcular el worstROI (mínimo) correctamente', () => {
    // -30%
    const stats = getInvestmentStats(portfolio);
    expect(stats.worstROI).toBeCloseTo(-30, 2);
  });

  test('debería calcular el averageROI correctamente', () => {
    // (50 + 10 + -30) / 3 ≈ 10%
    const stats = getInvestmentStats(portfolio);
    expect(stats.averageROI).toBeCloseTo(10, 2);
  });

  test('debería calcular el portfolioROI como ROI global ponderado', () => {
    // totalInitial=3500, totalFinal=4050 → ~15.71%
    const stats = getInvestmentStats(portfolio);
    expect(stats.portfolioROI).toBeCloseTo(15.71, 1);
  });

  test('debería funcionar correctamente con un portafolio de una sola inversión', () => {
    const stats = getInvestmentStats([inv1]);
    expect(stats.count).toBe(1);
    expect(stats.bestROI).toBeCloseTo(50, 2);
    expect(stats.worstROI).toBeCloseTo(50, 2);
    expect(stats.averageROI).toBeCloseTo(50, 2);
  });
});

// ---------------------------------------------------------------------------
// Clase Investment
// ---------------------------------------------------------------------------

describe('Clase Investment', () => {
  test('debería almacenar correctamente los datos de la inversión', () => {
    const inv = new Investment('Test', 1000, 1500, 2);
    expect(inv.name).toBe('Test');
    expect(inv.initialValue).toBe(1000);
    expect(inv.finalValue).toBe(1500);
    expect(inv.years).toBe(2);
  });

  test('getROI() debería retornar 50% para una inversión de 1000→1500', () => {
    const inv = new Investment('A', 1000, 1500, 2);
    expect(inv.getROI()).toBeCloseTo(50, 4);
  });

  test('getROI() debería retornar 100% al duplicar el capital (no 50%)', () => {
    // Test crítico: verifica que Investment.getROI() delega correctamente a calculateROI
    const inv = new Investment('B', 1000, 2000, 1);
    expect(inv.getROI()).toBeCloseTo(100, 4);
  });

  test('getROI() debería retornar ROI negativo para inversiones con pérdida', () => {
    const inv = new Investment('C', 1000, 800, 1);
    expect(inv.getROI()).toBeCloseTo(-20, 4);
  });

  test('getCAGR() debería coincidir con calculateCAGR aplicado a los mismos valores', () => {
    const inv = new Investment('D', 1000, 1500, 5);
    expect(inv.getCAGR()).toBeCloseTo(calculateCAGR(1000, 1500, 5), 4);
  });

  test('getCAGR() debería retornar ~8.4472% para 1000→1500 en 5 años', () => {
    const inv = new Investment('E', 1000, 1500, 5);
    expect(inv.getCAGR()).toBeCloseTo(8.4472, 3);
  });

  test('getAnnualizedROI() debería retornar un valor coherente con getROI() y los años', () => {
    const inv = new Investment('F', 1000, 2000, 2);
    // ROI total = 100%, anualizado en 2 años ≈ 41.4214%
    expect(inv.getAnnualizedROI()).toBeCloseTo(41.4214, 3);
  });

  test('toString() debería incluir el nombre, valores y duración', () => {
    const inv = new Investment('Tech', 1000, 1500, 2);
    const str = inv.toString();
    expect(str).toContain('Tech');
    expect(str).toContain('1000');
    expect(str).toContain('1500');
    expect(str).toContain('2');
  });
});
