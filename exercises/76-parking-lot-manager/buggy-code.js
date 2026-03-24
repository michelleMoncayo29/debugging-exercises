class Vehicle {
  constructor(plate, type, entryTime) {
    this.plate = plate;
    this.type = type;
    this.entryTime = entryTime;
  }

  getTypeLabel() {
    const labels = { car: 'Automóvil', motorcycle: 'Motocicleta', truck: 'Camión' };
    return labels[this.type] || 'Desconocido';
  }
}

class ParkingSpot {
  constructor(id, type) {
    this.id = id;
    this.type = type;
    this.vehicle = null;
  }

  isOccupied() {
    return this.vehicle !== null;
  }

  park(vehicle) {
    if (this.isOccupied()) return false;
    this.vehicle = vehicle;
    return true;
  }

  clear() {
    const vehicle = this.vehicle;
    this.vehicle = null;
    return vehicle;
  }

  getStatus() {
    return {
      id: this.id,
      type: this.type,
      occupied: this.isOccupied(),
      plate: this.isOccupied() ? this.vehicle.plate : null,
    };
  }
}

const HOURLY_RATES = {
  car: 5,
  motorcycle: 3,
  truck: 8,
};

const VEHICLE_SPOT_MAP = {
  car: 'regular',
  motorcycle: 'compact',
  truck: 'large',
};

class ParkingLot {
  constructor(name) {
    this.name = name;
    this.spots = [];
    this.transactions = [];
  }

  addSpots(type, count) {
    for (let i = 0; i < count; i++) {
      const id = `${type[0].toUpperCase()}${this.spots.length + 1}`;
      this.spots.push(new ParkingSpot(id, type));
    }
  }

  findAvailableSpot(vehicleType) {
    const spotType = VEHICLE_SPOT_MAP[vehicleType];
    return this.spots.find(spot => spot.type === spotType && !spot.isOccupied()) || null;
  }

  parkVehicle(plate, type, currentTime) {
    if (!VEHICLE_SPOT_MAP[type]) return null;
    const spot = this.findAvailableSpot(type);
    if (!spot) return null;
    const vehicle = new Vehicle(plate, type, currentTime);
    spot.park(vehicle);
    return spot.id;
  }

  removeVehicle(plate, currentTime) {
    const spot = this.spots.find(s => s.isOccupied() && s.vehicle.plate === plate);
    if (!spot) return null;
    const vehicle = spot.vehicle;
    const durationMinutes = currentTime - vehicle.entryTime;
    const hours = durationMinutes / 60;
    const fee = Math.floor(hours) * HOURLY_RATES[vehicle.type];
    const transaction = {
      plate,
      type: vehicle.type,
      spotId: spot.id,
      entryTime: vehicle.entryTime,
      exitTime: currentTime,
      durationMinutes,
      fee,
    };
    this.transactions.push(transaction);
    spot.clear();
    return fee;
  }

  isVehicleParked(plate) {
    return this.spots.some(s => s.isOccupied() && s.vehicle.plate === plate);
  }

  getOccupiedSpots() {
    return this.spots.filter(s => s.isOccupied());
  }

  getFreeSpots() {
    return this.spots.filter(s => !s.isOccupied());
  }

  getOccupancyRate() {
    if (this.spots.length === 0) return 0;
    return this.getOccupiedSpots().length / this.spots.length;
  }

  getVehiclesByType(type) {
    return this.getOccupiedSpots()
      .filter(s => s.vehicle.type === type)
      .map(s => s.vehicle.plate);
  }

  getAvailableSpotsByType() {
    return this.getFreeSpots().reduce((acc, spot) => {
      acc[spot.type] = (acc[spot.type] || 0) + 1;
      return acc;
    }, {});
  }

  getSpotStatusList() {
    return this.spots.map(s => s.getStatus());
  }

  getTotalRevenue() {
    return this.transactions.reduce((sum, t) => sum + t.fee, 0);
  }

  getRevenueByType() {
    return this.transactions.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + t.fee;
      return acc;
    }, {});
  }

  getAverageDuration() {
    if (this.transactions.length === 0) return 0;
    const total = this.transactions.reduce((sum, t) => sum + t.durationMinutes, 0);
    return total / this.transactions.length;
  }

  getMostFrequentType() {
    if (this.transactions.length === 0) return null;
    const counts = this.transactions.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }

  getTransactionsInRange(startTime, endTime) {
    return this.transactions.filter(
      t => t.entryTime >= startTime && t.exitTime <= endTime
    );
  }

  getTopEarners(n) {
    return [...this.transactions]
      .sort((a, b) => b.fee - a.fee)
      .slice(0, n)
      .map(t => ({ plate: t.plate, fee: t.fee }));
  }

  getVehicleHistory(plate) {
    return this.transactions.filter(t => t.plate === plate);
  }

  getLongestParkers(n) {
    return [...this.transactions]
      .sort((a, b) => b.durationMinutes - a.durationMinutes)
      .slice(0, n)
      .map(t => ({ plate: t.plate, durationMinutes: t.durationMinutes }));
  }

  getTotalDuration() {
    return this.transactions.reduce((sum, t) => sum + t.durationMinutes, 0);
  }

  getSpotUtilization() {
    return this.transactions.reduce((acc, t) => {
      acc[t.spotId] = (acc[t.spotId] || 0) + 1;
      return acc;
    }, {});
  }

  getSummary() {
    const occupied = this.getOccupiedSpots().length;
    const total = this.spots.length;
    return {
      name: this.name,
      totalSpots: total,
      occupiedSpots: occupied,
      freeSpots: total - occupied,
      occupancyRate: this.getOccupancyRate(),
      totalRevenue: this.getTotalRevenue(),
      totalTransactions: this.transactions.length,
    };
  }
}

module.exports = { Vehicle, ParkingSpot, ParkingLot, HOURLY_RATES, VEHICLE_SPOT_MAP };
