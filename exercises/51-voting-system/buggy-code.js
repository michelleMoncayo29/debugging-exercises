/**
 * Voting System
 *
 * Sistema de votación: conteo de votos, ganador por mayoría absoluta,
 * resultados ordenados y eliminación del candidato con menos votos.
 */

function tallyVotes(ballots) {
  return ballots.reduce((counts, vote) => {
    counts[vote] = (counts[vote] || 0) + 1;
    return counts;
  }, {});
}

// Determina el ganador por mayoría absoluta (>50%)
function getWinner(ballots) {
  if (ballots.length === 0) return null;
  const tally = tallyVotes(ballots);
  const total = ballots.length;
  const winner = Object.entries(tally).find(([, votes]) => votes / total > 0.5);
  return winner ? winner[0] : null;
}

function getRankedResults(ballots) {
  const tally = tallyVotes(ballots);
  const total = ballots.length;
  return Object.entries(tally)
    .map(([candidate, votes]) => ({
      candidate,
      votes,
      percentage: Math.round((votes / total) * 10000) / 100,
    }))
    .sort((a, b) => b.votes - a.votes);
}

function eliminateLowest(ballots) {
  const tally = tallyVotes(ballots);
  const minVotes = Math.min(...Object.values(tally));
  return Object.entries(tally)
    .filter(([, votes]) => votes > minVotes)
    .map(([candidate]) => candidate);
}

function instantRunoff(ballots) {
  let remaining = [...new Set(ballots)];
  const rounds = [];

  while (remaining.length > 1) {
    const activeBallots = ballots.filter(b => remaining.includes(b));
    const winner = getWinner(activeBallots);
    const results = getRankedResults(activeBallots);
    rounds.push({ candidates: remaining.slice(), results });

    if (winner) return { winner, rounds };
    remaining = eliminateLowest(activeBallots);
  }

  return { winner: remaining[0] || null, rounds };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { tallyVotes, getWinner, getRankedResults, eliminateLowest, instantRunoff };
}

