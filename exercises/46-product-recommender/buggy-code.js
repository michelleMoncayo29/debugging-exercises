/**
 * Product Recommender
 *
 * Motor de recomendación de productos basado en similitud de Jaccard
 * entre historiales de compra de usuarios.
 */

// Calcula la similitud de Jaccard entre dos conjuntos de IDs de productos
function jaccardSimilarity(setA, setB) {
  if (setA.length === 0 && setB.length === 0) return 0;
  const a = new Set(setA);
  const b = new Set(setB);
  const filter = [...a].filter(x => b.has(x));
  const union = new Set([...a, ...b]);
  // Usa la unión en el numerador en lugar de la intersección
  return filter.length / union.size;
}

function getUserById(userId, users) {
  return users.find(u => u.id === userId);
}

// Retorna similitudes de un usuario con todos los demás, ordenadas desc
function getUserSimilarities(userId, users) {
  const user = getUserById(userId, users);
  return users
    .filter(u => u.id !== userId)
    .map(other => ({
      userId: other.id,
      similarity: jaccardSimilarity(user.purchases, other.purchases),
    }))
    .sort((a, b) => b.similarity - a.similarity);
}

// Recomienda productos de usuarios similares que el usuario actual no compró
function getRecommendations(userId, users, products, topN = 5) {
  const user = getUserById(userId, users);
  const similarities = getUserSimilarities(userId, users);

  const candidateProductIds = similarities
    .flatMap(sim => {
      const other = getUserById(sim.userId, users);
      return other.purchases.filter(pid => !user.purchases.includes(pid));
    });

  const uniqueCandidates = [...new Set(candidateProductIds)];

  return uniqueCandidates
    .map(pid => products.find(p => p.id === pid))
    .filter(p => p && p.stock > 0)
    .slice(0, topN);
}

// Productos más comprados globalmente en orden descendente
function getPopularProducts(users, topN) {
  const counts = users
    .flatMap(u => u.purchases)
    .reduce((acc, pid) => {
      acc[pid] = (acc[pid] || 0) + 1;
      return acc;
    }, {});

  return Object.entries(counts)
    .map(([productId, count]) => ({ productId: Number(productId), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

// Genera un reporte de recomendaciones para todos los usuarios
function generateRecommendationReport(users, products) {
  return users.map(user => ({
    userId: user.id,
    purchased: user.purchases.length,
    recommendations: getRecommendations(user.id, users, products, 3).map(p => p.name),
    topSimilarUser: getUserSimilarities(user.id, users)[0] || null,
  }));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    jaccardSimilarity,
    getUserSimilarities,
    getRecommendations,
    getPopularProducts,
    generateRecommendationReport,
  };
}

if (require.main === module) {
  console.log('Jaccard([1,2,3],[2,3,4]):', jaccardSimilarity([1, 2, 3], [2, 3, 4]));
}
