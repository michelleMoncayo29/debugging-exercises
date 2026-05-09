/**
 * contact-book.js
 *
 * Clase ContactBook: agenda de contactos que permite agregar, eliminar,
 * buscar, agrupar, filtrar por etiqueta y obtener estadísticas.
 *
 * Cada contacto tiene la forma:
 *   { name: string, phone: string, email: string, tags: string[] }
 */

class ContactBook {
  constructor() {
    // Lista interna de contactos
    this._contacts = [];
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

  // ---------------------------------------------------------------------------
  // addContact
  // ---------------------------------------------------------------------------

  /**
   * Agrega un nuevo contacto a la agenda.
   *
   * @param {{ name: string, phone: string, email: string, tags?: string[] }} contact
   * @throws {Error} Si name o phone están ausentes o son cadenas vacías
   */
  addContact({ name, phone, email, tags = [] }) {
    if (!this._isNonEmptyString(name)) {
      throw new Error('El nombre del contacto es obligatorio y no puede estar vacío.');
    }
    if (!this._isNonEmptyString(phone)) {
      throw new Error('El teléfono del contacto es obligatorio y no puede estar vacío.');
    }

    this._contacts.push({
      name: name.trim(),
      phone: phone.trim(),
      email: email || '',
      tags: Array.isArray(tags) ? [...tags] : [],
    });
  }

  // ---------------------------------------------------------------------------
  // removeContact
  // ---------------------------------------------------------------------------

  /**
   * Elimina el primer contacto cuyo nombre coincide exactamente.
   *
   * @param {string} name - Nombre exacto del contacto a eliminar
   * @returns {boolean} true si se eliminó, false si no se encontró
   */
  removeContact(name) {
    const index = this._contacts.findIndex((c) => c.name === name);
    if (index === -1) {
      return false;
    }
    this._contacts.splice(index, 1);
    return true;
  }

  // ---------------------------------------------------------------------------
  // findByName
  // ---------------------------------------------------------------------------

  /**
   * Busca contactos cuyo nombre contenga la cadena dada (sin distinción de mayúsculas).
   *
   * @param {string} query - Subcadena a buscar en el nombre
   * @returns {Array} Contactos coincidentes
   */
  findByName(query) {
    const lowerQuery = query.toLowerCase();
    return this._contacts.filter((c) =>
      c.name.toLowerCase().includes(lowerQuery)
    );
  }

  // ---------------------------------------------------------------------------
  // findByPhone
  // ---------------------------------------------------------------------------

  /**
   * Encuentra el contacto con el número de teléfono exacto indicado.
   *
   * @param {string} phone - Número de teléfono a buscar
   * @returns {object|null} El contacto encontrado o null
   */
  findByPhone(phone) {
    const contact = this._contacts.find((c) => c.phone === phone);
    return contact !== undefined ? contact : null;
  }

  // ---------------------------------------------------------------------------
  // groupByFirstLetter
  // ---------------------------------------------------------------------------

  /**
   * Agrupa todos los contactos por la primera letra (mayúscula) de su nombre.
   *
   * @returns {Object} Objeto con letras como claves y arreglos de contactos como valores
   */
  groupByFirstLetter() {
    return this._contacts.reduce((groups, contact) => {
      const letter = contact.name[0].toUpperCase();
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(contact);
      return groups;
    }, {});
  }

  // ---------------------------------------------------------------------------
  // getByTag
  // ---------------------------------------------------------------------------

  /**
   * Retorna todos los contactos que tienen la etiqueta especificada.
   *
   * @param {string} tag - Etiqueta a buscar
   * @returns {Array} Contactos que contienen la etiqueta
   */
  getByTag(tag) {
    return this._contacts.filter((c) => c.tags.includes(tag));
  }

  // ---------------------------------------------------------------------------
  // getSortedAlphabetically
  // ---------------------------------------------------------------------------

  /**
   * Retorna una copia ordenada alfabéticamente de los contactos por nombre.
   * No muta la lista interna.
   *
   * @returns {Array} Contactos ordenados
   */
  getSortedAlphabetically() {
    return [...this._contacts].sort((a, b) => a.name.localeCompare(b.name));
  }

  // ---------------------------------------------------------------------------
  // getStatistics
  // ---------------------------------------------------------------------------

  /**
   * Calcula estadísticas generales de la agenda:
   *  - total: número de contactos
   *  - groupCount: número de grupos (letras iniciales distintas)
   *  - uniqueTags: arreglo de etiquetas únicas
   *  - mostPopularLetter: letra inicial con más contactos
   *  - avgTagsPerContact: promedio de etiquetas por contacto
   *
   * @returns {{ total: number, groupCount: number, uniqueTags: string[], mostPopularLetter: string|null, avgTagsPerContact: number }}
   */
  getStatistics() {
    const total = this._contacts.length;

    const groups = this.groupByFirstLetter();
    const groupCount = Object.keys(groups).length;

    // Recopilar todas las etiquetas y eliminar duplicados
    const uniqueTags = [
      ...new Set(this._contacts.flatMap((c) => c.tags)),
    ];

    // Letra con más contactos
    let mostPopularLetter = null;
    if (groupCount > 0) {
      mostPopularLetter = Object.keys(groups).reduce((best, letter) =>
        groups[letter].length > groups[best].length ? letter : best
      );
    }

    // Promedio de etiquetas por contacto
    const avgTagsPerContact =
      total === 0
        ? 0
        : this._contacts.reduce((sum, c) => sum + c.tags.length, 0) / total;

    return { total, groupCount, uniqueTags, mostPopularLetter, avgTagsPerContact };
  }

  // ---------------------------------------------------------------------------
  // hasContact
  // ---------------------------------------------------------------------------

  /**
   * Indica si existe algún contacto con el nombre exacto dado.
   *
   * @param {string} name - Nombre exacto del contacto
   * @returns {boolean}
   */
  hasContact(name) {
    return this._contacts.some((c) => c.name === name);
  }

  // ---------------------------------------------------------------------------
  // getAllTags
  // ---------------------------------------------------------------------------

  /**
   * Retorna un arreglo con todas las etiquetas únicas presentes en la agenda.
   *
   * @returns {string[]}
   */
  getAllTags() {
    return [...new Set(this._contacts.flatMap((c) => c.tags))];
  }

  // ---------------------------------------------------------------------------
  // updateContact
  // ---------------------------------------------------------------------------

  /**
   * Actualiza los campos de un contacto existente (identificado por nombre exacto).
   * Solo se reemplazan los campos proporcionados; el resto se conserva.
   *
   * @param {string} name    - Nombre exacto del contacto a actualizar
   * @param {object} updates - Objeto con los campos a actualizar
   * @returns {boolean} true si se actualizó, false si no se encontró
   */
  updateContact(name, updates) {
    const index = this._contacts.findIndex((c) => c.name === name);
    if (index === -1) {
      return false;
    }
    // Fusionar cambios preservando los campos existentes
    this._contacts[index] = { ...this._contacts[index], ...updates };
    return true;
  }

  // ---------------------------------------------------------------------------
  // getAll / count
  // ---------------------------------------------------------------------------

  /**
   * Retorna una copia superficial de todos los contactos.
   *
   * @returns {Array}
   */
  getAll() {
    return [...this._contacts];
  }

  /**
   * Retorna el número total de contactos en la agenda.
   *
   * @returns {number}
   */
  count() {
    return this._contacts.length;
  }
}

// ---------------------------------------------------------------------------
// Exportación
// ---------------------------------------------------------------------------

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContactBook;
}
