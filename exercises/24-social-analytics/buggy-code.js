/**
 * Dashboard de análisis de redes sociales
 * Obtiene publicaciones, comentarios y usuarios desde JSONPlaceholder API
 */

class Post {
  constructor(id, title, authorId, likes = 0) {
    this.id = id;
    this.title = title;
    this.authorId = authorId;
    this.likes = likes;
  }
}

class Author {
  constructor(id, name, username, followers) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.followers = followers;
  }
}

class Analytics {
  constructor(author, posts, comments) {
    this.author = author;
    this.posts = posts;
    this.comments = comments;
  }

  getTotalLikes() {
    return this.posts.reduce((sum, p) => sum + p.likes, 0);
  }

  getTotalComments() {
    return this.comments.length;
  }

  // Calcula el engagement rate como el total de interacciones relativo a la audiencia del autor
  getEngagementRate() {
    const totalInteractions = this.getTotalLikes() + this.getTotalComments();
    return totalInteractions / this.author.followers;
  }

  getAverageCommentsPerPost() {
    if (this.posts.length === 0) return 0;
    return this.getTotalComments() / this.posts.length;
  }

  getTopPost() {
    return this.posts.reduce(
      (top, p) => (p.likes > top.likes ? p : top),
      this.posts[0],
    );
  }

  getSummary() {
    return {
      author: this.author.name,
      followers: this.author.followers,
      totalPosts: this.posts.length,
      totalLikes: this.getTotalLikes(),
      totalComments: this.getTotalComments(),
      engagementRate: this.getEngagementRate(),
      avgCommentsPerPost: this.getAverageCommentsPerPost(),
    };
  }
}

// Obtiene publicaciones de un usuario desde JSONPlaceholder (sin API key)
async function fetchUserPosts(userId) {
  const url = `https://jsonplaceholder.typicode.com/posts?userId=${userId}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error al obtener posts: ${response.status}`);
  const data = await response.json();
  return data.map(
    (p) => new Post(p.id, p.title, p.userId, Math.floor(Math.random() * 500)),
  );
}

// Obtiene los comentarios de una publicación desde JSONPlaceholder (sin API key)
async function fetchPostComments(postId) {
  const url = `https://jsonplaceholder.typicode.com/comments?postId=${postId}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error al obtener comentarios: ${response.status}`);
  return response.json();
}

// Obtiene información de un usuario desde JSONPlaceholder (sin API key)
async function fetchAuthor(userId, followers) {
  const url = `https://jsonplaceholder.typicode.com/users/${userId}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error al obtener usuario: ${response.status}`);
  const data = await response.json();
  return new Author(data.id, data.name, data.username, followers);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Post, Author, Analytics, fetchUserPosts, fetchPostComments, fetchAuthor };
}

if (require.main === module) {
  (async () => {
    const author = await fetchAuthor(1, 15000);
    const posts = await fetchUserPosts(1);
    const allComments = [];
    for (const post of posts.slice(0, 3)) {
      const comments = await fetchPostComments(post.id);
      allComments.push(...comments);
    }
    const analytics = new Analytics(author, posts, allComments);
    console.log('Resumen de análisis:', analytics.getSummary());
  })();
}
