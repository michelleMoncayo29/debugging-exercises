const { Vehicle, ParkingSpot, ParkingLot, HOURLY_RATES, VEHICLE_SPOT_MAP } = require('./buggy-code');

describe('Vehicle', () => {
  test('crea un vehículo con placa, tipo y tiempo de entrada', () => {
    const v = new Vehicle('ABC123', 'car', 480);
    expect(v.plate).toBe('ABC123');
    expect(v.type).toBe('car');
    expect(v.entryTime).toBe(480);
  });

  test('getTypeLabel retorna la etiqueta correcta por tipo', () => {
    expect(new Vehicle('A1', 'car', 0).getTypeLabel()).toBe('Automóvil');
    expect(new Vehicle('A2', 'motorcycle', 0).getTypeLabel()).toBe('Motocicleta');
    expect(new Vehicle('A3', 'truck', 0).getTypeLabel()).toBe('Camión');
  });
});

describe('ParkingSpot', () => {
  test('inicia desocupado', () => {
    const spot = new ParkingSpot('R1', 'regular');
    expect(spot.isOccupied()).toBe(false);
    expect(spot.vehicle).toBeNull();
  });

  test('park ocupa el espacio con el vehículo dado', () => {
    const spot = new ParkingSpot('R1', 'regular');
    const v = new Vehicle('ABC123', 'car', 480);
    spot.park(v);
    expect(spot.isOccupied()).toBe(true);
    expect(spot.vehicle.plate).toBe('ABC123');
  });

  test('park retorna false si el espacio ya está ocupado', () => {
    const spot = new ParkingSpot('R1', 'regular');
    spot.park(new Vehicle('A1', 'car', 0));
    const result = spot.park(new Vehicle('A2', 'car', 10));
    expect(result).toBe(false);
  });

  test('clear libera el espacio y retorna el vehículo', () => {
    const spot = new ParkingSpot('C1', 'compact');
    const v = new Vehicle('M001', 'motorcycle', 300);
    spot.park(v);
    const returned = spot.clear();
    expect(spot.isOccupied()).toBe(false);
    expect(returned.plate).toBe('M001');
  });

  test('getStatus retorna objeto con info del espacio', () => {
    const spot = new ParkingSpot('L1', 'large');
    expect(spot.getStatus()).toEqual({ id: 'L1', type: 'large', occupied: false, plate: null });
    spot.park(new Vehicle('T999', 'truck', 0));
    expect(spot.getStatus()).toMatchObject({ occupied: true, plate: 'T999' });
  });
});

describe('HOURLY_RATES y VEHICLE_SPOT_MAP', () => {
  test('HOURLY_RATES tiene tarifas para car, motorcycle y truck', () => {
    expect(HOURLY_RATES.car).toBe(5);
    expect(HOURLY_RATES.motorcycle).toBe(3);
    expect(HOURLY_RATES.truck).toBe(8);
  });

  test('VEHICLE_SPOT_MAP asigna el tipo de espacio correcto por vehículo', () => {
    expect(VEHICLE_SPOT_MAP.car).toBe('regular');
    expect(VEHICLE_SPOT_MAP.motorcycle).toBe('compact');
    expect(VEHICLE_SPOT_MAP.truck).toBe('large');
  });
});

describe('ParkingLot - estacionamiento y liberación', () => {
  let lot;

  beforeEach(() => {
    lot = new ParkingLot('Parqueadero Central');
    lot.addSpots('compact', 3);
    lot.addSpots('regular', 4);
    lot.addSpots('large', 2);
  });

  test('addSpots crea la cantidad correcta de espacios', () => {
    expect(lot.spots.length).toBe(9);
  });

  test('parkVehicle retorna ID del espacio al estacionar un automóvil', () => {
    const spotId = lot.parkVehicle('CAR001', 'car', 480);
    expect(spotId).not.toBeNull();
    expect(lot.isVehicleParked('CAR001')).toBe(true);
  });

  test('parkVehicle asigna motorcycle a espacio compact', () => {
    const spotId = lot.parkVehicle('MOTO01', 'motorcycle', 480);
    const spot = lot.spots.find(s => s.id === spotId);
    expect(spot.type).toBe('compact');
  });

  test('parkVehicle asigna truck a espacio large', () => {
    const spotId = lot.parkVehicle('TRUCK1', 'truck', 480);
    const spot = lot.spots.find(s => s.id === spotId);
    expect(spot.type).toBe('large');
  });

  test('parkVehicle retorna null cuando no hay espacios disponibles', () => {
    lot.parkVehicle('M1', 'motorcycle', 480);
    lot.parkVehicle('M2', 'motorcycle', 480);
    lot.parkVehicle('M3', 'motorcycle', 480);
    const result = lot.parkVehicle('M4', 'motorcycle', 490);
    expect(result).toBeNull();
  });

  test('parkVehicle retorna null para tipo de vehículo inválido', () => {
    expect(lot.parkVehicle('X1', 'bus', 480)).toBeNull();
  });

  test('removeVehicle libera el espacio correctamente', () => {
    lot.parkVehicle('CAR001', 'car', 480);
    lot.removeVehicle('CAR001', 540);
    expect(lot.isVehicleParked('CAR001')).toBe(false);
  });

  test('removeVehicle retorna null si la placa no está estacionada', () => {
    expect(lot.removeVehicle('NOEXISTE', 500)).toBeNull();
  });
});

describe('ParkingLot - cálculo de tarifas', () => {
  let lot;

  beforeEach(() => {
    lot = new ParkingLot('Parqueadero Test');
    lot.addSpots('compact', 2);
    lot.addSpots('regular', 2);
    lot.addSpots('large', 2);
  });

  test('cobra exactamente una hora cuando la duración es 60 minutos (car)', () => {
    lot.parkVehicle('CAR001', 'car', 480);
    const fee = lot.removeVehicle('CAR001', 540);
    expect(fee).toBe(5); // 1 hora * $5
  });

  test('redondea hacia arriba la hora parcial: 90 minutos = 2 horas (car)', () => {
    lot.parkVehicle('CAR002', 'car', 480);
    const fee = lot.removeVehicle('CAR002', 570);
    expect(fee).toBe(10); // ceil(1.5) = 2 horas * $5
  });

  test('redondea hacia arriba la hora parcial: 45 minutos = 1 hora (motorcycle)', () => {
    lot.parkVehicle('MOTO01', 'motorcycle', 600);
    const fee = lot.removeVehicle('MOTO01', 645);
    expect(fee).toBe(3); // ceil(0.75) = 1 hora * $3
  });

  test('cobra tarifa correcta para truck con horas exactas', () => {
    lot.parkVehicle('TRUCK1', 'truck', 480);
    const fee = lot.removeVehicle('TRUCK1', 600);
    expect(fee).toBe(16); // 2 horas * $8
  });

  test('redondea hacia arriba: 150 minutos = 3 horas (truck)', () => {
    lot.parkVehicle('TRUCK2', 'truck', 480);
    const fee = lot.removeVehicle('TRUCK2', 630);
    expect(fee).toBe(24); // ceil(2.5) = 3 horas * $8
  });
});

describe('ParkingLot - ocupación y disponibilidad', () => {
  let lot;

  beforeEach(() => {
    lot = new ParkingLot('Parqueadero Norte');
    lot.addSpots('compact', 2);
    lot.addSpots('regular', 3);
    lot.addSpots('large', 1);
  });

  test('getOccupancyRate retorna 0 cuando el lote está vacío', () => {
    expect(lot.getOccupancyRate()).toBe(0);
  });

  test('getOccupancyRate retorna la proporción correcta de ocupación', () => {
    lot.parkVehicle('CAR001', 'car', 480);
    lot.parkVehicle('CAR002', 'car', 480);
    // 2 de 6 espacios ocupados
    expect(lot.getOccupancyRate()).toBeCloseTo(2 / 6);
  });

  test('getVehiclesByType retorna placas del tipo solicitado', () => {
    lot.parkVehicle('CAR001', 'car', 480);
    lot.parkVehicle('CAR002', 'car', 480);
    lot.parkVehicle('MOTO01', 'motorcycle', 480);
    const cars = lot.getVehiclesByType('car');
    expect(cars).toHaveLength(2);
    expect(cars).toContain('CAR001');
    expect(cars).toContain('CAR002');
  });

  test('getAvailableSpotsByType retorna el conteo correcto por tipo', () => {
    lot.parkVehicle('CAR001', 'car', 480);
    lot.parkVehicle('MOTO01', 'motorcycle', 480);
    const available = lot.getAvailableSpotsByType();
    expect(available.compact).toBe(1);
    expect(available.regular).toBe(2);
    expect(available.large).toBe(1);
  });

  test('getSpotStatusList retorna la lista de estados de todos los espacios', () => {
    const statuses = lot.getSpotStatusList();
    expect(statuses).toHaveLength(6);
    expect(statuses.every(s => typeof s.id === 'string')).toBe(true);
  });
});

describe('ParkingLot - estadísticas de transacciones', () => {
  let lot;

  beforeEach(() => {
    lot = new ParkingLot('Parqueadero Sur');
    lot.addSpots('compact', 3);
    lot.addSpots('regular', 3);
    lot.addSpots('large', 3);

    // Estacionar y retirar varios vehículos
    lot.parkVehicle('CAR001', 'car', 480);
    lot.parkVehicle('CAR002', 'car', 480);
    lot.parkVehicle('MOTO01', 'motorcycle', 480);
    lot.parkVehicle('TRUCK1', 'truck', 480);

    // CAR001: 90 min → ceil(1.5) * 5 = 10
    lot.removeVehicle('CAR001', 570);
    // CAR002: 60 min → ceil(1) * 5 = 5
    lot.removeVehicle('CAR002', 540);
    // MOTO01: 45 min → ceil(0.75) * 3 = 3
    lot.removeVehicle('MOTO01', 525);
    // TRUCK1: 120 min → ceil(2) * 8 = 16
    lot.removeVehicle('TRUCK1', 600);
  });

  test('getTotalRevenue retorna la suma correcta de tarifas', () => {
    // 10 + 5 + 3 + 16 = 34
    expect(lot.getTotalRevenue()).toBe(34);
  });

  test('getRevenueByType retorna ingresos desglosados por tipo de vehículo', () => {
    const revenue = lot.getRevenueByType();
    expect(revenue.car).toBe(15);   // 10 + 5
    expect(revenue.motorcycle).toBe(3);
    expect(revenue.truck).toBe(16);
  });

  test('getAverageDuration retorna el promedio de minutos estacionado', () => {
    // (90 + 60 + 45 + 120) / 4 = 315 / 4 = 78.75
    expect(lot.getAverageDuration()).toBeCloseTo(78.75);
  });

  test('getMostFrequentType retorna el tipo de vehículo más frecuente', () => {
    expect(lot.getMostFrequentType()).toBe('car');
  });

  test('getTransactionsInRange retorna solo las transacciones dentro del rango', () => {
    const range = lot.getTransactionsInRange(480, 560);
    // CAR002 (480→540) y MOTO01 (480→525) entran en el rango
    expect(range).toHaveLength(2);
  });

  test('getTopEarners retorna los N mayores pagadores ordenados por tarifa', () => {
    const top2 = lot.getTopEarners(2);
    expect(top2).toHaveLength(2);
    expect(top2[0].fee).toBe(16); // TRUCK1
    expect(top2[1].fee).toBe(10); // CAR001
  });

  test('getSummary retorna un resumen del estado del lote', () => {
    const summary = lot.getSummary();
    expect(summary.name).toBe('Parqueadero Sur');
    expect(summary.totalSpots).toBe(9);
    expect(summary.totalRevenue).toBe(34);
    expect(summary.totalTransactions).toBe(4);
  });
});

describe('ParkingLot - historial por vehículo y duraciones', () => {
  let lot;

  beforeEach(() => {
    lot = new ParkingLot('Parqueadero Este');
    lot.addSpots('compact', 2);
    lot.addSpots('regular', 2);
    lot.addSpots('large', 2);
  });

  test('getVehicleHistory retorna todas las transacciones de una placa', () => {
    lot.parkVehicle('CAR001', 'car', 480);
    lot.removeVehicle('CAR001', 570);
    lot.parkVehicle('CAR001', 'car', 600);
    lot.removeVehicle('CAR001', 660);

    const history = lot.getVehicleHistory('CAR001');
    expect(history).toHaveLength(2);
    expect(history.every(t => t.plate === 'CAR001')).toBe(true);
  });

  test('getLongestParkers retorna los N vehículos con mayor duración', () => {
    lot.parkVehicle('CAR001', 'car', 480);
    lot.parkVehicle('MOTO01', 'motorcycle', 480);
    lot.removeVehicle('CAR001', 660);   // 180 min
    lot.removeVehicle('MOTO01', 540);  // 60 min

    const top = lot.getLongestParkers(1);
    expect(top[0].plate).toBe('CAR001');
    expect(top[0].durationMinutes).toBe(180);
  });

  test('getTotalDuration retorna la suma total de minutos de todas las transacciones', () => {
    lot.parkVehicle('CAR001', 'car', 480);
    lot.parkVehicle('CAR002', 'car', 480);
    lot.removeVehicle('CAR001', 600); // 120 min
    lot.removeVehicle('CAR002', 570); // 90 min
    expect(lot.getTotalDuration()).toBe(210);
  });

  test('getSpotUtilization retorna cuántas veces fue usado cada espacio', () => {
    const spotId = lot.parkVehicle('CAR001', 'car', 480);
    lot.removeVehicle('CAR001', 540);
    lot.parkVehicle('CAR002', 'car', 550);
    lot.removeVehicle('CAR002', 610);

    const util = lot.getSpotUtilization();
    expect(util[spotId]).toBe(2);
  });
});
