/**
 * Slug Generator
 *
 * Convierte un título arbitrario en un slug URL-friendly.
 * Pasos: normalizar acentos → minúsculas → reemplazar no alfanuméricos
 * por guion → colapsar guiones consecutivos → recortar extremos.
 */

/**
 * Convierte un título en un slug URL-friendly.
 * @param {string} title
 * @returns {string}
 */
function generateSlug(title) {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

module.exports = { generateSlug };
