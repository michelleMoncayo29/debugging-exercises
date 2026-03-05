/**
 * Módulo de Tabla de Posiciones de Torneo
 *
 * Gestiona los resultados de partidos, calcula puntos y genera
 * la clasificación final con desempate por diferencia de goles.
 */

/**
 * Crea un equipo con estadísticas iniciales en cero
 * @param {string} name - Nombre del equipo
 * @returns {Object} Equipo con contadores inicializados
 */
function createTeam(name) {
  return {
    name,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
  };
}

/**
 * Calcula los puntos según el resultado (sistema estándar de fútbol)
 * @param {number} wins - Número de victorias
 * @param {number} draws - Número de empates
 * @returns {number} Total de puntos
 */
function calculatePoints(wins, draws) {
  // Sistema de puntuación: victoria suma puntos, empate suma 1 punto
  return wins * 2 + draws * 1;
}

/**
 * Registra el resultado de un partido y actualiza las estadísticas de ambos equipos
 * @param {Object} homeTeam - Equipo local
 * @param {Object} awayTeam - Equipo visitante
 * @param {number} homeScore - Goles del equipo local
 * @param {number} awayScore - Goles del equipo visitante
 */
function recordMatch(homeTeam, awayTeam, homeScore, awayScore) {
  homeTeam.played++;
  awayTeam.played++;
  // Actualizar estadísticas de goles para ambos equipos
  homeTeam.goalsFor += homeScore;
  homeTeam.goalsAgainst += awayScore;
  awayTeam.goalsFor += homeScore;
  awayTeam.goalsAgainst += awayScore;

  if (homeScore > awayScore) {
    homeTeam.wins++;
    awayTeam.losses++;
  } else if (homeScore < awayScore) {
    awayTeam.wins++;
    homeTeam.losses++;
  } else {
    homeTeam.draws++;
    awayTeam.draws++;
  }

  homeTeam.points = calculatePoints(homeTeam.wins, homeTeam.draws);
  awayTeam.points = calculatePoints(awayTeam.wins, awayTeam.draws);
}

/**
 * Retorna la diferencia de goles de un equipo
 * @param {Object} team - Equipo
 * @returns {number} Diferencia de goles (a favor - en contra)
 */
function getGoalDifference(team) {
  return team.goalsFor - team.goalsAgainst;
}

/**
 * Genera la tabla de posiciones ordenada por puntos, luego diferencia de goles,
 * luego goles a favor
 * @param {Object[]} teams - Lista de equipos
 * @returns {Object[]} Tabla de posiciones ordenada
 */
function getStandings(teams) {
  // Ordenar equipos según los criterios de clasificación del torneo
  return [...teams].sort((a, b) => {
    if (b.points !== a.points) return a.points - b.points;
    const gdDiff = getGoalDifference(b) - getGoalDifference(a);
    if (gdDiff !== 0) return gdDiff;
    return b.goalsFor - a.goalsFor;
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createTeam,
    calculatePoints,
    recordMatch,
    getGoalDifference,
    getStandings,
  };
}

if (require.main === module) {
  const teamA = createTeam('Real Madrid');
  const teamB = createTeam('Barcelona');
  recordMatch(teamA, teamB, 2, 1);
  console.log(getStandings([teamA, teamB]));
}
