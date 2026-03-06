/**
 * Pruebas para: Calendar Builder
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/38-calendar-builder
 */

const { buildCalendar, getDaysInMonth } = require('./buggy-code.js');
// const { buildCalendar, getDaysInMonth } = require('./solution.js');

describe('Calendar Builder - Error Lógico', () => {
  describe('getDaysInMonth - días en el mes', () => {
    test('enero tiene 31 días', () => {
      expect(getDaysInMonth(2024, 1)).toBe(31);
    });

    test('abril tiene 30 días', () => {
      expect(getDaysInMonth(2024, 4)).toBe(30);
    });

    test('febrero 2024 tiene 29 días (año bisiesto)', () => {
      expect(getDaysInMonth(2024, 2)).toBe(29);
    });

    test('febrero 2023 tiene 28 días (año no bisiesto)', () => {
      expect(getDaysInMonth(2023, 2)).toBe(28);
    });
  });

  describe('buildCalendar - construcción de cuadrícula (lunes a domingo)', () => {
    test('enero 2024 comienza en lunes (primer día de la primera semana es 1)', () => {
      const cal = buildCalendar(2024, 1);
      expect(cal[0][0]).toBe(1);
    });

    test('marzo 2024 comienza en viernes (posición 4 de la primera semana)', () => {
      // 1 de marzo de 2024 es viernes → índice 4 (Lun=0, Mar=1, Mié=2, Jue=3, Vie=4)
      const cal = buildCalendar(2024, 3);
      expect(cal[0][4]).toBe(1);
      expect(cal[0][0]).toBeNull(); // lunes está vacío
    });

    test('la primera semana de abril 2024 empieza el lunes 1', () => {
      // 1 de abril de 2024 es lunes
      const cal = buildCalendar(2024, 4);
      expect(cal[0][0]).toBe(1);
    });

    test('cada semana tiene exactamente 7 días', () => {
      const cal = buildCalendar(2024, 1);
      cal.forEach(week => expect(week).toHaveLength(7));
    });

    test('todos los días del mes aparecen en el calendario exactamente una vez', () => {
      const cal = buildCalendar(2024, 3);
      const days = cal.flat().filter(d => d !== null);
      expect(days).toHaveLength(31);
      expect(days[0]).toBe(1);
      expect(days[days.length - 1]).toBe(31);
    });

    test('febrero 2024 tiene el día 29 en el calendario', () => {
      const cal = buildCalendar(2024, 2);
      const days = cal.flat().filter(d => d !== null);
      expect(days).toHaveLength(29);
      expect(days[days.length - 1]).toBe(29);
    });
  });
});
