/**
 * sports-league-table.js
 *
 * A set of functions for managing and querying a football (soccer) league standings system.
 * Records match results, computes the classification table (points: win=3, draw=1, loss=0),
 * and provides utilities to query standings, history, head-to-head records, top scorers,
 * and relegation zones.
 *
 * Data model:
 *   The league is a flat array of match-entry objects. Each call to recordMatch appends
 *   two entries — one for the home team and one for the away team — following the shape:
 *
 *   {
 *     team:         string,   // nombre del equipo
 *     opponent:     string,   // nombre del oponente
 *     goalsFor:     number,   // goles anotados en ese partido
 *     goalsAgainst: number,   // goles recibidos en ese partido
 *     result:       'win' | 'draw' | 'loss'
 *   }
 *
 * Sorting criteria for standings (in order of priority):
 *   1. Points (descending)
 *   2. Goal difference (descending)
 *   3. Goals scored (descending)
 */

// ---------------------------------------------------------------------------
// recordMatch
// ---------------------------------------------------------------------------

/**
 * Records a match result by appending two entries to the league array:
 * one for the home team and one for the away team.
 *
 * @param {Array}  league         - Arreglo compartido del historial de partidos (mutado en lugar)
 * @param {string} homeTeam       - Nombre del equipo local
 * @param {string} awayTeam       - Nombre del equipo visitante
 * @param {number} homeGoals      - Goles anotados por el equipo local
 * @param {number} awayGoals      - Goles anotados por el equipo visitante
 */
function recordMatch(league, homeTeam, awayTeam, homeGoals, awayGoals) {
  // Determinar el resultado desde la perspectiva de cada equipo
  let homeResult, awayResult;
  if (homeGoals > awayGoals) {
    homeResult = 'win';
    awayResult = 'loss';
  } else if (homeGoals < awayGoals) {
    homeResult = 'loss';
    awayResult = 'win';
  } else {
    homeResult = 'draw';
    awayResult = 'draw';
  }

  league.push({
    team: homeTeam,
    opponent: awayTeam,
    goalsFor: homeGoals,
    goalsAgainst: awayGoals,
    result: homeResult,
  });

  league.push({
    team: awayTeam,
    opponent: homeTeam,
    goalsFor: awayGoals,
    goalsAgainst: homeGoals,
    result: awayResult,
  });
}

// ---------------------------------------------------------------------------
// Utilidad interna: calcular puntos de un resultado
// ---------------------------------------------------------------------------

/**
 * Maps a match result string to its point value.
 * @param {'win'|'draw'|'loss'} result
 * @returns {number}
 */
function resultToPoints(result) {
  if (result === 'win')  return 3;
  if (result === 'draw') return 1;
  return 0;
}

// ---------------------------------------------------------------------------
// getStandings
// ---------------------------------------------------------------------------

/**
 * Computes the league standings table from the match history.
 * Each row aggregates all matches for one team and is sorted by:
 *   1. Points (desc)  2. Goal difference (desc)  3. Goals scored (desc)
 *
 * @param {Array} league - Arreglo del historial de partidos
 * @returns {Array<{
 *   team: string,
 *   played: number,
 *   won: number,
 *   drawn: number,
 *   lost: number,
 *   goalsFor: number,
 *   goalsAgainst: number,
 *   goalDiff: number,
 *   points: number
 * }>} Clasificación ordenada
 */
function getStandings(league) {
  // Agrupar entradas por equipo usando reduce
  const teamMap = league.reduce((acc, entry) => {
    if (!acc[entry.team]) {
      acc[entry.team] = {
        team: entry.team,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      };
    }
    const row = acc[entry.team];
    row.played      += 1;
    row.goalsFor    += entry.goalsFor;
    row.goalsAgainst += entry.goalsAgainst;
    if (entry.result === 'win')       row.won   += 1;
    else if (entry.result === 'draw') row.drawn += 1;
    else                              row.lost  += 1;
    return acc;
  }, {});

  // Convertir mapa a array, calcular puntos y diferencia de goles
  const rows = Object.values(teamMap).map((row) => ({
    ...row,
    goalDiff: row.goalsFor - row.goalsAgainst,
    // CORREGIDO: los puntos se calculan correctamente: victorias*3 + empates*1
    points: row.won * 3 + row.drawn * 1,
  }));

  // Ordenar por puntos desc, luego GD desc, luego goalsFor desc
  rows.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    return b.goalsFor - a.goalsFor;
  });

  return rows;
}

// ---------------------------------------------------------------------------
// getTopTeams
// ---------------------------------------------------------------------------

/**
 * Returns the top N teams from the standings.
 *
 * @param {Array}  league - Arreglo del historial de partidos
 * @param {number} n      - Número de equipos a retornar
 * @returns {Array} Los N primeros equipos de la clasificación
 */
function getTopTeams(league, n) {
  return getStandings(league).slice(0, n);
}

// ---------------------------------------------------------------------------
// getTeamHistory
// ---------------------------------------------------------------------------

/**
 * Returns all match entries for a specific team, in insertion order.
 *
 * @param {Array}  league   - Arreglo del historial de partidos
 * @param {string} teamName - Nombre del equipo a consultar
 * @returns {Array} Todas las entradas del equipo en el historial
 */
function getTeamHistory(league, teamName) {
  return league.filter((entry) => entry.team === teamName);
}

// ---------------------------------------------------------------------------
// getHeadToHead
// ---------------------------------------------------------------------------

/**
 * Returns the two match entries (one per team) from a direct confrontation between
 * teamA and teamB. If they have not faced each other, returns an empty array.
 *
 * @param {Array}  league  - Arreglo del historial de partidos
 * @param {string} teamA   - Nombre del primer equipo
 * @param {string} teamB   - Nombre del segundo equipo
 * @returns {Array} Las dos entradas del enfrentamiento directo, o [] si no existe
 */
function getHeadToHead(league, teamA, teamB) {
  return league.filter(
    (entry) =>
      (entry.team === teamA && entry.opponent === teamB) ||
      (entry.team === teamB && entry.opponent === teamA)
  );
}

// ---------------------------------------------------------------------------
// getTopScorers
// ---------------------------------------------------------------------------

/**
 * Returns the top N teams ordered by total goals scored (descending).
 * Each element has { team, goalsFor }.
 *
 * @param {Array}  league - Arreglo del historial de partidos
 * @param {number} n      - Número de equipos a retornar
 * @returns {Array<{ team: string, goalsFor: number }>}
 */
function getTopScorers(league, n) {
  // Acumular goles por equipo
  const goalMap = league.reduce((acc, entry) => {
    if (!acc[entry.team]) {
      acc[entry.team] = { team: entry.team, goalsFor: 0 };
    }
    acc[entry.team].goalsFor += entry.goalsFor;
    return acc;
  }, {});

  // Ordenar de mayor a menor goles anotados y devolver los N primeros
  return Object.values(goalMap)
    .sort((a, b) => b.goalsFor - a.goalsFor)
    .slice(0, n);
}

// ---------------------------------------------------------------------------
// getRelegationZone
// ---------------------------------------------------------------------------

/**
 * Returns the bottom N teams from the standings (relegation candidates).
 *
 * @param {Array}  league - Arreglo del historial de partidos
 * @param {number} n      - Número de equipos en zona de descenso
 * @returns {Array} Los N últimos equipos de la clasificación
 */
function getRelegationZone(league, n) {
  const standings = getStandings(league);
  return standings.slice(standings.length - n, standings.length);
}

// ---------------------------------------------------------------------------
// Exportaciones
// ---------------------------------------------------------------------------

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    recordMatch,
    getStandings,
    getTopTeams,
    getTeamHistory,
    getHeadToHead,
    getTopScorers,
    getRelegationZone,
  };
}
