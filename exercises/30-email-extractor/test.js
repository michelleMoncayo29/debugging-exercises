/**
 * Pruebas para: Email Extractor
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/30-email-extractor
 */

const { extractEmails, isValidEmail } = require('./buggy-code.js');
// const { } = require('./solution.js');

describe('Email Extractor - Error Lógico', () => {
  describe('isValidEmail - validación de email', () => {
    test('debe aceptar un email en minúsculas válido', () => {
      expect(isValidEmail('usuario@ejemplo.com')).toBe(true);
    });

    test('debe aceptar un email con subdominios', () => {
      expect(isValidEmail('user@mail.empresa.org')).toBe(true);
    });

    test('debe aceptar un email con caracteres especiales en la parte local', () => {
      expect(isValidEmail('user.name+tag@ejemplo.co')).toBe(true);
    });

    test('debe rechazar una cadena sin arroba', () => {
      expect(isValidEmail('usuarioejemplo.com')).toBe(false);
    });

    test('debe rechazar una cadena sin dominio', () => {
      expect(isValidEmail('usuario@')).toBe(false);
    });

    test('debe aceptar emails con letras mayúsculas', () => {
      expect(isValidEmail('Usuario@Ejemplo.COM')).toBe(true);
    });
  });

  describe('extractEmails - extracción desde texto', () => {
    test('debe extraer emails en minúsculas de un texto simple', () => {
      const text = 'Contacta a soporte@empresa.com para ayuda.';
      expect(extractEmails(text)).toEqual(['soporte@empresa.com']);
    });

    test('debe extraer múltiples emails', () => {
      const text = 'Envía copia a ana@empresa.com y a juan@empresa.com';
      const result = extractEmails(text);
      expect(result).toContain('ana@empresa.com');
      expect(result).toContain('juan@empresa.com');
      expect(result).toHaveLength(2);
    });

    test('debe extraer emails con letras mayúsculas y normalizarlos a minúsculas', () => {
      const text = 'Escribe a Admin@Empresa.COM para más información.';
      expect(extractEmails(text)).toEqual(['admin@empresa.com']);
    });

    test('debe eliminar emails duplicados', () => {
      const text = 'info@empresa.com y luego otra vez info@empresa.com';
      expect(extractEmails(text)).toHaveLength(1);
    });

    test('debe devolver arreglo vacío si no hay emails en el texto', () => {
      expect(extractEmails('Este texto no tiene correos')).toEqual([]);
    });

    test('debe extraer emails mezclados con mayúsculas y minúsculas sin duplicar', () => {
      const text = 'Contacta a Ventas@Empresa.com o ventas@empresa.com';
      const result = extractEmails(text);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe('ventas@empresa.com');
    });
  });
});
