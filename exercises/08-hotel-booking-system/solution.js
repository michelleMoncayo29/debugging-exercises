/**
 * Módulo de Sistema de Reservas y Gestión de Ingresos
 *
 * Este módulo gestiona las reservas de un hotel, incluyendo la validación
 * de fechas, cálculo de precios con temporadas, gestión de ocupación
 * y generación de reportes financieros complejos.
 */

// Configuración del hotel
const HOTEL_CONFIG = {
  totalRooms: 50,
  basePrice: 100,
  taxRate: 0.21, // 21% IVA
  seasonalMultipliers: {
    summer: 1.5,
    winter: 1.2,
    low: 1.0,
  },
};

/**
 * Determina la temporada según el mes del año.
 */
function getSeason(date) {
  const month = date.getMonth(); // 0-11
  if (month >= 5 && month <= 8) return 'summer'; // Jun-Sep
  if (month === 11 || month === 0 || month === 1) return 'winter'; // Dic-Feb
  return 'low';
}

/**
 * Valida si un rango de fechas es correcto y no está en el pasado.
 */
function validateDateRange(checkIn, checkOut) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);

  // CORREGIDO: Se asegura de comparar los timestamps para validación correcta
  if (isNaN(inDate.getTime()) || isNaN(outDate.getTime())) {
    throw new Error('Formato de fecha inválido');
  }

  if (inDate < now) {
    throw new Error('La fecha de check-in no puede ser en el pasado');
  }

  if (outDate <= inDate) {
    throw new Error('La fecha de check-out debe ser posterior al check-in');
  }

  return true;
}

/**
 * Calcula el precio total de una estancia.
 */
function calculateStayPrice(checkIn, checkOut, roomType = 'standard') {
  validateDateRange(checkIn, checkOut);

  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);

  // CORREGIDO: Cálculo correcto de diferencia de días asegurando enteros
  const diffTime = outDate - inDate;
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let totalBase = 0;
  let current = new Date(inDate);

  // CORREGIDO: Se itera noche a noche para aplicar multiplicadores temporales correctamente
  for (let i = 0; i < nights; i++) {
    const season = getSeason(current);
    const multiplier = HOTEL_CONFIG.seasonalMultipliers[season];
    const roomMultiplier = roomType === 'suite' ? 2 : 1;
    totalBase += HOTEL_CONFIG.basePrice * multiplier * roomMultiplier;

    current.setDate(current.getDate() + 1);
  }

  const tax = totalBase * HOTEL_CONFIG.taxRate;
  return {
    subtotal: Number(totalBase.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number((totalBase + tax).toFixed(2)),
    nights,
  };
}

/**
 * Procesa un lote de reservas y genera estadísticas de ocupación.
 */
function processBookingBatch(existingReservations, newBookings) {
  const results = {
    successful: [],
    failed: [],
    occupancyStats: {
      totalRevenue: 0,
      averageNights: 0,
    },
  };

  const allReservations = [...existingReservations];

  for (const booking of newBookings) {
    try {
      // Validar disponibilidad
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);

      // CORREGIDO: Se comprueba la disponibilidad real contando solapamientos por día
      let maxSimultaneous = 0;
      let current = new Date(checkIn);
      while (current < checkOut) {
        const overlapping = allReservations.filter((res) => {
          const resIn = new Date(res.checkIn);
          const resOut = new Date(res.checkOut);
          return current >= resIn && current < resOut;
        }).length;

        maxSimultaneous = Math.max(maxSimultaneous, overlapping);
        current.setDate(current.getDate() + 1);
      }

      if (maxSimultaneous >= HOTEL_CONFIG.totalRooms) {
        throw new Error('No hay habitaciones disponibles para estas fechas');
      }

      const priceDetails = calculateStayPrice(
        booking.checkIn,
        booking.checkOut,
        booking.roomType,
      );
      const confirmedBooking = {
        ...booking,
        id: Math.random().toString(36).substr(2, 9),
        ...priceDetails,
      };

      allReservations.push(confirmedBooking);
      results.successful.push(confirmedBooking);
      results.occupancyStats.totalRevenue += confirmedBooking.total;
    } catch (error) {
      results.failed.push({
        customer: booking.customer,
        reason: error.message,
      });
    }
  }

  // CORREGIDO: Cálculo de promedio con validación de división por cero
  const totalNights = results.successful.reduce((acc, b) => acc + b.nights, 0);
  results.occupancyStats.averageNights =
    results.successful.length > 0
      ? Number((totalNights / results.successful.length).toFixed(2))
      : 0;

  return results;
}

/**
 * Genera un reporte de ingresos mensuales.
 */
function generateRevenueReport(reservations, year) {
  // CORREGIDO: Inicialización correcta de todos los meses para evitar huecos
  const report = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    revenue: 0,
    bookingsCount: 0,
  }));

  for (const res of reservations) {
    const date = new Date(res.checkIn);
    if (date.getFullYear() === year) {
      const monthIndex = date.getMonth();
      report[monthIndex].revenue += res.total;
      report[monthIndex].bookingsCount += 1;
    }
  }

  // CORREGIDO: Ordenar de mayor a menor ingreso
  return report.sort((a, b) => b.revenue - a.revenue);
}

// Exportar para testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getSeason,
    validateDateRange,
    calculateStayPrice,
    processBookingBatch,
    generateRevenueReport,
  };
}
