/**
 * Roman Numeral Converter
 *
 * Convierte entre números enteros (1-3999) y numerales romanos.
 * El algoritmo greedy de toRoman requiere que la tabla esté ordenada
 * de mayor a menor para que siempre se tome el valor más grande posible.
 */

const ROMAN_TABLE = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

/**
 * Convierte un entero (1-3999) a numeral romano.
 * @param {number} num
 * @returns {string}
 */
function toRoman(num) {
  let result = '';
  let remaining = num;

  for (const [value, numeral] of ROMAN_TABLE) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }

  return result;
}

/**
 * Convierte un numeral romano a entero.
 * @param {string} roman
 * @returns {number}
 */
function fromRoman(roman) {
  const VALUES = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;

  for (let i = 0; i < roman.length; i++) {
    const current = VALUES[roman[i]];
    const next = VALUES[roman[i + 1]];

    if (next && current < next) {
      total -= current;
    } else {
      total += current;
    }
  }

  return total;
}

module.exports = { toRoman, fromRoman };
