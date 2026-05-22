/**
 * anagram-finder.js
 *
 * Utilidades para detectar y agrupar anagramas dentro de listas de palabras.
 * Incluye: verificar si dos palabras son anagramas, agrupar palabras en familias
 * de anagramas, encontrar todos los anagramas de una palabra en una lista,
 * obtener el grupo más grande, filtrar por mínimo de anagramas, encontrar
 * palabras sin anagramas y calcular estadísticas generales.
 */

// ---------------------------------------------------------------------------
// sortLetters
// ---------------------------------------------------------------------------

/**
 * Returns the letters of a word sorted alphabetically (lowercased).
 * Used as a canonical key to identify anagram families.
 *
 * @param {string} word - La palabra a normalizar
 * @returns {string} Letras de la palabra ordenadas alfabéticamente en minúsculas
 */
function sortLetters(word) {
  return word
    .toLowerCase()
    .split('')
    .sort()
    .join('');
}

// ---------------------------------------------------------------------------
// areAnagrams
// ---------------------------------------------------------------------------

/**
 * Determines whether two words are anagrams of each other.
 * The comparison is case-insensitive.
 *
 * @param {string} wordA - Primera palabra
 * @param {string} wordB - Segunda palabra
 * @returns {boolean} true si son anagramas, false en caso contrario
 */
function areAnagrams(wordA, wordB) {
  if (wordA.length !== wordB.length) return false;
  return sortLetters(wordA) === sortLetters(wordB);
}

// ---------------------------------------------------------------------------
// groupAnagrams
// ---------------------------------------------------------------------------

/**
 * Groups a list of words into anagram families.
 * Each family is an array of words that are anagrams of each other.
 *
 * Uses a Map keyed by the canonical sorted-letter string so that all
 * anagrams of the same family are accumulated in O(n · k log k) time,
 * where k is the average word length.
 *
 * @param {string[]} words - Lista de palabras a agrupar
 * @returns {string[][]} Arreglo de grupos; cada grupo es un arreglo de anagramas
 */
function groupAnagrams(words) {
  if (words.length === 0) return [];

  const familyMap = words.reduce((map, word) => {
    const key = sortLetters(word);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(word);
    return map;
  }, new Map());

  return Array.from(familyMap.values());
}

// ---------------------------------------------------------------------------
// findAnagramsOf
// ---------------------------------------------------------------------------

/**
 * Finds all words in a list that are anagrams of a given target word.
 * The target word itself is excluded from the results, even if it appears
 * in the list.
 *
 * @param {string} targetWord - La palabra objetivo
 * @param {string[]} wordList  - Lista de palabras donde buscar
 * @returns {string[]} Palabras de la lista que son anagramas del objetivo
 */
function findAnagramsOf(targetWord, wordList) {
  const targetKey = sortLetters(targetWord);

  return wordList.filter((word) => {
    if (word.toLowerCase() === targetWord.toLowerCase()) return false;
    return sortLetters(word) === targetKey;
  });
}

// ---------------------------------------------------------------------------
// getLargestAnagramGroup
// ---------------------------------------------------------------------------

/**
 * Returns the largest anagram group from the given word list.
 * If there is a tie, returns the first largest group found.
 * Returns an empty array if the word list is empty.
 *
 * @param {string[]} words - Lista de palabras
 * @returns {string[]} El grupo de anagramas más grande
 */
function getLargestAnagramGroup(words) {
  if (words.length === 0) return [];

  const groups = groupAnagrams(words);

  return groups.reduce(
    (largest, group) => (group.length > largest.length ? group : largest),
    []
  );
}

// ---------------------------------------------------------------------------
// filterWordsWithMinAnagrams
// ---------------------------------------------------------------------------

/**
 * Returns only words that have at least `minAnagrams` anagrams within the
 * same word list (the word itself is not counted as its own anagram).
 *
 * @param {string[]} words       - Lista de palabras
 * @param {number}   minAnagrams - Mínimo de anagramas requeridos (inclusivo)
 * @returns {string[]} Palabras que cumplen el umbral mínimo de anagramas
 */
function filterWordsWithMinAnagrams(words, minAnagrams) {
  if (words.length === 0) return [];

  const familyMap = words.reduce((map, word) => {
    const key = sortLetters(word);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(word);
    return map;
  }, new Map());

  return words.filter((word) => {
    const key = sortLetters(word);
    const groupSize = familyMap.get(key).length;
    const anagramCount = groupSize - 1;
    return anagramCount >= minAnagrams;
  });
}

// ---------------------------------------------------------------------------
// findWordsWithNoAnagrams
// ---------------------------------------------------------------------------

/**
 * Returns words that have no anagrams within the same list.
 * These are words whose anagram family contains only themselves.
 *
 * @param {string[]} words - Lista de palabras
 * @returns {string[]} Palabras sin ningún anagrama en la lista
 */
function findWordsWithNoAnagrams(words) {
  if (words.length === 0) return [];

  const familyMap = words.reduce((map, word) => {
    const key = sortLetters(word);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(word);
    return map;
  }, new Map());

  return words.filter((word) => {
    const key = sortLetters(word);
    return familyMap.get(key).length === 1;
  });
}

// ---------------------------------------------------------------------------
// getAnagramStats
// ---------------------------------------------------------------------------

/**
 * Calculates aggregate statistics for the anagram groups of a word list.
 *
 * Returns:
 *   - totalGroups:      number of distinct anagram families
 *   - largestGroupSize: size of the biggest family
 *   - averageGroupSize: mean size of all families (0 if empty)
 *
 * @param {string[]} words - Lista de palabras
 * @returns {{ totalGroups: number, largestGroupSize: number, averageGroupSize: number }}
 */
function getAnagramStats(words) {
  if (words.length === 0) {
    return { totalGroups: 0, largestGroupSize: 0, averageGroupSize: 0 };
  }

  const groups = groupAnagrams(words);
  const totalGroups = groups.length;

  const largestGroupSize = groups.reduce(
    (max, group) => Math.max(max, group.length),
    0
  );

  const totalWords = groups.reduce((sum, group) => sum + group.length, 0);
  const averageGroupSize = totalWords / totalGroups;

  return { totalGroups, largestGroupSize, averageGroupSize };
}

// ---------------------------------------------------------------------------
// Exportaciones
// ---------------------------------------------------------------------------

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    sortLetters,
    areAnagrams,
    groupAnagrams,
    findAnagramsOf,
    getLargestAnagramGroup,
    filterWordsWithMinAnagrams,
    findWordsWithNoAnagrams,
    getAnagramStats,
  };
}
