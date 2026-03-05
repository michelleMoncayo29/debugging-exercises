/**
 * Pruebas para: Tabla de Posiciones de Torneo
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/14-tournament-standings
 */

const {
  createTeam,
  calculatePoints,
  recordMatch,
  getGoalDifference,
  getStandings,
} = require('./buggy-code.js');
// const { createTeam, calculatePoints, recordMatch, getGoalDifference, getStandings } = require('./solution.js');

describe('Tabla de Posiciones de Torneo - Error Lógico', () => {
  // ─── calculatePoints ──────────────────────────────────────────────────────

  describe('calculatePoints - Cálculo de puntos', () => {
    test('debe asignar 3 puntos por victoria', () => {
      expect(calculatePoints(1, 0)).toBe(3);
    });

    test('debe asignar 1 punto por empate', () => {
      expect(calculatePoints(0, 1)).toBe(1);
    });

    test('debe calcular puntos correctamente con victorias y empates mixtos', () => {
      // 2 victorias (6 pts) + 3 empates (3 pts) = 9 puntos
      expect(calculatePoints(2, 3)).toBe(9);
    });

    test('debe retornar 0 puntos si no hay victorias ni empates', () => {
      expect(calculatePoints(0, 0)).toBe(0);
    });
  });

  // ─── recordMatch ──────────────────────────────────────────────────────────

  describe('recordMatch - Registro de partidos', () => {
    test('debe asignar goles correctamente a cada equipo (local y visitante)', () => {
      const teamA = createTeam('Equipo A');
      const teamB = createTeam('Equipo B');
      recordMatch(teamA, teamB, 3, 1);
      // El equipo A anota 3 goles a favor y recibe 1 en contra
      expect(teamA.goalsFor).toBe(3);
      expect(teamA.goalsAgainst).toBe(1);
      // El equipo B anota 1 gol a favor y recibe 3 en contra
      expect(teamB.goalsFor).toBe(1);
      expect(teamB.goalsAgainst).toBe(3);
    });

    test('debe sumar 3 puntos al ganador y 0 al perdedor', () => {
      const teamA = createTeam('Ganador');
      const teamB = createTeam('Perdedor');
      recordMatch(teamA, teamB, 2, 0);
      expect(teamA.points).toBe(3);
      expect(teamB.points).toBe(0);
    });

    test('debe sumar 1 punto a cada equipo en un empate', () => {
      const teamA = createTeam('Equipo A');
      const teamB = createTeam('Equipo B');
      recordMatch(teamA, teamB, 1, 1);
      expect(teamA.points).toBe(1);
      expect(teamB.points).toBe(1);
    });

    test('debe incrementar correctamente victorias, empates y derrotas', () => {
      const home = createTeam('Local');
      const away = createTeam('Visitante');
      recordMatch(home, away, 3, 0);
      expect(home.wins).toBe(1);
      expect(home.losses).toBe(0);
      expect(away.wins).toBe(0);
      expect(away.losses).toBe(1);
    });
  });

  // ─── getGoalDifference ────────────────────────────────────────────────────

  describe('getGoalDifference - Diferencia de goles', () => {
    test('debe calcular diferencia positiva correctamente', () => {
      const team = createTeam('Test');
      team.goalsFor = 10;
      team.goalsAgainst = 4;
      expect(getGoalDifference(team)).toBe(6);
    });

    test('debe calcular diferencia negativa correctamente', () => {
      const team = createTeam('Test');
      team.goalsFor = 3;
      team.goalsAgainst = 7;
      expect(getGoalDifference(team)).toBe(-4);
    });
  });

  // ─── getStandings ─────────────────────────────────────────────────────────

  describe('getStandings - Tabla de posiciones', () => {
    test('debe colocar al equipo con más puntos en primera posición', () => {
      const teamA = createTeam('Primero');
      const teamB = createTeam('Segundo');
      // teamA gana → 3 pts, teamB → 0 pts
      recordMatch(teamA, teamB, 1, 0);
      const standings = getStandings([teamB, teamA]);
      expect(standings[0].name).toBe('Primero');
    });

    test('debe desempatar por diferencia de goles cuando los puntos son iguales', () => {
      const teamA = createTeam('MejorDG');
      const teamB = createTeam('PeorDG');
      const teamC = createTeam('Rival');
      // Ambos ganan con distinta diferencia de goles
      recordMatch(teamA, createTeam('X'), 5, 0); // DG = +5
      recordMatch(teamB, createTeam('Y'), 1, 0); // DG = +1
      // Ambos tienen 3 pts; teamA debería ir primero por mayor DG
      const standings = getStandings([teamB, teamA]);
      expect(standings[0].name).toBe('MejorDG');
    });

    test('debe no mutar el array original al ordenar', () => {
      const teamA = createTeam('A');
      const teamB = createTeam('B');
      recordMatch(teamA, teamB, 0, 1);
      const original = [teamA, teamB];
      getStandings(original);
      // El array original no debe cambiar de orden
      expect(original[0].name).toBe('A');
    });
  });
});
