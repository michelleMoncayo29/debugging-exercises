/**
 * Pruebas para: Matrix Rotation
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/35-matrix-rotation
 */

const { rotateMatrix } = require('./buggy-code.js');
// const { } = require('./solution.js');

describe('Matrix Rotation - Error Lógico', () => {
  test('debe rotar una matriz 2x2 90° en sentido horario', () => {
    const matrix = [
      [1, 2],
      [3, 4],
    ];
    expect(rotateMatrix(matrix)).toEqual([
      [3, 1],
      [4, 2],
    ]);
  });

  test('debe rotar una matriz 3x3 90° en sentido horario', () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    expect(rotateMatrix(matrix)).toEqual([
      [7, 4, 1],
      [8, 5, 2],
      [9, 6, 3],
    ]);
  });

  test('debe rotar una matriz de identidad y devolver la misma', () => {
    const matrix = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
    expect(rotateMatrix(matrix)).toEqual([
      [0, 0, 1],
      [0, 1, 0],
      [1, 0, 0],
    ]);
  });

  test('cuatro rotaciones de 90° deben devolver la matriz original', () => {
    const original = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    let result = original;
    for (let i = 0; i < 4; i++) {
      result = rotateMatrix(result);
    }
    expect(result).toEqual(original);
  });

  test('debe rotar una matriz 4x4 correctamente', () => {
    const matrix = [
      [1,  2,  3,  4],
      [5,  6,  7,  8],
      [9,  10, 11, 12],
      [13, 14, 15, 16],
    ];
    expect(rotateMatrix(matrix)).toEqual([
      [13, 9,  5, 1],
      [14, 10, 6, 2],
      [15, 11, 7, 3],
      [16, 12, 8, 4],
    ]);
  });

  test('debe manejar una matriz 1x1 sin cambios', () => {
    expect(rotateMatrix([[42]])).toEqual([[42]]);
  });
});
