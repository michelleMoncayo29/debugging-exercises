const { Team, Match, Tournament } = require('./buggy-code');

describe('Team', () => {
  test('crea un equipo con nombre y grupo', () => {
    const t = new Team('Real Madrid', 'A');
    expect(t.name).toBe('Real Madrid');
    expect(t.group).toBe('A');
  });

  test('crea un equipo sin grupo (fase eliminatoria)', () => {
    const t = new Team('Barcelona');
    expect(t.name).toBe('Barcelona');
    expect(t.group).toBeNull();
  });
});

describe('Match', () => {
  test('crea un partido con todos sus datos', () => {
    const m = new Match('Arsenal', 'Chelsea', 2, 1, 1);
    expect(m.homeTeam).toBe('Arsenal');
    expect(m.awayTeam).toBe('Chelsea');
    expect(m.homeGoals).toBe(2);
    expect(m.awayGoals).toBe(1);
    expect(m.matchday).toBe(1);
  });

  test('getResult retorna "home" si ganó el local', () => {
    expect(new Match('A', 'B', 3, 1, 1).getResult()).toBe('home');
  });

  test('getResult retorna "away" si ganó el visitante', () => {
    expect(new Match('A', 'B', 0, 2, 1).getResult()).toBe('away');
  });

  test('getResult retorna "draw" en caso de empate', () => {
    expect(new Match('A', 'B', 1, 1, 1).getResult()).toBe('draw');
  });

  test('getTotalGoals retorna la suma de goles del partido', () => {
    expect(new Match('A', 'B', 4, 2, 1).getTotalGoals()).toBe(6);
  });

  test('involvesTeam retorna true si el equipo participó en el partido', () => {
    const m = new Match('Arsenal', 'Chelsea', 1, 0, 1);
    expect(m.involvesTeam('Arsenal')).toBe(true);
    expect(m.involvesTeam('Chelsea')).toBe(true);
    expect(m.involvesTeam('Liverpool')).toBe(false);
  });
});

describe('Tournament - registro de equipos y partidos', () => {
  let tournament;

  beforeEach(() => {
    tournament = new Tournament('Premier League');
    tournament.addTeam('Arsenal', 'A');
    tournament.addTeam('Chelsea', 'A');
    tournament.addTeam('Liverpool', 'B');
    tournament.addTeam('Man City', 'B');
  });

  test('addTeam agrega equipos correctamente', () => {
    expect(tournament.teams).toHaveLength(4);
    expect(tournament.teams.map(t => t.name)).toContain('Arsenal');
  });

  test('addTeam no agrega un equipo duplicado', () => {
    tournament.addTeam('Arsenal', 'A');
    expect(tournament.teams).toHaveLength(4);
  });

  test('recordMatch registra un partido y lo almacena', () => {
    tournament.recordMatch('Arsenal', 'Chelsea', 2, 0, 1);
    expect(tournament.matches).toHaveLength(1);
    expect(tournament.matches[0].homeGoals).toBe(2);
  });

  test('getMatchesByMatchday retorna los partidos de la jornada indicada', () => {
    tournament.recordMatch('Arsenal', 'Chelsea', 2, 0, 1);
    tournament.recordMatch('Liverpool', 'Man City', 1, 1, 1);
    tournament.recordMatch('Arsenal', 'Liverpool', 3, 1, 2);
    expect(tournament.getMatchesByMatchday(1)).toHaveLength(2);
    expect(tournament.getMatchesByMatchday(2)).toHaveLength(1);
  });

  test('getMatchesByTeam retorna todos los partidos de un equipo', () => {
    tournament.recordMatch('Arsenal', 'Chelsea', 2, 0, 1);
    tournament.recordMatch('Arsenal', 'Liverpool', 1, 1, 2);
    tournament.recordMatch('Chelsea', 'Man City', 0, 1, 2);
    const matches = tournament.getMatchesByTeam('Arsenal');
    expect(matches).toHaveLength(2);
  });
});

describe('Tournament - estadísticas por equipo (puntos)', () => {
  test('una victoria vale exactamente 3 puntos', () => {
    const t = new Tournament('Test');
    t.addTeam('A', 'X');
    t.addTeam('B', 'X');
    t.recordMatch('A', 'B', 1, 0, 1);
    expect(t.getTeamStats('A').points).toBe(3);
  });

  test('una derrota vale 0 puntos y la victoria del rival vale 3', () => {
    const t = new Tournament('Test');
    t.addTeam('A', 'X');
    t.addTeam('B', 'X');
    t.recordMatch('A', 'B', 0, 2, 1);
    expect(t.getTeamStats('A').points).toBe(0);
    expect(t.getTeamStats('B').points).toBe(3);
  });

  test('un empate vale exactamente 1 punto para cada equipo', () => {
    const t = new Tournament('Test');
    t.addTeam('A', 'X');
    t.addTeam('B', 'X');
    t.recordMatch('A', 'B', 0, 0, 1);
    expect(t.getTeamStats('A').points).toBe(1);
    expect(t.getTeamStats('B').points).toBe(1);
  });

  test('getTeamStats retorna puntos correctos: 2V 1E = 7pts', () => {
    const t = new Tournament('La Liga');
    t.addTeam('Atlético', 'A');
    t.addTeam('Sevilla', 'A');
    t.addTeam('Betis', 'A');
    t.recordMatch('Atlético', 'Sevilla', 2, 0, 1);
    t.recordMatch('Atlético', 'Betis', 2, 1, 2);
    t.recordMatch('Sevilla', 'Atlético', 1, 1, 3);
    // 2 victorias × 3 + 1 empate × 1 = 7
    expect(t.getTeamStats('Atlético').points).toBe(7);
  });

  test('getTeamStats: 3V = 9pts', () => {
    const t = new Tournament('Test');
    t.addTeam('X', 'A');
    t.addTeam('Y', 'A');
    t.addTeam('Z', 'A');
    t.recordMatch('X', 'Y', 1, 0, 1);
    t.recordMatch('X', 'Z', 2, 0, 2);
    t.addTeam('W', 'A');
    t.recordMatch('X', 'W', 1, 0, 3);
    expect(t.getTeamStats('X').points).toBe(9);
  });

  test('getTeamStats: equipo con solo empates tiene puntos = número de empates', () => {
    const t = new Tournament('Test');
    t.addTeam('X', 'A');
    t.addTeam('Y', 'A');
    t.recordMatch('X', 'Y', 0, 0, 1);
    t.recordMatch('Y', 'X', 1, 1, 2);
    expect(t.getTeamStats('X').points).toBe(2);
  });

  test('getTeamStats retorna victorias, empates y derrotas correctas', () => {
    const t = new Tournament('La Liga');
    t.addTeam('Atlético', 'A');
    t.addTeam('Sevilla', 'A');
    t.addTeam('Betis', 'A');
    t.recordMatch('Atlético', 'Sevilla', 2, 0, 1);
    t.recordMatch('Atlético', 'Betis', 2, 1, 2);
    t.recordMatch('Sevilla', 'Atlético', 1, 1, 3);
    const stats = t.getTeamStats('Atlético');
    expect(stats.won).toBe(2);
    expect(stats.drawn).toBe(1);
    expect(stats.lost).toBe(0);
  });

  test('getTeamStats retorna goles a favor y en contra correctos', () => {
    const t = new Tournament('La Liga');
    t.addTeam('Atlético', 'A');
    t.addTeam('Sevilla', 'A');
    t.addTeam('Betis', 'A');
    t.recordMatch('Atlético', 'Sevilla', 2, 0, 1);
    t.recordMatch('Atlético', 'Betis', 2, 1, 2);
    t.recordMatch('Sevilla', 'Atlético', 1, 1, 3);
    const stats = t.getTeamStats('Atlético');
    expect(stats.goalsFor).toBe(5);
    expect(stats.goalsAgainst).toBe(2);
    expect(stats.goalDifference).toBe(3);
  });

  test('getTeamStats retorna null para un equipo inexistente', () => {
    const t = new Tournament('Test');
    expect(t.getTeamStats('No existe')).toBeNull();
  });
});

describe('Tournament - tabla de posiciones', () => {
  /*
   * Escenario diseñado para exponer el bug (2pts por victoria en vez de 3):
   *
   * Bayern:      3V  0E  0D  →  9pts correctos  /  6pts con bug
   * Dortmund:    1V  1E  1D  →  4pts correctos  /  3pts con bug
   * Leipzig:     0V  3E  0D  →  3pts (igual en ambos, sin victorias)
   * Leverkusen:  1V  0E  2D  →  3pts correctos  /  2pts con bug
   *
   * Con solución: Bayern(9) > Dortmund(4) > Leipzig(3) > Leverkusen(3)
   * Con bug:      Bayern(6) > Dortmund(3)=Leipzig(3) → Leipzig queda sobre
   *               Dortmund por tener mejor GD (-1 vs -2)
   */
  let tournament;

  beforeEach(() => {
    tournament = new Tournament('Bundesliga');
    tournament.addTeam('Bayern', 'A');
    tournament.addTeam('Dortmund', 'A');
    tournament.addTeam('Leipzig', 'A');
    tournament.addTeam('Leverkusen', 'A');

    // Bayern gana todo (GF=6, GA=0)
    tournament.recordMatch('Bayern', 'Dortmund', 2, 0, 1);
    tournament.recordMatch('Bayern', 'Leipzig', 2, 0, 2);
    tournament.recordMatch('Bayern', 'Leverkusen', 2, 0, 3);

    // Dortmund: derrota vs Bayern, empate vs Leipzig (1-1), victoria vs Leverkusen (2-1)
    // GF=0+1+2=3, GA=2+1+1=4, GD=-1... recalculo:
    // vs Bayern (away 0-2): GF=0, GA=2
    // vs Leipzig (home 1-1): GF=1, GA=1
    // vs Leverkusen (away 0-2): Leverkusen pierde → Dortmund gana
    tournament.recordMatch('Dortmund', 'Leipzig', 1, 1, 4);
    tournament.recordMatch('Leverkusen', 'Dortmund', 0, 2, 5); // Dortmund gana fuera

    // Leipzig: derrota vs Bayern, empate vs Dortmund (1-1), empate vs Leverkusen (0-0)
    // GF=0+1+0=1, GA=2+1+0=3, GD=-2
    tournament.recordMatch('Leipzig', 'Leverkusen', 0, 0, 6);

    // Leverkusen: derrota vs Bayern, derrota vs Dortmund, empate vs Leipzig
    // GF=0+0+0=0, GA=2+2+0=4, GD=-4
  });

  test('getStandings retorna todos los equipos ordenados', () => {
    const standings = tournament.getStandings();
    expect(standings).toHaveLength(4);
    expect(standings[0].name).toBe('Bayern');
  });

  test('Bayern con 3 victorias tiene 9 puntos en la tabla', () => {
    const standings = tournament.getStandings();
    expect(standings[0].points).toBe(9);
  });

  test('Dortmund con 1V 1E 1D tiene 4 puntos en la tabla', () => {
    const standings = tournament.getStandings();
    const dortmund = standings.find(t => t.name === 'Dortmund');
    expect(dortmund.points).toBe(4);
  });

  test('Dortmund (1V 1E) queda por encima de Leipzig (0V 3E) en la tabla', () => {
    // Correcto: Dortmund=4pts > Leipzig=3pts → Dortmund arriba
    // Con bug:  Dortmund=3pts = Leipzig=3pts → Leipzig queda arriba (GD -2 > Dortmund GD -3)
    const standings = tournament.getStandings();
    const dortmundPos = standings.findIndex(t => t.name === 'Dortmund');
    const leipzigPos = standings.findIndex(t => t.name === 'Leipzig');
    expect(dortmundPos).toBeLessThan(leipzigPos);
  });

  test('getStandings incluye diferencia de goles en cada entrada', () => {
    const standings = tournament.getStandings();
    const leverkusen = standings.find(t => t.name === 'Leverkusen');
    // Leverkusen: vs Bayern(0-2), vs Dortmund(0-2), vs Leipzig(0-0) → GF=0, GA=4, GD=-4
    expect(leverkusen.goalDifference).toBe(-4);
  });

  test('getStandings con filtro de grupo retorna solo equipos de ese grupo', () => {
    tournament.addTeam('PSG', 'B');
    tournament.addTeam('Lyon', 'B');
    tournament.recordMatch('PSG', 'Lyon', 3, 0, 7);
    const groupA = tournament.getStandings('A');
    expect(groupA.every(t => t.group === 'A')).toBe(true);
    expect(groupA).toHaveLength(4);
  });
});

describe('Tournament - análisis avanzado', () => {
  let tournament;

  beforeEach(() => {
    tournament = new Tournament('Serie A');
    tournament.addTeam('Juventus', 'A');
    tournament.addTeam('Inter', 'A');
    tournament.addTeam('Milan', 'A');
    tournament.addTeam('Napoli', 'A');

    tournament.recordMatch('Juventus', 'Inter', 1, 0, 1);
    tournament.recordMatch('Milan', 'Napoli', 2, 2, 1);
    tournament.recordMatch('Juventus', 'Milan', 3, 0, 2);
    tournament.recordMatch('Inter', 'Napoli', 1, 1, 2);
    tournament.recordMatch('Juventus', 'Napoli', 2, 1, 3);
    tournament.recordMatch('Inter', 'Milan', 0, 1, 3);
  });

  test('getTotalGoals retorna la suma total de goles del torneo', () => {
    // 1+0 + 2+2 + 3+0 + 1+1 + 2+1 + 0+1 = 14
    expect(tournament.getTotalGoals()).toBe(14);
  });

  test('getAverageGoalsPerMatch retorna el promedio correcto', () => {
    expect(tournament.getAverageGoalsPerMatch()).toBeCloseTo(14 / 6);
  });

  test('getHighestScoringMatch retorna el partido con más goles totales', () => {
    const match = tournament.getHighestScoringMatch();
    // Milan 2-2 Napoli = 4 goles
    expect(match.getTotalGoals()).toBe(4);
  });

  test('getBestAttack retorna el equipo con más goles anotados', () => {
    // Juventus: 1+3+2=6
    expect(tournament.getBestAttack()).toBe('Juventus');
  });

  test('getBestDefense retorna el equipo con menos goles recibidos', () => {
    // Juventus: recibió 0+0+1=1
    expect(tournament.getBestDefense()).toBe('Juventus');
  });

  test('getUnbeatenTeams retorna equipos sin ninguna derrota', () => {
    const unbeaten = tournament.getUnbeatenTeams();
    expect(unbeaten).toContain('Juventus');
    expect(unbeaten).not.toContain('Milan');
  });

  test('getTeamsWithoutWin retorna equipos que no han ganado ningún partido', () => {
    // Napoli: 0V 2E 1D
    const noWins = tournament.getTeamsWithoutWin();
    expect(noWins).toContain('Napoli');
    expect(noWins).not.toContain('Juventus');
  });

  test('getHeadToHead retorna el historial entre dos equipos específicos', () => {
    const h2h = tournament.getHeadToHead('Juventus', 'Inter');
    expect(h2h).toHaveLength(1);
    expect(h2h[0].homeGoals).toBe(1);
    expect(h2h[0].awayGoals).toBe(0);
  });

  test('getTopTeams retorna los N primeros de la tabla con Juventus primero', () => {
    const top2 = tournament.getTopTeams(2);
    expect(top2).toHaveLength(2);
    expect(top2[0].name).toBe('Juventus');
  });

  test('el líder Juventus tiene 9 puntos (3V × 3)', () => {
    const top = tournament.getTopTeams(1);
    expect(top[0].points).toBe(9);
  });
});
