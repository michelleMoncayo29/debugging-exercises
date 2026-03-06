/**
 * Pruebas para: Grade Curve
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/36-grade-curve
 */

const { applyCurve, getLetterGrade } = require('./buggy-code.js');
// const { applyCurve, getLetterGrade } = require('./solution.js');

describe('Grade Curve - Error Lógico', () => {
  describe('applyCurve - escalar notas al máximo de 100', () => {
    test('debe escalar para que la nota más alta sea exactamente 100', () => {
      const curved = applyCurve([80, 60, 40]);
      expect(curved[0]).toBe(100);
    });

    test('debe mantener las proporciones relativas entre notas', () => {
      const curved = applyCurve([80, 60, 40]);
      expect(curved[1]).toBe(75);
      expect(curved[2]).toBe(50);
    });

    test('debe redondear a dos decimales', () => {
      const curved = applyCurve([90, 75, 50]);
      expect(curved[0]).toBe(100);
      expect(curved[1]).toBeCloseTo(83.33, 2);
      expect(curved[2]).toBeCloseTo(55.56, 2);
    });

    test('si la nota máxima ya es 100, debe devolver las mismas notas', () => {
      expect(applyCurve([100, 85, 70])).toEqual([100, 85, 70]);
    });

    test('debe manejar un único estudiante con la nota máxima', () => {
      expect(applyCurve([75])).toEqual([100]);
    });

    test('si todos tienen la misma nota, todos deben subir a 100', () => {
      expect(applyCurve([60, 60, 60])).toEqual([100, 100, 100]);
    });
  });

  describe('getLetterGrade - calificación por letra', () => {
    test('debe devolver A para notas de 90 o más', () => {
      expect(getLetterGrade(100)).toBe('A');
      expect(getLetterGrade(90)).toBe('A');
    });

    test('debe devolver B para notas entre 80 y 89', () => {
      expect(getLetterGrade(85)).toBe('B');
      expect(getLetterGrade(80)).toBe('B');
    });

    test('debe devolver C para notas entre 70 y 79', () => {
      expect(getLetterGrade(75)).toBe('C');
    });

    test('debe devolver D para notas entre 60 y 69', () => {
      expect(getLetterGrade(65)).toBe('D');
    });

    test('debe devolver F para notas menores a 60', () => {
      expect(getLetterGrade(59)).toBe('F');
      expect(getLetterGrade(0)).toBe('F');
    });
  });
});
