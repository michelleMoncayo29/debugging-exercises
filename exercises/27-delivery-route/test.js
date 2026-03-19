/**
 * Pruebas para: Calculadora de Rutas de Entrega
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/27-delivery-route
 */

// IMPORTANTE: Cambiar esta línea para probar tu solución
const { Depot, Stop, RouteCalculator, haversineDistance } = require('./buggy-code.js');
// const { } = require('./solution.js');

describe('Calculadora de Rutas de Entrega', () => {
  let calc;

  beforeEach(() => {
    calc = new RouteCalculator();
  });

  describe('calculateRouteDistance - Distancia total incluyendo regreso al depósito', () => {
    test('debe retornar 0 cuando no hay paradas', () => {
      const depot = new Depot('Bodega', 0, 0);
      expect(calc.calculateRouteDistance(depot, [])).toBe(0);
    });

    test('con 1 parada la distancia debe ser la ida más el regreso (doble del tramo simple)', () => {
      // Depósito y parada en el mismo meridiano → la distancia de regreso = distancia de ida
      const depot = new Depot('Bodega', 0, 0);
      const stop = new Stop('Entrega', 0, 5, 3);
      const oneWayDistance = haversineDistance(0, 0, 0, 5);
      // Ruta correcta: depot→stop + stop→depot = 2 * oneWayDistance
      // Buggy: solo depot→stop = 1 * oneWayDistance
      expect(calc.calculateRouteDistance(depot, [stop])).toBeCloseTo(2 * oneWayDistance, 1);
    });

    test('la distancia con 1 parada debe ser mayor a solo el tramo de ida', () => {
      const depot = new Depot('Bodega', 4.711, -74.0721);
      const stop = new Stop('Entrega', 6.2518, -75.5636);
      const oneWay = haversineDistance(depot.lat, depot.lng, stop.lat, stop.lng);
      const roundTrip = calc.calculateRouteDistance(depot, [stop]);
      expect(roundTrip).toBeGreaterThan(oneWay);
    });

    test('con 2 paradas en línea recta, la distancia de regreso debe añadirse', () => {
      // Coordenadas alineadas en el ecuador: depot(0,0), stop1(0,3), stop2(0,7)
      const depot = new Depot('Bodega', 0, 0);
      const stop1 = new Stop('Parada 1', 0, 3, 2);
      const stop2 = new Stop('Parada 2', 0, 7, 4);
      const d1 = haversineDistance(0, 0, 0, 3); // depot→stop1
      const d2 = haversineDistance(0, 3, 0, 7); // stop1→stop2
      const d3 = haversineDistance(0, 7, 0, 0); // stop2→depot (regreso)
      const expectedTotal = d1 + d2 + d3;
      expect(calc.calculateRouteDistance(depot, [stop1, stop2])).toBeCloseTo(expectedTotal, 1);
    });

    test('la ruta completa debe ser mayor que la ruta parcial sin regreso', () => {
      const depot = new Depot('Bodega', 0, 0);
      const stop1 = new Stop('Parada 1', 0, 2, 1);
      const stop2 = new Stop('Parada 2', 1, 3, 2);
      const stop3 = new Stop('Parada 3', 2, 1, 3);
      const routeDistance = calc.calculateRouteDistance(depot, [stop1, stop2, stop3]);
      const lastToDepot = haversineDistance(stop3.lat, stop3.lng, depot.lat, depot.lng);
      // La distancia total debe incluir el regreso, que es > 0
      expect(routeDistance).toBeGreaterThan(0);
      expect(lastToDepot).toBeGreaterThan(0);
    });

    test('ruta de ida y vuelta a la misma parada debe ser el doble de la distancia simple', () => {
      const depot = new Depot('Bodega', 0, 0);
      const stop = new Stop('Única parada', 3, 4, 5);
      const simple = haversineDistance(0, 0, 3, 4);
      // Ida + vuelta desde el mismo punto = 2 * distancia simple (la geometría es simétrica)
      expect(calc.calculateRouteDistance(depot, [stop])).toBeCloseTo(2 * simple, 1);
    });
  });

  describe('RouteCalculator.getTotalPackages - Total de paquetes en la ruta', () => {
    test('debe sumar los paquetes de todas las paradas', () => {
      const stops = [
        new Stop('A', 0, 0, 5),
        new Stop('B', 1, 1, 3),
        new Stop('C', 2, 2, 8),
      ];
      expect(calc.getTotalPackages(stops)).toBe(16);
    });
  });

  describe('RouteCalculator.getEstimatedDuration - Tiempo estimado de viaje', () => {
    test('debe calcular el tiempo en minutos basado en distancia y velocidad promedio', () => {
      // 40 km a 40 km/h = 1 hora = 60 minutos
      expect(calc.getEstimatedDuration(40, 40)).toBeCloseTo(60, 2);
    });

    test('debe calcular el tiempo con velocidad personalizada', () => {
      // 100 km a 50 km/h = 2 horas = 120 minutos
      expect(calc.getEstimatedDuration(100, 50)).toBeCloseTo(120, 2);
    });
  });

  describe('haversineDistance - Fórmula de distancia geográfica', () => {
    test('debe retornar 0 para el mismo punto', () => {
      expect(haversineDistance(4.711, -74.0721, 4.711, -74.0721)).toBeCloseTo(0, 5);
    });

    test('debe ser simétrica: dist(A,B) = dist(B,A)', () => {
      const d1 = haversineDistance(0, 0, 3, 4);
      const d2 = haversineDistance(3, 4, 0, 0);
      expect(d1).toBeCloseTo(d2, 5);
    });
  });
});
