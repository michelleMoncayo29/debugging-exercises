/**
 * Pruebas para: Dashboard de Análisis de Redes Sociales
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/24-social-analytics
 */

// IMPORTANTE: Cambiar esta línea para probar tu solución
const { Post, Author, Analytics } = require('./buggy-code.js');
// const { } = require('./solution.js');

describe('Dashboard de Análisis de Redes Sociales', () => {
  let author;
  let posts;
  let comments;

  beforeEach(() => {
    author = new Author(1, 'María López', 'maria_l', 1000);
    posts = [
      new Post(1, 'Post uno', 1, 100),
      new Post(2, 'Post dos', 1, 200),
      new Post(3, 'Post tres', 1, 50),
      new Post(4, 'Post cuatro', 1, 150),
      new Post(5, 'Post cinco', 1, 100),
    ];
    // 50 comentarios en total
    comments = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, postId: (i % 5) + 1 }));
  });

  describe('Analytics.getEngagementRate - Tasa de engagement', () => {
    test('debe calcular el engagement rate dividiendo entre seguidores, no entre posts', () => {
      const analytics = new Analytics(author, posts, comments);
      // Total likes: 100+200+50+150+100 = 600
      // Total comentarios: 50
      // Total interacciones: 650
      // Engagement correcto: 650 / 1000 seguidores = 0.65
      // Buggy (divide entre 5 posts): 650 / 5 = 130
      expect(analytics.getEngagementRate()).toBeCloseTo(0.65, 5);
    });

    test('debe retornar un valor menor que 1 para una audiencia grande', () => {
      const bigAuthor = new Author(2, 'Influencer', 'inf', 100000);
      const analytics = new Analytics(bigAuthor, posts, comments);
      // Con 100,000 seguidores, el engagement rate debe ser << 1
      expect(analytics.getEngagementRate()).toBeLessThan(1);
    });

    test('debe retornar 0.5 con 1 like, 0 comentarios y 2 seguidores', () => {
      const smallAuthor = new Author(3, 'Pequeño', 'peq', 2);
      const singlePost = [new Post(1, 'Único', 3, 1)];
      const analytics = new Analytics(smallAuthor, singlePost, []);
      // 1 interacción / 2 seguidores = 0.5
      expect(analytics.getEngagementRate()).toBeCloseTo(0.5, 5);
    });

    test('debe retornar 1.0 cuando las interacciones igualan los seguidores', () => {
      const analytics = new Analytics(
        new Author(4, 'Exacto', 'ex', 650),
        posts,
        comments,
      );
      // 650 interacciones / 650 seguidores = 1.0
      expect(analytics.getEngagementRate()).toBeCloseTo(1.0, 5);
    });

    test('debe reflejar un engagement diferente para mismas interacciones pero distintos seguidores', () => {
      const analytics1 = new Analytics(new Author(5, 'A', 'a', 500), posts, comments);
      const analytics2 = new Analytics(new Author(6, 'B', 'b', 2000), posts, comments);
      // Mismas interacciones (650) pero distinta audiencia → tasas distintas
      expect(analytics1.getEngagementRate()).toBeGreaterThan(analytics2.getEngagementRate());
    });
  });

  describe('Analytics.getTotalLikes - Total de likes', () => {
    test('debe sumar los likes de todas las publicaciones', () => {
      const analytics = new Analytics(author, posts, comments);
      expect(analytics.getTotalLikes()).toBe(600);
    });
  });

  describe('Analytics.getTotalComments - Total de comentarios', () => {
    test('debe retornar el número total de comentarios', () => {
      const analytics = new Analytics(author, posts, comments);
      expect(analytics.getTotalComments()).toBe(50);
    });
  });

  describe('Analytics.getAverageCommentsPerPost - Comentarios promedio por post', () => {
    test('debe calcular el promedio de comentarios por publicación', () => {
      const analytics = new Analytics(author, posts, comments);
      // 50 comentarios / 5 posts = 10 por post
      expect(analytics.getAverageCommentsPerPost()).toBeCloseTo(10, 5);
    });
  });

  describe('Analytics.getTopPost - Publicación más popular', () => {
    test('debe retornar la publicación con más likes', () => {
      const analytics = new Analytics(author, posts, comments);
      expect(analytics.getTopPost().id).toBe(2);
      expect(analytics.getTopPost().likes).toBe(200);
    });
  });

  describe('Analytics.getSummary - Resumen completo', () => {
    test('debe incluir el engagement rate correcto en el resumen', () => {
      const analytics = new Analytics(author, posts, comments);
      const summary = analytics.getSummary();
      expect(summary.engagementRate).toBeCloseTo(0.65, 5);
      expect(summary.followers).toBe(1000);
      expect(summary.totalPosts).toBe(5);
    });
  });
});
