/**
 * Sistema de Gestión de Suscripciones
 *
 * Maneja la facturación prorrateada, períodos de gracia,
 * cancelaciones anticipadas y aplicación de descuentos.
 */

// Ciclos de facturación expresados en días
const BILLING_CYCLES = {
  monthly: 30,
  quarterly: 90,
  annual: 365,
};

const DEFAULT_GRACE_DAYS = 7;

/**
 * Calcula el monto prorrateado según los días del período a facturar
 * @param {number} price - Precio del período completo
 * @param {number} daysUsed - Días del período a calcular
 * @param {number} totalDays - Total de días del período de facturación
 * @returns {number} Monto prorrateado redondeado a 2 decimales
 */
function calculateProration(price, daysUsed, totalDays) {
  if (price < 0 || daysUsed < 0 || totalDays <= 0) {
    throw new Error('Parámetros inválidos para calcular prorrateo');
  }
  if (daysUsed > totalDays) {
    throw new Error('Los días utilizados no pueden exceder el total del período');
  }

  // Dividir el precio entre los días del período para obtener el valor diario
  return Math.round((price * daysUsed) / totalDays);
}

/**
 * Verifica si la suscripción sigue dentro del período de gracia post-vencimiento
 * @param {Date} expirationDate - Fecha de vencimiento de la suscripción
 * @param {number} graceDays - Días de gracia permitidos después del vencimiento
 * @param {Date} currentDate - Fecha actual (inyectable para pruebas)
 * @returns {boolean}
 */
function isInGracePeriod(
  expirationDate,
  graceDays = DEFAULT_GRACE_DAYS,
  currentDate = new Date(),
) {
  const graceEnd = new Date(expirationDate);
  graceEnd.setDate(graceEnd.getDate() + graceDays);
  return currentDate > expirationDate && currentDate <= graceEnd;
}

/**
 * Calcula el reembolso al cancelar una suscripción antes del fin del período
 * @param {Object} subscription - Datos de la suscripción activa
 * @param {number} subscription.price - Precio del período actual
 * @param {Date} subscription.startDate - Fecha de inicio del período actual
 * @param {Date} subscription.endDate - Fecha de fin del período actual
 * @param {string} subscription.billingCycle - Ciclo de facturación (monthly/quarterly/annual)
 * @param {Date} currentDate - Fecha actual (inyectable para pruebas)
 * @returns {number} Monto a reembolsar
 */
function calculateCancellationRefund(subscription, currentDate = new Date()) {
  const { price, startDate, endDate, billingCycle } = subscription;

  if (currentDate >= endDate) {
    return 0;
  }

  const totalDays = BILLING_CYCLES[billingCycle];
  const daysUsed = Math.floor(
    (currentDate - startDate) / (1000 * 60 * 60 * 24),
  );

  const daysRemaining = totalDays - daysUsed;

  // Calcular el reembolso proporcional al tiempo de uso
  return calculateProration(price, daysRemaining, totalDays);
}

/**
 * Aplica múltiples descuentos a un precio base de forma aditiva.
 * Los porcentajes se suman antes de aplicarse (no en cadena multiplicativa).
 * @param {number} basePrice - Precio base
 * @param {number[]} discounts - Array de porcentajes de descuento (valores 0-100)
 * @returns {number} Precio final con descuentos aplicados, redondeado a 2 decimales
 */
function applyDiscounts(basePrice, discounts) {
  if (basePrice < 0) {
    throw new Error('El precio base no puede ser negativo');
  }
  if (
    !Array.isArray(discounts) ||
    discounts.some((d) => d < 0 || d > 100)
  ) {
    throw new Error('Los descuentos deben ser valores entre 0 y 100');
  }

  // Aplicar cada descuento de forma acumulativa sobre el precio base
  const totalDiscount = Math.min(
    discounts.reduce((sum, d) => sum + d, 0),
    100,
  );
  return Math.round(basePrice * (1 - totalDiscount / 100) * 100) / 100;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateProration,
    isInGracePeriod,
    calculateCancellationRefund,
    applyDiscounts,
    BILLING_CYCLES,
    DEFAULT_GRACE_DAYS,
  };
}

if (require.main === module) {
  console.log('Prorrateo trimestral (45/90 días, $120):', calculateProration(120, 45, 90));
  console.log('Descuentos aditivos ($100, [10%, 20%]):', applyDiscounts(100, [10, 20]));
}
