'use strict';

const { Room, Hotel } = require('./buggy-code');

describe('Room', () => {
  test('crea una habitación con propiedades correctas', () => {
    const room = new Room(101, 'single', 80);
    expect(room.roomNumber).toBe(101);
    expect(room.type).toBe('single');
    expect(room.pricePerNight).toBe(80);
    expect(room.isAvailable).toBe(true);
    expect(room.bookings).toEqual([]);
  });

  test('crea una habitación de tipo suite con precio alto', () => {
    const room = new Room(301, 'suite', 350);
    expect(room.roomNumber).toBe(301);
    expect(room.type).toBe('suite');
    expect(room.pricePerNight).toBe(350);
    expect(room.isAvailable).toBe(true);
  });
});

describe('Hotel - gestión de habitaciones', () => {
  let hotel;

  beforeEach(() => {
    hotel = new Hotel('Grand Palace');
    hotel.addRoom(new Room(101, 'single', 80));
    hotel.addRoom(new Room(102, 'single', 90));
    hotel.addRoom(new Room(201, 'double', 150));
    hotel.addRoom(new Room(202, 'double', 160));
    hotel.addRoom(new Room(301, 'suite', 350));
  });

  test('el hotel tiene nombre correcto', () => {
    expect(hotel.name).toBe('Grand Palace');
  });

  test('addRoom agrega habitaciones correctamente', () => {
    expect(hotel.rooms.length).toBe(5);
  });

  test('getAvailableRooms retorna todas las habitaciones al inicio', () => {
    const available = hotel.getAvailableRooms();
    expect(available.length).toBe(5);
  });

  test('getAvailableRooms filtra por tipo correctamente', () => {
    const singles = hotel.getAvailableRooms('single');
    expect(singles.length).toBe(2);
    expect(singles.every(r => r.type === 'single')).toBe(true);

    const suites = hotel.getAvailableRooms('suite');
    expect(suites.length).toBe(1);
    expect(suites[0].roomNumber).toBe(301);
  });

  test('getRoomsByPriceRange retorna habitaciones en el rango correcto', () => {
    const rooms = hotel.getRoomsByPriceRange(80, 160);
    expect(rooms.length).toBe(4);
    expect(rooms.every(r => r.pricePerNight >= 80 && r.pricePerNight <= 160)).toBe(true);
  });

  test('getRoomsByPriceRange excluye habitaciones fuera del rango', () => {
    const rooms = hotel.getRoomsByPriceRange(200, 400);
    expect(rooms.length).toBe(1);
    expect(rooms[0].roomNumber).toBe(301);
  });
});

describe('Hotel - reservas', () => {
  let hotel;

  beforeEach(() => {
    hotel = new Hotel('Grand Palace');
    hotel.addRoom(new Room(101, 'single', 80));
    hotel.addRoom(new Room(201, 'double', 150));
    hotel.addRoom(new Room(301, 'suite', 350));
  });

  test('bookRoom reserva una habitación disponible y calcula el costo', () => {
    const booking = hotel.bookRoom(101, 'Ana García', '2024-03-01', '2024-03-04');
    expect(booking).not.toBeNull();
    expect(booking.guestName).toBe('Ana García');
    expect(booking.roomNumber).toBe(101);
    expect(booking.nights).toBe(3);
    expect(booking.totalCost).toBe(240); // 3 noches × $80
  });

  test('bookRoom calcula correctamente 7 noches en suite', () => {
    const booking = hotel.bookRoom(301, 'Carlos López', '2024-05-10', '2024-05-17');
    expect(booking.nights).toBe(7);
    expect(booking.totalCost).toBe(2450); // 7 × $350
  });

  test('bookRoom marca la habitación como no disponible', () => {
    hotel.bookRoom(101, 'Ana García', '2024-03-01', '2024-03-04');
    const available = hotel.getAvailableRooms();
    expect(available.length).toBe(2);
    expect(available.some(r => r.roomNumber === 101)).toBe(false);
  });

  test('bookRoom retorna null si la habitación no existe', () => {
    const result = hotel.bookRoom(999, 'Ghost', '2024-03-01', '2024-03-03');
    expect(result).toBeNull();
  });

  test('bookRoom retorna null si la habitación no está disponible', () => {
    hotel.bookRoom(101, 'Ana García', '2024-03-01', '2024-03-04');
    const result = hotel.bookRoom(101, 'Bob Smith', '2024-03-05', '2024-03-07');
    expect(result).toBeNull();
  });

  test('bookRoom guarda el historial de reservas en la habitación', () => {
    hotel.bookRoom(101, 'Ana García', '2024-03-01', '2024-03-04');
    const room = hotel.rooms.find(r => r.roomNumber === 101);
    expect(room.bookings.length).toBe(1);
    expect(room.bookings[0].guestName).toBe('Ana García');
  });

  test('checkOut libera la habitación correctamente', () => {
    hotel.bookRoom(101, 'Ana García', '2024-03-01', '2024-03-04');
    hotel.checkOut(101);
    const available = hotel.getAvailableRooms();
    expect(available.length).toBe(3);
    expect(available.some(r => r.roomNumber === 101)).toBe(true);
  });

  test('checkOut retorna false si la habitación no existe', () => {
    expect(hotel.checkOut(999)).toBe(false);
  });
});

describe('Hotel - estadísticas y reportes', () => {
  let hotel;

  beforeEach(() => {
    hotel = new Hotel('Grand Palace');
    hotel.addRoom(new Room(101, 'single', 80));
    hotel.addRoom(new Room(102, 'single', 90));
    hotel.addRoom(new Room(201, 'double', 150));
    hotel.addRoom(new Room(301, 'suite', 350));

    hotel.bookRoom(101, 'Ana García', '2024-03-01', '2024-03-04');  // 3 noches × $80 = $240
    hotel.bookRoom(201, 'Carlos López', '2024-03-10', '2024-03-15'); // 5 noches × $150 = $750
  });

  test('getTotalRevenue calcula ingresos totales correctamente', () => {
    expect(hotel.getTotalRevenue()).toBe(990); // $240 + $750
  });

  test('getOccupancyRate calcula el porcentaje correcto', () => {
    expect(hotel.getOccupancyRate()).toBe(50); // 2 de 4 habitaciones ocupadas
  });

  test('getOccupiedRooms retorna habitaciones actualmente ocupadas', () => {
    const occupied = hotel.getOccupiedRooms();
    expect(occupied.length).toBe(2);
    expect(occupied.some(r => r.roomNumber === 101)).toBe(true);
    expect(occupied.some(r => r.roomNumber === 201)).toBe(true);
  });

  test('getMostExpensiveBooking retorna la reserva de mayor costo', () => {
    const top = hotel.getMostExpensiveBooking();
    expect(top.guestName).toBe('Carlos López');
    expect(top.totalCost).toBe(750);
  });

  test('getBookingsByGuest retorna todas las reservas de un huésped', () => {
    hotel.checkOut(101);
    hotel.bookRoom(101, 'Ana García', '2024-04-01', '2024-04-03'); // 2 noches × $80 = $160
    const bookings = hotel.getBookingsByGuest('Ana García');
    expect(bookings.length).toBe(2);
    expect(bookings.every(b => b.guestName === 'Ana García')).toBe(true);
  });

  test('getBookingsByGuest retorna arreglo vacío si el huésped no existe', () => {
    expect(hotel.getBookingsByGuest('Fantasma')).toEqual([]);
  });

  test('getRoomSummary retorna resumen correcto por tipo', () => {
    const summary = hotel.getRoomSummary();
    expect(summary.single.total).toBe(2);
    expect(summary.single.occupied).toBe(1);
    expect(summary.double.total).toBe(1);
    expect(summary.double.occupied).toBe(1);
    expect(summary.suite.total).toBe(1);
    expect(summary.suite.occupied).toBe(0);
  });

  test('getTotalRevenue es 0 cuando no hay reservas', () => {
    const emptyHotel = new Hotel('Empty Hotel');
    emptyHotel.addRoom(new Room(101, 'single', 80));
    expect(emptyHotel.getTotalRevenue()).toBe(0);
  });

  test('getOccupancyRate es 0 cuando no hay habitaciones ocupadas', () => {
    const emptyHotel = new Hotel('Empty Hotel');
    emptyHotel.addRoom(new Room(101, 'single', 80));
    expect(emptyHotel.getOccupancyRate()).toBe(0);
  });

  test('getMostExpensiveBooking retorna null sin reservas', () => {
    const emptyHotel = new Hotel('Empty Hotel');
    emptyHotel.addRoom(new Room(101, 'single', 80));
    expect(emptyHotel.getMostExpensiveBooking()).toBeNull();
  });
});
