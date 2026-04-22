/**
 * Matrix Rotation
 *
 * Rota una matriz NxN 90° en sentido horario.
 * Algoritmo: transponer la matriz y luego invertir cada fila.
 * El orden importa: transponer primero, invertir después produce rotación
 * horaria. Hacerlo al revés produce rotación antihoraria.
 */

/**
 * Transpone una matriz NxN (filas y columnas intercambiadas).
 * @param {number[][]} matrix
 * @returns {number[][]}
 */
function transpose(matrix) {
  const n = matrix.length;
  return matrix.map((row, i) => row.map((_, j) => matrix[j][i]));
}

/**
 * Rota una matriz NxN 90° en sentido horario.
 * @param {number[][]} matrix
 * @returns {number[][]}
 */
function rotateMatrix(matrix) {
  const transposed = transpose(matrix);
  return transposed.map(row => [...row].reverse());
}

module.exports = { rotateMatrix };
