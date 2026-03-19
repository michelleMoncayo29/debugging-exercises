/**
 * Pruebas para: Motor de Recomendación de Libros
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/25-book-recommender
 */

// IMPORTANTE: Cambiar esta línea para probar tu solución
const { Book, UserProfile, RecommendationEngine } = require('./buggy-code.js');
// const { } = require('./solution.js');

describe('Motor de Recomendación de Libros', () => {
  let user;

  beforeEach(() => {
    user = new UserProfile('Ana', ['fiction', 'mystery', 'thriller'], 0);
  });

  describe('RecommendationEngine.calculateScore - Puntuación de relevancia', () => {
    test('debe dar score 1.0 cuando el libro cubre todos los intereses del usuario', () => {
      const engine = new RecommendationEngine(user);
      const book = new Book('Libro A', 'Autor', ['fiction', 'mystery', 'thriller'], 4.0);
      // 3 coincidencias / 3 temas del usuario = 1.0
      expect(engine.calculateScore(book)).toBeCloseTo(1.0, 5);
    });

    test('debe dar score 0.33 cuando el libro cubre solo 1 de 3 intereses del usuario', () => {
      const engine = new RecommendationEngine(user);
      const book = new Book('Libro B', 'Autor', ['fiction'], 4.0);
      // 1 coincidencia / 3 temas del usuario = 0.333
      expect(engine.calculateScore(book)).toBeCloseTo(1 / 3, 5);
    });

    test('un libro con pocos temas que coinciden todos NO debe superar a uno que cubre más intereses', () => {
      const engine = new RecommendationEngine(user);
      // Libro A: solo 1 tema ('fiction'), coincide con 1 de 3 intereses del usuario → score correcto: 1/3
      const bookA = new Book('Libro A', 'Autor', ['fiction'], 4.0);
      // Libro B: 5 temas, coincide con los 3 intereses del usuario → score correcto: 3/3 = 1.0
      const bookB = new Book('Libro B', 'Autor', ['fiction', 'mystery', 'thriller', 'crime', 'suspense'], 4.0);
      expect(engine.calculateScore(bookB)).toBeGreaterThan(engine.calculateScore(bookA));
    });

    test('debe dar score 0 cuando el libro no tiene temas en común con el usuario', () => {
      const engine = new RecommendationEngine(user);
      const book = new Book('Libro C', 'Autor', ['cooking', 'travel', 'science'], 4.0);
      expect(engine.calculateScore(book)).toBe(0);
    });

    test('debe dar score 0.67 cuando el libro cubre 2 de 3 intereses', () => {
      const engine = new RecommendationEngine(user);
      const book = new Book('Libro D', 'Autor', ['fiction', 'mystery', 'history'], 4.0);
      // 2 coincidencias / 3 temas del usuario = 0.667
      expect(engine.calculateScore(book)).toBeCloseTo(2 / 3, 5);
    });

    test('debe dar score 0 cuando el perfil del usuario no tiene temas preferidos', () => {
      const emptyUser = new UserProfile('Vacío', [], 0);
      const engine = new RecommendationEngine(emptyUser);
      const book = new Book('Libro E', 'Autor', ['fiction', 'mystery'], 4.0);
      expect(engine.calculateScore(book)).toBe(0);
    });
  });

  describe('RecommendationEngine.getTopRecommendations - Mejores recomendaciones', () => {
    test('debe retornar el libro que mejor cubre los intereses del usuario primero', () => {
      const engine = new RecommendationEngine(user);
      // Libro A cubre 1 de 3 intereses
      const bookA = new Book('Libro A', 'Autor', ['fiction'], 4.0);
      // Libro B cubre 3 de 3 intereses
      const bookB = new Book('Libro B', 'Autor', ['fiction', 'mystery', 'thriller'], 4.0);
      // Libro C cubre 0 intereses
      const bookC = new Book('Libro C', 'Autor', ['cooking'], 4.0);
      engine.addBook(bookA);
      engine.addBook(bookB);
      engine.addBook(bookC);
      const top = engine.getTopRecommendations(1);
      expect(top[0].title).toBe('Libro B');
    });

    test('debe filtrar libros con calificación menor al mínimo del usuario', () => {
      const strictUser = new UserProfile('Estricto', ['fiction'], 4.0);
      const engine = new RecommendationEngine(strictUser);
      engine.addBook(new Book('Bueno', 'Autor', ['fiction'], 4.5));
      engine.addBook(new Book('Malo', 'Autor', ['fiction'], 3.0));
      const recs = engine.getTopRecommendations(5);
      expect(recs.length).toBe(1);
      expect(recs[0].title).toBe('Bueno');
    });

    test('debe retornar un máximo de n libros', () => {
      const engine = new RecommendationEngine(user);
      for (let i = 0; i < 10; i++) {
        engine.addBook(new Book(`Libro ${i}`, 'Autor', ['fiction'], 4.0));
      }
      expect(engine.getTopRecommendations(3).length).toBe(3);
    });
  });
});
