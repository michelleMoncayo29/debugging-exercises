/**
 * Validador de números usando el algoritmo de Luhn
 *
 * El algoritmo de Luhn es un método de suma de verificación utilizado
 * para validar números de identificación como tarjetas de crédito,
 * números IMEI y otros identificadores numéricos.
 */

'use strict';

// ---------------------------------------------------------------------------
// Función auxiliar interna
// ---------------------------------------------------------------------------

/**
 * Elimina espacios de una cadena numérica y la convierte a string.
 * @param {string|number} number - Número a limpiar.
 * @returns {string} Cadena numérica sin espacios.
 */
function stripSpaces(number) {
  return String(number).replace(/\s/g, '');
}

// ---------------------------------------------------------------------------
// luhnCheck
// ---------------------------------------------------------------------------

/**
 * Valida un número usando el algoritmo de Luhn.
 *
 * Pasos del algoritmo:
 * 1. Invertir los dígitos.
 * 2. Doblar cada dígito en posición impar del array invertido (índices 1, 3, 5...).
 * 3. Si el doblado supera 9, restar 9.
 * 4. Sumar todos los dígitos. Si la suma es múltiplo de 10, el número es válido.
 *
 * @param {string|number} number - Número a validar (puede contener espacios).
 * @returns {boolean} true si el número pasa la validación de Luhn.
 */
function luhnCheck(number) {
  const digits = stripSpaces(number).split('').reverse().map(Number);

  const sum = digits.reduce((acc, digit, index) => {
    if (index % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    return acc + digit;
  }, 0);

  return sum % 10 === 0;
}

// ---------------------------------------------------------------------------
// generateCheckDigit
// ---------------------------------------------------------------------------

/**
 * Genera el dígito de verificación (check digit) para un número parcial.
 * El check digit es el dígito que al añadirse al final hace el número válido.
 *
 * @param {string|number} partialNumber - Número sin el dígito de verificación final.
 * @returns {number} Dígito de verificación (0-9).
 */
function generateCheckDigit(partialNumber) {
  const partial = stripSpaces(partialNumber);
  for (let d = 0; d <= 9; d++) {
    if (luhnCheck(partial + String(d))) {
      return d;
    }
  }
  return -1;
}

// ---------------------------------------------------------------------------
// detectCardType
// ---------------------------------------------------------------------------

/**
 * Detecta el tipo de tarjeta de crédito basándose en el prefijo del número.
 *
 * Reglas de prefijos:
 * - Visa:       empieza con 4
 * - Mastercard: empieza con 51-55
 * - Amex:       empieza con 34 o 37
 * - Discover:   empieza con 6011 o 65
 *
 * @param {string|number} number - Número de tarjeta (puede contener espacios).
 * @returns {string} 'Visa', 'Mastercard', 'Amex', 'Discover' o 'Unknown'.
 */
function detectCardType(number) {
  const n = stripSpaces(number);
  if (/^4/.test(n)) return 'Visa';
  if (/^5[1-5]/.test(n)) return 'Mastercard';
  if (/^3[47]/.test(n)) return 'Amex';
  if (/^6(?:011|5)/.test(n)) return 'Discover';
  return 'Unknown';
}

// ---------------------------------------------------------------------------
// maskCardNumber
// ---------------------------------------------------------------------------

/**
 * Enmascara un número de tarjeta mostrando solo los últimos 4 dígitos.
 * Los dígitos ocultos se reemplazan con '*'.
 *
 * @param {string|number} number - Número de tarjeta (puede contener espacios).
 * @returns {string} Número enmascarado sin espacios.
 * @example maskCardNumber('4111 1111 1111 1111') => '************1111'
 */
function maskCardNumber(number) {
  const n = stripSpaces(number);
  return '*'.repeat(n.length - 4) + n.slice(-4);
}

// ---------------------------------------------------------------------------
// formatCardNumber
// ---------------------------------------------------------------------------

/**
 * Formatea un número de tarjeta insertando un espacio cada groupSize dígitos.
 *
 * @param {string|number} number - Número de tarjeta (puede contener espacios previos).
 * @param {number} [groupSize=4] - Tamaño de cada grupo de dígitos.
 * @returns {string} Número formateado con espacios.
 * @example formatCardNumber('4111111111111111') => '4111 1111 1111 1111'
 */
function formatCardNumber(number, groupSize = 4) {
  const n = stripSpaces(number);
  return n.match(new RegExp(`.{1,${groupSize}}`, 'g')).join(' ');
}

// ---------------------------------------------------------------------------
// validateCards
// ---------------------------------------------------------------------------

/**
 * Filtra un arreglo de números retornando solo los que pasan la validación Luhn.
 *
 * @param {string[]} cards - Arreglo de números de tarjeta.
 * @returns {string[]} Solo los números válidos según Luhn.
 */
function validateCards(cards) {
  return cards.filter((card) => luhnCheck(card));
}

// ---------------------------------------------------------------------------
// getInvalidCards
// ---------------------------------------------------------------------------

/**
 * Filtra un arreglo de números retornando solo los que NO pasan la validación Luhn.
 *
 * @param {string[]} cards - Arreglo de números de tarjeta.
 * @returns {string[]} Solo los números inválidos según Luhn.
 */
function getInvalidCards(cards) {
  return cards.filter((card) => !luhnCheck(card));
}

// ---------------------------------------------------------------------------
// getLuhnStats
// ---------------------------------------------------------------------------

/**
 * Calcula estadísticas de validación Luhn para un arreglo de números.
 *
 * @param {string[]} numbers - Arreglo de números a analizar.
 * @returns {{
 *   total: number,
 *   valid: number,
 *   invalid: number,
 *   validRate: number
 * }} validRate es el porcentaje (0-100) redondeado a 2 decimales.
 */
function getLuhnStats(numbers) {
  const valid = numbers.filter((n) => luhnCheck(n)).length;
  const invalid = numbers.length - valid;
  const validRate =
    numbers.length > 0
      ? parseFloat(((valid / numbers.length) * 100).toFixed(2))
      : 0;

  return { total: numbers.length, valid, invalid, validRate };
}

// ---------------------------------------------------------------------------
// groupByCardType
// ---------------------------------------------------------------------------

/**
 * Agrupa un arreglo de números de tarjeta por tipo detectado.
 *
 * @param {string[]} cards - Arreglo de números de tarjeta.
 * @returns {Object.<string, string[]>} Objeto cuyas claves son los tipos de tarjeta
 *   y los valores son arreglos con los números de ese tipo.
 */
function groupByCardType(cards) {
  return cards.reduce((groups, card) => {
    const type = detectCardType(card);
    if (!groups[type]) groups[type] = [];
    groups[type].push(card);
    return groups;
  }, {});
}

// ---------------------------------------------------------------------------
// getTopCardTypes
// ---------------------------------------------------------------------------

/**
 * Retorna los N tipos de tarjeta más frecuentes en el arreglo,
 * ordenados de mayor a menor cantidad.
 *
 * @param {string[]} cards - Arreglo de números de tarjeta.
 * @param {number} n - Número máximo de tipos a retornar.
 * @returns {{ type: string, count: number }[]} Arreglo ordenado descendentemente.
 */
function getTopCardTypes(cards, n) {
  const grouped = groupByCardType(cards);
  return Object.entries(grouped)
    .map(([type, group]) => ({ type, count: group.length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

// ---------------------------------------------------------------------------
// Exportaciones
// ---------------------------------------------------------------------------

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    luhnCheck,
    generateCheckDigit,
    detectCardType,
    maskCardNumber,
    formatCardNumber,
    validateCards,
    getInvalidCards,
    getLuhnStats,
    groupByCardType,
    getTopCardTypes,
  };
}
