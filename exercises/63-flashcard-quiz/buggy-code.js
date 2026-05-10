/**
 * FlashcardDeck
 *
 * Sistema de estudio con tarjetas de memoria (flashcards). Permite crear
 * mazos de tarjetas pregunta/respuesta por categoría, registrar el rendimiento
 * por tarjeta, obtener tarjetas débiles, estadísticas por categoría y globales,
 * barajar el mazo y obtener tarjetas pendientes de repaso.
 */

class FlashcardDeck {
  /**
   * @param {string} name - Nombre del mazo de tarjetas
   */
  constructor(name) {
    this._name = name;
    this._cards = [];
    this._nextId = 1;
  }

  // ---------------------------------------------------------------------------
  // Utilidades internas
  // ---------------------------------------------------------------------------

  /**
   * Genera un identificador único para cada tarjeta.
   * @returns {string}
   */
  _generateId() {
    return `card-${this._nextId++}`;
  }

  /**
   * Busca una tarjeta por id y lanza error si no existe.
   * @param {string} id
   * @returns {Object}
   */
  _findCardOrThrow(id) {
    const card = this._cards.find((c) => c.id === id);
    if (!card) {
      throw new Error(`No existe ninguna tarjeta con id "${id}".`);
    }
    return card;
  }

  /**
   * Calcula la tasa de éxito de una tarjeta (correct / attempts).
   * Retorna 0 si la tarjeta no tiene intentos.
   * @param {Object} card
   * @returns {number} Valor entre 0 y 1
   */
  _cardSuccessRate(card) {
    if (card.attempts === 0) return 0;
    return card.correct / card.attempts;
  }

  // ---------------------------------------------------------------------------
  // Información básica
  // ---------------------------------------------------------------------------

  /**
   * Retorna el nombre del mazo.
   * @returns {string}
   */
  getName() {
    return this._name;
  }

  /**
   * Retorna el número de tarjetas en el mazo.
   * @returns {number}
   */
  size() {
    return this._cards.length;
  }

  /**
   * Retorna una copia superficial del arreglo de tarjetas.
   * @returns {Object[]}
   */
  getAllCards() {
    return this._cards.map((c) => ({ ...c }));
  }

  // ---------------------------------------------------------------------------
  // Gestión de tarjetas
  // ---------------------------------------------------------------------------

  /**
   * Agrega una nueva tarjeta al mazo.
   * @param {string} question - Pregunta de la tarjeta (no vacía)
   * @param {string} answer   - Respuesta correcta (no vacía)
   * @param {string} category - Categoría temática de la tarjeta
   * @returns {Object} La tarjeta recién creada
   */
  addCard(question, answer, category) {
    if (!question || !question.trim()) {
      throw new Error('La pregunta no puede estar vacía.');
    }
    if (!answer || !answer.trim()) {
      throw new Error('La respuesta no puede estar vacía.');
    }
    const duplicate = this._cards.some((c) => c.question === question);
    if (duplicate) {
      throw new Error(`Ya existe una tarjeta con la pregunta: "${question}"`);
    }

    const card = {
      id: this._generateId(),
      question,
      answer,
      category: category || 'General',
      attempts: 0,
      correct: 0,
    };
    this._cards.push(card);
    return { ...card };
  }

  /**
   * Elimina la tarjeta con el id indicado.
   * @param {string} id
   */
  removeCard(id) {
    const index = this._cards.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`No existe ninguna tarjeta con id "${id}".`);
    }
    this._cards.splice(index, 1);
  }

  /**
   * Retorna todas las tarjetas que pertenecen a la categoría indicada.
   * @param {string} category
   * @returns {Object[]}
   */
  getCardsByCategory(category) {
    return this._cards
      .filter((c) => c.category === category)
      .map((c) => ({ ...c }));
  }

  // ---------------------------------------------------------------------------
  // Registro de respuestas
  // ---------------------------------------------------------------------------

  /**
   * Registra un intento correcto para la tarjeta indicada.
   * Incrementa tanto attempts como correct.
   * @param {string} id - Id de la tarjeta
   */
  markCorrect(id) {
    const card = this._findCardOrThrow(id);
    card.attempts += 1;
    card.correct += 1;
  }

  /**
   * Registra un intento incorrecto para la tarjeta indicada.
   * Solo incrementa attempts.
   * @param {string} id - Id de la tarjeta
   */
  markIncorrect(id) {
    const card = this._findCardOrThrow(id);
    card.attempts += 1;
  }

  // ---------------------------------------------------------------------------
  // Rendimiento por tarjeta
  // ---------------------------------------------------------------------------

  /**
   * Retorna la tasa de éxito de una tarjeta específica.
   * Retorna 0 si la tarjeta no ha sido intentada.
   * @param {string} id
   * @returns {number} Valor entre 0 y 1
   */
  getSuccessRate(id) {
    const card = this._findCardOrThrow(id);
    return this._cardSuccessRate(card);
  }

  // ---------------------------------------------------------------------------
  // Tarjetas débiles
  // ---------------------------------------------------------------------------

  /**
   * Retorna las tarjetas cuya tasa de éxito es menor al umbral dado.
   * Solo incluye tarjetas que hayan sido intentadas al menos una vez.
   * @param {number} [threshold=0.5] - Umbral de tasa de éxito (0 a 1)
   * @returns {Object[]}
   */
  getWeakCards(threshold = 0.5) {
    return this._cards
      .filter((c) => c.attempts > 0 && this._cardSuccessRate(c) < threshold)
      .map((c) => ({ ...c }));
  }

  // ---------------------------------------------------------------------------
  // Tarjetas pendientes de repaso
  // ---------------------------------------------------------------------------

  /**
   * Retorna las tarjetas que aún necesitan repaso.
   * Una tarjeta está "dominada" cuando tiene al menos un intento y su tasa
   * de éxito es >= 0.8. Las demás (sin intentos o con tasa < 0.8) son pendientes.
   * @returns {Object[]}
   */
  getDueCards() {
    return this._cards
      .filter((c) => {
        if (c.attempts === 0) return true;
        return this._cardSuccessRate(c) < 0.8;
      })
      .map((c) => ({ ...c }));
  }

  // ---------------------------------------------------------------------------
  // Estadísticas por categoría
  // ---------------------------------------------------------------------------

  /**
   * Calcula estadísticas agrupadas por categoría.
   *
   * Cada entrada contiene:
   *   - total {number}              : total de tarjetas en la categoría
   *   - totalAttempts {number}      : suma de intentos de todas las tarjetas
   *   - averageSuccessRate {number} : promedio de tasa de éxito entre las
   *                                   tarjetas de la categoría (0 si ninguna
   *                                   ha sido intentada)
   *
   * @returns {Object.<string, {total: number, totalAttempts: number, averageSuccessRate: number}>}
   */
  getCategoryStats() {
    // Primer paso: acumular totales y suma de tasas de éxito por categoría
    const grouped = this._cards.reduce((acc, card) => {
      const cat = card.category;
      if (!acc[cat]) {
        acc[cat] = { total: 0, totalAttempts: 0, _rateSum: 0 };
      }
      acc[cat].total += 1;
      acc[cat].totalAttempts += card.attempts;
      acc[cat]._rateSum += this._cardSuccessRate(card);
      return acc;
    }, {});

    // Segundo paso: calcular el promedio real y eliminar la propiedad auxiliar
    Object.keys(grouped).forEach((cat) => {
      const entry = grouped[cat];
      entry.averageSuccessRate = entry.total > 0 ? entry._rateSum / entry.total : 0;
      delete entry._rateSum;
    });

    return grouped;
  }

  // ---------------------------------------------------------------------------
  // Estadísticas globales
  // ---------------------------------------------------------------------------

  /**
   * Retorna estadísticas globales del mazo:
   *   - totalCards {number}         : número total de tarjetas
   *   - totalAttempts {number}      : suma de todos los intentos
   *   - globalSuccessRate {number}  : (total correct) / (total attempts), 0 si no hay intentos
   *   - masteredCards {number}      : tarjetas con success rate >= 0.8 y al menos 1 intento
   *
   * @returns {{totalCards: number, totalAttempts: number, globalSuccessRate: number, masteredCards: number}}
   */
  getStats() {
    const totalCards = this._cards.length;

    const { totalAttempts, totalCorrect } = this._cards.reduce(
      (acc, card) => ({
        totalAttempts: acc.totalAttempts + card.attempts,
        totalCorrect: acc.totalCorrect + card.correct,
      }),
      { totalAttempts: 0, totalCorrect: 0 }
    );

    const globalSuccessRate =
      totalAttempts === 0 ? 0 : totalCorrect / totalAttempts;

    const masteredCards = this._cards.filter(
      (c) => c.attempts > 0 && this._cardSuccessRate(c) >= 0.8
    ).length;

    return { totalCards, totalAttempts, globalSuccessRate, masteredCards };
  }

  // ---------------------------------------------------------------------------
  // Reiniciar mazo
  // ---------------------------------------------------------------------------

  /**
   * Reinicia el progreso de todas las tarjetas (attempts y correct a cero).
   * Las tarjetas se conservan en el mazo.
   */
  reset() {
    this._cards.forEach((card) => {
      card.attempts = 0;
      card.correct = 0;
    });
  }

  // ---------------------------------------------------------------------------
  // Barajar
  // ---------------------------------------------------------------------------

  /**
   * Baraja aleatoriamente el orden de las tarjetas en el mazo (algoritmo Fisher-Yates).
   */
  shuffle() {
    for (let i = this._cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this._cards[i], this._cards[j]] = [this._cards[j], this._cards[i]];
    }
  }
}

// ---------------------------------------------------------------------------
// Exportaciones
// ---------------------------------------------------------------------------

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FlashcardDeck };
}
