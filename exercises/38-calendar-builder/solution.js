/**
 * Calendar Builder
 *
 * Genera una cuadrícula de calendario para un mes dado.
 * Las semanas van de lunes (índice 0) a domingo (índice 6).
 * Las celdas sin día del mes se rellenan con null.
 */

/**
 * Devuelve el número de días en un mes dado.
 * @param {number} year
 * @param {number} month - 1-indexed (1 = enero)
 * @returns {number}
 */
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

/**
 * Convierte el resultado de getDay() (0=domingo, 1=lunes, ..., 6=sábado)
 * al índice de columna con lunes como primer día de la semana (0=lunes, ..., 6=domingo).
 * @param {number} sundayBasedDay
 * @returns {number}
 */
function toMondayIndex(sundayBasedDay) {
  // CORREGIDO: getDay() devuelve 0 para domingo. En un calendario con lunes
  // como primer día, domingo debe estar en la posición 6.
  // La fórmula (day + 6) % 7 convierte: 0→6, 1→0, 2→1, ..., 6→5.
  // Sin esta conversión, usando getDay() directamente, enero de 2024 (que
  // empieza en lunes=1) aparecería en la posición 1 en lugar de la 0.
  return (sundayBasedDay + 6) % 7;
}

/**
 * Construye la cuadrícula del calendario para un mes.
 * @param {number} year
 * @param {number} month - 1-indexed
 * @returns {(number|null)[][]} - arreglo de semanas, cada semana con 7 celdas
 */
function buildCalendar(year, month) {
  const totalDays = getDaysInMonth(year, month);
  const firstDayOfWeek = toMondayIndex(new Date(year, month - 1, 1).getDay());

  const weeks = [];
  let week = Array(7).fill(null);
  let dayOfWeek = firstDayOfWeek;

  for (let day = 1; day <= totalDays; day++) {
    week[dayOfWeek] = day;
    dayOfWeek++;

    if (dayOfWeek === 7) {
      weeks.push(week);
      week = Array(7).fill(null);
      dayOfWeek = 0;
    }
  }

  if (dayOfWeek > 0) {
    weeks.push(week);
  }

  return weeks;
}

module.exports = { buildCalendar, getDaysInMonth };
