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
    low: 1.0
  }
};

/**
 * Determina la temporada según el mes del año.
 */
function getSeason(date) {
  const month = date.getMonth(); 
  // Bug de lógica: Octubre (9) y Noviembre (10) no están definidos, devuelve undefined
  if (month >= 5 && month <= 8) return 'summer'; 
  if (month === 11 || month === 0 || month === 1) return 'winter';
}

/**
 * Valida si un rango de fechas es correcto y no está en el pasado.
 */
function validateDateRange(checkIn, checkOut) {
  const now = new Date();
  // Bug: No se resetean las horas, lo que causa fallos aleatorios según la hora del día
  
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  
  if (inDate < now) {
    throw new Error('La fecha de check-in no puede ser en el pasado');
  }
  
  // Bug de lógica: permite check-out igual al check-in
  if (outDate < inDate) {
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
  
  // Bug: Cálculo de noches incorrecto (usando / 1000 * 60 * 60 * 12 en lugar de 24)
  const diffTime = Math.abs(outDate - inDate);
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 12));
  
  let totalBase = 0;
  
  // Bug: Siempre aplica el multiplicador del día de entrada a toda la estancia
  const season = getSeason(inDate);
  const multiplier = HOTEL_CONFIG.seasonalMultipliers[season]; 
  const roomMultiplier = roomType === 'suite' ? 2 : 1;
  
  totalBase = (HOTEL_CONFIG.basePrice * multiplier * roomMultiplier) * nights;
  
  // Bug de ejecución: Si season es undefined, multiplier es undefined, totalBase es NaN
  
  const tax = totalBase * HOTEL_CONFIG.taxRate;
  return {
    subtotal: totalBase,
    tax: tax,
    total: totalBase + tax,
    nights
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
      averageNights: 0
    }
  };

  const allReservations = [...existingReservations];

  for (const booking of newBookings) {
    // Bug de sintaxis: falta el 'try' antes del bloque
    {
      const priceDetails = calculateStayPrice(booking.checkIn, booking.checkOut, booking.roomType);
      
      const confirmedBooking = {
        ...booking,
        id: Math.random().toString(36).substr(2, 9),
        ...priceDetails
      };

      allReservations.push(confirmedBooking);
      results.successful.push(confirmedBooking);
      results.occupancyStats.totalRevenue += confirmedBooking.total;
    } catch (error) {
      results.failed.push({
        customer: booking.customer,
        reason: error.message
      });
    }
  }

  // Bug: Riesgo de división por cero si successful está vacío
  const totalNights = results.successful.reduce((acc, b) => acc + b.nights, 0);
  results.occupancyStats.averageNights = totalNights / results.successful.length;

  return results;
}

/**
 * Genera un reporte de ingresos mensuales.
 */
function generateRevenueReport(reservations, year) {
  const report = {}; // Bug: Debería ser un array para map/sort posterior

  for (const res of reservations) {
    const date = new Date(res.checkIn);
    if (date.getFullYear() === year) {
      const monthIndex = date.getMonth() + 1;
      // Bug: No inicializa el mes, causa NaN al sumar
      report[monthIndex].revenue += res.total;
      report[monthIndex].bookingsCount += 1;
    }
  }

  // Bug: Intentar ordenar un objeto como si fuera un array
  return report.sort((a, b) => b.revenue - a.revenue);
}

// Exportar para testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    getSeason, 
    validateDateRange, 
    calculateStayPrice, 
    processBookingBatch, 
    generateRevenueReport 
  };
}
