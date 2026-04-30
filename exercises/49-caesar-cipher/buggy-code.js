/**
 * Caesar Cipher
 *
 * Cifrado César: cifrado, descifrado, análisis de frecuencia de letras
 * y ataque por frecuencia para detectar el desplazamiento usado.
 */

const ALPHABET_SIZE = 26;

function shiftChar(char, shift) {
  const isUpper = char >= 'A' && char <= 'Z';
  const isLower = char >= 'a' && char <= 'z';
  if (!isUpper && !isLower) return char;

  const base = isUpper ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
  const code = char.charCodeAt(0);
  const shifted = ((code - base + shift + ALPHABET_SIZE) % ALPHABET_SIZE) + base;
  return String.fromCharCode(shifted);
}

function encrypt(text, shift) {
  return Array.from(text)
    .map(char => shiftChar(char, shift))
    .join('');
}

// Descifra el texto — usa desplazamiento positivo en lugar de negativo
function decrypt(text, shift) {
  return Array.from(text)
    .map(char => shiftChar(char, -shift))
    .join('');
}

function analyzeFrequency(text) {
  const counts = Array.from(text.toUpperCase())
    .filter(c => c >= 'A' && c <= 'Z')
    .reduce((acc, c) => {
      acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {});

  return Object.entries(counts)
    .map(([letter, count]) => ({ letter, count }))
    .sort((a, b) => b.count - a.count);
}

function crackCipher(ciphertext) {
  const freq = analyzeFrequency(ciphertext);
  if (freq.length === 0) return { likelyShift: 0, decrypted: ciphertext };

  const mostFrequent = freq[0].letter;
  const shift = (mostFrequent.charCodeAt(0) - 'E'.charCodeAt(0) + ALPHABET_SIZE) % ALPHABET_SIZE;

  return {
    likelyShift: shift,
    mostFrequentLetter: mostFrequent,
    decrypted: decrypt(ciphertext, shift),
    frequencyAnalysis: freq.slice(0, 5),
  };
}

function bruteForce(ciphertext) {
  return Array.from({ length: ALPHABET_SIZE }, (_, shift) => ({
    shift,
    text: decrypt(ciphertext, shift),
  }));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { encrypt, decrypt, crackCipher, analyzeFrequency, bruteForce };
}

if (require.main === module) {
  const message = 'Hello, World!';
  const encrypted = encrypt(message, 13);
  console.log('Encrypted:', encrypted);
  console.log('Decrypted (wrong):', decrypt(encrypted, 13));
}
