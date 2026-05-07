/**
 * investment-calculator.js
 *
 * A collection of financial functions for evaluating and comparing investments.
 * Covers compound and simple interest, future and present value, ROI, CAGR,
 * inflation-adjusted returns, portfolio weighting, and investment ranking/filtering.
 *
 * Precisión de redondeo según tipo de resultado:
 *   - Montos monetarios (compoundInterest, simpleInterest, futureValue, presentValue): 4 decimales
 *   - Porcentajes (roi): 4 decimales
 *   - Tasas decimales (annualizedReturn, inflationAdjustedReturn, portfolioReturn): 6 decimales
 * Rate inputs are expressed as decimals (e.g., 5% → 0.05), except ruleOf72
 * which expects a percentage value (e.g., 6 for 6%).
 */

// ---------------------------------------------------------------------------
// Utilidad interna de redondeo
// ---------------------------------------------------------------------------

/**
 * Rounds a number to the given number of decimal places.
 * @param {number} value
 * @param {number} decimals
 * @returns {number}
 */
function roundTo(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

// ---------------------------------------------------------------------------
// compoundInterest
// ---------------------------------------------------------------------------

/**
 * Calculates the total amount after compound interest.
 *
 * Formula: A = principal * (1 + rate/n)^(n*t)
 *
 * @param {number} principal  - Monto inicial (debe ser > 0)
 * @param {number} rate       - Tasa de interés anual como decimal (debe ser >= 0)
 * @param {number} n          - Número de capitalizaciones por año (debe ser > 0)
 * @param {number} t          - Número de años (debe ser > 0)
 * @returns {number} Monto total redondeado a 2 decimales
 */
function compoundInterest(principal, rate, n, t) {
  if (principal <= 0) {
    throw new Error('El principal debe ser mayor que cero.');
  }
  if (rate < 0) {
    throw new Error('La tasa de interés no puede ser negativa.');
  }
  if (n <= 0) {
    throw new Error('El número de capitalizaciones por año debe ser mayor que cero.');
  }
  if (t <= 0) {
    throw new Error('El número de años debe ser mayor que cero.');
  }

  const amount = principal * Math.pow(1 + rate / n, n * t);
  return roundTo(amount, 4);
}

// ---------------------------------------------------------------------------
// simpleInterest
// ---------------------------------------------------------------------------

/**
 * Calculates only the interest earned (not the total amount) using simple interest.
 *
 * Formula: Interest = principal * rate * years
 *
 * @param {number} principal  - Monto inicial (debe ser > 0)
 * @param {number} rate       - Tasa de interés anual como decimal
 * @param {number} years      - Número de años
 * @returns {number} Interés ganado redondeado a 2 decimales
 */
function simpleInterest(principal, rate, years) {
  if (principal <= 0) {
    throw new Error('El principal debe ser mayor que cero.');
  }

  // Retorna solo el interés, no el monto total (principal + interés)
  const interest = principal * rate * years;
  return roundTo(interest, 2);
}

// ---------------------------------------------------------------------------
// futureValue
// ---------------------------------------------------------------------------

/**
 * Calculates the future value of an investment with optional periodic payments (annuity).
 *
 * Formula (rate != 0):
 *   FV = principal * (1 + rate)^years + periodicPayment * [((1 + rate)^years - 1) / rate]
 *
 * Formula (rate === 0):
 *   FV = principal + periodicPayment * years
 *
 * @param {number} principal         - Monto inicial (debe ser >= 0)
 * @param {number} rate              - Tasa de interés anual como decimal
 * @param {number} years             - Número de años (debe ser > 0)
 * @param {number} [periodicPayment=0] - Pago periódico al final de cada período
 * @returns {number} Valor futuro redondeado a 2 decimales
 */
function futureValue(principal, rate, years, periodicPayment = 0) {
  // Cero es válido: permite calcular el valor futuro de solo los pagos periódicos (anualidad pura)
  if (principal < 0) {
    throw new Error('El principal no puede ser negativo.');
  }
  if (years <= 0) {
    throw new Error('El número de años debe ser mayor que cero.');
  }

  if (rate === 0) {
    return roundTo(principal + periodicPayment * years, 4);
  }

  const growthFactor = Math.pow(1 + rate, years);
  // Factor de anualidad: acumulación de pagos periódicos
  const annuityFactor = (growthFactor - 1) / rate;
  const fv = principal * growthFactor + periodicPayment * annuityFactor;
  return roundTo(fv, 4);
}

// ---------------------------------------------------------------------------
// presentValue
// ---------------------------------------------------------------------------

/**
 * Calculates the present value of a future amount discounted at a given rate.
 *
 * Formula: PV = futureAmount / (1 + rate)^years
 *
 * @param {number} futureAmount - Monto futuro (debe ser > 0)
 * @param {number} rate         - Tasa de descuento anual como decimal
 * @param {number} years        - Número de años (debe ser > 0)
 * @returns {number} Valor presente redondeado a 2 decimales
 */
function presentValue(futureAmount, rate, years) {
  if (futureAmount <= 0) {
    throw new Error('El monto futuro debe ser mayor que cero.');
  }
  if (years <= 0) {
    throw new Error('El número de años debe ser mayor que cero.');
  }

  const pv = futureAmount / Math.pow(1 + rate, years);
  return roundTo(pv, 4);
}

// ---------------------------------------------------------------------------
// ruleOf72
// ---------------------------------------------------------------------------

/**
 * Estimates the number of years required to double an investment using the Rule of 72.
 *
 * Formula: years = 72 / annualRatePercent
 *
 * @param {number} annualRatePercent - Tasa anual expresada como porcentaje (e.g., 6 para 6%)
 * @returns {number} Años aproximados para duplicar la inversión
 */
function ruleOf72(annualRatePercent) {
  if (annualRatePercent <= 0) {
    throw new Error('La tasa anual debe ser mayor que cero.');
  }

  return 72 / annualRatePercent;
}

// ---------------------------------------------------------------------------
// roi
// ---------------------------------------------------------------------------

/**
 * Calculates the Return on Investment (ROI) as a percentage.
 *
 * Formula: ROI = (finalValue - initialInvestment) / initialInvestment * 100
 *
 * @param {number} initialInvestment - Valor inicial de la inversión (debe ser > 0)
 * @param {number} finalValue        - Valor final de la inversión
 * @returns {number} ROI como porcentaje, redondeado a 4 decimales
 */
function roi(initialInvestment, finalValue) {
  if (initialInvestment <= 0) {
    throw new Error('La inversión inicial debe ser mayor que cero.');
  }

  const result = (finalValue - initialInvestment) / initialInvestment * 100;

  return roundTo(result, 4);
}

// ---------------------------------------------------------------------------
// annualizedReturn
// ---------------------------------------------------------------------------

/**
 * Calculates the Compound Annual Growth Rate (CAGR) of an investment.
 *
 * Formula: CAGR = (finalValue / initialValue)^(1/years) - 1
 *
 * @param {number} initialValue - Valor inicial de la inversión (debe ser > 0)
 * @param {number} finalValue   - Valor final de la inversión
 * @param {number} years        - Número de años del período (debe ser > 0)
 * @returns {number} CAGR como decimal, redondeado a 6 decimales
 */
function annualizedReturn(initialValue, finalValue, years) {
  if (initialValue <= 0) {
    throw new Error('El valor inicial debe ser mayor que cero.');
  }
  if (years <= 0) {
    throw new Error('El número de años debe ser mayor que cero.');
  }

  const cagr = Math.pow(finalValue / initialValue, 1 / years) - 1;
  return roundTo(cagr, 6);
}

// ---------------------------------------------------------------------------
// inflationAdjustedReturn
// ---------------------------------------------------------------------------

/**
 * Calculates the real (inflation-adjusted) return using the Fisher equation.
 *
 * Formula: realReturn = (1 + nominalRate) / (1 + inflationRate) - 1
 *
 * @param {number} nominalRate    - Retorno nominal como decimal
 * @param {number} inflationRate  - Tasa de inflación como decimal (no puede ser -1)
 * @returns {number} Retorno real redondeado a 6 decimales
 */
function inflationAdjustedReturn(nominalRate, inflationRate) {
  if (inflationRate === -1) {
    throw new Error('La tasa de inflación no puede ser -1 (división por cero).');
  }

  // Ecuación de Fisher: descuenta el efecto de la inflación del retorno nominal
  const realReturn = (1 + nominalRate) / (1 + inflationRate) - 1;
  return roundTo(realReturn, 6);
}

// ---------------------------------------------------------------------------
// portfolioReturn
// ---------------------------------------------------------------------------

/**
 * Calculates the weighted average return of a portfolio of holdings.
 *
 * Each holding must have: { value: number, annualReturn: number }
 * The weight of each holding is proportional to its value relative to the total.
 *
 * @param {Array<{value: number, annualReturn: number}>} holdings - Activos del portafolio
 * @returns {number} Retorno ponderado del portafolio, redondeado a 6 decimales
 */
function portfolioReturn(holdings) {
  if (holdings.length === 0) {
    throw new Error('El portafolio no puede estar vacío.');
  }

  // Verificar que ningún activo tenga un valor cero o negativo
  const hasInvalidValue = holdings.some((h) => h.value <= 0);
  if (hasInvalidValue) {
    throw new Error('Todos los valores de los activos deben ser mayores que cero.');
  }

  // Acumular valor total y suma ponderada en una sola pasada
  const { totalValue, weightedSum } = holdings.reduce(
    (acc, holding) => ({
      totalValue: acc.totalValue + holding.value,
      weightedSum: acc.weightedSum + holding.value * holding.annualReturn,
    }),
    { totalValue: 0, weightedSum: 0 }
  );

  return roundTo(weightedSum / totalValue, 6);
}

// ---------------------------------------------------------------------------
// rankInvestments
// ---------------------------------------------------------------------------

/**
 * Returns a new array of investments sorted from highest to lowest ROI.
 * Does NOT mutate the original array.
 *
 * Each investment must have: { name: string, initialValue: number, finalValue: number }
 *
 * @param {Array<{name: string, initialValue: number, finalValue: number}>} investments
 * @returns {Array} Nuevo arreglo ordenado por ROI descendente
 */
function rankInvestments(investments) {
  // Schwartzian transform: pre-computa el ROI una vez por elemento para evitar
  // recalcularlo O(n log n) veces durante la comparación del sort.
  return investments
    .map((inv) => ({ inv, score: roi(inv.initialValue, inv.finalValue) }))
    .sort((a, b) => b.score - a.score)
    .map(({ inv }) => inv);
}

// ---------------------------------------------------------------------------
// filterByMinROI
// ---------------------------------------------------------------------------

/**
 * Returns only the investments whose ROI meets or exceeds the minimum threshold.
 *
 * @param {Array<{name: string, initialValue: number, finalValue: number}>} investments
 * @param {number} minROI - Umbral mínimo de ROI como porcentaje (e.g., 15 para 15%)
 * @returns {Array} Inversiones que cumplen o superan el umbral mínimo
 */
function filterByMinROI(investments, minROI) {
  return investments.filter(
    (inv) => roi(inv.initialValue, inv.finalValue) >= minROI
  );
}

// ---------------------------------------------------------------------------
// Exportaciones
// ---------------------------------------------------------------------------

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    compoundInterest,
    simpleInterest,
    futureValue,
    presentValue,
    ruleOf72,
    roi,
    annualizedReturn,
    inflationAdjustedReturn,
    portfolioReturn,
    rankInvestments,
    filterByMinROI,
  };
}
