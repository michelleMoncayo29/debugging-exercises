/**
 * Módulo avanzado de integración y procesamiento con JSONPlaceholder
 *
 * Este módulo obtiene datos de la API y realiza transformaciones
 * lógicas complejas sobre los resultados obtenidos.
 */

const fetch = typeof globalThis.fetch !== 'undefined' ? globalThis.fetch : null;

/**
 * Obtiene un perfil completo: Publicación, su Autor y sus Comentarios.
 * Combina múltiples llamadas asíncronas.
 */
async function getFullPostProfile(postId) {
  if (!postId) throw new Error('Se requiere un ID de publicación');

  // CORREGIDO: Se añadió await para obtener la respuesta del post
  const postResponse = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
  );
  if (!postResponse.ok) throw new Error('Post no encontrado');
  const post = await postResponse.json();

  // CORREGIDO: Se utilizan promesas paralelas para optimizar el tiempo de carga
  const [userResponse, commentsResponse] = await Promise.all([
    fetch(`https://jsonplaceholder.typicode.com/users/${post.userId}`),
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`),
  ]);

  if (!userResponse.ok || !commentsResponse.ok) {
    throw new Error('Error al obtener datos relacionados del perfil');
  }

  const author = await userResponse.json();
  const comments = await commentsResponse.json();

  return {
    ...post,
    author: {
      name: author.name,
      email: author.email,
      company: author.company.name,
    },
    commentsCount: comments.length,
    comments: comments.map((c) => ({ email: c.email, body: c.body })),
  };
}

/**
 * Filtra publicaciones por longitud del cuerpo y extrae palabras clave.
 * Lógica de negocio sobre datos consultados.
 */
async function getTrendingPosts(minWords = 10) {
  // CORREGIDO: Se añadió await a la llamada inicial
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await response.json();

  // CORREGIDO: Lógica de conteo de palabras corregida usando trim() y split()
  return posts
    .filter((post) => post.body.trim().split(/\s+/).length >= minWords)
    .map((post) => ({
      id: post.id,
      title: post.title,
      wordCount: post.body.trim().split(/\s+/).length,
      // Extraer primera palabra del título como tag
      tag: post.title.split(' ')[0],
    }))
    .slice(0, 5); // Solo las top 5
}

/**
 * Busca correos electrónicos específicos en los comentarios de un usuario.
 */
async function findUserEngagement(userId) {
  if (!userId) throw new Error('ID de usuario requerido');

  // CORREGIDO: URL corregida para obtener posts del usuario específicamente
  const postsResponse = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}/posts`,
  );
  const userPosts = await postsResponse.json();

  // CORREGIDO: Se usa for...of con await para procesar secuencialmente o Promise.all para paralelo
  // Para este caso, Promise.all es mejor para no bloquear
  const commentsPromises = userPosts.map((post) =>
    fetch(
      `https://jsonplaceholder.typicode.com/posts/${post.id}/comments`,
    ).then((res) => res.json()),
  );

  const allCommentsArrays = await Promise.all(commentsPromises);
  const allComments = allCommentsArrays.flat();

  // CORREGIDO: Se eliminó el error de duplicidad y se asegura el retorno único de emails
  const uniqueEmails = [...new Set(allComments.map((c) => c.email))];

  return {
    userId,
    totalPosts: userPosts.length,
    totalCommentsReceived: allComments.length,
    uniqueInteractors: uniqueEmails,
  };
}

/**
 * Crea una publicación validando el esquema de datos localmente antes de enviar.
 */
async function secureCreatePost(postData) {
  // CORREGIDO: Validación de esquema robusta
  if (!postData.title || typeof postData.title !== 'string' || !postData.title.trim()) {
    throw new Error('Título inválido');
  }
  if (!postData.body || postData.body.length <= 5) {
    throw new Error('El cuerpo debe tener al menos 5 caracteres');
  }

  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok) throw new Error('Error en el servidor');

  return await response.json();
}

// Exportar para testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getFullPostProfile,
    getTrendingPosts,
    findUserEngagement,
    secureCreatePost,
  };
}
