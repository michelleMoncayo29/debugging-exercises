/**
 * Scrabble Scorer
 *
 * Sistema de puntuación para Scrabble: valores de letras, casillas especiales
 * (DL, TL, DW, TW), mejor jugada y tabla de posiciones.
 */

// Tabla de valores de letras estándar de Scrabble
const LETTER_VALUES = {
  A: 1, E: 1, I: 1, O: 1, U: 1, L: 1, N: 1, S: 1, T: 1, R: 1,
  D: 2, G: 2,
  B: 3, C: 3, M: 3, P: 3,
  F: 4, H: 4, V: 4, W: 4, Y: 4,
  K: 5,
  J: 8, X: 8,
  Q: 10, Z: 10,
};

// Retorna el valor base de una letra
function getLetterValue(letter) {
  return LETTER_VALUES[letter.toUpperCase()] || 0;
}

// Puntaje de una palabra sin casillas especiales
function scoreWord(word) {
  return Array.from(word.toUpperCase()).reduce(
    (total, letter) => total + getLetterValue(letter),
    0
  );
}

// Calcula el puntaje de una palabra colocada en casillas especiales del tablero
function scorePlacement(word, squares) {
  const letters = Array.from(word.toUpperCase());

  // Luego aplica los multiplicadores individuales de letra sobre el total ya multiplicado
  const letterScore = letters.reduce((total, letter, idx) => {
    const square = squares.find(s => s.pos === idx);
    const baseValue = getLetterValue(letter);
    if (!square || !square.type) return total + baseValue;
    if (square.type === 'DL') return total + baseValue * 2;
    if (square.type === 'TL') return total + baseValue * 3;
    return total + baseValue;
  }, 0);

  const wordMultiplier = squares.reduce((multiplier, square) => {
    if (square.type === 'DW') return multiplier * 2;
    if (square.type === 'TW') return multiplier * 3;
    return multiplier;
  }, 1);

  return letterScore * wordMultiplier;
}

// Retorna la palabra con mayor puntaje de una lista
function getBestWord(words) {
  return words
    .map(word => ({ word, score: scoreWord(word) }))
    .reduce((best, current) => (current.score > best.score ? current : best));
}

// Tabla de posiciones ordenada por puntaje total descendente
function getLeaderboard(players) {
  return players
    .map(player => ({
      name: player.name,
      total: player.scores.reduce((sum, s) => sum + s, 0),
      gamesPlayed: player.scores.length,
      average: Math.round(player.scores.reduce((s, v) => s + v, 0) / player.scores.length),
    }))
    .sort((a, b) => b.total - a.total)
    .map((player, idx) => ({ ...player, rank: idx + 1 }));
}

// Estadísticas de una partida completa
function gameStats(plays) {
  const allScores = plays.flatMap(p => p.scores);
  const total = allScores.reduce((s, v) => s + v, 0);
  const best = plays.reduce(
    (best, p) => {
      const max = Math.max(...p.scores);
      return max > best.score ? { player: p.name, score: max } : best;
    },
    { player: '', score: -Infinity }
  );

  return {
    totalScore: total,
    averageScore: Math.round(total / allScores.length),
    highestPlay: best,
    uniqueLettersUsed: [
      ...new Set(plays.flatMap(p => p.words.flatMap(w => Array.from(w.toUpperCase())))),
    ].sort(),
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getLetterValue, scoreWord, scorePlacement, getBestWord, getLeaderboard, gameStats };
}

if (require.main === module) {
  console.log('QUIZ score:', scoreWord('QUIZ'));

  const squares = [
    { pos: 0, type: 'DL' },
    { pos: 1, type: null },
    { pos: 2, type: 'DW' },
  ];
  console.log('CAT con DL+DW:', scorePlacement('CAT', squares));
}
