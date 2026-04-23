/**
 * Poker Hand Ranker
 *
 * Clasifica manos de 5 cartas de póker.
 * Cada carta se representa como una cadena: valor + palo (ej. "7H", "KS").
 * Valores: 2-9, T(10), J, Q, K, A.
 */

/**
 * Cuenta cuántas veces aparece cada valor en la mano.
 * @param {string[]} hand
 * @returns {number[]} - frecuencias ordenadas de mayor a menor
 */
function getFrequencies(hand) {
  const counts = {};
  for (const card of hand) {
    const value = card.slice(0, -1);
    counts[value] = (counts[value] || 0) + 1;
  }
  return Object.values(counts).sort((a, b) => b - a);
}

/**
 * Clasifica una mano de 5 cartas de póker.
 * @param {string[]} hand - arreglo de 5 cartas
 * @returns {string} - nombre del ranking
 */
function rankHand(hand) {
  const freq = getFrequencies(hand);
  const [first, second] = freq;

  if (first === 4) return 'four_of_a_kind';
  if (first === 3 && second === 2) return 'full_house';
  if (first === 3) return 'three_of_a_kind';
  if (first === 2 && second === 2) return 'two_pair';
  if (first === 2) return 'one_pair';
  return 'high_card';
}

module.exports = { rankHand };
