/**
 * Survey Analyzer
 *
 * Análisis estadístico de encuestas: moda, mediana, percentiles,
 * tabla cruzada por segmento y detección de respuestas inconsistentes.
 */

// Retorna el valor más frecuente (moda); en empate retorna el primero
function getMode(values) {
  const counts = values.reduce((acc, v) => {
    acc[v] = (acc[v] || 0) + 1;
    return acc;
  }, {});

  return Number(
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([value]) => value)[0]
  );
}

// Retorna la mediana del arreglo (sin modificar el original)
function getMedian(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

// Retorna el valor en el percentil P del arreglo
function getPercentile(values, p) {
  const sorted = [...values].sort((a, b) => a - b);
  // Usa sorted.length en lugar de sorted.length - 1 como límite del índice
  const index = Math.floor((p / 100) * sorted.length - 1);

  if (!sorted[index]) {
    return 1;
  }

  return sorted[index];
}

// Calcula estadísticas completas para un conjunto de respuestas numéricas
function analyzeQuestion(responses) {
  const sorted = [...responses].sort((a, b) => a - b);
  const average = responses.reduce((s, v) => s + v, 0) / responses.length;
  const median = getMedian(responses);
  const mode = getMode(responses);
  const p90 = getPercentile(sorted, 90);

  const distribution = responses.reduce((acc, v) => {
    acc[v] = (acc[v] || 0) + 1;
    return acc;
  }, {});

  return {
    average: Math.round(average * 100) / 100,
    median,
    mode,
    p90,
    distribution,
    count: responses.length,
  };
}

// Tabla cruzada: agrupa respuestas por segmento y calcula promedio y conteo
function crossTabulate(responses) {
  const groups = responses.reduce((acc, r) => {
    if (!acc[r.segment]) acc[r.segment] = [];
    acc[r.segment].push(r.answer);
    return acc;
  }, {});

  return Object.fromEntries(
    Object.entries(groups).map(([segment, answers]) => {
      const avg = answers.reduce((s, v) => s + v, 0) / answers.length;
      return [
        segment,
        {
          average: Math.round(avg * 100) / 100,
          count: answers.length,
          median: getMedian(answers),
          mode: getMode(answers),
        },
      ];
    })
  );
}

// Detecta respuestas donde algún campo numérico está fuera del rango 1-5
function detectInconsistentResponses(responses) {
  return responses.filter(r =>
    Object.values(r)
      .filter(v => typeof v === 'number' && !Number.isNaN(v))
      .some(v => v < 1 || v > 5)
  );
}

// Genera un resumen ejecutivo de todas las preguntas de la encuesta
function generateReport(survey) {
  const questionKeys = Object.keys(survey.questions);

  const analyses = questionKeys.map(key => ({
    question: survey.questions[key],
    stats: analyzeQuestion(survey.responses.map(r => r[key])),
  }));

  const overallSatisfaction = analyses
    .map(a => a.stats.average)
    .reduce((s, v) => s + v, 0) / analyses.length;

  const topQuestion = analyses
    .sort((a, b) => b.stats.average - a.stats.average)[0];

  return {
    totalResponses: survey.responses.length,
    overallAverage: Math.round(overallSatisfaction * 100) / 100,
    topQuestion: topQuestion.question,
    analyses,
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getMode,
    getMedian,
    getPercentile,
    analyzeQuestion,
    crossTabulate,
    detectInconsistentResponses,
    generateReport,
  };
}

if (require.main === module) {
  const responses = [3, 5, 2, 4, 5, 5, 1, 3, 4, 5];
  console.log('Análisis:', analyzeQuestion(responses));
  console.log('Percentil 90:', getPercentile(responses, 90));
}
