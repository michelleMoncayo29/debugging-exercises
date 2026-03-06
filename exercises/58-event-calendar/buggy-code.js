/**
 * Event Calendar
 *
 * Calendario de eventos: gestión de eventos únicos y recurrentes,
 * detección de conflictos, franjas libres y vistas semanales.
 */

function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

function addDays(dateStr, days) {
  const date = new Date(dateStr + 'T00:00:00Z');
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().split('T')[0];
}

class EventCalendar {
  constructor() {
    this.events = new Map();
  }

  addEvent({ id, title, date, startTime, endTime }) {
    if (this.events.has(id)) {
      throw new Error(`Event ${id} already exists`);
    }
    if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
      throw new Error('Start time must be before end time');
    }
    this.events.set(id, { id, title, date, startTime, endTime });
  }

  getEvent(id) {
    const event = this.events.get(id);
    if (!event) throw new Error(`Event ${id} not found`);
    return event;
  }

  removeEvent(id) {
    if (!this.events.has(id)) throw new Error(`Event ${id} not found`);
    this.events.delete(id);
  }

  getEventsOnDate(date) {
    return [...this.events.values()]
      .filter(e => e.date === date)
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  }

  hasConflict({ date, startTime, endTime }) {
    const newStart = timeToMinutes(startTime);
    const newEnd = timeToMinutes(endTime);
    return [...this.events.values()].some(existing => {
      if (existing.date !== date) return false;
      const existStart = timeToMinutes(existing.startTime);
      const existEnd = timeToMinutes(existing.endTime);
      return newStart < existEnd && newEnd > existStart;
    });
  }

  // El bucle comienza en i = 1 en lugar de i = 0, omitiendo la fecha de inicio
  // y desplazando todas las ocurrencias un intervalo hacia adelante.
  generateRecurringDates(startDate, intervalDays, count) {
    const dates = [];
    for (let i = 1; i <= count; i++) {
      dates.push(addDays(startDate, i * intervalDays));
    }
    return dates;
  }

  addRecurringEvent({ idPrefix, title, date, startTime, endTime, intervalDays, occurrences }) {
    const dates = this.generateRecurringDates(date, intervalDays, occurrences);
    dates.forEach((d, index) => {
      const id = `${idPrefix}-${String(index + 1).padStart(3, '0')}`;
      this.addEvent({ id, title, date: d, startTime, endTime });
    });
  }

  getWeekEvents(startDate) {
    const weekDates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
    return [...this.events.values()]
      .filter(e => weekDates.includes(e.date))
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
      });
  }

  getMonthEvents(year, month) {
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    return [...this.events.values()]
      .filter(e => e.date.startsWith(prefix))
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
      });
  }

  getFreeSlots(date, dayStart, dayEnd) {
    const events = this.getEventsOnDate(date);
    const start = timeToMinutes(dayStart);
    const end = timeToMinutes(dayEnd);
    const slots = [];
    let current = start;

    for (const event of events) {
      const eventStart = timeToMinutes(event.startTime);
      const eventEnd = timeToMinutes(event.endTime);
      if (current < eventStart) {
        slots.push({ start: minutesToTime(current), end: minutesToTime(eventStart) });
      }
      current = Math.max(current, eventEnd);
    }

    if (current < end) {
      slots.push({ start: minutesToTime(current), end: minutesToTime(end) });
    }
    return slots;
  }

  getConflicts(date) {
    const events = this.getEventsOnDate(date);
    const conflicts = [];
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const a = events[i];
        const b = events[j];
        if (
          timeToMinutes(a.startTime) < timeToMinutes(b.endTime) &&
          timeToMinutes(a.endTime) > timeToMinutes(b.startTime)
        ) {
          conflicts.push({ event1: a.id, event2: b.id });
        }
      }
    }
    return conflicts;
  }

  getEventStats() {
    const total = this.events.size;
    const byDate = {};
    for (const event of this.events.values()) {
      byDate[event.date] = (byDate[event.date] || 0) + 1;
    }
    const busiestDay = Object.entries(byDate).sort((a, b) => b[1] - a[1])[0] || null;
    return {
      total,
      uniqueDates: Object.keys(byDate).length,
      busiestDay: busiestDay ? { date: busiestDay[0], count: busiestDay[1] } : null,
    };
  }

  searchEvents(query) {
    const lower = query.toLowerCase();
    return [...this.events.values()]
      .filter(e => e.title.toLowerCase().includes(lower))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  rescheduleEvent(id, newDate, newStartTime, newEndTime) {
    const event = this.getEvent(id);
    const tempEvent = { date: newDate, startTime: newStartTime, endTime: newEndTime };
    this.removeEvent(id);
    if (this.hasConflict(tempEvent)) {
      this.events.set(id, event);
      throw new Error(`Cannot reschedule: conflict detected on ${newDate}`);
    }
    event.date = newDate;
    event.startTime = newStartTime;
    event.endTime = newEndTime;
    this.events.set(id, event);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EventCalendar };
}

if (require.main === module) {
  const cal = new EventCalendar();
  // Con el bug: i=1, i=2, i=3 → days 7, 14, 21 → ['2024-03-08', '2024-03-15', '2024-03-22']
  // Correcto: ['2024-03-01', '2024-03-08', '2024-03-15']
  const dates = cal.generateRecurringDates('2024-03-01', 7, 3);
  console.log('Recurring dates (wrong):', dates);
}
