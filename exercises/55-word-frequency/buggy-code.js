/**
 * Word Frequency & TF-IDF
 *
 * Análisis de frecuencia de términos con TF-IDF, similitud coseno
 * y extracción de palabras clave de un corpus de documentos.
 */

function tokenize(text, stopwords = []) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 0 && !stopwords.includes(word));
}

function termFrequency(text) {
  const tokens = tokenize(text);
  const totalWords = tokens.length;
  if (totalWords === 0) return {};

  const counts = tokens.reduce((freq, word) => {
    freq[word] = (freq[word] || 0) + 1;
    return freq;
  }, {});

  // const uniqueWords = Object.keys(counts).length;

  return Object.fromEntries(
    Object.entries(counts).map(([word, count]) => [word, count / totalWords])
  );
}

function inverseDocumentFrequency(term, corpus) {
  const totalDocs = corpus.length;
  const docsWithTerm = corpus.filter(doc =>
    tokenize(doc).includes(term)
  ).length;

  if (docsWithTerm === 0) return Math.log(totalDocs);
  return Math.log(totalDocs / docsWithTerm);
}

function tfidf(term, document, corpus) {
  const tf = termFrequency(document)[term] || 0;
  const idf = inverseDocumentFrequency(term, corpus);
  return tf * idf;
}

function getTopKeywords(document, corpus, n = 5) {
  const tf = termFrequency(document);
  const scores = Object.keys(tf).map(term => ({
    term,
    score: tfidf(term, document, corpus),
  }));
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

function buildTfidfVector(document, corpus) {
  const allTerms = [...new Set(corpus.flatMap(doc => tokenize(doc)))];
  return allTerms.map(term => tfidf(term, document, corpus));
}

function dotProduct(vecA, vecB) {
  return vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
}

function magnitude(vec) {
  return Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
}

function cosineSimilarity(docA, docB, corpus) {
  const vecA = buildTfidfVector(docA, corpus);
  const vecB = buildTfidfVector(docB, corpus);
  const magA = magnitude(vecA);
  const magB = magnitude(vecB);
  if (magA === 0 || magB === 0) return 0;
  return dotProduct(vecA, vecB) / (magA * magB);
}

function findMostSimilar(query, corpus) {
  const extendedCorpus = [query, ...corpus];
  let bestSimilarity = -1;
  let bestDoc = null;

  for (const doc of corpus) {
    const sim = cosineSimilarity(query, doc, extendedCorpus);
    if (sim > bestSimilarity) {
      bestSimilarity = sim;
      bestDoc = doc;
    }
  }
  return { document: bestDoc, similarity: Math.round(bestSimilarity * 10000) / 10000 };
}

function getWordFrequencyMap(text) {
  const tokens = tokenize(text);
  return tokens.reduce((freq, word) => {
    freq[word] = (freq[word] || 0) + 1;
    return freq;
  }, {});
}

function getMostFrequentWords(text, n = 10, stopwords = []) {
  const tokens = tokenize(text, stopwords);
  const counts = tokens.reduce((freq, word) => {
    freq[word] = (freq[word] || 0) + 1;
    return freq;
  }, {});
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([word, count]) => ({ word, count }));
}

function getUniqueTermsCount(text) {
  return new Set(tokenize(text)).size;
}

function getLexicalDiversity(text) {
  const tokens = tokenize(text);
  if (tokens.length === 0) return 0;
  return Math.round((new Set(tokens).size / tokens.length) * 10000) / 10000;
}

function getAverageTermFrequency(text) {
  const tf = termFrequency(text);
  const values = Object.values(tf);
  if (values.length === 0) return 0;
  return Math.round(
    (values.reduce((s, v) => s + v, 0) / values.length) * 10000
  ) / 10000;
}

function compareCorpusTerms(corpus) {
  const allTerms = [...new Set(corpus.flatMap(doc => tokenize(doc)))];
  return allTerms.map(term => ({
    term,
    idf: Math.round(inverseDocumentFrequency(term, corpus) * 10000) / 10000,
    documentFrequency: corpus.filter(doc => tokenize(doc).includes(term)).length,
  })).sort((a, b) => b.idf - a.idf);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    tokenize,
    termFrequency,
    inverseDocumentFrequency,
    tfidf,
    getTopKeywords,
    cosineSimilarity,
    findMostSimilar,
    getWordFrequencyMap,
    getMostFrequentWords,
    getUniqueTermsCount,
    getLexicalDiversity,
    getAverageTermFrequency,
    compareCorpusTerms,
  };
}

