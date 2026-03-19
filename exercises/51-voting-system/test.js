/**
 * Pruebas para Voting System
 * Ejecutar con: npm test exercises/51-voting-system
 */

const { tallyVotes, getWinner, getRankedResults, eliminateLowest } = require('./buggy-code.js');

describe('Voting System', () => {
  describe('tallyVotes - conteo de votos', () => {
    test('debe contar votos correctamente para cada candidato', () => {
      const ballots = ['Alice', 'Bob', 'Alice', 'Carol', 'Alice', 'Bob'];
      const tally = tallyVotes(ballots);
      expect(tally['Alice']).toBe(3);
      expect(tally['Bob']).toBe(2);
      expect(tally['Carol']).toBe(1);
    });

    test('debe manejar lista vacía de votos', () => {
      expect(tallyVotes([])).toEqual({});
    });
  });

  describe('getWinner - ganador por mayoría absoluta', () => {
    test('debe retornar el candidato con más del 50% de los votos', () => {
      const ballots = ['Alice', 'Alice', 'Alice', 'Bob', 'Carol'];
      expect(getWinner(ballots)).toBe('Alice');
    });

    test('debe retornar null si ningún candidato tiene mayoría absoluta', () => {
      const ballots = ['Alice', 'Alice', 'Bob', 'Bob', 'Carol'];
      expect(getWinner(ballots)).toBeNull();
    });

    test('debe requerir estrictamente más del 50%', () => {
      // 2 de 4 = exactamente 50%, no es mayoría absoluta
      const ballots = ['Alice', 'Alice', 'Bob', 'Bob'];
      expect(getWinner(ballots)).toBeNull();
    });
  });

  describe('getRankedResults - resultados ordenados', () => {
    test('debe retornar candidatos ordenados de más a menos votos', () => {
      const ballots = ['Alice', 'Bob', 'Alice', 'Carol', 'Alice'];
      const results = getRankedResults(ballots);
      expect(results[0].candidate).toBe('Alice');
      expect(results[0].votes).toBe(3);
      expect(results[1].candidate).toBe('Bob');
    });

    test('debe incluir el porcentaje de votos', () => {
      const ballots = ['Alice', 'Alice', 'Bob'];
      const results = getRankedResults(ballots);
      expect(results[0].percentage).toBeCloseTo(66.67, 1);
    });
  });

  describe('eliminateLowest - eliminación del candidato con menos votos', () => {
    test('debe retornar lista de candidatos sin el de menor cantidad de votos', () => {
      const ballots = ['Alice', 'Alice', 'Alice', 'Bob', 'Bob', 'Carol'];
      const remaining = eliminateLowest(ballots);
      expect(remaining).not.toContain('Carol');
      expect(remaining).toContain('Alice');
      expect(remaining).toContain('Bob');
    });

    test('debe retornar solo los nombres únicos de candidatos restantes', () => {
      const ballots = ['Alice', 'Alice', 'Bob', 'Bob', 'Carol'];
      const remaining = eliminateLowest(ballots);
      expect(remaining.length).toBe(2);
    });
  });
});
