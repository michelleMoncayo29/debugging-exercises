/**
 * Parking Lot Manager
 *
 * Sistema de gestión de estacionamiento con tipos de vehículos, spots,
 * cobro por hora y reportes de ocupación.
 */

// Jerarquía de tamaños: un vehículo puede usar su spot o uno más grande
const SIZE_ORDER = ['compact', 'standard', 'large'];

class Vehicle {
  constructor(plate, size, entryTime) {
    this.plate = plate;
    this.size = size;
    this.entryTime = entryTime;
  }
}

class ParkingLot {
  constructor(spots, hourlyRate) {
    this.spots = spots.map(s => ({ ...s, vehicle: null }));
    this.hourlyRate = hourlyRate;
    this.transactions = [];
  }

  // Spots disponibles de un tipo específico
  getAvailableSpots(type) {
    return this.spots.filter(s => s.type === type && s.vehicle === null);
  }

  // CORREGIDO: al buscar un spot, se deben considerar los tipos compatibles
  // en orden desde el tamaño del vehículo hacia arriba (compact → standard → large).
  // El bug asignaba el primer spot libre sin respetar el tipo, usando cualquier spot.
  findSpot(vehicleSize) {
    const sizeIndex = SIZE_ORDER.indexOf(vehicleSize);
    const compatibleTypes = SIZE_ORDER.slice(sizeIndex);
    for (const type of compatibleTypes) {
      const available = this.getAvailableSpots(type);
      if (available.length > 0) return available[0];
    }
    return null;
  }

  park(vehicle) {
    const spot = this.findSpot(vehicle.size);
    if (!spot) {
      throw new Error(`No hay spots disponibles para vehículo de tamaño ${vehicle.size}`);
    }
    spot.vehicle = vehicle;
    return spot;
  }

  getOccupiedSpot(plate) {
    return this.spots.find(s => s.vehicle && s.vehicle.plate === plate);
  }

  exit(plate, exitTime) {
    const spot = this.getOccupiedSpot(plate);
    if (!spot) throw new Error(`Vehículo ${plate} no está registrado`);

    const entry = new Date(spot.vehicle.entryTime);
    const exit = new Date(exitTime);
    const diffMs = exit - entry;
    const rawHours = diffMs / (1000 * 60 * 60);
    const hours = Math.max(1, Math.ceil(rawHours));
    const amount = hours * this.hourlyRate;

    const bill = {
      plate,
      spotId: spot.id,
      entryTime: spot.vehicle.entryTime,
      exitTime,
      hours,
      amount: Math.round(amount * 100) / 100,
    };

    this.transactions.push(bill);
    spot.vehicle = null;
    return bill;
  }

  getOccupancyRate() {
    const occupied = this.spots.filter(s => s.vehicle !== null).length;
    return occupied / this.spots.length;
  }

  getRevenueSummary() {
    const total = this.transactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      totalTransactions: this.transactions.length,
      totalRevenue: Math.round(total * 100) / 100,
      averageStay: this.transactions.length
        ? Math.round(this.transactions.reduce((s, t) => s + t.hours, 0) / this.transactions.length * 10) / 10
        : 0,
      revenueBySpotType: this.transactions.reduce((acc, t) => {
        const spot = this.spots.find(s => s.id === t.spotId);
        if (spot) acc[spot.type] = (acc[spot.type] || 0) + t.amount;
        return acc;
      }, {}),
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Vehicle, ParkingLot };
}

if (require.main === module) {
  const lot = new ParkingLot([
    { id: 'A1', type: 'compact' }, { id: 'B1', type: 'standard' }, { id: 'C1', type: 'large' },
  ], 2.50);
  lot.park(new Vehicle('ABC123', 'compact', '2024-01-01T08:00:00'));
  const bill = lot.exit('ABC123', '2024-01-01T11:30:00');
  console.log('Factura:', bill);
  console.log('Ocupación:', lot.getOccupancyRate());
}
