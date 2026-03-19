/**
 * Tests para el ejercicio 59: Validador de Luhn
 *
 * Por defecto se importa desde ./buggy-code.
 * Para verificar la solución, cambia la línea de importación a:
 * const { ... } = require('./buggy-code');
 */

const {
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
} = require('./buggy-code');
// const {
//   luhnCheck,
//   generateCheckDigit,
//   detectCardType,
//   maskCardNumber,
//   formatCardNumber,
//   validateCards,
//   getInvalidCards,
//   getLuhnStats,
//   groupByCardType,
//   getTopCardTypes,
// } = require('./buggy-code');

// ---------------------------------------------------------------------------
// Números de tarjeta conocidos para las pruebas
// ---------------------------------------------------------------------------
const VISA         = '4111111111111111';
const MASTERCARD   = '5500005555555559';
const AMEX         = '371449635398431';
const DISCOVER     = '6011111111111117';
const LUHN_SHORT   = '79927398713';     // número corto válido conocido

const INVALID_VISA = '4111111111111112';
const INVALID_RAND = '1234567890123456';
const INVALID_SEQ  = '9999999999999999';

// ---------------------------------------------------------------------------
// luhnCheck
// ---------------------------------------------------------------------------

describe('luhnCheck — validación del algoritmo de Luhn', () => {
  test('debería retornar true para un número Visa válido conocido', () => {
    expect(luhnCheck(VISA)).toBe(true);
  });

  test('debería retornar true para un número Mastercard válido conocido', () => {
    expect(luhnCheck(MASTERCARD)).toBe(true);
  });

  test('debería retornar true para un número Amex válido conocido', () => {
    expect(luhnCheck(AMEX)).toBe(true);
  });

  test('debería retornar true para un número Discover válido conocido', () => {
    expect(luhnCheck(DISCOVER)).toBe(true);
  });

  test('debería retornar true para el número corto 79927398713', () => {
    expect(luhnCheck(LUHN_SHORT)).toBe(true);
  });

  test('debería retornar false cuando el último dígito es incorrecto (Visa)', () => {
    expect(luhnCheck(INVALID_VISA)).toBe(false);
  });

  test('debería retornar false para un número aleatorio inválido', () => {
    expect(luhnCheck(INVALID_RAND)).toBe(false);
  });

  test('debería retornar false para un número con todos los dígitos iguales a 9', () => {
    expect(luhnCheck(INVALID_SEQ)).toBe(false);
  });

  test('debería retornar true para el dígito único "0"', () => {
    expect(luhnCheck('0')).toBe(true);
  });

  test('debería aceptar números con espacios y validarlos correctamente (Visa con espacios)', () => {
    expect(luhnCheck('4111 1111 1111 1111')).toBe(true);
  });

  test('debería aceptar un número Amex con espacios y retornar true', () => {
    expect(luhnCheck('3714 496353 98431')).toBe(true);
  });

  test('debería retornar false para Visa con espacios y último dígito incorrecto', () => {
    expect(luhnCheck('4111 1111 1111 1112')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// generateCheckDigit
// ---------------------------------------------------------------------------

describe('generateCheckDigit — generación del dígito de verificación', () => {
  test('debería retornar 1 para el parcial de Visa "411111111111111"', () => {
    expect(generateCheckDigit('411111111111111')).toBe(1);
  });

  test('debería retornar 3 para el parcial "7992739871"', () => {
    expect(generateCheckDigit('7992739871')).toBe(3);
  });

  test('debería retornar un dígito entre 0 y 9 inclusive', () => {
    const digit = generateCheckDigit('550000555555555');
    expect(digit).toBeGreaterThanOrEqual(0);
    expect(digit).toBeLessThanOrEqual(9);
  });

  test('el número completo resultante debería pasar luhnCheck (Visa)', () => {
    const partial = '411111111111111';
    const checkDigit = generateCheckDigit(partial);
    expect(luhnCheck(partial + String(checkDigit))).toBe(true);
  });

  test('el número completo resultante debería pasar luhnCheck (Mastercard)', () => {
    const partial = '550000555555555';
    const checkDigit = generateCheckDigit(partial);
    expect(luhnCheck(partial + String(checkDigit))).toBe(true);
  });

  test('el número completo resultante debería pasar luhnCheck (número corto)', () => {
    const partial = '799273987';
    const checkDigit = generateCheckDigit(partial);
    expect(luhnCheck(partial + String(checkDigit))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// detectCardType
// ---------------------------------------------------------------------------

describe('detectCardType — detección del tipo de tarjeta', () => {
  test('debería retornar "Visa" para un número que empieza con 4', () => {
    expect(detectCardType(VISA)).toBe('Visa');
  });

  test('debería retornar "Mastercard" para un número que empieza con 55', () => {
    expect(detectCardType(MASTERCARD)).toBe('Mastercard');
  });

  test('debería retornar "Mastercard" para un número que empieza con 51', () => {
    expect(detectCardType('5100000000000000')).toBe('Mastercard');
  });

  test('debería retornar "Amex" para un número que empieza con 37', () => {
    expect(detectCardType(AMEX)).toBe('Amex');
  });

  test('debería retornar "Amex" para un número que empieza con 34', () => {
    expect(detectCardType('341111111111111')).toBe('Amex');
  });

  test('debería retornar "Discover" para un número que empieza con 6011', () => {
    expect(detectCardType(DISCOVER)).toBe('Discover');
  });

  test('debería retornar "Discover" para un número que empieza con 65', () => {
    expect(detectCardType('6500000000000000')).toBe('Discover');
  });

  test('debería retornar "Unknown" para un prefijo no reconocido', () => {
    expect(detectCardType(INVALID_RAND)).toBe('Unknown');
  });

  test('debería ignorar espacios al detectar el tipo', () => {
    expect(detectCardType('4111 1111 1111 1111')).toBe('Visa');
  });
});

// ---------------------------------------------------------------------------
// maskCardNumber
// ---------------------------------------------------------------------------

describe('maskCardNumber — enmascaramiento del número de tarjeta', () => {
  test('debería mostrar solo los últimos 4 dígitos de una Visa (16 dígitos)', () => {
    expect(maskCardNumber(VISA)).toBe('************1111');
  });

  test('debería mostrar solo los últimos 4 dígitos de una Amex (15 dígitos)', () => {
    expect(maskCardNumber(AMEX)).toBe('***********8431');
  });

  test('debería usar asteriscos para los dígitos ocultos', () => {
    const result = maskCardNumber(VISA);
    const stars = result.slice(0, -4);
    expect(stars).toMatch(/^\*+$/);
  });

  test('debería tener la misma longitud que el número original sin espacios', () => {
    const result = maskCardNumber(VISA);
    expect(result).toHaveLength(16);
  });

  test('debería eliminar espacios antes de enmascarar', () => {
    expect(maskCardNumber('4111 1111 1111 1111')).toBe('************1111');
  });

  test('debería mostrar los últimos 4 dígitos correctos para Mastercard', () => {
    expect(maskCardNumber(MASTERCARD)).toBe('************5559');
  });
});

// ---------------------------------------------------------------------------
// formatCardNumber
// ---------------------------------------------------------------------------

describe('formatCardNumber — formateo del número de tarjeta', () => {
  test('debería formatear una Visa en grupos de 4 por defecto', () => {
    expect(formatCardNumber(VISA)).toBe('4111 1111 1111 1111');
  });

  test('debería formatear una Amex en grupos de 4', () => {
    expect(formatCardNumber(AMEX, 4)).toBe('3714 4963 5398 431');
  });

  test('debería formatear en grupos de 6 cuando se indica groupSize=6', () => {
    expect(formatCardNumber(VISA, 6)).toBe('411111 111111 1111');
  });

  test('debería eliminar espacios previos antes de reformatear', () => {
    expect(formatCardNumber('4111 1111 1111 1111')).toBe('4111 1111 1111 1111');
  });

  test('debería formatear un número corto correctamente', () => {
    expect(formatCardNumber(LUHN_SHORT, 4)).toBe('7992 7398 713');
  });
});

// ---------------------------------------------------------------------------
// validateCards
// ---------------------------------------------------------------------------

describe('validateCards — filtrado de tarjetas válidas', () => {
  const mixedCards = [VISA, INVALID_VISA, MASTERCARD, INVALID_RAND, AMEX];
  const allInvalid = [INVALID_VISA, INVALID_RAND, INVALID_SEQ];
  const allValid   = [VISA, MASTERCARD, AMEX, DISCOVER];

  test('debería retornar solo las tarjetas válidas de un arreglo mixto', () => {
    const result = validateCards(mixedCards);
    expect(result).toContain(VISA);
    expect(result).toContain(MASTERCARD);
    expect(result).toContain(AMEX);
    expect(result).not.toContain(INVALID_VISA);
    expect(result).not.toContain(INVALID_RAND);
  });

  test('debería retornar un arreglo vacío si todas son inválidas', () => {
    expect(validateCards(allInvalid)).toHaveLength(0);
  });

  test('debería retornar todas las tarjetas si todas son válidas', () => {
    expect(validateCards(allValid)).toHaveLength(allValid.length);
  });

  test('debería retornar un arreglo vacío para un arreglo vacío', () => {
    expect(validateCards([])).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// getInvalidCards
// ---------------------------------------------------------------------------

describe('getInvalidCards — filtrado de tarjetas inválidas', () => {
  const mixedCards = [VISA, INVALID_VISA, MASTERCARD, INVALID_RAND];

  test('debería retornar solo las tarjetas inválidas de un arreglo mixto', () => {
    const result = getInvalidCards(mixedCards);
    expect(result).toContain(INVALID_VISA);
    expect(result).toContain(INVALID_RAND);
    expect(result).not.toContain(VISA);
    expect(result).not.toContain(MASTERCARD);
  });

  test('debería retornar un arreglo vacío si todas son válidas', () => {
    expect(getInvalidCards([VISA, MASTERCARD, AMEX])).toHaveLength(0);
  });

  test('debería retornar todas si todas son inválidas', () => {
    const allInvalid = [INVALID_VISA, INVALID_RAND];
    expect(getInvalidCards(allInvalid)).toHaveLength(2);
  });

  test('debería ser complementario a validateCards (sin intersección)', () => {
    const cards = [VISA, INVALID_VISA, MASTERCARD, INVALID_RAND];
    const valid   = validateCards(cards);
    const invalid = getInvalidCards(cards);
    expect(valid.length + invalid.length).toBe(cards.length);
    valid.forEach((c) => expect(invalid).not.toContain(c));
  });
});

// ---------------------------------------------------------------------------
// getLuhnStats
// ---------------------------------------------------------------------------

describe('getLuhnStats — estadísticas de validación', () => {
  test('debería retornar total, valid, invalid y validRate correctos para arreglo mixto', () => {
    const numbers = [VISA, MASTERCARD, AMEX, INVALID_VISA];
    const stats = getLuhnStats(numbers);
    expect(stats.total).toBe(4);
    expect(stats.valid).toBe(3);
    expect(stats.invalid).toBe(1);
    expect(stats.validRate).toBe(75);
  });

  test('debería retornar validRate 100 cuando todos son válidos', () => {
    const stats = getLuhnStats([VISA, MASTERCARD]);
    expect(stats.total).toBe(2);
    expect(stats.valid).toBe(2);
    expect(stats.invalid).toBe(0);
    expect(stats.validRate).toBe(100);
  });

  test('debería retornar validRate 0 cuando todos son inválidos', () => {
    const stats = getLuhnStats([INVALID_VISA, INVALID_RAND]);
    expect(stats.valid).toBe(0);
    expect(stats.validRate).toBe(0);
  });

  test('debería retornar todos los campos en 0 para un arreglo vacío', () => {
    const stats = getLuhnStats([]);
    expect(stats).toEqual({ total: 0, valid: 0, invalid: 0, validRate: 0 });
  });

  test('debería calcular validRate con 2 decimales (50.00 → 50)', () => {
    const stats = getLuhnStats([VISA, INVALID_VISA]);
    expect(stats.validRate).toBe(50);
  });

  test('debería calcular validRate con decimales para proporciones no enteras', () => {
    // 1 válida de 3 → 33.33%
    const stats = getLuhnStats([VISA, INVALID_VISA, INVALID_RAND]);
    expect(stats.validRate).toBeCloseTo(33.33, 2);
  });
});

// ---------------------------------------------------------------------------
// groupByCardType
// ---------------------------------------------------------------------------

describe('groupByCardType — agrupación por tipo de tarjeta', () => {
  const cards = [VISA, MASTERCARD, AMEX, DISCOVER, INVALID_RAND, '4222222222222'];

  test('debería crear una clave "Visa" con todas las tarjetas Visa', () => {
    const groups = groupByCardType(cards);
    expect(groups['Visa']).toContain(VISA);
    expect(groups['Visa']).toContain('4222222222222');
  });

  test('debería crear una clave "Mastercard" con la tarjeta Mastercard', () => {
    const groups = groupByCardType(cards);
    expect(groups['Mastercard']).toContain(MASTERCARD);
  });

  test('debería crear una clave "Amex" con la tarjeta Amex', () => {
    const groups = groupByCardType(cards);
    expect(groups['Amex']).toContain(AMEX);
  });

  test('debería crear una clave "Discover" con la tarjeta Discover', () => {
    const groups = groupByCardType(cards);
    expect(groups['Discover']).toContain(DISCOVER);
  });

  test('debería crear una clave "Unknown" para números no reconocidos', () => {
    const groups = groupByCardType(cards);
    expect(groups['Unknown']).toContain(INVALID_RAND);
  });

  test('debería retornar un objeto vacío para un arreglo vacío', () => {
    expect(groupByCardType([])).toEqual({});
  });

  test('la suma de todos los grupos debe igualar el total de tarjetas', () => {
    const groups = groupByCardType(cards);
    const total = Object.values(groups).reduce((sum, arr) => sum + arr.length, 0);
    expect(total).toBe(cards.length);
  });
});

// ---------------------------------------------------------------------------
// getTopCardTypes
// ---------------------------------------------------------------------------

describe('getTopCardTypes — tipos de tarjeta más frecuentes', () => {
  const cards = [
    VISA, '4222222222222', '4000000000000002',   // 3 Visa
    MASTERCARD, '5100000000000000',               // 2 Mastercard
    AMEX,                                         // 1 Amex
    INVALID_RAND,                                 // 1 Unknown
  ];

  test('debería retornar el tipo más frecuente en primer lugar', () => {
    const top = getTopCardTypes(cards, 1);
    expect(top).toHaveLength(1);
    expect(top[0].type).toBe('Visa');
    expect(top[0].count).toBe(3);
  });

  test('debería respetar el límite n al retornar los tipos', () => {
    const top = getTopCardTypes(cards, 2);
    expect(top).toHaveLength(2);
  });

  test('debería ordenar los tipos de mayor a menor cantidad', () => {
    const top = getTopCardTypes(cards, 3);
    expect(top[0].count).toBeGreaterThanOrEqual(top[1].count);
    expect(top[1].count).toBeGreaterThanOrEqual(top[2].count);
  });

  test('debería retornar objetos con las propiedades "type" y "count"', () => {
    const top = getTopCardTypes(cards, 2);
    top.forEach((entry) => {
      expect(entry).toHaveProperty('type');
      expect(entry).toHaveProperty('count');
    });
  });

  test('debería retornar un arreglo vacío para un arreglo vacío de tarjetas', () => {
    expect(getTopCardTypes([], 3)).toHaveLength(0);
  });

  test('debería retornar todos los tipos si n es mayor que la cantidad de tipos distintos', () => {
    const singleType = [VISA, '4222222222222'];
    const top = getTopCardTypes(singleType, 10);
    expect(top).toHaveLength(1);
    expect(top[0].type).toBe('Visa');
    expect(top[0].count).toBe(2);
  });
});
