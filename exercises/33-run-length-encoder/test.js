/**
 * Pruebas para: Run-Length Encoder
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/33-run-length-encoder
 */

const { encode, decode } = require('./buggy-code.js');
// const { } = require('./solution.js');

describe('Run-Length Encoder - Error Lógico', () => {
  describe('encode - compresión', () => {
    test('debe comprimir caracteres repetidos', () => {
      expect(encode('aaabbc')).toBe('3a2b1c');
    });

    test('debe manejar una sola ocurrencia de cada carácter', () => {
      expect(encode('abc')).toBe('1a1b1c');
    });

    test('debe manejar una larga racha del mismo carácter', () => {
      expect(encode('aaaaaaaaaa')).toBe('10a');
    });

    test('debe manejar cadena de un solo carácter', () => {
      expect(encode('z')).toBe('1z');
    });

    test('debe manejar cadena vacía', () => {
      expect(encode('')).toBe('');
    });

    test('debe manejar rachas mixtas', () => {
      expect(encode('aabbccddee')).toBe('2a2b2c2d2e');
    });
  });

  describe('decode - descompresión', () => {
    test('debe descomprimir una cadena básica', () => {
      expect(decode('3a2b1c')).toBe('aaabbc');
    });

    test('debe descomprimir conteos de un solo dígito', () => {
      expect(decode('1a1b1c')).toBe('abc');
    });

    test('debe descomprimir conteos de dos dígitos', () => {
      expect(decode('10a')).toBe('aaaaaaaaaa');
    });

    test('debe descomprimir conteos de dos dígitos mezclados con uno', () => {
      expect(decode('12a3b')).toBe('aaaaaaaaaaaabbb');
    });

    test('debe descomprimir cadena vacía', () => {
      expect(decode('')).toBe('');
    });

    test('encode y decode deben ser operaciones inversas', () => {
      const original = 'aaabbbccccdd';
      expect(decode(encode(original))).toBe(original);
    });
  });
});
