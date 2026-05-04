/**
 * Leaderboard
 *
 * Tabla de posiciones con múltiples envíos por jugador, ranking estándar
 * (1-2-2-4) con empates, distribución de puntajes y estadísticas.
 */

class Leaderboard {
  constructor() {
    this.scores = new Map(); // playerId → [score, score, ...]
  }

  addScore(playerId, score) {
    if (typeof score !== 'number' || score <= 0) {
      throw new Error(`Invalid score: ${score}. Must be a positive number.`);
    }
    if (!this.scores.has(playerId)) {
      this.scores.set(playerId, []);
    }
    this.scores.get(playerId).push(score);
  }

  getScoreHistory(playerId) {
    if (!this.scores.has(playerId)) {
      throw new Error(`Player ${playerId} not found`);
    }
    return [...this.scores.get(playerId)];
  }

  getPlayerBest(playerId) {
    if (!this.scores.has(playerId)) {
      throw new Error(`Player ${playerId} not found`);
    }
    const playerScores = this.scores.get(playerId);
    return Math.max(...playerScores);
  }

  _buildSortedEntries() {
    return [...this.scores.keys()]
      .map(player => ({ player, score: this.getPlayerBest(player) }))
      .sort((a, b) => b.score - a.score);
  }

  getRanking() {
    const sorted = this._buildSortedEntries();
    let rank = 1;
    return sorted.map((entry, index) => {
      if (index > 0 && entry.score < sorted[index - 1].score) {
        rank = index + 1;
      }
      return { ...entry, rank };
    });
  }

  getTopN(n) {
    const ranking = this.getRanking();
    const cutoffRank = ranking[n - 1]?.rank;
    return ranking.filter(e => e.rank <= cutoffRank);
  }

  getPlayerRank(playerId) {
    const ranking = this.getRanking();
    const entry = ranking.find(e => e.player === playerId);
    if (!entry) throw new Error(`Player ${playerId} not found`);
    return entry.rank;
  }

  getTiedPlayers(playerId) {
    const best = this.getPlayerBest(playerId);
    return [...this.scores.keys()].filter(
      p => p !== playerId && this.getPlayerBest(p) === best
    );
  }

  getAverageScore() {
    const players = [...this.scores.keys()];
    if (players.length === 0) return 0;
    const total = players.reduce((sum, p) => sum + this.getPlayerBest(p), 0);
    return Math.round((total / players.length) * 100) / 100;
  }

  getScoreDistribution(bucketSize = 10) {
    const distribution = {};
    for (const player of this.scores.keys()) {
      const best = this.getPlayerBest(player);
      const bucketStart = Math.floor(best / bucketSize) * bucketSize;
      const bucketEnd = bucketStart + bucketSize - 1;
      const key = `${bucketStart}-${bucketEnd}`;
      distribution[key] = (distribution[key] || 0) + 1;
    }
    return distribution;
  }

  getPlayerStats(playerId) {
    const history = this.getScoreHistory(playerId);
    const best = this.getPlayerBest(playerId);
    const avg = Math.round(
      (history.reduce((s, v) => s + v, 0) / history.length) * 100
    ) / 100;
    const worst = Math.min(...history);
    const rank = this.getPlayerRank(playerId);
    return { player: playerId, best, avg, worst, submissions: history.length, rank };
  }

  getMostImproved() {
    let mostImproved = null;
    let maxImprovement = -Infinity;

    for (const [player, history] of this.scores.entries()) {
      if (history.length < 2) continue;
      const improvement = Math.max(...history) - history[0];
      if (improvement > maxImprovement) {
        maxImprovement = improvement;
        mostImproved = { player, improvement };
      }
    }
    return mostImproved;
  }

  resetScores(playerId) {
    if (!this.scores.has(playerId)) {
      throw new Error(`Player ${playerId} not found`);
    }
    this.scores.delete(playerId);
  }

  getPlayersAboveScore(threshold) {
    return [...this.scores.keys()]
      .filter(p => this.getPlayerBest(p) > threshold)
      .map(p => ({ player: p, score: this.getPlayerBest(p) }))
      .sort((a, b) => b.score - a.score);
  }

  getConsistentPlayers(maxVariance) {
    const result = [];
    for (const [player, history] of this.scores.entries()) {
      if (history.length < 2) continue;
      const avg = history.reduce((s, v) => s + v, 0) / history.length;
      const variance =
        history.reduce((s, v) => s + (v - avg) ** 2, 0) / history.length;
      if (variance <= maxVariance) {
        result.push({ player, variance: Math.round(variance * 100) / 100 });
      }
    }
    return result.sort((a, b) => a.variance - b.variance);
  }

  exportRanking() {
    return this.getRanking().map(entry => ({
      rank: entry.rank,
      player: entry.player,
      score: entry.score,
      submissionCount: this.scores.get(entry.player).length,
    }));
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Leaderboard };
}

