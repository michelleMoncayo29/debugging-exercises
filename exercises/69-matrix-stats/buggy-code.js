/**
 * Matrix Stats
 *
 * Calculadora de estadísticas para matrices 2D.
 * Proporciona funciones para analizar filas, columnas,
 * diagonales, normalización y estadísticas globales.
 */

/**
 * Calcula la suma de cada fila de la matriz.
 * @param {number[][]} matrix
 * @returns {number[]}
 */
function rowSums(matrix) {
  return matrix.map(row => row.reduce((acc, val) => acc + val, 0));
}

/**
 * Calcula el promedio de cada fila de la matriz.
 * @param {number[][]} matrix
 * @returns {number[]}
 */
function rowAverages(matrix) {
  return matrix.map(row => row.reduce((acc, val) => acc + val, 0) / row.length);
}

/**
 * Devuelve el valor mínimo de cada fila.
 * @param {number[][]} matrix
 * @returns {number[]}
 */
function rowMins(matrix) {
  return matrix.map(row => row.reduce((min, val) => (val < min ? val : min), row[0]));
}

/**
 * Devuelve el valor máximo de cada fila.
 * @param {number[][]} matrix
 * @returns {number[]}
 */
function rowMaxs(matrix) {
  return matrix.map(row => row.reduce((max, val) => (val > max ? val : max), row[0]));
}

/**
 * Calcula la suma de cada columna de la matriz.
 * @param {number[][]} matrix
 * @returns {number[]}
 */
function colSums(matrix) {
  const numCols = matrix[0].length;
  return Array.from({ length: numCols }, (_, col) =>
    matrix.reduce((acc, row) => acc + row[col], 0)
  );
}

/**
 * Calcula el promedio de cada columna de la matriz.
 * @param {number[][]} matrix
 * @returns {number[]}
 */
function colAverages(matrix) {
  const numCols = matrix[0].length;
  return Array.from({ length: numCols }, (_, col) =>
    matrix.reduce((acc, row) => acc + row[col], 0) / matrix.length
  );
}

/**
 * Devuelve el valor mínimo de cada columna.
 * @param {number[][]} matrix
 * @returns {number[]}
 */
function colMins(matrix) {
  const numCols = matrix[0].length;
  return Array.from({ length: numCols }, (_, col) =>
    matrix.reduce((min, row) => (row[col] < min ? row[col] : min), matrix[0][col])
  );
}

/**
 * Devuelve el valor máximo de cada columna.
 * @param {number[][]} matrix
 * @returns {number[]}
 */
function colMaxs(matrix) {
  const numCols = matrix[0].length;
  return Array.from({ length: numCols }, (_, col) =>
    matrix.reduce((max, row) => (row[col] > max ? row[col] : max), matrix[0][col])
  );
}

/**
 * Calcula la suma de la diagonal principal de la matriz.
 * @param {number[][]} matrix
 * @returns {number}
 */
function diagonalSum(matrix) {
  return matrix.reduce((acc, row, i) => acc + row[i], 0);
}

/**
 * Calcula la transpuesta de la matriz.
 * @param {number[][]} matrix
 * @returns {number[][]}
 */
function transpose(matrix) {
  const numCols = matrix[0].length;
  return Array.from({ length: numCols }, (_, col) =>
    matrix.map(row => row[col])
  );
}

/**
 * Aplana la matriz 2D a un arreglo 1D (fila por fila).
 * @param {number[][]} matrix
 * @returns {number[]}
 */
function flatten(matrix) {
  return matrix.flatMap(row => row);
}

/**
 * Encuentra todas las celdas que cumplen una condición.
 * @param {number[][]} matrix
 * @param {function} predicate - función que recibe el valor y retorna boolean
 * @returns {{ row: number, col: number, value: number }[]}
 */
function findCells(matrix, predicate) {
  const results = [];
  matrix.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      if (predicate(value)) {
        results.push({ row: rowIndex, col: colIndex, value });
      }
    });
  });
  return results;
}

/**
 * Normaliza todos los valores de la matriz al rango [0, 1].
 * @param {number[][]} matrix
 * @returns {number[][]}
 */
function normalize(matrix) {
  const allValues = matrix.flatMap(row => row);
  const min = allValues.reduce((a, b) => (a < b ? a : b), allValues[0]);
  const max = allValues.reduce((a, b) => (a > b ? a : b), allValues[0]);
  const range = max - min;

  return matrix.map(row =>
    row.map(val => (range === 0 ? 0 : (val - min) / range))
  );
}

/**
 * Calcula estadísticas globales de toda la matriz.
 * @param {number[][]} matrix
 * @returns {{ min: number, max: number, mean: number, median: number }}
 */
function overallStats(matrix) {
  const values = matrix.flatMap(row => row);
  const sorted = [...values].sort((a, b) => a - b);

  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const mean = values.reduce((acc, val) => acc + val, 0) / values.length;

  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];

  return { min, max, mean, median };
}

/**
 * Devuelve el índice de la fila cuya suma es la más alta.
 * @param {number[][]} matrix
 * @returns {number}
 */
function rowWithHighestSum(matrix) {
  const sums = rowSums(matrix);
  return sums.indexOf(sums.reduce((max, val) => (val > max ? val : max), sums[0]));
}

/**
 * Devuelve el índice de la columna cuya suma es la más alta.
 * @param {number[][]} matrix
 * @returns {number}
 */
function colWithHighestSum(matrix) {
  const sums = colSums(matrix);
  return sums.indexOf(sums.reduce((max, val) => (val > max ? val : max), sums[0]));
}

/**
 * Cuenta cuántos valores son estrictamente mayores al umbral dado.
 * @param {number[][]} matrix
 * @param {number} threshold
 * @returns {number}
 */
function countAbove(matrix, threshold) {
  return matrix.flatMap(row => row).filter(val => val > threshold).length;
}

/**
 * Cuenta cuántos valores son estrictamente menores al umbral dado.
 * @param {number[][]} matrix
 * @param {number} threshold
 * @returns {number}
 */
function countBelow(matrix, threshold) {
  return matrix.flatMap(row => row).filter(val => val < threshold).length;
}

module.exports = {
  rowSums,
  rowAverages,
  rowMins,
  rowMaxs,
  colSums,
  colAverages,
  colMins,
  colMaxs,
  diagonalSum,
  transpose,
  flatten,
  findCells,
  normalize,
  overallStats,
  rowWithHighestSum,
  colWithHighestSum,
  countAbove,
  countBelow,
};
