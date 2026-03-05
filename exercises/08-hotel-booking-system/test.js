/**
 * Pruebas para: Sistema de Reservas de Hotel
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 */

// IMPORTANTE: Cambiar esta línea para probar tu solución
const {
  getSeason,
  validateDateRange,
  calculateStayPrice,
  processBookingBatch,
  generateRevenueReport,
} = require('./buggy-code.js');
// const { getSeason, validateDateRange, calculateStayPrice, processBookingBatch, generateRevenueReport } = require('./solution.js');

describe('Sistema de Reservas de Hotel - Lógica Avanzada', () => {
  describe('getSeason - Identificación de Temporada', () => {
    test('debe identificar correctamente todas las estaciones del año', () => {
      expect(getSeason(new Date(2024, 6, 1))).toBe('summer'); // Julio
      expect(getSeason(new Date(2024, 0, 1))).toBe('winter'); // Enero
      expect(getSeason(new Date(2024, 3, 1))).toBe('low'); // Abril
    });

    test('debe manejar los meses de otoño (Octubre/Noviembre) como temporada baja', () => {
      expect(getSeason(new Date(2024, 9, 15))).toBe('low'); // Octubre
      expect(getSeason(new Date(2024, 10, 15))).toBe('low'); // Noviembre
    });
  });

  describe('calculateStayPrice - Cálculo de Estancia', () => {
    test('debe calcular el número correcto de noches', () => {
      const result = calculateStayPrice('2026-10-01', '2026-10-05');
      expect(result.nights).toBe(4);
    });

    test('debe aplicar multiplicadores diferentes si la estancia cruza temporadas', () => {
      // De 28 de Agosto (Summer) a 2 de Septiembre (Low)
      // Noche 28, 29, 30, 31 (Summer) + Noche 1 (Low)
      const result = calculateStayPrice('2026-08-28', '2026-09-02');
      // Esperado: (100 * 1.5 * 4 noches) + (100 * 1.0 * 1 noche) = 600 + 100 = 700 base
      expect(result.subtotal).toBe(700);
    });

    test('debe duplicar el precio base para suites', () => {
      const standard = calculateStayPrice(
        '2026-11-01',
        '2026-11-02',
        'standard',
      );
      const suite = calculateStayPrice('2026-11-01', '2026-11-02', 'suite');
      expect(suite.subtotal).toBe(standard.subtotal * 2);
    });
  });

  describe('processBookingBatch - Gestión de Lotes y Disponibilidad', () => {
    test('debe procesar exitosamente un lote de reservas válidas', () => {
      const existing = [];
      const incoming = [
        {
          customer: 'Ana',
          checkIn: '2026-12-01',
          checkOut: '2026-12-05',
          roomType: 'standard',
        },
        {
          customer: 'Bob',
          checkIn: '2026-12-10',
          checkOut: '2026-12-12',
          roomType: 'suite',
        },
      ];

      const result = processBookingBatch(existing, incoming);
      expect(result.successful).toHaveLength(2);
      expect(result.occupancyStats.totalRevenue).toBeGreaterThan(0);
      expect(result.occupancyStats.averageNights).toBe(3); // (4 + 2) / 2
    });

    test('debe manejar errores sin detener el proceso del lote', () => {
      const incoming = [
        { customer: 'Error', checkIn: '2020-01-01', checkOut: '2020-01-05' }, // Fecha pasada
        { customer: 'Ok', checkIn: '2026-12-20', checkOut: '2026-12-25' },
      ];
      const result = processBookingBatch([], incoming);
      expect(result.failed).toHaveLength(1);
      expect(result.successful).toHaveLength(1);
    });
  });

  describe('generateRevenueReport - Reportes Financieros', () => {
    test('debe retornar un reporte ordenado por ingresos de mayor a menor', () => {
      const data = [
        { checkIn: '2026-01-01', total: 1000 },
        { checkIn: '2026-05-01', total: 5000 },
        { checkIn: '2026-12-01', total: 2000 },
      ];
      const report = generateRevenueReport(data, 2026);

      expect(Array.isArray(report)).toBe(true);
      expect(report[0].month).toBe(5); // Mayo debería ser el primero (5000)
      expect(report[0].revenue).toBe(5000);
      expect(report[1].month).toBe(12); // Diciembre el segundo (2000)
    });
  });
});
