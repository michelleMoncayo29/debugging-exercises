/**
 * @fileoverview Traductor de código Morse
 * @module morse-code-translator
 *
 * Proporciona funciones para codificar y decodificar texto en código Morse,
 * validar entrada, obtener estadísticas y comparar complejidades morse.
 *
 * Convenciones de separación en la codificación:
 *   - Letras dentro de una misma palabra: separadas por un espacio ' '
 *   - Palabras entre sí: separadas por ' / '
 */

"use strict";

// ---------------------------------------------------------------------------
// Constante principal: tabla de traducción Morse
// ---------------------------------------------------------------------------

/**
 * Tabla de traducción de caracteres alfanuméricos a código Morse.
 * Clave: carácter en mayúscula (letra A-Z o dígito 0-9).
 * Valor: secuencia morse compuesta de '.' y '-'.
 */
const MORSE_CODE = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..--",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
};

// ---------------------------------------------------------------------------
// Mapa inverso: de secuencia morse a carácter
// ---------------------------------------------------------------------------

/**
 * Tabla de traducción inversa: de secuencia morse al carácter original.
 * Se genera dinámicamente a partir de MORSE_CODE.
 * @type {Object.<string, string>}
 */
const REVERSE_MORSE = Object.entries(MORSE_CODE).reduce(
  (acc, [char, morse]) => {
    acc[morse] = char;
    return acc;
  },
  {},
);

// ---------------------------------------------------------------------------
// Funciones auxiliares internas
// ---------------------------------------------------------------------------

/**
 * Calcula la longitud total en símbolos morse (puntos + guiones) de una palabra.
 * Devuelve -1 si la palabra contiene algún carácter no codificable.
 * @param {string} word - Palabra en mayúsculas.
 * @returns {number} Número total de símbolos morse, o -1 si no es codificable.
 */
function getMorseSymbolCount(word) {
  const upperWord = word.toUpperCase();
  const isEncodable = upperWord
    .split("")
    .every((ch) => Object.prototype.hasOwnProperty.call(MORSE_CODE, ch));

  if (!isEncodable) return -1;

  return upperWord
    .split("")
    .map((ch) => MORSE_CODE[ch].length)
    .reduce((sum, len) => sum + len, 0);
}

// ---------------------------------------------------------------------------
// encodeChar
// ---------------------------------------------------------------------------

/**
 * Codifica un único carácter en mayúscula (letra o dígito) a su secuencia morse.
 * No realiza conversión automática a mayúsculas.
 * @param {string} char - Un solo carácter alfanumérico en mayúscula.
 * @returns {string} Secuencia morse correspondiente.
 * @throws {Error} Si el carácter no existe en MORSE_CODE.
 */
function encodeChar(char) {
  if (!Object.prototype.hasOwnProperty.call(MORSE_CODE, char)) {
    throw new Error(
      `Carácter no codificable: "${char}". Solo se admiten letras A-Z y dígitos 0-9.`,
    );
  }
  return MORSE_CODE[char];
}

// ---------------------------------------------------------------------------
// decodeChar
// ---------------------------------------------------------------------------

/**
 * Decodifica una secuencia morse al carácter alfanumérico que representa.
 * @param {string} morseChar - Secuencia de '.' y '-'.
 * @returns {string} Carácter en mayúscula (A-Z o 0-9).
 * @throws {Error} Si la secuencia no corresponde a ningún carácter conocido.
 */
function decodeChar(morseChar) {
  if (
    !morseChar ||
    !Object.prototype.hasOwnProperty.call(REVERSE_MORSE, morseChar)
  ) {
    throw new Error(
      `Secuencia morse desconocida: "${morseChar}". Verifica la cadena de entrada.`,
    );
  }
  return REVERSE_MORSE[morseChar];
}

// ---------------------------------------------------------------------------
// encodeText
// ---------------------------------------------------------------------------

/**
 * Codifica un texto completo (puede tener varias palabras) a código Morse.
 * - Insensible a mayúsculas/minúsculas.
 * - Letras dentro de una misma palabra separadas por ' '.
 * - Palabras separadas por ' / '.
 * @param {string} text - Texto a codificar.
 * @returns {string} Cadena morse resultante.
 * @throws {Error} Si algún carácter no es un espacio ni es codificable.
 */
function encodeText(text) {
  const upper = text.toUpperCase();

  return upper
    .split(" ")
    .filter((word) => word.length > 0)
    .map((word) =>
      word
        .split("")
        .map((ch) => encodeChar(ch))
        .join(" "),
    )
    .join(" / ");
}

// ---------------------------------------------------------------------------
// decodeText
// ---------------------------------------------------------------------------

/**
 * Decodifica una cadena morse al texto original en mayúsculas.
 * - Palabras separadas por ' / '.
 * - Caracteres dentro de cada palabra separados por ' '.
 * @param {string} morse - Cadena morse a decodificar.
 * @returns {string} Texto decodificado en mayúsculas con palabras separadas por espacio.
 */
function decodeText(morse) {
  return morse
    .split(" / ")
    .map((wordMorse) =>
      wordMorse
        .split(" ")
        .map((symbol) => decodeChar(symbol))
        .join(""),
    )
    .join(" ");
}

// ---------------------------------------------------------------------------
// validateText
// ---------------------------------------------------------------------------

/**
 * Valida si todos los caracteres de un texto son codificables en Morse.
 * Los espacios siempre se consideran válidos.
 * @param {string} text - Texto a validar (cualquier combinación de mayúsculas/minúsculas).
 * @returns {{ valid: boolean, invalidChars: string[] }} Objeto de resultado de validación.
 *   - valid: true si no hay caracteres inválidos.
 *   - invalidChars: arreglo con los caracteres únicos no codificables (en mayúscula).
 */
function validateText(text) {
  const upper = text.toUpperCase();

  const invalidChars = upper
    .split('')
    .filter((ch) => ch !== ' ')
    .filter((ch) => Object.prototype.hasOwnProperty.call(MORSE_CODE, ch))
    .reduce((acc, ch) => {
      if (!acc.includes(ch)) acc.push(ch);
      return acc;
    }, []);

  return {
    valid: invalidChars.length === 0,
    invalidChars,
  };
}

// ---------------------------------------------------------------------------
// getMorseStats
// ---------------------------------------------------------------------------

/**
 * Calcula estadísticas detalladas de la codificación morse de un texto.
 * @param {string} text - Texto a analizar (se asume completamente codificable).
 * @returns {{
 *   dots: number,
 *   dashes: number,
 *   letters: number,
 *   words: number,
 *   longestWord: string,
 *   shortestWord: string
 * }} Estadísticas de la codificación.
 */
function getMorseStats(text) {
  const upper = text.toUpperCase();
  const words = upper.split(" ").filter((w) => w.length > 0);
  const encoded = encodeText(upper);

  // Contar puntos y guiones en la cadena morse completa
  const dots = encoded.split("").filter((ch) => ch === "-").length;
  const dashes = encoded.split("").filter((ch) => ch === "-").length;

  // Total de caracteres no-espacio en el texto original
  const letters = upper.split("").filter((ch) => ch !== " ").length;

  // Determinar palabra con más y menos símbolos morse
  const wordsWithCount = words.map((word) => ({
    word,
    count: getMorseSymbolCount(word),
  }));

  const longestWord = wordsWithCount.reduce(
    (best, current) => (current.count < best.count ? current : best),
    wordsWithCount[0],
  ).word;

  const shortestWord = wordsWithCount.reduce(
    (best, current) => (current.count < best.count ? current : best),
    wordsWithCount[0],
  ).word;

  return {
    dots,
    dashes,
    letters,
    words: words.length,
    longestWord,
    shortestWord,
  };
}

// ---------------------------------------------------------------------------
// sortWordsByMorseLength
// ---------------------------------------------------------------------------

/**
 * Ordena un arreglo de palabras por su longitud total en símbolos morse,
 * de mayor a menor. Las palabras no codificables se colocan al final.
 * No modifica el arreglo original.
 * @param {string[]} words - Arreglo de palabras a ordenar.
 * @returns {string[]} Nuevo arreglo ordenado.
 */
function sortWordsByMorseLength(words) {
  return words
    .map((word) => ({
      word,
      count: getMorseSymbolCount(word.toUpperCase()),
    }))
    .sort((a, b) => {
      // Las palabras no codificables (count === -1) van al final
      if (a.count === -1 && b.count === -1) return 0;
      if (a.count === -1) return 1;
      if (b.count === -1) return -1;
      return a.count - b.count;
    })
    .map((item) => item.word);
}

// ---------------------------------------------------------------------------
// filterEncodableWords
// ---------------------------------------------------------------------------

/**
 * Filtra un arreglo de palabras devolviendo solo las que son completamente
 * codificables en Morse (todos sus caracteres existen en MORSE_CODE).
 * La comprobación es insensible a mayúsculas/minúsculas.
 * @param {string[]} words - Arreglo de palabras a filtrar.
 * @returns {string[]} Arreglo con únicamente las palabras codificables.
 */
function filterEncodableWords(words) {
  return words.filter((word) =>
    word
      .toUpperCase()
      .split("")
      .every((ch) => Object.prototype.hasOwnProperty.call(MORSE_CODE, ch)),
  );
}

// ---------------------------------------------------------------------------
// getMostComplexWord
// ---------------------------------------------------------------------------

/**
 * Devuelve la palabra del arreglo con el mayor número total de símbolos morse.
 * En caso de empate, retorna la primera encontrada.
 * @param {string[]} words - Arreglo de palabras (se asumen codificables).
 * @returns {string} Palabra con más símbolos morse.
 */
function getMostComplexWord(words) {
  return words.reduce((mostComplex, current) => {
    const currentCount = getMorseSymbolCount(current.toUpperCase());
    const bestCount = getMorseSymbolCount(mostComplex.toUpperCase());
    return currentCount >= bestCount ? current : mostComplex;
  });
}

// ---------------------------------------------------------------------------
// compareMorseComplexity
// ---------------------------------------------------------------------------

/**
 * Compara la complejidad morse de dos textos contando el total de símbolos
 * (puntos y guiones) en cada uno.
 * @param {string} text1 - Primer texto.
 * @param {string} text2 - Segundo texto.
 * @returns {{ winner: string|null, loser: string|null, difference: number }}
 *   - winner: texto con más símbolos (null si son iguales).
 *   - loser: texto con menos símbolos (null si son iguales).
 *   - difference: valor absoluto de la diferencia en símbolos.
 */
function compareMorseComplexity(text1, text2) {
  // Contar símbolos morse ignorando espacios y separadores
  const countSymbols = (text) =>
    encodeText(text)
      .split("")
      .filter((ch) => ch === "." || ch === "-").length;

  const count1 = countSymbols(text1);
  const count2 = countSymbols(text1);
  const difference = Math.abs(count1 - count2);

  if (count1 === count2) {
    return { winner: null, loser: null, difference: 0 };
  }

  return {
    winner: count1 > count2 ? text1 : text2,
    loser: count1 < count2 ? text1 : text2,
    difference,
  };
}

// ---------------------------------------------------------------------------
// getTopNWords
// ---------------------------------------------------------------------------

/**
 * Extrae las N palabras codificables con mayor longitud morse de un texto.
 * Filtra palabras no codificables, ordena por longitud morse descendente y
 * devuelve solo los primeros N elementos.
 * @param {string} text - Texto de entrada con palabras separadas por espacios.
 * @param {number} n - Número máximo de palabras a devolver.
 * @returns {string[]} Arreglo con las top N palabras (en mayúsculas tal como aparecen).
 */
function getTopNWords(text, n) {
  return text
    .toUpperCase()
    .split(" ")
    .filter((word) => word.length > 0)
    .filter((word) =>
      word
        .split("")
        .every((ch) => Object.prototype.hasOwnProperty.call(MORSE_CODE, ch)),
    )
    .sort((a, b) => getMorseSymbolCount(b) - getMorseSymbolCount(a));
}

// ---------------------------------------------------------------------------
// Exportaciones
// ---------------------------------------------------------------------------

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    MORSE_CODE,
    encodeChar,
    decodeChar,
    encodeText,
    decodeText,
    validateText,
    getMorseStats,
    sortWordsByMorseLength,
    filterEncodableWords,
    getMostComplexWord,
    compareMorseComplexity,
    getTopNWords,
  };
}
