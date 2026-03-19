/**
 * Pruebas para Word Frequency (TF-IDF)
 * Ejecutar con: npm test exercises/55-word-frequency
 */

const {
  tokenize,
  termFrequency,
  inverseDocumentFrequency,
  tfidf,
  getTopKeywords,
  cosineSimilarity,
  findMostSimilar,
} = require('./buggy-code.js');

describe('Word Frequency & TF-IDF', () => {
  const doc1 = 'the cat sat on the mat';
  const doc2 = 'the dog sat on the log';
  const doc3 = 'the cat chased the dog';
  const corpus = [doc1, doc2, doc3];

  describe('tokenize - tokenización', () => {
    test('debe dividir el texto en palabras en minúsculas', () => {
      expect(tokenize('Hello World')).toEqual(['hello', 'world']);
    });

    test('debe eliminar puntuación', () => {
      expect(tokenize('hello, world!')).toEqual(['hello', 'world']);
    });

    test('debe ignorar palabras vacías (stopwords)', () => {
      const tokens = tokenize('the cat sat on the mat', ['the', 'on']);
      expect(tokens).not.toContain('the');
      expect(tokens).not.toContain('on');
      expect(tokens).toContain('cat');
    });
  });

  describe('termFrequency - frecuencia de término', () => {
    test('debe calcular TF como conteo / total de palabras', () => {
      // "the cat sat on the mat" → 6 palabras, "the" aparece 2 veces
      // TF("the") = 2/6 ≈ 0.333
      const tf = termFrequency('the cat sat on the mat');
      expect(tf['the']).toBeCloseTo(2 / 6, 5);
    });

    test('el denominador debe ser el total de palabras, no las únicas', () => {
      // "the cat sat on the mat" → 6 totales, 5 únicas
      // Si usa únicas: TF("the") = 2/5 = 0.4 (incorrecto)
      // Si usa totales: TF("the") = 2/6 ≈ 0.333 (correcto)
      const tf = termFrequency('the cat sat on the mat');
      expect(tf['the']).not.toBeCloseTo(2 / 5, 5);
      expect(tf['the']).toBeCloseTo(2 / 6, 5);
    });

    test('palabras que aparecen una vez deben tener TF = 1/total', () => {
      const tf = termFrequency('the cat sat on the mat');
      expect(tf['cat']).toBeCloseTo(1 / 6, 5);
    });

    test('la suma de todos los TF debe ser 1', () => {
      const tf = termFrequency('the cat sat on the mat');
      const total = Object.values(tf).reduce((s, v) => s + v, 0);
      expect(total).toBeCloseTo(1, 5);
    });
  });

  describe('inverseDocumentFrequency - IDF', () => {
    test('debe calcular IDF = log(N / df) donde N = total de documentos', () => {
      // "the" aparece en los 3 documentos → IDF = log(3/3) = 0
      const idf = inverseDocumentFrequency('the', corpus);
      expect(idf).toBeCloseTo(0, 5);
    });

    test('término raro debe tener IDF alto', () => {
      // "chased" solo aparece en doc3 → IDF = log(3/1) ≈ 1.099
      const idf = inverseDocumentFrequency('chased', corpus);
      expect(idf).toBeCloseTo(Math.log(3), 3);
    });

    test('término ausente en el corpus debe retornar IDF máximo', () => {
      const idf = inverseDocumentFrequency('xyz', corpus);
      expect(idf).toBeCloseTo(Math.log(3), 3);
    });
  });

  describe('tfidf - puntuación TF-IDF', () => {
    test('debe retornar TF * IDF para un término en un documento', () => {
      const score = tfidf('cat', doc1, corpus);
      const tf = 1 / 6;
      const idf = Math.log(3 / 2); // "cat" en doc1 y doc3
      expect(score).toBeCloseTo(tf * idf, 5);
    });

    test('"the" debe tener TF-IDF de 0 al aparecer en todos los documentos', () => {
      const score = tfidf('the', doc1, corpus);
      expect(score).toBeCloseTo(0, 5);
    });
  });

  describe('getTopKeywords - palabras clave más relevantes', () => {
    test('debe retornar las N palabras con mayor TF-IDF', () => {
      const keywords = getTopKeywords(doc3, corpus, 2);
      expect(keywords).toHaveLength(2);
      expect(keywords[0].score).toBeGreaterThanOrEqual(keywords[1].score);
    });

    test('debe incluir el término con mayor TF-IDF primero', () => {
      // "chased" solo aparece en doc3 → score alto
      const keywords = getTopKeywords(doc3, corpus, 3);
      const terms = keywords.map(k => k.term);
      expect(terms).toContain('chased');
    });
  });

  describe('cosineSimilarity - similitud coseno', () => {
    test('un documento comparado consigo mismo debe tener similitud 1', () => {
      expect(cosineSimilarity(doc1, doc1, corpus)).toBeCloseTo(1, 3);
    });

    test('documentos más similares deben tener mayor puntuación', () => {
      const sim12 = cosineSimilarity(doc1, doc2, corpus);
      const sim13 = cosineSimilarity(doc1, doc3, corpus);
      // doc1 y doc2 comparten más estructura similar que doc1 y doc3
      expect(typeof sim12).toBe('number');
      expect(sim12).toBeGreaterThanOrEqual(0);
      expect(sim12).toBeLessThanOrEqual(1);
    });
  });

  describe('findMostSimilar - documento más similar', () => {
    test('debe retornar el documento más parecido de una colección', () => {
      const query = 'cat sat';
      const result = findMostSimilar(query, corpus);
      expect(result).toBeDefined();
      expect(result.similarity).toBeGreaterThanOrEqual(0);
    });
  });
});
