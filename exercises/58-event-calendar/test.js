/**
 * Pruebas para Event Calendar
 * Ejecutar con: npm test exercises/58-event-calendar
 */

const { EventCalendar } = require('./buggy-code.js');

describe('Event Calendar', () => {
  let calendar;

  beforeEach(() => {
    calendar = new EventCalendar();
    calendar.addEvent({
      id: 'E001',
      title: 'Daily Standup',
      date: '2024-03-01',
      startTime: '09:00',
      endTime: '09:30',
    });
    calendar.addEvent({
      id: 'E002',
      title: 'Team Lunch',
      date: '2024-03-01',
      startTime: '12:00',
      endTime: '13:00',
    });
    calendar.addEvent({
      id: 'E003',
      title: 'Sprint Review',
      date: '2024-03-05',
      startTime: '15:00',
      endTime: '16:00',
    });
  });

  describe('addEvent - agregar evento', () => {
    test('debe agregar eventos correctamente', () => {
      expect(calendar.getEvent('E001').title).toBe('Daily Standup');
    });

    test('debe lanzar error si el id ya existe', () => {
      expect(() => calendar.addEvent({
        id: 'E001', title: 'Dup', date: '2024-03-01', startTime: '10:00', endTime: '11:00',
      })).toThrow();
    });
  });

  describe('getEventsOnDate - eventos por fecha', () => {
    test('debe retornar todos los eventos de una fecha', () => {
      const events = calendar.getEventsOnDate('2024-03-01');
      expect(events).toHaveLength(2);
    });

    test('debe retornar lista vacía si no hay eventos', () => {
      expect(calendar.getEventsOnDate('2024-12-31')).toHaveLength(0);
    });

    test('debe retornar eventos ordenados por hora de inicio', () => {
      const events = calendar.getEventsOnDate('2024-03-01');
      expect(events[0].startTime).toBe('09:00');
      expect(events[1].startTime).toBe('12:00');
    });
  });

  describe('hasConflict - detectar conflictos', () => {
    test('debe detectar superposición de horarios', () => {
      const newEvent = { date: '2024-03-01', startTime: '09:15', endTime: '09:45' };
      expect(calendar.hasConflict(newEvent)).toBe(true);
    });

    test('eventos consecutivos no deben ser conflicto', () => {
      // Termina a las 09:30, empieza a las 09:30 → sin conflicto
      const newEvent = { date: '2024-03-01', startTime: '09:30', endTime: '10:00' };
      expect(calendar.hasConflict(newEvent)).toBe(false);
    });

    test('evento en fecha distinta no debe ser conflicto', () => {
      const newEvent = { date: '2024-03-02', startTime: '09:00', endTime: '09:30' };
      expect(calendar.hasConflict(newEvent)).toBe(false);
    });
  });

  describe('generateRecurringDates - fechas recurrentes', () => {
    test('la primera ocurrencia debe ser la fecha de inicio', () => {
      const dates = calendar.generateRecurringDates('2024-03-01', 7, 3);
      expect(dates[0]).toBe('2024-03-01');
    });

    test('debe generar el número correcto de ocurrencias', () => {
      const dates = calendar.generateRecurringDates('2024-03-01', 7, 4);
      expect(dates).toHaveLength(4);
    });

    test('las fechas deben estar separadas por el intervalo correcto', () => {
      const dates = calendar.generateRecurringDates('2024-03-01', 7, 3);
      expect(dates[1]).toBe('2024-03-08');
      expect(dates[2]).toBe('2024-03-15');
    });
  });

  describe('addRecurringEvent - evento recurrente', () => {
    test('debe agregar todas las ocurrencias al calendario', () => {
      calendar.addRecurringEvent({
        idPrefix: 'STD',
        title: 'Weekly Sync',
        date: '2024-04-01',
        startTime: '10:00',
        endTime: '10:30',
        intervalDays: 7,
        occurrences: 3,
      });
      expect(calendar.getEventsOnDate('2024-04-01')).toHaveLength(1);
      expect(calendar.getEventsOnDate('2024-04-08')).toHaveLength(1);
      expect(calendar.getEventsOnDate('2024-04-15')).toHaveLength(1);
    });
  });

  describe('getWeekEvents - eventos de una semana', () => {
    test('debe retornar todos los eventos de la semana', () => {
      const events = calendar.getWeekEvents('2024-03-01');
      const ids = events.map(e => e.id);
      expect(ids).toContain('E001');
      expect(ids).toContain('E002');
      expect(ids).toContain('E003');
    });
  });

  describe('removeEvent - eliminar evento', () => {
    test('debe eliminar el evento del calendario', () => {
      calendar.removeEvent('E001');
      expect(() => calendar.getEvent('E001')).toThrow();
    });
  });

  describe('getFreeSlots - franjas horarias libres', () => {
    test('debe retornar franjas libres entre eventos del día', () => {
      const slots = calendar.getFreeSlots('2024-03-01', '08:00', '14:00');
      expect(slots.length).toBeGreaterThan(0);
      // Hay un hueco entre 09:30 y 12:00
      const hasGap = slots.some(s => s.start === '09:30' && s.end === '12:00');
      expect(hasGap).toBe(true);
    });
  });
});
