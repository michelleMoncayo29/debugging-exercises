/**
 * Pruebas para: Sistema de Evaluación del Mercado Inmobiliario
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/26-real-estate-evaluator
 */

// IMPORTANTE: Cambiar esta línea para probar tu solución
const { Property, Listing, MarketAnalyzer } = require('./buggy-code.js');
// const { } = require('./solution.js');

function makeListing(price) {
  return new Listing(new Property(1, 'Dir', price, 100, 2), 'Agente', 30);
}

describe('Sistema de Evaluación del Mercado Inmobiliario', () => {
  describe('MarketAnalyzer.getMedianPrice - Precio mediano del mercado', () => {
    test('debe retornar la mediana correcta de 5 precios desordenados (cantidad impar)', () => {
      const analyzer = new MarketAnalyzer();
      // Ingresados en orden NO ordenado
      analyzer.addListing(makeListing(500000));
      analyzer.addListing(makeListing(200000));
      analyzer.addListing(makeListing(100000));
      analyzer.addListing(makeListing(300000));
      analyzer.addListing(makeListing(400000));
      // Sorted: [100000, 200000, 300000, 400000, 500000] → mediana = 300000
      // Sin ordenar (buggy): índice 2 del arreglo original = 100000
      expect(analyzer.getMedianPrice()).toBe(300000);
    });

    test('debe retornar la mediana correcta de 4 precios desordenados (cantidad par)', () => {
      const analyzer = new MarketAnalyzer();
      analyzer.addListing(makeListing(400000));
      analyzer.addListing(makeListing(100000));
      analyzer.addListing(makeListing(300000));
      analyzer.addListing(makeListing(200000));
      // Sorted: [100000, 200000, 300000, 400000] → mediana = (200000+300000)/2 = 250000
      // Sin ordenar (buggy): índice 2 del original = 300000
      expect(analyzer.getMedianPrice()).toBe(250000);
    });

    test('debe retornar el único precio cuando solo hay un listado', () => {
      const analyzer = new MarketAnalyzer();
      analyzer.addListing(makeListing(350000));
      expect(analyzer.getMedianPrice()).toBe(350000);
    });

    test('debe retornar la mediana correcta con precios ya ordenados de mayor a menor', () => {
      const analyzer = new MarketAnalyzer();
      // Ingresados de mayor a menor → sin ordenar, el medio sería el valor equivocado
      analyzer.addListing(makeListing(900000));
      analyzer.addListing(makeListing(600000));
      analyzer.addListing(makeListing(300000));
      analyzer.addListing(makeListing(150000));
      analyzer.addListing(makeListing(100000));
      // Sorted: [100000, 150000, 300000, 600000, 900000] → mediana = 300000
      // Sin ordenar (buggy): índice 2 = 300000 → aquí coincide; esta prueba valida el caso general
      expect(analyzer.getMedianPrice()).toBe(300000);
    });

    test('debe retornar la mediana correcta con valores extremos desordenados', () => {
      const analyzer = new MarketAnalyzer();
      analyzer.addListing(makeListing(1000000));
      analyzer.addListing(makeListing(50000));
      analyzer.addListing(makeListing(750000));
      // Sorted: [50000, 750000, 1000000] → mediana = 750000
      // Sin ordenar (buggy): índice 1 = 50000
      expect(analyzer.getMedianPrice()).toBe(750000);
    });

    test('debe retornar 0 cuando no hay listados', () => {
      const analyzer = new MarketAnalyzer();
      expect(analyzer.getMedianPrice()).toBe(0);
    });
  });

  describe('MarketAnalyzer.getAveragePrice - Precio promedio del mercado', () => {
    test('debe calcular el promedio correctamente', () => {
      const analyzer = new MarketAnalyzer();
      analyzer.addListing(makeListing(100000));
      analyzer.addListing(makeListing(200000));
      analyzer.addListing(makeListing(300000));
      expect(analyzer.getAveragePrice()).toBe(200000);
    });
  });

  describe('MarketAnalyzer.getPriceRange - Rango de precios', () => {
    test('debe retornar el precio mínimo y máximo del mercado', () => {
      const analyzer = new MarketAnalyzer();
      analyzer.addListing(makeListing(300000));
      analyzer.addListing(makeListing(100000));
      analyzer.addListing(makeListing(500000));
      expect(analyzer.getPriceRange()).toEqual({ min: 100000, max: 500000 });
    });
  });

  describe('MarketAnalyzer.getAffordableListings - Propiedades asequibles', () => {
    test('debe retornar solo las propiedades dentro del presupuesto', () => {
      const analyzer = new MarketAnalyzer();
      analyzer.addListing(makeListing(200000));
      analyzer.addListing(makeListing(400000));
      analyzer.addListing(makeListing(600000));
      const affordable = analyzer.getAffordableListings(400000);
      expect(affordable.length).toBe(2);
    });
  });

  describe('Property.getPricePerSqm - Precio por metro cuadrado', () => {
    test('debe calcular el precio por metro cuadrado correctamente', () => {
      const property = new Property(1, 'Av Principal', 300000, 100, 3);
      expect(property.getPricePerSqm()).toBe(3000);
    });
  });
});
