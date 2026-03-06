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
 * Construye la cuadrícula del calendario para un mes.
 * @param {number} year
 * @param {number} month - 1-indexed
 * @returns {(number|null)[][]} - arreglo de semanas, cada semana con 7 celdas
 */
function buildCalendar(year, month) {
  const totalDays = getDaysInMonth(year, month);
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

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
