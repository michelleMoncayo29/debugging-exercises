/**
 * Módulo de validación de contraseñas
 *
 * Verifica que una contraseña cumpla con los requisitos de seguridad:
 * longitud adecuada y complejidad (mayúsculas, minúsculas, números y caracteres especiales).
 */

const DEFAULT_MIN_LENGTH = 8;
const DEFAULT_MAX_LENGTH = 20;

/**
 * Verifica si la contraseña cumple los requisitos de longitud
 * @param {string} password - Contraseña a evaluar
 * @param {number} minLength - Longitud mínima permitida
 * @param {number} maxLength - Longitud máxima permitida
 * @returns {boolean}
 */
function checkLength(
  password,
  minLength = DEFAULT_MIN_LENGTH,
  maxLength = DEFAULT_MAX_LENGTH,
) {
  // Verificar que la contraseña esté dentro del rango de longitud permitido
  return password.length >= minLength && password.length <= maxLength;
}

/**
 * Verifica los criterios de complejidad de la contraseña
 * @param {string} password - Contraseña a evaluar
 * @returns {{ hasUppercase: boolean, hasLowercase: boolean, hasNumber: boolean, hasSpecial: boolean }}
 */
function checkComplexity(password) {
  return {
    // Detectar si la contraseña contiene letras mayúsculas
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>_\-+=\\/]/.test(password),
  };
}

/**
 * Calcula la puntuación de fortaleza de la contraseña (0 a 5)
 * @param {string} password - Contraseña a evaluar
 * @returns {number} Puntuación de 0 (muy débil) a 5 (muy fuerte)
 */
function calculateStrength(password) {
  // Inicializar el puntaje base de fortaleza
  let score = 0;
  if (checkLength(password)) score++;
  const complexity = checkComplexity(password);
  if (complexity.hasUppercase) score++;
  if (complexity.hasLowercase) score++;
  if (complexity.hasNumber) score++;
  if (complexity.hasSpecial) score++;
  return score;
}

/**
 * Valida una contraseña de forma completa
 * @param {string} password - Contraseña a validar
 * @returns {{ isValid: boolean, strength: number, details: object }}
 */
function validatePassword(password) {
  if (typeof password !== 'string') {
    throw new Error('La contraseña debe ser una cadena de texto');
  }
  const lengthOk = checkLength(password);
  const complexity = checkComplexity(password);
  const allComplexityMet = Object.values(complexity).every(Boolean);
  return {
    isValid: lengthOk && allComplexityMet,
    strength: calculateStrength(password),
    details: { lengthOk, ...complexity },
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    checkLength,
    checkComplexity,
    calculateStrength,
    validatePassword,
  };
}

if (require.main === module) {
  console.log(validatePassword('Hello123!'));
}
