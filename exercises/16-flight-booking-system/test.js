/**
 * Pruebas para: Sistema de Reservas de Vuelos
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/16-flight-booking-system
 */

// IMPORTANTE: Cambiar esta línea para probar tu solución
const {
  getFlightDuration,
  calculateFare,
  bookFlight,
} = require('./buggy-code.js');
// const {
//   getFlightDuration,
//   calculateFare,
//   bookFlight,
// } = require('./buggy-code.js');

describe('Sistema de Reservas de Vuelos', () => {
  // --- getFlightDuration ---
  describe('getFlightDuration - Cálculo de duración de vuelo', () => {
    test('debe calcular correctamente la duración de un vuelo de 2.5 horas', () => {
      const flight = {
        flightNumber: 'AV204',
        schedule: {
          departure: '2025-06-10T08:00:00',
          arrival: '2025-06-10T10:30:00',
        },
      };
      expect(getFlightDuration(flight)).toBe(150);
    });

    test('debe calcular correctamente la duración de un vuelo de 1 hora', () => {
      const flight = {
        flightNumber: 'CO101',
        schedule: {
          departure: '2025-07-01T06:00:00',
          arrival: '2025-07-01T07:00:00',
        },
      };
      expect(getFlightDuration(flight)).toBe(60);
    });

    test('debe calcular correctamente la duración de un vuelo de 45 minutos', () => {
      const flight = {
        flightNumber: 'AV010',
        schedule: {
          departure: '2025-08-15T12:00:00',
          arrival: '2025-08-15T12:45:00',
        },
      };
      expect(getFlightDuration(flight)).toBe(45);
    });

    test('debe lanzar error cuando el vuelo no tiene horario (schedule es undefined)', () => {
      const flightSinHorario = { flightNumber: 'XX999' };
      expect(() => getFlightDuration(flightSinHorario)).toThrow(
        'El vuelo debe tener un horario definido',
      );
    });

    test('debe lanzar error cuando el vuelo es null', () => {
      expect(() => getFlightDuration(null)).toThrow(
        'El vuelo debe tener un horario definido',
      );
    });
  });

  // --- calculateFare ---
  describe('calculateFare - Cálculo de tarifa dinámica', () => {
    test('debe calcular la tarifa correctamente con asientos disponibles', () => {
      const flight = { baseFare: 1500, availableSeats: 5 };
      expect(calculateFare(flight)).toBe(300);
    });

    test('debe calcular la tarifa con un solo asiento disponible', () => {
      const flight = { baseFare: 600, availableSeats: 1 };
      expect(calculateFare(flight)).toBe(600);
    });

    test('debe calcular la tarifa y redondear a 2 decimales', () => {
      const flight = { baseFare: 1000, availableSeats: 3 };
      expect(calculateFare(flight)).toBeCloseTo(333.33, 2);
    });

    test('debe lanzar error cuando availableSeats es 0', () => {
      const flight = { baseFare: 1500, availableSeats: 0 };
      expect(() => calculateFare(flight)).toThrow(
        'El vuelo no tiene asientos disponibles',
      );
    });

    test('debe lanzar error cuando availableSeats es negativo', () => {
      const flight = { baseFare: 1500, availableSeats: -3 };
      expect(() => calculateFare(flight)).toThrow(
        'El vuelo no tiene asientos disponibles',
      );
    });

    test('debe lanzar error cuando no hay tarifa base definida', () => {
      const flight = { availableSeats: 5 };
      expect(() => calculateFare(flight)).toThrow(
        'El vuelo debe tener una tarifa base definida',
      );
    });
  });

  // --- bookFlight ---
  describe('bookFlight - Registro de reserva de pasajero', () => {
    const flight = {
      flightNumber: 'AV204',
      schedule: {
        departure: '2025-06-10T08:00:00',
        arrival: '2025-06-10T10:30:00',
      },
    };

    test('debe retornar una confirmación con código, nombre, email y estado', () => {
      const passenger = {
        id: 'P001',
        name: 'María García',
        contact: { email: 'maria@email.com' },
      };
      const result = bookFlight(flight, passenger);
      expect(result.confirmationCode).toBe('AV204-P001');
      expect(result.passengerName).toBe('María García');
      expect(result.email).toBe('maria@email.com');
      expect(result.status).toBe('confirmed');
    });

    test('debe incluir el número de vuelo en la confirmación', () => {
      const passenger = {
        id: 'P002',
        name: 'Carlos López',
        contact: { email: 'carlos@email.com' },
      };
      const result = bookFlight(flight, passenger);
      expect(result.flight).toBe('AV204');
    });

    test('debe lanzar error cuando el pasajero no tiene contacto registrado', () => {
      const passengerSinContacto = { id: 'P003', name: 'Juan Pérez' };
      expect(() => bookFlight(flight, passengerSinContacto)).toThrow(
        'El pasajero debe tener un correo de contacto registrado',
      );
    });

    test('debe lanzar error cuando contact.email es undefined', () => {
      const passengerSinEmail = {
        id: 'P004',
        name: 'Laura Martínez',
        contact: {},
      };
      expect(() => bookFlight(flight, passengerSinEmail)).toThrow(
        'El pasajero debe tener un correo de contacto registrado',
      );
    });

    test('debe lanzar error cuando el pasajero es null', () => {
      expect(() => bookFlight(flight, null)).toThrow(
        'Se requieren datos del vuelo y del pasajero',
      );
    });

    test('debe lanzar error cuando el vuelo es null', () => {
      const passenger = {
        id: 'P005',
        name: 'Ana Ruiz',
        contact: { email: 'ana@email.com' },
      };
      expect(() => bookFlight(null, passenger)).toThrow(
        'Se requieren datos del vuelo y del pasajero',
      );
    });
  });
});
