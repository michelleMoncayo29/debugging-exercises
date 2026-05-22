/**
 * shopping-list-optimizer.js
 *
 * Clase ShoppingListOptimizer: gestor inteligente de lista de compras.
 *
 * Permite agregar artículos con nombre, cantidad, precio unitario, categoría
 * y prioridad (high/medium/low); eliminar y actualizar artículos; agrupar por
 * categoría; ordenar por prioridad y luego por categoría; calcular el costo
 * total; aplicar restricción de presupuesto; obtener artículos por categoría;
 * encontrar los más caros; filtrar por umbral de precio y generar estadísticas.
 *
 * Cada artículo tiene la forma:
 *   { name: string, quantity: number, unitPrice: number, category: string, priority: 'high'|'medium'|'low' }
 */

// Orden numérico de prioridad para ordenamiento (menor = más importante)
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
const VALID_PRIORITIES = new Set(['high', 'medium', 'low']);

class ShoppingListOptimizer {
  constructor() {
    // Lista interna de artículos de compras
    this._items = [];
  }

  // ---------------------------------------------------------------------------
  // Utilidades internas
  // ---------------------------------------------------------------------------

  /**
   * Valida que un valor sea una cadena no vacía.
   * @param {*} value
   * @returns {boolean}
   */
  _isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  /**
   * Calcula el costo total de un artículo (quantity * unitPrice).
   * @param {{ quantity: number, unitPrice: number }} item
   * @returns {number}
   */
  _itemCost(item) {
    return item.quantity * item.unitPrice;
  }

  // ---------------------------------------------------------------------------
  // addItem
  // ---------------------------------------------------------------------------

  /**
   * Agrega un nuevo artículo a la lista de compras.
   *
   * @param {{ name: string, quantity: number, unitPrice: number, category: string, priority?: string }} item
   * @throws {Error} Si name está ausente/vacío, quantity <= 0, unitPrice < 0 o priority es inválida
   */
  addItem({ name, quantity, unitPrice, category, priority = 'medium' }) {
    if (!this._isNonEmptyString(name)) {
      throw new Error('El nombre del artículo es obligatorio y no puede estar vacío.');
    }
    if (typeof quantity !== 'number' || quantity <= 0) {
      throw new Error('La cantidad debe ser un número positivo mayor que cero.');
    }
    if (typeof unitPrice !== 'number' || unitPrice < 0) {
      throw new Error('El precio unitario no puede ser negativo.');
    }
    if (!VALID_PRIORITIES.has(priority)) {
      throw new Error(`La prioridad debe ser 'high', 'medium' o 'low'. Se recibió: ${priority}`);
    }

    this._items.push({
      name: name.trim(),
      quantity,
      unitPrice,
      category: category || 'general',
      priority,
    });
  }

  // ---------------------------------------------------------------------------
  // removeItem
  // ---------------------------------------------------------------------------

  /**
   * Elimina el primer artículo cuyo nombre coincide exactamente.
   *
   * @param {string} name - Nombre exacto del artículo a eliminar
   * @returns {boolean} true si se eliminó, false si no se encontró
   */
  removeItem(name) {
    const index = this._items.findIndex((i) => i.name === name);
    if (index === -1) {
      return false;
    }
    this._items.splice(index, 1);
    return true;
  }

  // ---------------------------------------------------------------------------
  // updateItem
  // ---------------------------------------------------------------------------

  /**
   * Actualiza los campos de un artículo existente (identificado por nombre exacto).
   * Solo se reemplazan los campos proporcionados; el resto se conserva.
   *
   * @param {string} name    - Nombre exacto del artículo a actualizar
   * @param {object} updates - Objeto con los campos a actualizar
   * @returns {boolean} true si se actualizó, false si no se encontró
   */
  updateItem(name, updates) {
    const index = this._items.findIndex((i) => i.name === name);
    if (index === -1) {
      return false;
    }
    this._items[index] = { ...this._items[index], ...updates };
    return true;
  }

  // ---------------------------------------------------------------------------
  // getTotalCost
  // ---------------------------------------------------------------------------

  /**
   * Calcula el costo total de todos los artículos en la lista.
   * Costo de cada artículo = quantity * unitPrice.
   *
   * @returns {number}
   */
  getTotalCost() {
    return this._items.reduce((sum, item) => sum + this._itemCost(item), 0);
  }

  // ---------------------------------------------------------------------------
  // groupByCategory
  // ---------------------------------------------------------------------------

  /**
   * Agrupa todos los artículos por su categoría.
   *
   * @returns {Object} Objeto con categorías como claves y arreglos de artículos como valores
   */
  groupByCategory() {
    return this._items.reduce((groups, item) => {
      const cat = item.category;
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(item);
      return groups;
    }, {});
  }

  // ---------------------------------------------------------------------------
  // getSortedByPriorityThenCategory
  // ---------------------------------------------------------------------------

  /**
   * Retorna una copia de los artículos ordenada primero por prioridad
   * (high → medium → low) y luego alfabéticamente por categoría.
   * No muta la lista interna.
   *
   * @returns {Array}
   */
  getSortedByPriorityThenCategory() {
    return [...this._items].sort((a, b) => {
      const priorityDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.category.localeCompare(b.category);
    });
  }

  // ---------------------------------------------------------------------------
  // getItemsWithinBudget
  // ---------------------------------------------------------------------------

  /**
   * Retorna los artículos que se pueden comprar con el presupuesto dado,
   * eligiendo en orden de prioridad (high primero) y luego alfabéticamente
   * por categoría cuando la prioridad es igual.
   * El algoritmo es greedy: incluye cada artículo si el costo acumulado
   * no supera el presupuesto.
   *
   * @param {number} budget - Presupuesto máximo disponible
   * @returns {Array} Artículos seleccionados dentro del presupuesto
   */
  getItemsWithinBudget(budget) {
    const sorted = this.getSortedByPriorityThenCategory();
    let remaining = budget;
    const selected = [];

    sorted.forEach((item) => {
      const cost = this._itemCost(item);
      if (cost <= remaining) {
        selected.push(item);
        remaining -= cost;
      }
    });

    return selected;
  }

  // ---------------------------------------------------------------------------
  // getItemsByCategory
  // ---------------------------------------------------------------------------

  /**
   * Retorna todos los artículos que pertenecen a la categoría especificada.
   *
   * @param {string} category - Nombre exacto de la categoría
   * @returns {Array}
   */
  getItemsByCategory(category) {
    return this._items.filter((i) => i.category === category);
  }

  // ---------------------------------------------------------------------------
  // getMostExpensiveItems
  // ---------------------------------------------------------------------------

  /**
   * Retorna los N artículos más costosos, ordenados de mayor a menor costo total
   * (quantity * unitPrice).
   *
   * @param {number} n - Número de artículos a retornar
   * @returns {Array}
   */
  getMostExpensiveItems(n) {
    return [...this._items]
      .sort((a, b) => this._itemCost(b) - this._itemCost(a))
      .slice(0, n);
  }

  // ---------------------------------------------------------------------------
  // getItemsBelowPrice / getItemsAbovePrice
  // ---------------------------------------------------------------------------

  /**
   * Retorna los artículos cuyo precio unitario es estrictamente menor al umbral.
   *
   * @param {number} threshold - Umbral de precio unitario
   * @returns {Array}
   */
  getItemsBelowPrice(threshold) {
    return this._items.filter((i) => i.unitPrice < threshold);
  }

  /**
   * Retorna los artículos cuyo precio unitario es estrictamente mayor al umbral.
   *
   * @param {number} threshold - Umbral de precio unitario
   * @returns {Array}
   */
  getItemsAbovePrice(threshold) {
    return this._items.filter((i) => i.unitPrice > threshold);
  }

  // ---------------------------------------------------------------------------
  // getSummaryStats
  // ---------------------------------------------------------------------------

  /**
   * Calcula estadísticas generales de la lista de compras:
   *  - totalItems: número de artículos
   *  - totalCost: costo total acumulado
   *  - categoryCount: número de categorías distintas
   *  - mostExpensiveItem: nombre del artículo con mayor precio unitario
   *  - avgUnitPrice: promedio de precios unitarios
   *  - priorityBreakdown: objeto { high, medium, low } con conteos
   *
   * @returns {{ totalItems: number, totalCost: number, categoryCount: number, mostExpensiveItem: string|null, avgUnitPrice: number, priorityBreakdown: object }}
   */
  getSummaryStats() {
    const totalItems = this._items.length;

    if (totalItems === 0) {
      return {
        totalItems: 0,
        totalCost: 0,
        categoryCount: 0,
        mostExpensiveItem: null,
        avgUnitPrice: 0,
        priorityBreakdown: { high: 0, medium: 0, low: 0 },
      };
    }

    const totalCost = this.getTotalCost();

    const categories = new Set(this._items.map((i) => i.category));
    const categoryCount = categories.size;

    const mostExpensiveItem = this._items.reduce((best, item) =>
      item.unitPrice > best.unitPrice ? item : best
    ).name;

    const avgUnitPrice =
      this._items.reduce((sum, i) => sum + i.unitPrice, 0) / totalItems;

    const priorityBreakdown = this._items.reduce(
      (acc, item) => {
        acc[item.priority] = (acc[item.priority] || 0) + 1;
        return acc;
      },
      { high: 0, medium: 0, low: 0 }
    );

    return { totalItems, totalCost, categoryCount, mostExpensiveItem, avgUnitPrice, priorityBreakdown };
  }

  // ---------------------------------------------------------------------------
  // getAll / count
  // ---------------------------------------------------------------------------

  /**
   * Retorna una copia superficial de todos los artículos.
   *
   * @returns {Array}
   */
  getAll() {
    return [...this._items];
  }

  /**
   * Retorna el número total de artículos en la lista.
   *
   * @returns {number}
   */
  count() {
    return this._items.length;
  }
}

// ---------------------------------------------------------------------------
// Exportación
// ---------------------------------------------------------------------------

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ShoppingListOptimizer;
}
