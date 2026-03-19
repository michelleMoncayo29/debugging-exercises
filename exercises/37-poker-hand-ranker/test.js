/**
 * Pruebas para: Poker Hand Ranker
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/37-poker-hand-ranker
 */

const { rankHand } = require('./buggy-code.js');
// const { } = require('./solution.js');

describe('Poker Hand Ranker - Error Lógico', () => {
  test('debe identificar un par', () => {
    expect(rankHand(['2H', '2D', '5C', '8S', 'KH'])).toBe('one_pair');
  });

  test('debe identificar doble par', () => {
    expect(rankHand(['2H', '2D', '5C', '5S', 'KH'])).toBe('two_pair');
  });

  test('debe identificar un trío', () => {
    expect(rankHand(['7H', '7D', '7C', '2S', 'KH'])).toBe('three_of_a_kind');
  });

  test('debe identificar un full house', () => {
    expect(rankHand(['7H', '7D', '7C', 'KS', 'KH'])).toBe('full_house');
  });

  test('debe identificar póker (four of a kind)', () => {
    expect(rankHand(['9H', '9D', '9C', '9S', 'KH'])).toBe('four_of_a_kind');
  });

  test('debe identificar carta alta cuando no hay combinación', () => {
    expect(rankHand(['2H', '5D', '7C', '9S', 'KH'])).toBe('high_card');
  });

  test('un trío no debe confundirse con full house', () => {
    const hand = ['7H', '7D', '7C', '2S', 'KH'];
    expect(rankHand(hand)).not.toBe('full_house');
    expect(rankHand(hand)).toBe('three_of_a_kind');
  });

  test('un par no debe confundirse con full house', () => {
    const hand = ['7H', '7D', '2C', '5S', 'KH'];
    expect(rankHand(hand)).not.toBe('full_house');
    expect(rankHand(hand)).toBe('one_pair');
  });
});
