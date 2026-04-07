/**
 * Motor de recomendación de libros
 * Obtiene libros por temática desde Open Library API (sin API key)
 */

class Book {
  constructor(title, author, subjects, rating) {
    this.title = title;
    this.author = author;
    this.subjects = subjects; // Arreglo de temas del libro
    this.rating = rating;     // Calificación de 0 a 5
  }
}

class UserProfile {
  constructor(name, preferredSubjects, minRating) {
    this.name = name;
    this.preferredSubjects = preferredSubjects; // Temas que le interesan al usuario
    this.minRating = minRating;
  }
}

class RecommendationEngine {
  constructor(userProfile) {
    this.userProfile = userProfile;
    this.books = [];
  }

  addBook(book) {
    this.books.push(book);
  }

  // Calcula qué tan bien cubre el libro los intereses del usuario (0 a 1)
  calculateScore(book) {
    if (this.userProfile.preferredSubjects.length === 0) return 0;
    const matchCount = book.subjects.filter((s) =>
      this.userProfile.preferredSubjects.includes(s),
    ).length;
    return matchCount / this.userProfile.preferredSubjects.length;
  }

  filterByRating() {
    return this.books.filter((b) => b.rating >= this.userProfile.minRating);
  }

  getTopRecommendations(n = 5) {
    return this.filterByRating()
      .map((book) => ({ book, score: this.calculateScore(book) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, n)
      .map((entry) => entry.book);
  }

  getScoredBooks() {
    return this.filterByRating()
      .map((book) => ({
        title: book.title,
        score: Math.round(this.calculateScore(book) * 100),
        matchedSubjects: book.subjects.filter((s) =>
          this.userProfile.preferredSubjects.includes(s),
        ),
      }))
      .sort((a, b) => b.score - a.score);
  }
}

// Obtiene libros por temática desde Open Library (sin API key)
async function fetchBooksBySubject(subject, limit = 10) {
  const query = encodeURIComponent(subject.replace(/ /g, '_'));
  const url = `https://openlibrary.org/subjects/${query}.json?limit=${limit}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error al obtener libros: ${response.status}`);
  const data = await response.json();
  return (data.works || []).map((work) => {
    const subjects = (work.subject || []).slice(0, 8).map((s) => s.toLowerCase());
    return new Book(
      work.title,
      work.authors?.[0]?.name || 'Autor desconocido',
      subjects,
      3 + Math.random() * 2,
    );
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Book, UserProfile, RecommendationEngine, fetchBooksBySubject };
}

if (require.main === module) {
  (async () => {
    const user = new UserProfile('Ana', ['fiction', 'mystery', 'thriller'], 3.5);
    const engine = new RecommendationEngine(user);
    const books = await fetchBooksBySubject('mystery fiction', 15);
    books.forEach((b) => engine.addBook(b));
    console.log('Recomendaciones principales:');
    engine.getScoredBooks().slice(0, 5).forEach((b) => {
      console.log(`  ${b.title} - Score: ${b.score}% - Temas coincidentes: ${b.matchedSubjects.join(', ')}`);
    });
  })();
}
