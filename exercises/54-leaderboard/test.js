/**
 * Pruebas para Leaderboard
 * Ejecutar con: npm test exercises/54-leaderboard
 */

const { Leaderboard } = require('./buggy-code.js');

describe('Leaderboard', () => {
  let board;

  beforeEach(() => {
    board = new Leaderboard();
    board.addScore('Alice', 50);
    board.addScore('Bob', 80);
    board.addScore('Alice', 90);  // Alice mejora su puntaje
    board.addScore('Carol', 80);  // Carol empata con Bob
    board.addScore('Dave', 60);
  });

  describe('addScore - agregar puntaje', () => {
    test('debe registrar múltiples puntajes para el mismo jugador', () => {
      const scores = board.getScoreHistory('Alice');
      expect(scores).toContain(50);
      expect(scores).toContain(90);
    });

    test('debe lanzar error si el puntaje no es un número positivo', () => {
      expect(() => board.addScore('Eve', -5)).toThrow();
      expect(() => board.addScore('Eve', 0)).toThrow();
    });
  });

  describe('getPlayerBest - mejor puntaje del jugador', () => {
    test('debe retornar el puntaje más alto del jugador, no el primero', () => {
      // Alice tiene [50, 90] → debe retornar 90, no 50
      expect(board.getPlayerBest('Alice')).toBe(90);
    });

    test('debe retornar el único puntaje si solo tiene uno', () => {
      expect(board.getPlayerBest('Bob')).toBe(80);
    });

    test('debe lanzar error si el jugador no existe', () => {
      expect(() => board.getPlayerBest('Unknown')).toThrow();
    });
  });

  describe('getRanking - tabla de posiciones', () => {
    test('debe ordenar por mejor puntaje de mayor a menor', () => {
      const ranking = board.getRanking();
      expect(ranking[0].player).toBe('Alice');
      expect(ranking[0].score).toBe(90);
    });

    test('debe asignar el mismo rango a jugadores empatados', () => {
      const ranking = board.getRanking();
      const bobEntry = ranking.find(r => r.player === 'Bob');
      const carolEntry = ranking.find(r => r.player === 'Carol');
      expect(bobEntry.rank).toBe(carolEntry.rank);
    });

    test('debe saltar rangos después de un empate (ranking estándar 1-2-2-4)', () => {
      const ranking = board.getRanking();
      // Alice:90(1), Bob:80(2), Carol:80(2), Dave:60(4)
      const daveEntry = ranking.find(r => r.player === 'Dave');
      expect(daveEntry.rank).toBe(4);
    });
  });

  describe('getTopN - top N jugadores', () => {
    test('debe retornar al menos N jugadores con mejor puntaje', () => {
      const top2 = board.getTopN(2);
      expect(top2.length).toBeGreaterThanOrEqual(2);
      expect(top2[0].player).toBe('Alice');
    });

    test('debe incluir todos los jugadores empatados en el límite', () => {
      // Top 2 incluye Alice (rank 1) y el empate Bob+Carol (rank 2) → 3 jugadores
      const top2 = board.getTopN(2);
      const players = top2.map(e => e.player);
      expect(players).toContain('Alice');
      expect(players).toContain('Bob');
      expect(players).toContain('Carol');
    });
  });

  describe('getPlayerRank - rango de un jugador', () => {
    test('debe retornar el rango correcto del jugador', () => {
      expect(board.getPlayerRank('Alice')).toBe(1);
      expect(board.getPlayerRank('Dave')).toBe(4);
    });

    test('jugadores empatados deben tener el mismo rango', () => {
      expect(board.getPlayerRank('Bob')).toBe(board.getPlayerRank('Carol'));
    });
  });

  describe('getTiedPlayers - jugadores empatados', () => {
    test('debe retornar todos los jugadores con el mismo puntaje', () => {
      const tied = board.getTiedPlayers('Bob');
      expect(tied).toContain('Carol');
      expect(tied).not.toContain('Alice');
    });

    test('debe retornar lista vacía si nadie más empata', () => {
      const tied = board.getTiedPlayers('Alice');
      expect(tied).toHaveLength(0);
    });
  });

  describe('getAverageScore - puntaje promedio', () => {
    test('debe calcular el promedio de todos los mejores puntajes', () => {
      // Alice:90, Bob:80, Carol:80, Dave:60 → avg = 77.5
      expect(board.getAverageScore()).toBe(77.5);
    });
  });

  describe('getScoreDistribution - distribución de puntajes', () => {
    test('debe contar jugadores en cada rango de puntaje', () => {
      const dist = board.getScoreDistribution(20);
      // 60-79: Dave(60) → 1, 80-99: Bob(80), Carol(80), Alice(90) → 3
      expect(dist['80-99']).toBe(3);
      expect(dist['60-79']).toBe(1);
    });
  });

  describe('resetScores - reiniciar puntajes', () => {
    test('debe eliminar todos los puntajes del jugador', () => {
      board.resetScores('Alice');
      expect(() => board.getPlayerBest('Alice')).toThrow();
    });
  });
});
