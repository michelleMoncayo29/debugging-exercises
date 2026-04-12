/**
 * Email Extractor
 *
 * Módulo para validar y extraer direcciones de email desde texto libre.
 */

const EMAIL_PATTERN = /[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}/gi;

/**
 * Verifica si una cadena es un email válido.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const pattern = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/i;
  return pattern.test(email);
}

/**
 * Extrae todos los emails únicos de un texto, normalizados a minúsculas.
 * @param {string} text
 * @returns {string[]}
 */
function extractEmails(text) {
  const matches = text.match(EMAIL_PATTERN) ?? [];
  const normalized = matches.map(email => email.toLowerCase());
  return [...new Set(normalized)];
}

module.exports = { extractEmails, isValidEmail };
