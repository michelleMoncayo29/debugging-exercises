/**
 * Pruebas para Parking Lot Manager
 * Ejecutar con: npm test exercises/47-parking-lot
 */

const { Vehicle, ParkingLot } = require('./buggy-code.js');

describe('Parking Lot Manager', () => {
  let lot;

  beforeEach(() => {
    // Spots ordenados: large primero para que el bug sea detectable
    lot = new ParkingLot([
      { id: 'C1', type: 'large' }, { id: 'C2', type: 'large' },
      { id: 'B1', type: 'standard' }, { id: 'B2', type: 'standard' }, { id: 'B3', type: 'standard' },
      { id: 'A1', type: 'compact' }, { id: 'A2', type: 'compact' }, { id: 'A3', type: 'compact' },
    ], 2.50); // tarifa por hora
  });

  describe('Vehicle - creación', () => {
    test('debe crear un vehículo con sus propiedades', () => {
      const v = new Vehicle('ABC123', 'compact', '2024-01-01T10:00:00');
      expect(v.plate).toBe('ABC123');
      expect(v.size).toBe('compact');
    });
  });

  describe('ParkingLot - estacionamiento de vehículos', () => {
    test('debe asignar el primer spot libre del tipo correcto, no cualquiera', () => {
      const v = new Vehicle('AAA001', 'compact', '2024-01-01T08:00:00');
      const spot = lot.park(v);
      expect(spot.type).toBe('compact'); // no debe asignar un spot 'large' o 'standard'
    });

    test('vehículo compact puede usar spot standard si no hay compact disponible', () => {
      // Llenar todos los compact
      lot.park(new Vehicle('P1', 'compact', '2024-01-01T08:00:00'));
      lot.park(new Vehicle('P2', 'compact', '2024-01-01T08:00:00'));
      lot.park(new Vehicle('P3', 'compact', '2024-01-01T08:00:00'));
      const v = new Vehicle('P4', 'compact', '2024-01-01T08:00:00');
      const spot = lot.park(v);
      expect(spot.type).toBe('standard');
    });

    test('debe lanzar error si no hay spots disponibles para ese tamaño', () => {
      // Solo hay 2 spots large; después del 2° debe fallar
      lot.park(new Vehicle('P0', 'large', '2024-01-01T08:00:00'));
      lot.park(new Vehicle('P1', 'large', '2024-01-01T08:00:00'));
      expect(() => lot.park(new Vehicle('PX', 'large', '2024-01-01T08:00:00'))).toThrow();
    });

    test('debe registrar el vehículo en el spot asignado', () => {
      const v = new Vehicle('BBB999', 'standard', '2024-01-01T09:00:00');
      const spot = lot.park(v);
      expect(lot.getOccupiedSpot('BBB999').id).toBe(spot.id);
    });
  });

  describe('ParkingLot - salida y cobro', () => {
    test('debe calcular la tarifa basada en horas exactas', () => {
      const v = new Vehicle('CCC111', 'compact', '2024-01-01T08:00:00');
      lot.park(v);
      // Sale 3 horas después
      const bill = lot.exit('CCC111', '2024-01-01T11:00:00');
      expect(bill.hours).toBe(3);
      expect(bill.amount).toBe(7.50);
    });

    test('debe cobrar al menos 1 hora (mínimo)', () => {
      const v = new Vehicle('DDD222', 'compact', '2024-01-01T08:00:00');
      lot.park(v);
      const bill = lot.exit('DDD222', '2024-01-01T08:30:00');
      expect(bill.hours).toBe(1);
      expect(bill.amount).toBe(2.50);
    });

    test('debe liberar el spot al salir', () => {
      const v = new Vehicle('EEE333', 'compact', '2024-01-01T08:00:00');
      lot.park(v);
      lot.exit('EEE333', '2024-01-01T10:00:00');
      expect(lot.getAvailableSpots('compact').length).toBe(3);
    });

    test('debe lanzar error al intentar salir con placa no registrada', () => {
      expect(() => lot.exit('ZZZ999', '2024-01-01T10:00:00')).toThrow();
    });
  });

  describe('ParkingLot - disponibilidad y reportes', () => {
    test('debe retornar spots disponibles por tipo correctamente', () => {
      lot.park(new Vehicle('F1', 'compact', '2024-01-01T08:00:00'));
      lot.park(new Vehicle('F2', 'compact', '2024-01-01T08:00:00'));
      expect(lot.getAvailableSpots('compact').length).toBe(1);
      expect(lot.getAvailableSpots('standard').length).toBe(3);
    });

    test('debe calcular la tasa de ocupación total', () => {
      lot.park(new Vehicle('G1', 'compact', '2024-01-01T08:00:00'));
      lot.park(new Vehicle('G2', 'standard', '2024-01-01T08:00:00'));
      // 2 ocupados de 8 total = 25%
      expect(lot.getOccupancyRate()).toBeCloseTo(0.25);
    });
  });
});
