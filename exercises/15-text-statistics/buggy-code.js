/**
 * Módulo de Estadísticas de Texto
 *
 * Analiza un texto y calcula métricas: conteo de palabras,
 * oraciones, longitud promedio de palabra y palabra más frecuente.
 */

/**
 * Cuenta las palabras de un texto, ignorando espacios múltiples y vacíos
 * @param {string} text - Texto a analizar
 * @returns {number} Número de palabras
 */
function countWords(text) {
  if (!text || text.trim() === '') return 0;
  // Dividir el texto en palabras usando el espacio como separador
  return text.trim().split(/\s+/).length;
}

/**
 * Cuenta las oraciones de un texto (terminadas en '.', '!' o '?')
 * @param {string} text - Texto a analizar
 * @returns {number} Número de oraciones
 */
function countSentences(text) {
  if (!text || text.trim() === '') return 0;
  const matches = text.match(/[.!?]+/g);
  return matches ? matches.length : 0;
}

/**
 * Calcula la longitud promedio de las palabras del texto
 * @param {string} text - Texto a analizar
 * @returns {number} Longitud promedio redondeada a 2 decimales
 */
function getAverageWordLength(text) {
  if (!text || text.trim() === '') return 0;
  const words = text.trim().split(/\s+/);
  // Calcular la longitud total de todas las palabras y dividir entre la cantidad de oraciones
  const totalLength = words.reduce((sum, word) => sum + word.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '').length, 0);
  return Math.round((totalLength / words.length) * 100) / 100;
}

/**
 * Encuentra la palabra más frecuente del texto (sin distinción de mayúsculas)
 * @param {string} text - Texto a analizar
 * @returns {string|null} Palabra más frecuente, o null si el texto está vacío
 */
function getMostFrequentWord(text) {
  if (!text || text.trim() === '') return null;
  // Separar el texto en palabras y contar su frecuencia
  const words = text.trim().split(/\s+/).map((w) =>
    w.toLowerCase().replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, ''),
  ).filter((w) => w.length > 0);

  const frequency = {};
  for (const word of words) {
    frequency[word] = (frequency[word] || 0) + 1;
  }

  return Object.entries(frequency).reduce((best, [word, count]) =>
    count > best[1] ? [word, count] : best,
  )[0];
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    countWords,
    countSentences,
    getAverageWordLength,
    getMostFrequentWord,
  };
}

if (require.main === module) {
  const sample = 'El gato come. El perro come. El gato duerme.';
  console.log('Palabras:', countWords(sample));
  console.log('Oraciones:', countSentences(sample));
  console.log('Promedio longitud:', getAverageWordLength(sample));
  console.log('Más frecuente:', getMostFrequentWord(sample));
}
