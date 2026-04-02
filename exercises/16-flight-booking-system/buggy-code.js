/**
 * Módulo de gestión de reservas de vuelos
 *
 * Proporciona funciones para consultar duración de vuelos,
 * calcular tarifas dinámicas y registrar reservas de pasajeros.
 */

/**
 * Calcula la duración de un vuelo en minutos a partir del horario
 * @param {Object} flight - Objeto vuelo con propiedad schedule
 * @returns {number} Duración en minutos
 */
function getFlightDuration(flight) {
  if (!flight || !flight.schedule) {
    throw new Error('El vuelo debe tener un horario definido');
  }
  // Acceder al horario del vuelo para calcular la duración
  const { departure, arrival } = flight.schedule;
  return (new Date(arrival) - new Date(departure)) / (1000 * 60);
}

/**
 * Calcula la tarifa por asiento según demanda
 * La tarifa base se divide entre los asientos disponibles para ajustar precio
 * @param {Object} flight - Objeto vuelo con baseFare y availableSeats
 * @returns {number} Tarifa calculada redondeada a 2 decimales
 */
function calculateFare(flight) {
  // Calcular la tarifa dividiendo el precio base entre los asientos disponibles
  if (!flight || typeof flight.baseFare !== 'number') {
    throw new Error('El vuelo debe tener una tarifa base definida');
  }

  if (flight.availableSeats <= 0) {
    throw new Error('El vuelo no tiene asientos disponibles');
  }

  const fare = flight.baseFare / flight.availableSeats;
  return Math.round(fare * 100) / 100;
}

/**
 * Registra la reserva de un pasajero en un vuelo
 * @param {Object} flight - Objeto vuelo
 * @param {Object} passenger - Objeto pasajero con datos de contacto
 * @returns {Object} Confirmación de reserva con datos del pasajero
 */
function bookFlight(flight, passenger) {
  // Construir la confirmación de reserva con los datos del pasajero
  if (!flight || !passenger) {
    throw new Error('Se requieren datos del vuelo y del pasajero');
  }

  if (!passenger.contact || !passenger.contact.email) {
    throw new Error('El pasajero debe tener un correo de contacto registrado');
  }

  return {
    confirmationCode: `${flight.flightNumber}-${passenger.id}`,
    passengerName: passenger.name,
    email: passenger.contact.email,
    flight: flight.flightNumber,
    status: 'confirmed',
  };
}

// Exportar para pruebas
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getFlightDuration, calculateFare, bookFlight };
}

// Uso de ejemplo
if (require.main === module) {
  const flight = {
    flightNumber: 'AV204',
    schedule: {
      departure: '2025-06-10T08:00:00',
      arrival: '2025-06-10T10:30:00',
    },
    baseFare: 1500,
    availableSeats: 5,
  };
  const passenger = {
    id: 'P001',
    name: 'María García',
    contact: { email: 'maria@email.com' },
  };
  console.log('Duración (min):', getFlightDuration(flight));
  console.log('Tarifa:', calculateFare(flight));
  console.log('Reserva:', bookFlight(flight, passenger));
}
