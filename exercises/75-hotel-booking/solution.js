'use strict';

/**
 * Sistema de reservas de hotel
 *
 * Implementa la gestión de habitaciones y reservas de un hotel:
 * disponibilidad, cálculo de costos por noches, check-out, reportes
 * de ocupación, ingresos totales y estadísticas por tipo de habitación.
 */

class Room {
  constructor(roomNumber, type, pricePerNight) {
    this.roomNumber = roomNumber;
    this.type = type;
    this.pricePerNight = pricePerNight;
    this.isAvailable = true;
    this.bookings = [];
  }
}

class Hotel {
  constructor(name) {
    this.name = name;
    this.rooms = [];
  }

  addRoom(room) {
    this.rooms.push(room);
  }

  bookRoom(roomNumber, guestName, checkIn, checkOut) {
    const room = this.rooms.find(r => r.roomNumber === roomNumber);

    if (!room || !room.isAvailable) {
      return null;
    }

    // CORREGIDO: el orden correcto es checkOut - checkIn para obtener noches positivas
    const nights = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
    const totalCost = nights * room.pricePerNight;

    const booking = {
      guestName,
      roomNumber,
      checkIn,
      checkOut,
      nights,
      totalCost,
    };

    room.bookings.push(booking);
    room.isAvailable = false;

    return booking;
  }

  checkOut(roomNumber) {
    const room = this.rooms.find(r => r.roomNumber === roomNumber);
    if (!room) return false;
    room.isAvailable = true;
    return true;
  }

  getAvailableRooms(type = null) {
    return this.rooms.filter(r => {
      if (!r.isAvailable) return false;
      if (type !== null) return r.type === type;
      return true;
    });
  }

  getOccupiedRooms() {
    return this.rooms.filter(r => !r.isAvailable);
  }

  getRoomsByPriceRange(min, max) {
    return this.rooms.filter(r => r.pricePerNight >= min && r.pricePerNight <= max);
  }

  getTotalRevenue() {
    return this.rooms.reduce((total, room) => {
      const roomRevenue = room.bookings.reduce((sum, b) => sum + b.totalCost, 0);
      return total + roomRevenue;
    }, 0);
  }

  getOccupancyRate() {
    if (this.rooms.length === 0) return 0;
    const occupied = this.rooms.filter(r => !r.isAvailable).length;
    return (occupied / this.rooms.length) * 100;
  }

  getMostExpensiveBooking() {
    const allBookings = this.rooms.flatMap(r => r.bookings);
    if (allBookings.length === 0) return null;
    return allBookings.reduce((max, b) => (b.totalCost > max.totalCost ? b : max));
  }

  getBookingsByGuest(guestName) {
    return this.rooms.flatMap(r => r.bookings).filter(b => b.guestName === guestName);
  }

  getRoomSummary() {
    const types = [...new Set(this.rooms.map(r => r.type))];
    return types.reduce((summary, type) => {
      const roomsOfType = this.rooms.filter(r => r.type === type);
      summary[type] = {
        total: roomsOfType.length,
        occupied: roomsOfType.filter(r => !r.isAvailable).length,
        available: roomsOfType.filter(r => r.isAvailable).length,
      };
      return summary;
    }, {});
  }
}

module.exports = { Room, Hotel };
