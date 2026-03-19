/**
 * Pruebas para: Roman Numeral Converter
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/32-roman-numeral-converter
 */

const { toRoman, fromRoman } = require('./buggy-code.js');
// const { } = require('./solution.js');

describe('Roman Numeral Converter - Error Lógico', () => {
  describe('toRoman - conversión a numeral romano', () => {
    test('debe convertir valores básicos simples', () => {
      expect(toRoman(1)).toBe('I');
      expect(toRoman(5)).toBe('V');
      expect(toRoman(10)).toBe('X');
    });

    test('debe convertir números que requieren adición simple', () => {
      expect(toRoman(3)).toBe('III');
      expect(toRoman(8)).toBe('VIII');
      expect(toRoman(15)).toBe('XV');
    });

    test('debe aplicar reglas de sustracción (IV, IX, XL, XC, CD, CM)', () => {
      expect(toRoman(4)).toBe('IV');
      expect(toRoman(9)).toBe('IX');
      expect(toRoman(40)).toBe('XL');
      expect(toRoman(90)).toBe('XC');
      expect(toRoman(400)).toBe('CD');
      expect(toRoman(900)).toBe('CM');
    });

    test('debe convertir números compuestos con sustracción', () => {
      expect(toRoman(14)).toBe('XIV');
      expect(toRoman(44)).toBe('XLIV');
      expect(toRoman(99)).toBe('XCIX');
    });

    test('debe convertir números grandes', () => {
      expect(toRoman(1994)).toBe('MCMXCIV');
      expect(toRoman(2024)).toBe('MMXXIV');
      expect(toRoman(3999)).toBe('MMMCMXCIX');
    });
  });

  describe('fromRoman - conversión desde numeral romano', () => {
    test('debe convertir numerales básicos', () => {
      expect(fromRoman('I')).toBe(1);
      expect(fromRoman('V')).toBe(5);
      expect(fromRoman('X')).toBe(10);
    });

    test('debe convertir numerales con adición', () => {
      expect(fromRoman('III')).toBe(3);
      expect(fromRoman('VIII')).toBe(8);
      expect(fromRoman('XV')).toBe(15);
    });

    test('debe manejar sustracción correctamente', () => {
      expect(fromRoman('IV')).toBe(4);
      expect(fromRoman('IX')).toBe(9);
      expect(fromRoman('XL')).toBe(40);
      expect(fromRoman('XC')).toBe(90);
    });

    test('debe convertir numerales compuestos', () => {
      expect(fromRoman('MCMXCIV')).toBe(1994);
      expect(fromRoman('MMXXIV')).toBe(2024);
    });
  });
});
