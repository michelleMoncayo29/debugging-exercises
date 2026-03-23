/**
 * Pruebas para: Integración Avanzada con API (JSONPlaceholder)
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 */

// IMPORTANTE: Cambiar esta línea para probar tu solución
const {
  getFullPostProfile,
  getTrendingPosts,
  findUserEngagement,
  secureCreatePost,
} = require('./buggy-code.js');
// const {
//   getFullPostProfile,
//   getTrendingPosts,
//   findUserEngagement,
//   secureCreatePost,
// } = require('./solution.js');

describe('Integración Avanzada con API - Lógica y Asincronía', () => {
  describe('getFullPostProfile - Perfil Completo', () => {
    test('debe retornar un objeto combinado con datos de post, autor y comentarios', async () => {
      const profile = await getFullPostProfile(1);

      expect(profile).toHaveProperty('id', 1);
      expect(profile.author).toHaveProperty('name');
      expect(profile.author).toHaveProperty('company');
      expect(typeof profile.commentsCount).toBe('number');
      expect(profile.comments[0]).toHaveProperty('body');
      expect(profile.comments[0]).not.toHaveProperty('content'); // Debe usar 'body'
    });

    test('debe usar el userId correcto del post para buscar al autor', async () => {
      // Post 1 es de User 1, pero Post 11 es de User 2
      const profile = await getFullPostProfile(11);
      // Si el bug persiste, buscará al User 11 (que no existe o es incorrecto) en lugar del User 2
      expect(profile.author.email).toBe('Shanna@melissa.tv'); // Email del Usuario 2
    });
  });

  describe('getTrendingPosts - Lógica de Filtrado', () => {
    test('debe retornar las top 5 publicaciones que cumplen el mínimo de palabras', async () => {
      const trending = await getTrendingPosts(10); // Posts con al menos 10 palabras

      expect(Array.isArray(trending)).toBe(true);
      expect(trending.length).toBeLessThanOrEqual(5);
      expect(trending[0]).toHaveProperty('wordCount');
      expect(trending[0].wordCount).toBeGreaterThanOrEqual(10);
    });
  });

  describe('findUserEngagement - Agregación de Datos', () => {
    test('debe consolidar interacciones únicas de los posts de un usuario', async () => {
      const engagement = await findUserEngagement(1);

      expect(engagement.userId).toBe(1);
      expect(engagement.totalPosts).toBe(10); // Usuario 1 tiene 10 posts
      expect(engagement.totalCommentsReceived).toBeGreaterThan(0);
      expect(Array.isArray(engagement.uniqueInteractors)).toBe(true);
    });
  });

  describe('secureCreatePost - Validación y Envío', () => {
    test('debe validar localmente antes de intentar el fetch', async () => {
      await expect(
        secureCreatePost({ title: '  ', body: 'Valido' }),
      ).rejects.toThrow('Título inválido');

      await expect(
        secureCreatePost({ title: 'Post', body: 'Short' }),
      ).rejects.toThrow('El cuerpo debe tener al menos 5 caracteres');
    });

    test('debe enviar cabeceras correctas para que el servidor responda con el objeto', async () => {
      const post = {
        title: 'Test Title',
        body: 'Test Body long enough',
        userId: 1,
      };
      const result = await secureCreatePost(post);

      expect(result.title).toBe(post.title);
      expect(result).toHaveProperty('id');
    });
  });
});
