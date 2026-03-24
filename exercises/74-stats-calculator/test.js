/**
 * Tests para ejercicio 74-stats-calculator
 *
 * Por defecto se prueba el código con bugs (buggy-code.js).
 * Para verificar la solución, cambia la línea de importación a:
 *   const { ... } = require('./buggy-code');
 */

const {
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
} = require('./buggy-code');
// const {
//   DataStats,
//   calculateMean,
//   calculateMedian,
//   calculateMode,
//   calculateVariance,
//   calculateStdDev,
//   calculateRange,
//   calculatePercentile,
//   calculateQuartiles,
//   calculateIQR,
//   calculateZScores,
//   calculateCorrelation,
//   findOutliers,
//   getFrequencyDistribution,
//   normalizeData,
// } = require('./solution');

// ---------------------------------------------------------------------------
// calculateMean
// ---------------------------------------------------------------------------

describe('calculateMean - media aritmética', () => {
  test('debería calcular la media de un arreglo básico de enteros', () => {
    expect(calculateMean([1, 2, 3, 4, 5])).toBe(3);
  });

  test('debería calcular la media de números con decimales', () => {
    expect(calculateMean([1.5, 2.5, 3.5])).toBeCloseTo(2.5, 4);
  });

  test('debería retornar el mismo valor para un arreglo de un solo elemento', () => {
    expect(calculateMean([42])).toBe(42);
  });

  test('debería retornar 0 para un arreglo de ceros', () => {
    expect(calculateMean([0, 0, 0])).toBe(0);
  });

  test('debería calcular correctamente la media del conjunto de referencia [2,4,4,4,5,5,7,9]', () => {
    // suma=40, n=8 → media=5
    expect(calculateMean([2, 4, 4, 4, 5, 5, 7, 9])).toBe(5);
  });

  test('debería calcular la media con valores negativos', () => {
    expect(calculateMean([-3, -1, 1, 3])).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// calculateMedian
// ---------------------------------------------------------------------------

describe('calculateMedian - mediana', () => {
  test('debería calcular la mediana de un arreglo de longitud impar ya ordenado', () => {
    expect(calculateMedian([1, 2, 3, 4, 5])).toBe(3);
  });

  test('debería calcular la mediana de un arreglo de longitud par ya ordenado', () => {
    // sorted=[1,2,3,4], promedio de 2 y 3 = 2.5
    expect(calculateMedian([1, 2, 3, 4])).toBe(2.5);
  });

  test('debería ordenar el arreglo antes de calcular la mediana (longitud impar desordenado)', () => {
    // sorted=[1,2,3], mediana=2
    expect(calculateMedian([3, 1, 2])).toBe(2);
  });

  test('debería ordenar el arreglo antes de calcular la mediana (longitud par desordenado)', () => {
    // sorted=[1,2,3,4], promedio de 2 y 3 = 2.5
    expect(calculateMedian([4, 1, 3, 2])).toBe(2.5);
  });

  test('[TEST CRÍTICO] debería ordenar antes de calcular la mediana en arreglo par desordenado', () => {
    // Sin ordenar: data[1]=1, data[2]=5 → (1+5)/2=3 ← valor incorrecto si no ordena
    // Con ordenar: sorted=[1,3,5,10], (sorted[1]+sorted[2])/2=(3+5)/2=4 ← correcto
    expect(calculateMedian([10, 1, 5, 3])).toBe(4);
  });

  test('debería calcular la mediana de un arreglo impar muy desordenado', () => {
    // sorted=[1,5,9], mediana=5
    expect(calculateMedian([9, 1, 5])).toBe(5);
  });

  test('debería retornar el único valor para arreglo de un elemento', () => {
    expect(calculateMedian([7])).toBe(7);
  });

  test('debería calcular la mediana con valores negativos', () => {
    // sorted=[-3,-1,2], mediana=-1
    expect(calculateMedian([2, -3, -1])).toBe(-1);
  });
});

// ---------------------------------------------------------------------------
// calculateMode
// ---------------------------------------------------------------------------

describe('calculateMode - moda', () => {
  test('debería retornar la moda de un arreglo con un único valor más frecuente', () => {
    expect(calculateMode([1, 2, 2, 3])).toEqual([2]);
  });

  test('debería retornar todas las modas cuando hay empate (bimodal)', () => {
    expect(calculateMode([1, 1, 2, 2, 3])).toEqual([1, 2]);
  });

  test('debería retornar todos los valores cuando cada uno aparece igual cantidad de veces', () => {
    const result = calculateMode([1, 2, 3]);
    expect(result).toContain(1);
    expect(result).toContain(2);
    expect(result).toContain(3);
    expect(result).toHaveLength(3);
  });

  test('[TEST CRÍTICO] debería retornar un arreglo con la moda correcta (no arreglo vacío)', () => {
    // El bug usa > en vez de === al filtrar frecuencias, lo que devuelve []
    const result = calculateMode([1, 2, 2, 3]);
    expect(result).not.toHaveLength(0);
    expect(result).toEqual([2]);
  });

  test('debería retornar la moda para un arreglo con un solo valor repetido muchas veces', () => {
    expect(calculateMode([5, 5, 5, 5])).toEqual([5]);
  });

  test('debería retornar las modas ordenadas de menor a mayor', () => {
    const result = calculateMode([3, 3, 1, 1, 2]);
    expect(result).toEqual([1, 3]);
  });

  test('debería manejar arreglo de un solo elemento', () => {
    expect(calculateMode([9])).toEqual([9]);
  });
});

// ---------------------------------------------------------------------------
// calculateVariance
// ---------------------------------------------------------------------------

describe('calculateVariance - varianza muestral', () => {
  test('[TEST CRÍTICO] debería usar n-1 (corrección de Bessel) no n para varianza muestral', () => {
    // data=[2,4,4,4,5,5,7,9], mean=5
    // Σ(xi-μ)² = 9+1+1+1+0+0+4+16 = 32
    // Con n=8:   32/8  = 4      (varianza poblacional — INCORRECTA)
    // Con n-1=7: 32/7  ≈ 4.5714 (varianza muestral — CORRECTA)
    expect(calculateVariance([2, 4, 4, 4, 5, 5, 7, 9])).toBeCloseTo(4.5714, 3);
  });

  test('debería calcular varianza de un arreglo simple', () => {
    // [2,4,6]: mean=4, diffs²=[4,0,4], suma=8, /2=4
    expect(calculateVariance([2, 4, 6])).toBeCloseTo(4, 4);
  });

  test('debería retornar 0 cuando todos los valores son iguales', () => {
    expect(calculateVariance([5, 5, 5, 5])).toBe(0);
  });

  test('debería calcular varianza de valores negativos y positivos', () => {
    // [-2,0,2]: mean=0, diffs²=[4,0,4], suma=8, /2=4
    expect(calculateVariance([-2, 0, 2])).toBeCloseTo(4, 4);
  });

  test('la varianza nunca debería ser negativa', () => {
    const result = calculateVariance([1, 5, 3, 9, 2, 7]);
    expect(result).toBeGreaterThanOrEqual(0);
  });
});

// ---------------------------------------------------------------------------
// calculateStdDev
// ---------------------------------------------------------------------------

describe('calculateStdDev - desviación estándar muestral', () => {
  test('debería calcular la desviación estándar del conjunto de referencia', () => {
    // sqrt(4.5714) ≈ 2.1381
    expect(calculateStdDev([2, 4, 4, 4, 5, 5, 7, 9])).toBeCloseTo(2.1381, 3);
  });

  test('debería retornar 0 cuando todos los valores son iguales', () => {
    expect(calculateStdDev([3, 3, 3])).toBe(0);
  });

  test('debería ser la raíz cuadrada de la varianza', () => {
    const data = [1, 3, 5, 7, 9];
    const variance = calculateVariance(data);
    const stdDev = calculateStdDev(data);
    expect(stdDev).toBeCloseTo(Math.sqrt(variance), 4);
  });

  test('la desviación estándar nunca debería ser negativa', () => {
    expect(calculateStdDev([10, 2, 30, 15, 8])).toBeGreaterThanOrEqual(0);
  });

  test('debería ser menor que el rango del conjunto de datos', () => {
    const data = [1, 2, 3, 4, 5];
    expect(calculateStdDev(data)).toBeLessThan(calculateRange(data));
  });
});

// ---------------------------------------------------------------------------
// calculateRange
// ---------------------------------------------------------------------------

describe('calculateRange - rango', () => {
  test('debería calcular el rango de un arreglo desordenado', () => {
    expect(calculateRange([1, 5, 3, 9, 2])).toBe(8);
  });

  test('debería retornar 0 cuando todos los valores son iguales', () => {
    expect(calculateRange([4, 4, 4])).toBe(0);
  });

  test('debería calcular correctamente con valores negativos', () => {
    expect(calculateRange([-5, 0, 5])).toBe(10);
  });

  test('debería retornar el valor del único elemento menos sí mismo (0) para arreglo de un elemento', () => {
    expect(calculateRange([7])).toBe(0);
  });

  test('debería calcular el rango entre el máximo y el mínimo correctamente', () => {
    expect(calculateRange([10, 1, 5, 3])).toBe(9);
  });
});

// ---------------------------------------------------------------------------
// calculatePercentile
// ---------------------------------------------------------------------------

describe('calculatePercentile - percentil', () => {
  test('debería coincidir con la mediana en el percentil 50', () => {
    const data = [3, 1, 4, 1, 5, 9, 2, 6];
    expect(calculatePercentile(data, 50)).toBeCloseTo(calculateMedian(data), 4);
  });

  test('debería retornar el mínimo en el percentil 0', () => {
    const data = [3, 7, 1, 9, 4];
    expect(calculatePercentile(data, 0)).toBe(1);
  });

  test('debería retornar el máximo en el percentil 100', () => {
    const data = [3, 7, 1, 9, 4];
    expect(calculatePercentile(data, 100)).toBe(9);
  });

  test('debería calcular el percentil 25 correctamente con interpolación', () => {
    // [1,2,3,4,5,6,7,8]: índice=0.25*7=1.75, lower=1, upper=2
    // → sorted[1] + 0.75*(sorted[2]-sorted[1]) = 2 + 0.75 = 2.75
    expect(calculatePercentile([1, 2, 3, 4, 5, 6, 7, 8], 25)).toBeCloseTo(
      2.75,
      4,
    );
  });

  test('debería calcular el percentil 75 correctamente con interpolación', () => {
    // [1,2,3,4,5,6,7,8]: índice=0.75*7=5.25, lower=5, upper=6
    // → sorted[5] + 0.25*(sorted[6]-sorted[5]) = 6 + 0.25 = 6.25
    expect(calculatePercentile([1, 2, 3, 4, 5, 6, 7, 8], 75)).toBeCloseTo(
      6.25,
      4,
    );
  });
});

// ---------------------------------------------------------------------------
// calculateQuartiles
// ---------------------------------------------------------------------------

describe('calculateQuartiles - cuartiles', () => {
  test('debería retornar un objeto con las propiedades Q1, Q2 y Q3', () => {
    const result = calculateQuartiles([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(result).toHaveProperty('Q1');
    expect(result).toHaveProperty('Q2');
    expect(result).toHaveProperty('Q3');
  });

  test('Q2 debería coincidir con la mediana del conjunto', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8];
    const { Q2 } = calculateQuartiles(data);
    expect(Q2).toBeCloseTo(calculateMedian(data), 4);
  });

  test('Q1 debería ser menor que Q2 y Q2 menor que Q3', () => {
    const { Q1, Q2, Q3 } = calculateQuartiles([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(Q1).toBeLessThan(Q2);
    expect(Q2).toBeLessThan(Q3);
  });

  test('debería calcular cuartiles correctos para [1,2,3,4,5,6,7,8]', () => {
    const { Q1, Q3 } = calculateQuartiles([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(Q1).toBeCloseTo(2.75, 4);
    expect(Q3).toBeCloseTo(6.25, 4);
  });

  test('debería calcular cuartiles aunque el arreglo esté desordenado', () => {
    const ordered = calculateQuartiles([1, 2, 3, 4, 5]);
    const unordered = calculateQuartiles([5, 3, 1, 4, 2]);
    expect(ordered.Q1).toBeCloseTo(unordered.Q1, 4);
    expect(ordered.Q2).toBeCloseTo(unordered.Q2, 4);
    expect(ordered.Q3).toBeCloseTo(unordered.Q3, 4);
  });
});

// ---------------------------------------------------------------------------
// calculateIQR
// ---------------------------------------------------------------------------

describe('calculateIQR - rango intercuartílico', () => {
  test('debería calcular el IQR de [1,2,3,4,5,6,7,8]', () => {
    // Q1=2.75, Q3=6.25, IQR=3.5
    expect(calculateIQR([1, 2, 3, 4, 5, 6, 7, 8])).toBeCloseTo(3.5, 4);
  });

  test('debería retornar 0 cuando todos los valores son iguales', () => {
    expect(calculateIQR([5, 5, 5, 5])).toBe(0);
  });

  test('el IQR debería ser igual a Q3 menos Q1', () => {
    const data = [2, 4, 6, 8, 10, 12];
    const { Q1, Q3 } = calculateQuartiles(data);
    expect(calculateIQR(data)).toBeCloseTo(Q3 - Q1, 4);
  });

  test('el IQR nunca debería ser negativo', () => {
    expect(calculateIQR([10, 1, 7, 3, 5])).toBeGreaterThanOrEqual(0);
  });
});

// ---------------------------------------------------------------------------
// calculateZScores
// ---------------------------------------------------------------------------

describe('calculateZScores - puntuaciones z', () => {
  test('[TEST CRÍTICO] el z-score del valor (media + desviación) debe ser aproximadamente 1', () => {
    // Si se divide por media en vez de stdDev:
    //   z = (mean + stdDev - mean) / mean = stdDev / mean ≠ 1 en general
    // Si se divide por stdDev:
    //   z = stdDev / stdDev = 1
    const data = [2, 4, 4, 4, 5, 5, 7, 9];
    const mean = calculateMean(data);
    const stdDev = calculateStdDev(data);
    const scores = calculateZScores(data);
    // El elemento cuyo valor es exactamente mean+stdDev debe tener z≈1
    const targetIndex = data.indexOf(
      data.find((x) => Math.abs(x - (mean + stdDev)) < 0.001),
    );
    if (targetIndex !== -1) {
      expect(scores[targetIndex]).toBeCloseTo(1, 1);
    }
    // Verificación directa: z-score de 7 (= 5+2) debe ser (7-5)/stdDev ≈ (2/2.1381) ≈ 0.935
    const zOf7 = scores[data.indexOf(7)];
    expect(zOf7).toBeCloseTo(2 / stdDev, 3);
  });

  test('la media de todos los z-scores debería ser aproximadamente 0', () => {
    const data = [2, 4, 4, 4, 5, 5, 7, 9];
    const scores = calculateZScores(data);
    const meanOfScores = scores.reduce((s, z) => s + z, 0) / scores.length;
    expect(meanOfScores).toBeCloseTo(0, 1);
  });

  test('la desviación estándar de los z-scores debería ser aproximadamente 1', () => {
    const data = [2, 4, 4, 4, 5, 5, 7, 9];
    const scores = calculateZScores(data);
    const meanZ = scores.reduce((s, z) => s + z, 0) / scores.length;
    const variance =
      scores.reduce((s, z) => s + Math.pow(z - meanZ, 2), 0) /
      (scores.length - 1);
    expect(Math.sqrt(variance)).toBeCloseTo(1, 1);
  });

  test('el z-score del valor igual a la media debería ser 0', () => {
    // [1,2,3,4,5]: mean=3, z-score de 3 debe ser 0
    const data = [1, 2, 3, 4, 5];
    const scores = calculateZScores(data);
    const indexOfMean = data.indexOf(3);
    expect(scores[indexOfMean]).toBeCloseTo(0, 4);
  });

  test('debería retornar el mismo número de elementos que el arreglo original', () => {
    const data = [10, 20, 30, 40, 50];
    expect(calculateZScores(data)).toHaveLength(data.length);
  });

  test('el z-score más alto debe corresponder al valor más alto', () => {
    const data = [1, 2, 3, 4, 10];
    const scores = calculateZScores(data);
    const maxScore = Math.max(...scores);
    expect(scores[data.indexOf(10)]).toBe(maxScore);
  });
});

// ---------------------------------------------------------------------------
// calculateCorrelation
// ---------------------------------------------------------------------------

describe('calculateCorrelation - correlación de Pearson', () => {
  test('[TEST CRÍTICO] debería retornar 1 para una relación lineal positiva perfecta', () => {
    // x=[1,2,3,4,5], y=[2,4,6,8,10]
    // Si se usa meanX para las desviaciones de y, el numerador cambia y el resultado no es 1
    expect(calculateCorrelation([1, 2, 3, 4, 5], [2, 4, 6, 8, 10])).toBeCloseTo(
      1,
      4,
    );
  });

  test('debería retornar -1 para una relación lineal negativa perfecta', () => {
    expect(calculateCorrelation([1, 2, 3], [6, 4, 2])).toBeCloseTo(-1, 4);
  });

  test('debería retornar un valor entre -1 y 1', () => {
    const result = calculateCorrelation([1, 3, 5, 2, 4], [4, 2, 1, 5, 3]);
    expect(result).toBeGreaterThanOrEqual(-1);
    expect(result).toBeLessThanOrEqual(1);
  });

  test('debería calcular correlación cercana a 0 para datos sin relación lineal', () => {
    // Datos diseñados para correlación≈0
    const result = calculateCorrelation([1, 2, 3, 4, 5], [3, 1, 4, 1, 5]);
    expect(Math.abs(result)).toBeLessThan(0.9);
  });

  test('debería ser simétrica: corr(x,y) = corr(y,x)', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [3, 1, 4, 1, 5];
    expect(calculateCorrelation(x, y)).toBeCloseTo(
      calculateCorrelation(y, x),
      4,
    );
  });

  test('debería calcular correlación correcta para [1,2,3] con [2,4,6]', () => {
    expect(calculateCorrelation([1, 2, 3], [2, 4, 6])).toBeCloseTo(1, 4);
  });
});

// ---------------------------------------------------------------------------
// findOutliers
// ---------------------------------------------------------------------------

describe('findOutliers - detección de valores atípicos (Tukey)', () => {
  test('debería detectar un valor atípico claro en el extremo superior', () => {
    // [1,2,3,4,5,6,7,8,9,100]: upperFence=14.5, 100>14.5 → outlier
    const result = findOutliers([1, 2, 3, 4, 5, 6, 7, 8, 9, 100]);
    expect(result).toContain(100);
  });

  test('debería retornar arreglo vacío cuando no hay valores atípicos', () => {
    expect(findOutliers([1, 2, 3, 4, 5])).toHaveLength(0);
  });

  test('[TEST CRÍTICO] debería usar Q1 y Q3 (no Q2) para calcular las vallas de Tukey', () => {
    // Con Q1=3.25, Q3=7.75, IQR=4.5:
    //   valla inferior = Q1 - 1.5*IQR = 3.25 - 6.75 = -3.5
    //   valla superior = Q3 + 1.5*IQR = 7.75 + 6.75 = 14.5
    // Con Q2=5 (mediana) en vez de Q1/Q3 (bug):
    //   valla inferior = Q2 - 1.5*IQR = 5 - 6.75 = -1.75
    //   valla superior = Q2 + 1.5*IQR = 5 + 6.75 = 11.75
    // Valor 9 < 11.75 → no outlier con Q2 (bien)
    // Valor 100 > 11.75 → outlier con Q2 (igual detectado)
    // Diferencia visible: con valla correcta 14.5, sin outliers entre 9 y 14.
    // Creamos un caso donde el bug incluye un valor que no debería ser outlier.
    // data=[1,2,3,4,5,6,7,8,9,13]: upperFence correcta=Q3+1.5*IQR
    // sorted=[1,2,3,4,5,6,7,8,9,13], n=10
    // Q1: índice=0.25*9=2.25 → 3+0.25*(4-3)=3.25
    // Q3: índice=0.75*9=6.75 → 7+0.75*(8-7)=7.75
    // IQR=4.5, upperFence=7.75+6.75=14.5
    // 13 < 14.5 → NO outlier con fórmula correcta (Q1/Q3)
    // Con Q2=5: upperFence=5+6.75=11.75, 13>11.75 → outlier incorrectamente
    const result = findOutliers([1, 2, 3, 4, 5, 6, 7, 8, 9, 13]);
    expect(result).not.toContain(13);
    expect(result).toHaveLength(0);
  });

  test('debería detectar outliers en el extremo inferior', () => {
    // [-100, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const result = findOutliers([-100, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(result).toContain(-100);
  });

  test('debería detectar múltiples outliers si existen', () => {
    const result = findOutliers([-50, 1, 2, 3, 4, 5, 6, 7, 8, 9, 50]);
    expect(result).toContain(-50);
    expect(result).toContain(50);
  });
});

// ---------------------------------------------------------------------------
// getFrequencyDistribution
// ---------------------------------------------------------------------------

describe('getFrequencyDistribution - distribución de frecuencias', () => {
  test('debería contar correctamente la frecuencia de cada valor', () => {
    const result = getFrequencyDistribution([1, 2, 2, 3, 3, 3]);
    const entry1 = result.find((e) => e.value === 1);
    const entry2 = result.find((e) => e.value === 2);
    const entry3 = result.find((e) => e.value === 3);
    expect(entry1.count).toBe(1);
    expect(entry2.count).toBe(2);
    expect(entry3.count).toBe(3);
  });

  test('debería calcular correctamente el porcentaje de cada valor', () => {
    const result = getFrequencyDistribution([1, 2, 2, 3, 3, 3]);
    // n=6: 1→16.67%, 2→33.33%, 3→50%
    const entry3 = result.find((e) => e.value === 3);
    expect(entry3.percentage).toBeCloseTo(50, 2);
  });

  test('debería estar ordenado de menor a mayor por valor', () => {
    const result = getFrequencyDistribution([3, 1, 2, 1, 3, 3]);
    const values = result.map((e) => e.value);
    expect(values).toEqual([1, 2, 3]);
  });

  test('la suma de todos los porcentajes debería ser 100', () => {
    const result = getFrequencyDistribution([1, 2, 2, 3, 3, 3, 4]);
    const total = result.reduce((s, e) => s + e.percentage, 0);
    expect(total).toBeCloseTo(100, 1);
  });

  test('debería retornar una entrada por cada valor único', () => {
    const result = getFrequencyDistribution([1, 1, 2, 2, 3, 3]);
    expect(result).toHaveLength(3);
  });

  test('cada entrada debería tener las propiedades value, count y percentage', () => {
    const result = getFrequencyDistribution([5, 5, 10]);
    result.forEach((entry) => {
      expect(entry).toHaveProperty('value');
      expect(entry).toHaveProperty('count');
      expect(entry).toHaveProperty('percentage');
    });
  });
});

// ---------------------------------------------------------------------------
// normalizeData
// ---------------------------------------------------------------------------

describe('normalizeData - normalización min-max', () => {
  test('debería normalizar [0,5,10] a [0, 0.5, 1]', () => {
    expect(normalizeData([0, 5, 10])).toEqual([0, 0.5, 1]);
  });

  test('el valor mínimo siempre debería normalizarse a 0', () => {
    const result = normalizeData([3, 7, 1, 9, 5]);
    expect(result[result.indexOf(Math.min(...result))]).toBe(0);
    // El mínimo original es 1; su normalización debe ser 0
    const minIndex = [3, 7, 1, 9, 5].indexOf(1);
    expect(result[minIndex]).toBe(0);
  });

  test('el valor máximo siempre debería normalizarse a 1', () => {
    const data = [3, 7, 1, 9, 5];
    const result = normalizeData(data);
    const maxIndex = data.indexOf(Math.max(...data));
    expect(result[maxIndex]).toBe(1);
  });

  test('debería retornar todos ceros cuando todos los valores son iguales', () => {
    expect(normalizeData([4, 4, 4])).toEqual([0, 0, 0]);
  });

  test('todos los valores normalizados deben estar entre 0 y 1 inclusive', () => {
    const result = normalizeData([5, 1, 3, 8, 2]);
    result.forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    });
  });

  test('debería retornar el mismo número de elementos que el arreglo original', () => {
    const data = [10, 20, 30, 40];
    expect(normalizeData(data)).toHaveLength(data.length);
  });
});

// ---------------------------------------------------------------------------
// DataStats - clase
// ---------------------------------------------------------------------------

describe('DataStats - clase encapsuladora', () => {
  let stats;
  const testData = [2, 4, 4, 4, 5, 5, 7, 9];

  beforeEach(() => {
    stats = new DataStats('conjunto de prueba', testData);
  });

  test('debería crear una instancia con la etiqueta correcta', () => {
    expect(stats.label).toBe('conjunto de prueba');
  });

  test('debería hacer una copia defensiva de los datos en el constructor', () => {
    const original = [1, 2, 3];
    const instance = new DataStats('copia', original);
    original.push(99);
    expect(instance.data).toHaveLength(3);
    expect(instance.data).not.toContain(99);
  });

  test('getMean() debería retornar la media correcta', () => {
    expect(stats.getMean()).toBe(5);
  });

  test('getMedian() debería retornar la mediana correcta', () => {
    // sorted=[2,4,4,4,5,5,7,9], par, (4+5)/2=4.5
    expect(stats.getMedian()).toBe(4.5);
  });

  test('getMode() debería retornar la moda correcta', () => {
    // 4 aparece 3 veces (máximo)
    expect(stats.getMode()).toEqual([4]);
  });

  test('getVariance() debería retornar la varianza muestral correcta', () => {
    expect(stats.getVariance()).toBeCloseTo(4.5714, 3);
  });

  test('getStdDev() debería retornar la desviación estándar correcta', () => {
    expect(stats.getStdDev()).toBeCloseTo(2.1381, 3);
  });

  test('getRange() debería retornar el rango correcto', () => {
    expect(stats.getRange()).toBe(7);
  });

  test('getSummary() debería retornar un objeto con todas las métricas esperadas', () => {
    const summary = stats.getSummary();
    expect(summary).toHaveProperty('label');
    expect(summary).toHaveProperty('count');
    expect(summary).toHaveProperty('mean');
    expect(summary).toHaveProperty('median');
    expect(summary).toHaveProperty('mode');
    expect(summary).toHaveProperty('stdDev');
    expect(summary).toHaveProperty('range');
    expect(summary).toHaveProperty('Q1');
    expect(summary).toHaveProperty('Q2');
    expect(summary).toHaveProperty('Q3');
    expect(summary).toHaveProperty('IQR');
  });

  test('getSummary() debería reportar el conteo correcto', () => {
    expect(stats.getSummary().count).toBe(8);
  });

  test('getSummary() debería reportar la media correcta', () => {
    expect(stats.getSummary().mean).toBe(5);
  });

  test('getSummary().Q2 debería coincidir con getMedian()', () => {
    expect(stats.getSummary().Q2).toBeCloseTo(stats.getMedian(), 4);
  });
});
