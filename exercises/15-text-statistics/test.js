/**
 * Pruebas para: Estadísticas de Texto
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/15-text-statistics
 */

const {
  countWords,
  countSentences,
  getAverageWordLength,
  getMostFrequentWord,
} = require('./buggy-code.js');
// const { } = require('./solution.js');

describe('Estadísticas de Texto - Error Lógico', () => {
  // ─── countWords ───────────────────────────────────────────────────────────

  describe('countWords - Conteo de palabras', () => {
    test('debe contar correctamente las palabras de un texto simple', () => {
      expect(countWords('El gato duerme')).toBe(3);
    });

    test('debe ignorar espacios múltiples entre palabras y no contarlos como palabras', () => {
      // Con split(' '), los espacios múltiples generan strings vacíos que se cuentan como palabras
      expect(countWords('hola   mundo')).toBe(2);
    });

    test('debe retornar 0 para texto vacío', () => {
      expect(countWords('')).toBe(0);
    });

    test('debe retornar 0 para texto con solo espacios', () => {
      expect(countWords('   ')).toBe(0);
    });

    test('debe contar correctamente una sola palabra', () => {
      expect(countWords('javascript')).toBe(1);
    });
  });

  // ─── countSentences ───────────────────────────────────────────────────────

  describe('countSentences - Conteo de oraciones', () => {
    test('debe contar oraciones terminadas en punto', () => {
      expect(countSentences('Hola mundo. Esto es una prueba.')).toBe(2);
    });

    test('debe contar oraciones con signos de exclamación e interrogación', () => {
      expect(countSentences('¡Hola! ¿Cómo estás? Bien.')).toBe(3);
    });

    test('debe retornar 0 para texto sin signos de puntuación', () => {
      expect(countSentences('Hola mundo sin puntuación')).toBe(0);
    });

    test('debe retornar 0 para texto vacío', () => {
      expect(countSentences('')).toBe(0);
    });
  });

  // ─── getAverageWordLength ─────────────────────────────────────────────────

  describe('getAverageWordLength - Longitud promedio de palabras', () => {
    test('debe calcular el promedio de longitud de palabras (no dividir entre oraciones)', () => {
      // 'El gato come' → 'El'(2) + 'gato'(4) + 'come'(4) = 10 / 3 palabras = 3.33
      expect(getAverageWordLength('El gato come')).toBe(3.33);
    });

    test('debe calcular correctamente con texto de múltiples oraciones', () => {
      // 'El sol. La luna.' → el(2)+sol(3)+La(2)+luna(4) = 11 / 4 = 2.75
      expect(getAverageWordLength('El sol. La luna.')).toBe(2.75);
    });

    test('debe retornar 0 para texto vacío', () => {
      expect(getAverageWordLength('')).toBe(0);
    });
  });

  // ─── getMostFrequentWord ──────────────────────────────────────────────────

  describe('getMostFrequentWord - Palabra más frecuente', () => {
    test('debe encontrar la palabra más frecuente sin distinción de mayúsculas', () => {
      // 'El' y 'el' deben contarse como la misma palabra (aparece 3 veces)
      const text = 'El gato come. El perro come. El gato duerme.';
      expect(getMostFrequentWord(text)).toBe('el');
    });

    test('debe retornar la palabra correcta en un texto con repetición clara', () => {
      expect(getMostFrequentWord('sol sol sol luna luna')).toBe('sol');
    });

    test('debe retornar null para texto vacío', () => {
      expect(getMostFrequentWord('')).toBeNull();
    });

    test('debe retornar la palabra en minúsculas aunque aparezca en mayúsculas en el texto', () => {
      const result = getMostFrequentWord('HOLA hola Hola mundo');
      expect(result).toBe('hola');
    });
  });
});
