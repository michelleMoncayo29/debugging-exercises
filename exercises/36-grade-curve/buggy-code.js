/**
 * Grade Curve
 *
 * Aplica una curva de escala a un conjunto de notas: la nota más alta
 * sube a 100 y las demás se escalan proporcionalmente.
 */

/**
 * Devuelve la calificación en letra según el puntaje.
 * @param {number} score
 * @returns {string}
 */
function getLetterGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

/**
 * Aplica curva de escala: la nota máxima sube a 100 y las demás
 * se ajustan proporcionalmente.
 * @param {number[]} scores
 * @returns {number[]}
 */
function applyCurve(scores) {
  const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;

  if (average === 0) return scores.map(() => 0);

  return scores.map(score => {
    const curved = (score / average) * 100;
    return Math.round(curved * 100) / 100;
  });
}

module.exports = { applyCurve, getLetterGrade };
