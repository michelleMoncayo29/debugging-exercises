/**
 * Pruebas para: Slug Generator
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/31-slug-generator
 */

const { generateSlug } = require('./buggy-code.js');
// const { } = require('./solution.js');

describe('Slug Generator - Error Lógico', () => {
  test('debe convertir un título simple a slug en minúsculas', () => {
    expect(generateSlug('Hola Mundo')).toBe('hola-mundo');
  });

  test('debe reemplazar espacios múltiples con un solo guion', () => {
    expect(generateSlug('titulo   con   espacios')).toBe('titulo-con-espacios');
  });

  test('debe eliminar caracteres especiales y acentos latinos', () => {
    expect(generateSlug('Cómo Están Ústedes')).toBe('como-estan-ustedes');
  });

  test('debe colapsar guiones consecutivos en uno solo', () => {
    expect(generateSlug('hola---mundo')).toBe('hola-mundo');
  });

  test('debe eliminar guiones al inicio y al final', () => {
    expect(generateSlug('  hola mundo  ')).toBe('hola-mundo');
  });

  test('debe manejar títulos con puntuación', () => {
    expect(generateSlug('¡Bienvenidos al 2024!')).toBe('bienvenidos-al-2024');
  });

  test('debe manejar cadenas con mezcla de símbolos y espacios', () => {
    expect(generateSlug('Post #1: Intro & Setup')).toBe('post-1-intro-setup');
  });

  test('debe devolver cadena vacía para entrada vacía', () => {
    expect(generateSlug('')).toBe('');
  });

  test('debe mantener números en el slug', () => {
    expect(generateSlug('Ejercicio 10 de JavaScript')).toBe('ejercicio-10-de-javascript');
  });
});
