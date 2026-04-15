/**
 * Run-Length Encoder
 *
 * Compresión RLE: convierte secuencias de caracteres repetidos en
 * pares (conteo)(carácter). Ejemplo: "aaabbc" → "3a2b1c".
 */

/**
 * Comprime una cadena usando Run-Length Encoding.
 * @param {string} str
 * @returns {string}
 */
function encode(str) {
  if (!str) return '';

  let result = '';
  let count = 1;

  for (let i = 1; i <= str.length; i++) {
    if (i < str.length && str[i] === str[i - 1]) {
      count++;
    } else {
      result += count + str[i - 1];
      count = 1;
    }
  }

  return result;
}

/**
 * Descomprime una cadena codificada con Run-Length Encoding.
 * @param {string} str
 * @returns {string}
 */
function decode(str) {
  if (!str) return '';

  return str.replace(/(\d+)([a-zA-Z])/g, (_, count, char) => {
    return char.repeat(parseInt(count, 10));
  });
}

module.exports = { encode, decode };
