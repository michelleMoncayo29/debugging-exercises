/**
 * Vending Machine
 *
 * Calcula el vuelto óptimo usando un algoritmo greedy.
 * El algoritmo greedy requiere que las monedas estén ordenadas
 * de mayor a menor para minimizar la cantidad de monedas devueltas.
 */

/**
 * Calcula el vuelto para una transacción usando el mínimo de monedas.
 * @param {number} paid - Cantidad pagada (en céntimos)
 * @param {number} price - Precio del producto (en céntimos)
 * @param {number[]} availableCoins - Denominaciones disponibles (en cualquier orden)
 * @returns {{ coins: number[], possible: boolean }}
 */
function calculateChange(paid, price, availableCoins) {
  const changeAmount = paid - price;

  if (changeAmount === 0) return { coins: [], possible: true };

  const sortedCoins = [...availableCoins].sort((a, b) => b - a);

  const usedCoins = [];
  let remaining = changeAmount;

  for (const coin of sortedCoins) {
    while (remaining >= coin) {
      usedCoins.push(coin);
      remaining -= coin;
    }
  }

  if (remaining !== 0) {
    return { coins: [], possible: false };
  }

  return { coins: usedCoins, possible: true };
}

/**
 * Indica si es posible dar un monto exacto con las monedas disponibles.
 * @param {number} amount
 * @param {number[]} availableCoins
 * @returns {boolean}
 */
function canMakeChange(amount, availableCoins) {
  return calculateChange(amount, 0, availableCoins).possible;
}

module.exports = { calculateChange, canMakeChange };
