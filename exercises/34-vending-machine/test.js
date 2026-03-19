/**
 * Pruebas para: Vending Machine
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/34-vending-machine
 */

const { calculateChange, canMakeChange } = require('./buggy-code.js');
// const { } = require('./solution.js');

describe('Vending Machine - Error Lógico', () => {
  const COINS = [1, 5, 10, 25, 50, 100];

  describe('calculateChange - cálculo de vuelto', () => {
    test('debe devolver exactamente 25 céntimos con una moneda de 25', () => {
      const result = calculateChange(50, 25, COINS);
      expect(result.coins).toEqual([25]);
      expect(result.possible).toBe(true);
    });

    test('debe devolver 75 céntimos usando la menor cantidad de monedas', () => {
      const result = calculateChange(100, 25, COINS);
      expect(result.coins).toEqual([50, 25]);
      expect(result.possible).toBe(true);
    });

    test('debe devolver 30 céntimos usando monedas de 25 y 5', () => {
      const result = calculateChange(55, 25, COINS);
      expect(result.coins).toEqual([25, 5]);
      expect(result.possible).toBe(true);
    });

    test('debe devolver 99 céntimos con la menor cantidad posible de monedas', () => {
      const result = calculateChange(100, 1, COINS);
      expect(result.coins).toEqual([50, 25, 10, 10, 1, 1, 1, 1]);
      expect(result.possible).toBe(true);
    });

    test('debe devolver vuelto cero cuando el pago es exacto', () => {
      const result = calculateChange(25, 25, COINS);
      expect(result.coins).toEqual([]);
      expect(result.possible).toBe(true);
    });

    test('debe reportar imposible si no puede completar el cambio exacto', () => {
      const result = calculateChange(30, 27, [10, 5]);
      expect(result.possible).toBe(false);
    });
  });

  describe('canMakeChange - verificación de posibilidad', () => {
    test('debe confirmar que 75 céntimos es posible con monedas estándar', () => {
      expect(canMakeChange(75, COINS)).toBe(true);
    });

    test('debe confirmar que 3 céntimos NO es posible solo con monedas de 5', () => {
      expect(canMakeChange(3, [5, 10])).toBe(false);
    });

    test('debe confirmar que 0 céntimos siempre es posible', () => {
      expect(canMakeChange(0, COINS)).toBe(true);
    });
  });
});
