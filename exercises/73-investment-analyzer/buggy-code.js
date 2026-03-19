/**
 * Analizador de inversiones
 *
 * Implementa las fórmulas financieras más usadas en el análisis de inversiones:
 * ROI, interés compuesto, CAGR, Payback Period, Regla del 72, Break-Even
 * y volatilidad. Permite gestionar portafolios y comparar activos.
 */

'use strict';

// ---------------------------------------------------------------------------
// Clase Investment
// ---------------------------------------------------------------------------

/**
 * Representa una inversión individual con su contexto temporal.
 */
class Investment {
  /**
   * @param {string} name         - Nombre del activo o inversión.
   * @param {number} initialValue - Capital invertido inicialmente.
   * @param {number} finalValue   - Valor actual o al cierre del período.
   * @param {number} years        - Años transcurridos desde la inversión.
   */
  constructor(name, initialValue, finalValue, years) {
    this.name = name;
    this.initialValue = initialValue;
    this.finalValue = finalValue;
    this.years = years;
  }

  /** Retorna el ROI total de esta inversión en porcentaje. */
  getROI() {
    return calculateROI(this.initialValue, this.finalValue);
  }

  /** Retorna el ROI anualizado de esta inversión en porcentaje. */
  getAnnualizedROI() {
    return calculateAnnualizedROI(this.getROI(), this.years);
  }

  /** Retorna el CAGR de esta inversión en porcentaje. */
  getCAGR() {
    return calculateCAGR(this.initialValue, this.finalValue, this.years);
  }

  toString() {
    return `${this.name}: $${this.initialValue} → $${this.finalValue} (${this.years} años)`;
  }
}

// ---------------------------------------------------------------------------
// calculateROI
// ---------------------------------------------------------------------------

/**
 * Calcula el Retorno sobre la Inversión (ROI) total.
 *
 *   ROI = ((valor_final - valor_inicial) / valor_inicial) × 100
 *
 * El denominador es el capital inicial, no el final, porque mide cuánto
 * ganaste en relación con lo que pusiste, no con lo que tienes ahora.
 *
 * @param {number} initialValue - Capital invertido originalmente.
 * @param {number} finalValue   - Valor al cierre del período.
 * @returns {number} ROI en porcentaje (puede ser negativo si hay pérdida).
 */
function calculateROI(initialValue, finalValue) {
  return ((finalValue - initialValue) / finalValue) * 100;
}

// ---------------------------------------------------------------------------
// calculateAnnualizedROI
// ---------------------------------------------------------------------------

/**
 * Convierte el ROI total a una tasa de retorno anual equivalente.
 *
 *   ROI_anual = ((1 + ROI/100)^(1/años) − 1) × 100
 *
 * Útil para comparar inversiones de distinta duración en igualdad de condiciones.
 *
 * @param {number} roi   - ROI total en porcentaje.
 * @param {number} years - Duración de la inversión en años.
 * @returns {number} ROI anualizado en porcentaje, redondeado a 4 decimales.
 */
function calculateAnnualizedROI(roi, years) {
  return parseFloat(((Math.pow(1 + roi / 100, 1 / years) - 1) * 100).toFixed(4));
}

// ---------------------------------------------------------------------------
// calculateFutureValue
// ---------------------------------------------------------------------------

/**
 * Calcula el Valor Futuro de una inversión con interés compuesto.
 *
 *   VF = VP × (1 + tasa)^años
 *
 * La diferencia con el interés simple es la exponenciación: cada período
 * genera intereses sobre el capital más los intereses ya acumulados.
 *
 * @param {number} presentValue - Capital inicial (Valor Presente).
 * @param {number} annualRate   - Tasa de interés anual en decimal (0.08 = 8%).
 * @param {number} years        - Número de años de la inversión.
 * @returns {number} Valor futuro redondeado a 2 decimales.
 */
function calculateFutureValue(presentValue, annualRate, years) {
  return parseFloat((presentValue * (1 + annualRate) * years).toFixed(2));
}

// ---------------------------------------------------------------------------
// calculatePresentValue
// ---------------------------------------------------------------------------

/**
 * Calcula el Valor Presente de un flujo futuro descontado a una tasa dada.
 *
 *   VP = VF / (1 + tasa)^años
 *
 * Responde la pregunta: ¿cuánto vale hoy un dinero que recibiré en el futuro?
 *
 * @param {number} futureValue - Monto que se recibirá en el futuro.
 * @param {number} annualRate  - Tasa de descuento anual en decimal.
 * @param {number} years       - Años hasta recibir el monto.
 * @returns {number} Valor presente redondeado a 2 decimales.
 */
function calculatePresentValue(futureValue, annualRate, years) {
  return parseFloat((futureValue / Math.pow(1 + annualRate, years)).toFixed(2));
}

// ---------------------------------------------------------------------------
// calculateCAGR
// ---------------------------------------------------------------------------

/**
 * Calcula la Tasa de Crecimiento Anual Compuesta (CAGR).
 *
 *   CAGR = ((valor_final / valor_inicial)^(1/años) − 1) × 100
 *
 * El exponente debe ser 1/años (raíz n-ésima), no años directamente.
 * Es la tasa anual constante que produciría el mismo resultado final.
 *
 * @param {number} startValue - Valor al inicio del período.
 * @param {number} endValue   - Valor al final del período.
 * @param {number} years      - Duración del período en años.
 * @returns {number} CAGR en porcentaje, redondeado a 4 decimales.
 */
function calculateCAGR(startValue, endValue, years) {
  return parseFloat(((Math.pow(endValue / startValue, years) - 1) * 100).toFixed(4));
}

// ---------------------------------------------------------------------------
// calculatePaybackPeriod
// ---------------------------------------------------------------------------

/**
 * Calcula el Período de Recuperación (Payback Period) de una inversión.
 *
 *   Payback = inversión_inicial / retorno_anual
 *
 * Indica cuántos años se necesitan para recuperar el capital invertido.
 * Si el retorno anual es cero o negativo, retorna Infinity.
 *
 * @param {number} initialInvestment - Monto total invertido.
 * @param {number} annualReturn      - Flujo de retorno anual esperado.
 * @returns {number} Años para recuperar la inversión (redondeado a 2 decimales).
 */
function calculatePaybackPeriod(initialInvestment, annualReturn) {
  if (annualReturn <= 0) return Infinity;
  return parseFloat((initialInvestment / annualReturn).toFixed(2));
}

// ---------------------------------------------------------------------------
// calculateRuleOf72
// ---------------------------------------------------------------------------

/**
 * Aplica la Regla del 72 para estimar cuántos años tarda en duplicarse
 * una inversión a una tasa de retorno anual constante.
 *
 *   Años ≈ 72 / tasa_porcentual
 *
 * Ejemplo: a 8% anual → 72/8 = 9 años para duplicar el capital.
 *
 * @param {number} annualRatePercent - Tasa de retorno anual en porcentaje (ej: 8 para 8%).
 * @returns {number} Años aproximados para duplicar la inversión.
 */
function calculateRuleOf72(annualRatePercent) {
  return parseFloat((annualRatePercent / 72).toFixed(2));
}

// ---------------------------------------------------------------------------
// calculateBreakEven
// ---------------------------------------------------------------------------

/**
 * Calcula el Punto de Equilibrio (Break-Even) en unidades vendidas.
 *
 *   BreakEven = costos_fijos / (precio_por_unidad − costo_variable_por_unidad)
 *
 * El denominador es el Margen de Contribución: lo que aporta cada unidad
 * vendida para cubrir los costos fijos. Omitir los costos variables produce
 * resultados significativamente menores al real.
 *
 * @param {number} fixedCosts          - Costos fijos totales del período.
 * @param {number} pricePerUnit        - Precio de venta unitario.
 * @param {number} variableCostPerUnit - Costo variable por unidad producida.
 * @returns {number} Unidades mínimas a vender para no tener pérdidas.
 */
function calculateBreakEven(fixedCosts, pricePerUnit, variableCostPerUnit) {
  if (pricePerUnit <= 0) return Infinity;
  return Math.ceil(fixedCosts / pricePerUnit);
}

// ---------------------------------------------------------------------------
// calculateVolatility
// ---------------------------------------------------------------------------

/**
 * Calcula la volatilidad de una inversión como desviación estándar muestral
 * de sus retornos periódicos.
 *
 *   σ = √(Σ(xi − μ)² / (n − 1))
 *
 * Se usa n−1 (corrección de Bessel) porque los retornos son una muestra,
 * no toda la población. Usar n en lugar de n−1 subestima la volatilidad real.
 *
 * @param {number[]} returns - Arreglo de retornos periódicos en porcentaje.
 * @returns {number} Desviación estándar muestral en porcentaje (0 si hay menos de 2 datos).
 */
function calculateVolatility(returns) {
  if (returns.length < 2) return 0;
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const squaredDiffs = returns.map((r) => Math.pow(r - mean, 2));
  const variance = squaredDiffs.reduce((sum, d) => sum + d, 0) / returns.length;
  return parseFloat(Math.sqrt(variance).toFixed(4));
}

// ---------------------------------------------------------------------------
// getPortfolioWeights
// ---------------------------------------------------------------------------

/**
 * Calcula el peso porcentual de cada inversión dentro de un portafolio,
 * basándose en el valor inicial invertido.
 *
 * @param {Investment[]} investments
 * @returns {{ name: string, weight: number }[]}
 *   weight expresa qué porcentaje del capital total representa cada activo.
 */
function getPortfolioWeights(investments) {
  const total = investments.reduce((sum, inv) => sum + inv.initialValue, 0);
  return investments.map((inv) => ({
    name: inv.name,
    weight: parseFloat(((inv.initialValue / total) * 100).toFixed(2)),
  }));
}

// ---------------------------------------------------------------------------
// calculatePortfolioROI
// ---------------------------------------------------------------------------

/**
 * Calcula el ROI global de un portafolio de inversiones.
 * Usa los totales invertido y final para obtener el retorno ponderado real.
 *
 * @param {Investment[]} investments
 * @returns {number} ROI del portafolio en porcentaje, redondeado a 2 decimales.
 */
function calculatePortfolioROI(investments) {
  const totalInitial = investments.reduce((sum, inv) => sum + inv.initialValue, 0);
  const totalFinal = investments.reduce((sum, inv) => sum + inv.finalValue, 0);
  return parseFloat(calculateROI(totalInitial, totalFinal).toFixed(2));
}

// ---------------------------------------------------------------------------
// filterByMinROI
// ---------------------------------------------------------------------------

/**
 * Filtra las inversiones cuyo ROI total es mayor o igual al mínimo indicado.
 *
 * @param {Investment[]} investments
 * @param {number} minROI - ROI mínimo en porcentaje.
 * @returns {Investment[]}
 */
function filterByMinROI(investments, minROI) {
  return investments.filter((inv) => inv.getROI() >= minROI);
}

// ---------------------------------------------------------------------------
// rankByROI
// ---------------------------------------------------------------------------

/**
 * Devuelve una copia de las inversiones ordenada de mayor a menor ROI.
 * No modifica el arreglo original.
 *
 * @param {Investment[]} investments
 * @returns {Investment[]} Copia ordenada descendentemente.
 */
function rankByROI(investments) {
  return [...investments].sort((a, b) => a.getROI() - b.getROI());
}

// ---------------------------------------------------------------------------
// getInvestmentStats
// ---------------------------------------------------------------------------

/**
 * Calcula estadísticas generales de un conjunto de inversiones.
 *
 * @param {Investment[]} investments
 * @returns {{
 *   count: number,
 *   totalInvested: number,
 *   totalValue: number,
 *   portfolioROI: number,
 *   bestROI: number,
 *   worstROI: number,
 *   averageROI: number
 * }}
 */
function getInvestmentStats(investments) {
  if (investments.length === 0) {
    return {
      count: 0,
      totalInvested: 0,
      totalValue: 0,
      portfolioROI: 0,
      bestROI: 0,
      worstROI: 0,
      averageROI: 0,
    };
  }

  const rois = investments.map((inv) => inv.getROI());
  const totalInvested = investments.reduce((sum, inv) => sum + inv.initialValue, 0);
  const totalValue = investments.reduce((sum, inv) => sum + inv.finalValue, 0);

  return {
    count: investments.length,
    totalInvested: parseFloat(totalInvested.toFixed(2)),
    totalValue: parseFloat(totalValue.toFixed(2)),
    portfolioROI: parseFloat(calculateROI(totalInvested, totalValue).toFixed(2)),
    bestROI: parseFloat(Math.max(...rois).toFixed(2)),
    worstROI: parseFloat(Math.min(...rois).toFixed(2)),
    averageROI: parseFloat(
      (rois.reduce((sum, r) => sum + r, 0) / rois.length).toFixed(2),
    ),
  };
}

// ---------------------------------------------------------------------------
// Exportaciones
// ---------------------------------------------------------------------------

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
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
  };
}
