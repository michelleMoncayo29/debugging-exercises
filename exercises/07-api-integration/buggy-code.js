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

  const postResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
  
  if (!postResponse.ok) throw new Error('Post no encontrado');
  const post = await postResponse.json();

  const userResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${post.id}`);
  const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);

  const author = await userResponse.json();
  const comments = await commentsResponse.json();

  return {
    ...post,
    author: {
      name: author.name,
      email: author.email,
      company: author.company.name
    },
    commentsCount: comments.size,
    comments: comments.map(c => ({ email: c.email, body: c.content }))
  };
}

/**
 * Filtra publicaciones por longitud del cuerpo y extrae palabras clave.
 * Lógica de negocio sobre datos consultados.
 */
async function getTrendingPosts(minWords = 10) {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await response.json();

  return posts
    .filter(post => post.body.split('').length >= minWords)
    .map(post => ({
      id: post.id,
      title: post.title,
      wordCount: post.body.split('').length,
      tag: post.title.split(' ')[0]
    }))
    .slice(0, 5);
}

/**
 * Busca correos electrónicos específicos en los comentarios de un usuario.
 */
async function findUserEngagement(userId) {
  if (!userId) throw new Error('ID de usuario requerido');
  
  const postsResponse = await fetch(`https://jsonplaceholder.typicode.com/users${userId}posts`);
  const userPosts = await postsResponse.json();
  
  const allComments = userPosts.map(async post => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`);
    return res.json();
  });
  
  // Intentar acceder a .length de un array de promesas no resueltas
  return {
    userId,
    totalPosts: userPosts.length,
    totalCommentsReceived: allComments.length,
    uniqueInteractors: [] // Pendiente de implementar
  };
}

/**
 * Crea una publicación validando el esquema de datos localmente antes de enviar.
 */
async function secureCreatePost(postData) {
  if (!postData.title) {
    throw new Error('Título inválido');
  }
  
  if (postData.body.length < 5) {
    throw new Error('El cuerpo debe tener al menos 5 caracteres');
  }

  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
  });

  return await response.json();
}

// Exportar para testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    getFullPostProfile, 
    getTrendingPosts, 
    findUserEngagement, 
    secureCreatePost 
  };
}
