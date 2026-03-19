/**
 * Pruebas para: Motor de Precios de Transporte Compartido
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/18-rideshare-pricing
 */

// IMPORTANTE: Cambiar esta línea para probar tu solución
const { Ride, PriceCalculator, haversineDistance } = require('./buggy-code.js');
// const { } = require('./solution.js');

describe('Motor de Precios de Transporte Compartido', () => {
  let calculator;

  beforeEach(() => {
    calculator = new PriceCalculator();
  });

  describe('calculateFare - Tarifa sin surge (multiplicador = 1)', () => {
    test('debe calcular la tarifa base correctamente sin surge', () => {
      const ride = new Ride(null, null, 10, 15, 1.0);
      // BASE=2.5, distancia=10*1.2=12, tiempo=15*0.25=3.75 → total=(2.5+12+3.75)*1=18.25
      expect(calculator.calculateFare(ride)).toBeCloseTo(18.25, 2);
    });

    test('debe retornar solo la tarifa base cuando distancia y tiempo son 0', () => {
      const ride = new Ride(null, null, 0, 0, 1.0);
      expect(calculator.calculateFare(ride)).toBeCloseTo(2.5, 2);
    });
  });

  describe('calculateFare - Surge pricing (multiplicador > 1)', () => {
    test('debe aplicar surge de 2x al total del viaje, no solo a la tarifa base', () => {
      const ride = new Ride(null, null, 10, 15, 2.0);
      // Sin surge: 2.5 + 12 + 3.75 = 18.25
      // Con surge 2x aplicado al TOTAL: 18.25 * 2 = 36.5
      expect(calculator.calculateFare(ride)).toBeCloseTo(36.5, 2);
    });

    test('debe aplicar surge de 1.5x al total del viaje', () => {
      const ride = new Ride(null, null, 10, 15, 1.5);
      // Sin surge: 18.25
      // Con surge 1.5x: 18.25 * 1.5 = 27.375
      expect(calculator.calculateFare(ride)).toBeCloseTo(27.375, 2);
    });

    test('debe aplicar surge de 2x a un viaje corto', () => {
      const ride = new Ride(null, null, 5, 10, 2.0);
      // BASE=2.5, distancia=5*1.2=6, tiempo=10*0.25=2.5 → sin surge=11
      // Con surge 2x: 11 * 2 = 22
      expect(calculator.calculateFare(ride)).toBeCloseTo(22, 2);
    });

    test('debe aplicar surge de 3x correctamente', () => {
      const ride = new Ride(null, null, 8, 20, 3.0);
      // BASE=2.5, distancia=8*1.2=9.6, tiempo=20*0.25=5 → sin surge=17.1
      // Con surge 3x: 17.1 * 3 = 51.3
      expect(calculator.calculateFare(ride)).toBeCloseTo(51.3, 2);
    });

    test('debe dar el mismo resultado con surge=1 que sin surge', () => {
      const rideNoSurge = new Ride(null, null, 10, 15, 1.0);
      const rideSurge1 = new Ride(null, null, 10, 15, 1.0);
      expect(calculator.calculateFare(rideNoSurge)).toBeCloseTo(
        calculator.calculateFare(rideSurge1),
        2,
      );
    });
  });

  describe('getDistanceFare - Tarifa por distancia', () => {
    test('debe calcular la tarifa por distancia correctamente', () => {
      const ride = new Ride(null, null, 10, 0, 1.0);
      expect(calculator.getDistanceFare(ride)).toBeCloseTo(12, 2);
    });
  });

  describe('getTimeFare - Tarifa por tiempo', () => {
    test('debe calcular la tarifa por tiempo correctamente', () => {
      const ride = new Ride(null, null, 0, 20, 1.0);
      expect(calculator.getTimeFare(ride)).toBeCloseTo(5, 2);
    });
  });

  describe('haversineDistance - Distancia entre coordenadas', () => {
    test('debe retornar 0 para el mismo punto', () => {
      expect(haversineDistance(4.711, -74.0721, 4.711, -74.0721)).toBeCloseTo(0, 2);
    });

    test('debe calcular una distancia positiva entre dos puntos distintos', () => {
      const dist = haversineDistance(4.711, -74.0721, 6.2518, -75.5636);
      expect(dist).toBeGreaterThan(0);
    });
  });
});
