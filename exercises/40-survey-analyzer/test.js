/**
 * Pruebas para Survey Analyzer
 * Ejecutar con: npm test exercises/40-survey-analyzer
 */

const {
  getMode,
  getMedian,
  getPercentile,
  analyzeQuestion,
  crossTabulate,
  detectInconsistentResponses,
} = require('./buggy-code.js');

describe('Survey Analyzer', () => {
  describe('getMode - valor más frecuente', () => {
    test('debe retornar el valor más frecuente', () => {
      expect(getMode([1, 2, 2, 3, 3, 3, 4])).toBe(3);
    });

    test('debe retornar el primer valor en empate', () => {
      expect(getMode([1, 1, 2, 2])).toBe(1);
    });

    test('debe funcionar con escala 1-5', () => {
      expect(getMode([5, 4, 5, 3, 5, 2, 4])).toBe(5);
    });
  });

  describe('getMedian - valor central', () => {
    test('debe retornar la mediana de un arreglo impar', () => {
      expect(getMedian([1, 3, 5, 7, 9])).toBe(5);
    });

    test('debe retornar el promedio de los dos centrales en arreglo par', () => {
      expect(getMedian([1, 2, 3, 4])).toBe(2.5);
    });

    test('debe ordenar antes de calcular la mediana', () => {
      expect(getMedian([5, 1, 3, 2, 4])).toBe(3);
    });

    test('debe funcionar con un solo elemento', () => {
      expect(getMedian([7])).toBe(7);
    });
  });

  describe('getPercentile - percentil P', () => {
    test('debe retornar el percentil 50 (mediana) correctamente', () => {
      const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      expect(getPercentile(data, 50)).toBe(5);
    });

    test('debe retornar el percentil 90 correctamente', () => {
      const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      expect(getPercentile(data, 90)).toBe(9);
    });

    test('debe retornar el percentil 0 como el primer elemento', () => {
      const data = [1, 2, 3, 4, 5];
      expect(getPercentile(data, 0)).toBe(1);
    });

    test('debe retornar el percentil 100 como el último elemento', () => {
      const data = [1, 2, 3, 4, 5];
      expect(getPercentile(data, 100)).toBe(5);
    });
  });

  describe('analyzeQuestion - estadísticas completas de una pregunta', () => {
    const responses = [3, 5, 2, 4, 5, 5, 1, 3, 4, 5];

    test('debe calcular el promedio correctamente', () => {
      const result = analyzeQuestion(responses);
      expect(result.average).toBeCloseTo(3.7, 1);
    });

    test('debe calcular la mediana correctamente', () => {
      const result = analyzeQuestion(responses);
      expect(result.median).toBe(4);
    });

    test('debe calcular la moda correctamente', () => {
      const result = analyzeQuestion(responses);
      expect(result.mode).toBe(5);
    });

    test('debe calcular el percentil 90 correctamente', () => {
      const result = analyzeQuestion(responses);
      expect(result.p90).toBe(5);
    });

    test('debe calcular la distribución de frecuencias', () => {
      const result = analyzeQuestion(responses);
      expect(result.distribution[5]).toBe(4);
      expect(result.distribution[3]).toBe(2);
    });
  });

  describe('crossTabulate - tabla cruzada por segmento', () => {
    const responses = [
      { answer: 4, segment: 'A' },
      { answer: 5, segment: 'A' },
      { answer: 2, segment: 'B' },
      { answer: 3, segment: 'B' },
      { answer: 5, segment: 'A' },
    ];

    test('debe calcular el promedio por segmento', () => {
      const result = crossTabulate(responses);
      expect(result['A'].average).toBeCloseTo(4.67, 1);
      expect(result['B'].average).toBe(2.5);
    });

    test('debe contar respuestas por segmento', () => {
      const result = crossTabulate(responses);
      expect(result['A'].count).toBe(3);
      expect(result['B'].count).toBe(2);
    });
  });

  describe('detectInconsistentResponses - validación de coherencia', () => {
    test('debe detectar respuestas fuera del rango 1-5', () => {
      const responses = [
        { id: 1, satisfaction: 5, recommendScore: 4 },
        { id: 2, satisfaction: 6, recommendScore: 3 },
        { id: 3, satisfaction: 2, recommendScore: 0 },
      ];
      const inconsistent = detectInconsistentResponses(responses);
      expect(inconsistent.length).toBe(2);
      expect(inconsistent.map(r => r.id)).toEqual([2, 3]);
    });

    test('debe retornar arreglo vacío si todas las respuestas son válidas', () => {
      const responses = [
        { id: 1, satisfaction: 5, recommendScore: 4 },
        { id: 2, satisfaction: 3, recommendScore: 3 },
      ];
      expect(detectInconsistentResponses(responses)).toEqual([]);
    });
  });
});
