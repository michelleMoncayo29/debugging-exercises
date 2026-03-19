/**
 * Pruebas para: Log Parser
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/29-log-parser
 */

const { parseLogLine, filterByLevel, countByLevel } = require('./buggy-code.js');
// const { } = require('./solution.js');

const SAMPLE_LOGS = [
  '[ERROR] 2024-01-15T10:30:00 - Connection timeout',
  '[INFO] 2024-01-15T10:31:00 - Server started',
  '[WARN] 2024-01-15T10:32:00 - High memory usage',
  '[ERROR] 2024-01-15T10:33:00 - Database unreachable',
  '[INFO] 2024-01-15T10:34:00 - Request processed',
];

describe('Log Parser - Error Lógico', () => {
  describe('parseLogLine - parseo de línea individual', () => {
    test('debe extraer el nivel correctamente', () => {
      const result = parseLogLine('[ERROR] 2024-01-15T10:30:00 - Connection timeout');
      expect(result.level).toBe('ERROR');
    });

    test('debe extraer el timestamp correctamente', () => {
      const result = parseLogLine('[ERROR] 2024-01-15T10:30:00 - Connection timeout');
      expect(result.timestamp).toBe('2024-01-15T10:30:00');
    });

    test('debe extraer el mensaje correctamente', () => {
      const result = parseLogLine('[ERROR] 2024-01-15T10:30:00 - Connection timeout');
      expect(result.message).toBe('Connection timeout');
    });

    test('debe retornar null para líneas con formato inválido', () => {
      expect(parseLogLine('línea sin formato')).toBeNull();
      expect(parseLogLine('')).toBeNull();
    });

    test('debe manejar mensajes que contienen guiones', () => {
      const line = '[DEBUG] 2024-01-15T10:00:00 - user-id: 42 - login success';
      const result = parseLogLine(line);
      expect(result.message).toBe('user-id: 42 - login success');
    });

    test('debe parsear todos los niveles estándar', () => {
      expect(parseLogLine('[WARN] 2024-01-15T10:00:00 - disco lleno').level).toBe('WARN');
      expect(parseLogLine('[DEBUG] 2024-01-15T10:00:00 - breakpoint').level).toBe('DEBUG');
    });
  });

  describe('filterByLevel - filtrado por nivel', () => {
    test('debe devolver solo los logs del nivel solicitado', () => {
      const errors = filterByLevel(SAMPLE_LOGS, 'ERROR');
      expect(errors).toHaveLength(2);
      errors.forEach(log => expect(log.level).toBe('ERROR'));
    });

    test('debe filtrar logs de nivel INFO', () => {
      const infos = filterByLevel(SAMPLE_LOGS, 'INFO');
      expect(infos).toHaveLength(2);
    });

    test('debe devolver arreglo vacío si no hay coincidencias', () => {
      expect(filterByLevel(SAMPLE_LOGS, 'DEBUG')).toHaveLength(0);
    });

    test('los objetos devueltos deben tener level, timestamp y message', () => {
      const [first] = filterByLevel(SAMPLE_LOGS, 'WARN');
      expect(first).toHaveProperty('level');
      expect(first).toHaveProperty('timestamp');
      expect(first).toHaveProperty('message');
    });
  });

  describe('countByLevel - conteo por nivel', () => {
    test('debe contar correctamente ERRORs', () => {
      expect(countByLevel(SAMPLE_LOGS).ERROR).toBe(2);
    });

    test('debe contar correctamente INFOs', () => {
      expect(countByLevel(SAMPLE_LOGS).INFO).toBe(2);
    });

    test('debe contar correctamente WARNs', () => {
      expect(countByLevel(SAMPLE_LOGS).WARN).toBe(1);
    });

    test('debe retornar objeto vacío para arreglo vacío', () => {
      expect(countByLevel([])).toEqual({});
    });
  });
});
