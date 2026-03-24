/**
 * Calculadora de estadísticas descriptivas
 *
 * Implementa las métricas estadísticas más utilizadas en análisis de datos:
 * tendencia central (media, mediana, moda), dispersión (varianza, desviación
 * estándar, rango, IQR), normalización (z-scores), correlación de Pearson,
 * detección de valores atípicos y distribución de frecuencias.
 */

'use strict';

// ---------------------------------------------------------------------------
// Clase DataStats
// ---------------------------------------------------------------------------

/**
 * Encapsula un conjunto de datos numéricos y expone sus métricas estadísticas.
 */
class DataStats {
  /**
   * @param {string}   label - Nombre descriptivo del conjunto de datos.
   * @param {number[]} data  - Arreglo de valores numéricos.
   */
  constructor(label, data) {
    this.label = label;
    this.data = [...data]; // copia defensiva
  }

  getMean()       { return calculateMean(this.data); }
  getMedian()     { return calculateMedian(this.data); }
  getMode()       { return calculateMode(this.data); }
  getVariance()   { return calculateVariance(this.data); }
  getStdDev()     { return calculateStdDev(this.data); }
  getRange()      { return calculateRange(this.data); }
  getQuartiles()  { return calculateQuartiles(this.data); }
  getIQR()        { return calculateIQR(this.data); }
  getZScores()    { return calculateZScores(this.data); }
  getOutliers()   { return findOutliers(this.data); }

  /**
   * Retorna un resumen con las métricas principales del conjunto.
   * @returns {{ label, count, mean, median, mode, stdDev, range, Q1, Q2, Q3, IQR }}
   */
  getSummary() {
    const { Q1, Q2, Q3 } = calculateQuartiles(this.data);
    return {
      label:   this.label,
      count:   this.data.length,
      mean:    calculateMean(this.data),
      median:  calculateMedian(this.data),
      mode:    calculateMode(this.data),
      stdDev:  calculateStdDev(this.data),
      range:   calculateRange(this.data),
      Q1,
      Q2,
      Q3,
      IQR:     calculateIQR(this.data),
    };
  }
}

// ---------------------------------------------------------------------------
// calculateMean
// ---------------------------------------------------------------------------

/**
 * Calcula la media aritmética de un conjunto de datos.
 *
 *   μ = Σxi / n
 *
 * @param {number[]} data
 * @returns {number} Media redondeada a 4 decimales.
 */
function calculateMean(data) {
  return parseFloat(
    (data.reduce((sum, x) => sum + x, 0) / data.length).toFixed(4),
  );
}

// ---------------------------------------------------------------------------
// calculateMedian
// ---------------------------------------------------------------------------

/**
 * Calcula la mediana de un conjunto de datos.
 *
 * Pasos:
 * 1. Crear una copia ordenada de menor a mayor.
 * 2. Si n es impar, retornar el valor central.
 * 3. Si n es par, retornar el promedio de los dos valores centrales.
 *
 * Ordenar primero es obligatorio: la mediana del conjunto {5,1,3} es 3,
 * no 1 (el elemento central del arreglo sin ordenar).
 *
 * @param {number[]} data
 * @returns {number}
 */
function calculateMedian(data) {
  // CORREGIDO: crear copia y ordenarla antes de buscar el elemento central
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : parseFloat(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(4));
}

// ---------------------------------------------------------------------------
// calculateMode
// ---------------------------------------------------------------------------

/**
 * Calcula la moda: el/los valor(es) que aparece(n) con mayor frecuencia.
 *
 * Si varios valores comparten la frecuencia máxima se retornan todos,
 * ordenados de menor a mayor.
 *
 * @param {number[]} data
 * @returns {number[]} Arreglo con uno o más valores modales.
 */
function calculateMode(data) {
  const freq = data.reduce((acc, x) => {
    acc[x] = (acc[x] || 0) + 1;
    return acc;
  }, {});

  const maxFreq = Math.max(...Object.values(freq));

  // CORREGIDO: usar === para seleccionar solo los valores con frecuencia máxima
  return Object.keys(freq)
    .filter((k) => freq[k] === maxFreq)
    .map(Number)
    .sort((a, b) => a - b);
}

// ---------------------------------------------------------------------------
// calculateVariance
// ---------------------------------------------------------------------------

/**
 * Calcula la varianza muestral de un conjunto de datos.
 *
 *   s² = Σ(xi − μ)² / (n − 1)
 *
 * Se usa n−1 (corrección de Bessel) porque los datos son una muestra de una
 * población mayor. Dividir entre n produciría una subestimación sistemática.
 *
 * @param {number[]} data
 * @returns {number} Varianza muestral redondeada a 4 decimales.
 */
function calculateVariance(data) {
  const mean = calculateMean(data);
  const squaredDiffs = data.map((x) => Math.pow(x - mean, 2));
  // CORREGIDO: dividir entre (n − 1) para varianza muestral
  return parseFloat(
    (squaredDiffs.reduce((sum, d) => sum + d, 0) / (data.length - 1)).toFixed(4),
  );
}

// ---------------------------------------------------------------------------
// calculateStdDev
// ---------------------------------------------------------------------------

/**
 * Calcula la desviación estándar muestral (raíz cuadrada de la varianza muestral).
 *
 * @param {number[]} data
 * @returns {number} Desviación estándar redondeada a 4 decimales.
 */
function calculateStdDev(data) {
  return parseFloat(Math.sqrt(calculateVariance(data)).toFixed(4));
}

// ---------------------------------------------------------------------------
// calculateRange
// ---------------------------------------------------------------------------

/**
 * Calcula el rango estadístico: diferencia entre el valor máximo y el mínimo.
 *
 * @param {number[]} data
 * @returns {number}
 */
function calculateRange(data) {
  return Math.max(...data) - Math.min(...data);
}

// ---------------------------------------------------------------------------
// calculatePercentile
// ---------------------------------------------------------------------------

/**
 * Calcula el percentil p de un conjunto de datos usando interpolación lineal.
 *
 * @param {number[]} data
 * @param {number}   p    - Percentil deseado (0–100).
 * @returns {number} Valor del percentil, redondeado a 4 decimales.
 */
function calculatePercentile(data, p) {
  const sorted = [...data].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return parseFloat(
    (sorted[lower] + (index - lower) * (sorted[upper] - sorted[lower])).toFixed(4),
  );
}

// ---------------------------------------------------------------------------
// calculateQuartiles
// ---------------------------------------------------------------------------

/**
 * Calcula los tres cuartiles del conjunto de datos.
 *
 * @param {number[]} data
 * @returns {{ Q1: number, Q2: number, Q3: number }}
 *   Q1 = percentil 25, Q2 = mediana, Q3 = percentil 75.
 */
function calculateQuartiles(data) {
  return {
    Q1: calculatePercentile(data, 25),
    Q2: calculatePercentile(data, 50),
    Q3: calculatePercentile(data, 75),
  };
}

// ---------------------------------------------------------------------------
// calculateIQR
// ---------------------------------------------------------------------------

/**
 * Calcula el Rango Intercuartílico (IQR = Q3 − Q1).
 * Mide la dispersión del 50% central de los datos.
 *
 * @param {number[]} data
 * @returns {number}
 */
function calculateIQR(data) {
  const { Q1, Q3 } = calculateQuartiles(data);
  return parseFloat((Q3 - Q1).toFixed(4));
}

// ---------------------------------------------------------------------------
// calculateZScores
// ---------------------------------------------------------------------------

/**
 * Estandariza cada valor del conjunto calculando su z-score.
 *
 *   z = (xi − μ) / σ
 *
 * El z-score indica cuántas desviaciones estándar se aleja un dato de la media.
 * Dividir entre la media en lugar de σ produce valores sin significado estadístico.
 *
 * @param {number[]} data
 * @returns {number[]} Arreglo de z-scores redondeados a 4 decimales.
 */
function calculateZScores(data) {
  const mean = calculateMean(data);
  const stdDev = calculateStdDev(data);
  // CORREGIDO: dividir entre stdDev, no entre mean
  return data.map((x) => parseFloat(((x - mean) / stdDev).toFixed(4)));
}

// ---------------------------------------------------------------------------
// calculateCorrelation
// ---------------------------------------------------------------------------

/**
 * Calcula el coeficiente de correlación de Pearson entre dos conjuntos de datos.
 *
 *   r = Σ(xi − μx)(yi − μy) / sqrt(Σ(xi − μx)² · Σ(yi − μy)²)
 *
 * Cada variable debe desviarse respecto a su propia media: xi respecto a μx
 * e yi respecto a μy. Usar la misma media para ambas es un error de copy-paste.
 *
 * @param {number[]} x - Primer conjunto de datos.
 * @param {number[]} y - Segundo conjunto de datos (misma longitud que x).
 * @returns {number} Correlación entre −1 y 1, redondeada a 4 decimales.
 */
function calculateCorrelation(x, y) {
  const meanX = calculateMean(x);
  const meanY = calculateMean(y);

  // CORREGIDO: usar meanY para las desviaciones de y, no meanX
  const numerator = x.reduce(
    (sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY),
    0,
  );
  const denomX = Math.sqrt(
    x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0),
  );
  const denomY = Math.sqrt(
    y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0),
  );

  return parseFloat((numerator / (denomX * denomY)).toFixed(4));
}

// ---------------------------------------------------------------------------
// findOutliers
// ---------------------------------------------------------------------------

/**
 * Detecta valores atípicos (outliers) usando el criterio de Tukey con IQR.
 *
 * Las vallas se calculan como:
 *   Valla inferior = Q1 − 1.5 × IQR
 *   Valla superior = Q3 + 1.5 × IQR
 *
 * Usar Q2 (mediana) en lugar de Q1/Q3 produce vallas incorrectas: demasiado
 * estrechas o anchas según la asimetría de la distribución.
 *
 * @param {number[]} data
 * @returns {number[]} Valores que caen fuera de las vallas de Tukey.
 */
function findOutliers(data) {
  const { Q1, Q3 } = calculateQuartiles(data);
  const iqr = calculateIQR(data);
  // CORREGIDO: usar Q1 para la valla inferior y Q3 para la superior
  const lowerFence = Q1 - 1.5 * iqr;
  const upperFence = Q3 + 1.5 * iqr;
  return data.filter((x) => x < lowerFence || x > upperFence);
}

// ---------------------------------------------------------------------------
// getFrequencyDistribution
// ---------------------------------------------------------------------------

/**
 * Genera la distribución de frecuencias absolutas y relativas del conjunto.
 *
 * @param {number[]} data
 * @returns {{ value: number, count: number, percentage: number }[]}
 *   Ordenado de menor a mayor por valor.
 */
function getFrequencyDistribution(data) {
  const freq = data.reduce((acc, x) => {
    acc[x] = (acc[x] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(freq)
    .map(([value, count]) => ({
      value: Number(value),
      count,
      percentage: parseFloat(((count / data.length) * 100).toFixed(2)),
    }))
    .sort((a, b) => a.value - b.value);
}

// ---------------------------------------------------------------------------
// normalizeData
// ---------------------------------------------------------------------------

/**
 * Normaliza los datos al rango [0, 1] usando min-max scaling.
 *
 *   x_norm = (x − min) / (max − min)
 *
 * Si todos los valores son iguales (rango = 0), retorna un arreglo de ceros.
 *
 * @param {number[]} data
 * @returns {number[]} Valores normalizados redondeados a 4 decimales.
 */
function normalizeData(data) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  if (range === 0) return data.map(() => 0);
  return data.map((x) => parseFloat(((x - min) / range).toFixed(4)));
}

// ---------------------------------------------------------------------------
// Exportaciones
// ---------------------------------------------------------------------------

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DataStats,
    calculateMean,
    calculateMedian,
    calculateMode,
    calculateVariance,
    calculateStdDev,
    calculateRange,
    calculatePercentile,
    calculateQuartiles,
    calculateIQR,
    calculateZScores,
    calculateCorrelation,
    findOutliers,
    getFrequencyDistribution,
    normalizeData,
  };
}
