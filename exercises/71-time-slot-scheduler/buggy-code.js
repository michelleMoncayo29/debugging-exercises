/**
 * Sistema de Reserva de Franjas Horarias
 *
 * Permite definir franjas horarias por sala y día de la semana,
 * reservarlas para clientes, cancelar reservas, detectar conflictos
 * y obtener estadísticas de uso.
 *
 * Los tiempos se expresan en minutos desde medianoche (0–1440).
 * Ejemplo: 9:30 AM → 570, 14:00 → 840.
 */

// ─────────────────────────────────────────────
// Clase TimeSlot
// ─────────────────────────────────────────────

class TimeSlot {
  /**
   * @param {string} day        - Día de la semana (ej. 'lunes')
   * @param {number} start      - Inicio en minutos desde medianoche (0–1440)
   * @param {number} end        - Fin en minutos desde medianoche (0–1440)
   * @param {string} room       - Nombre o identificador de la sala
   */
  constructor(day, start, end, room) {
    if (start < 0 || end > 1440) {
      throw new Error(
        'Los tiempos deben estar dentro del rango del día (0–1440 minutos).'
      );
    }
    if (start >= end) {
      throw new Error(
        'El tiempo de inicio debe ser menor que el tiempo de fin.'
      );
    }

    this.day = day;
    this.start = start;
    this.end = end;
    this.room = room;
    this.clientName = null;
    this.isBooked = false;
  }

  /**
   * Retorna la duración de la franja en minutos.
   * @returns {number}
   */
  getDuration() {
    return this.end - this.start;
  }

  /**
   * Indica si esta franja se superpone con otra.
   * Dos franjas se solapan cuando pertenecen al mismo día y sala,
   * y sus intervalos de tiempo se intersectan.
   * @param {TimeSlot} other
   * @returns {boolean}
   */
  overlaps(other) {
    if (this.day !== other.day || this.room !== other.room) {
      return false;
    }
    return this.start < other.end && other.start < this.end;
  }

  /**
   * Reserva la franja para un cliente.
   * @param {string} clientName
   */
  book(clientName) {
    this.isBooked = true;
    this.clientName = clientName;
  }

  /**
   * Cancela la reserva de la franja.
   */
  cancel() {
    this.isBooked = false;
    this.clientName = null;
  }

  toString() {
    const startH = Math.floor(this.start / 60).toString().padStart(2, '0');
    const startM = (this.start % 60).toString().padStart(2, '0');
    const endH = Math.floor(this.end / 60).toString().padStart(2, '0');
    const endM = (this.end % 60).toString().padStart(2, '0');
    const status = this.isBooked ? `Reservada: ${this.clientName}` : 'Disponible';
    return `[${this.day}] ${startH}:${startM}–${endH}:${endM} | ${this.room} | ${status}`;
  }
}

// ─────────────────────────────────────────────
// Clase Scheduler
// ─────────────────────────────────────────────

class Scheduler {
  constructor() {
    /** @type {TimeSlot[]} */
    this._slots = [];
  }

  /**
   * Agrega una nueva franja horaria al sistema.
   * Lanza error si la franja solapa con alguna existente en el mismo día y sala.
   * @param {string} day
   * @param {number} start
   * @param {number} end
   * @param {string} room
   * @returns {TimeSlot}
   */
  addSlot(day, start, end, room) {
    const newSlot = new TimeSlot(day, start, end, room);
    const hasConflict = this._slots.some(slot => newSlot.overlaps(slot));
    if (hasConflict) {
      throw new Error(
        `La franja ${newSlot.toString()} se solapa con una franja existente.`
      );
    }
    this._slots.push(newSlot);
    return newSlot;
  }

  /**
   * Busca una franja exacta por día, inicio, fin y sala.
   * @param {string} day
   * @param {number} start
   * @param {number} end
   * @param {string} room
   * @returns {TimeSlot|undefined}
   */
  _findSlot(day, start, end, room) {
    return this._slots.find(
      s => s.day === day && s.start === start && s.end === end && s.room === room
    );
  }

  /**
   * Reserva una franja para un cliente.
   * Lanza error si la franja no existe o ya está reservada.
   * @param {string} day
   * @param {number} start
   * @param {number} end
   * @param {string} room
   * @param {string} clientName
   * @returns {TimeSlot}
   */
  bookSlot(day, start, end, room, clientName) {
    const slot = this._findSlot(day, start, end, room);
    if (!slot) {
      throw new Error('La franja horaria especificada no existe.');
    }
    if (slot.isBooked) {
      throw new Error(
        `La franja del ${day} (${start}–${end}) en ${room} ya está reservada.`
      );
    }
    slot.book(clientName);
    return slot;
  }

  /**
   * Cancela la reserva de una franja.
   * Lanza error si la franja no existe o no está reservada.
   * @param {string} day
   * @param {number} start
   * @param {number} end
   * @param {string} room
   */
  cancelBooking(day, start, end, room) {
    const slot = this._findSlot(day, start, end, room);
    if (!slot) {
      throw new Error('La franja horaria especificada no existe.');
    }
    if (!slot.isBooked) {
      throw new Error(
        `La franja del ${day} (${start}–${end}) en ${room} no tiene reserva activa.`
      );
    }
    slot.cancel();
  }

  /**
   * Retorna todas las franjas de un día específico.
   * @param {string} day
   * @returns {TimeSlot[]}
   */
  getSlotsForDay(day) {
    return this._slots.filter(s => s.day === day);
  }

  /**
   * Retorna las franjas disponibles (no reservadas) de un día.
   * @param {string} day
   * @returns {TimeSlot[]}
   */
  getAvailableSlots(day) {
    return this._slots.filter(s => s.day === day && !s.isBooked);
  }

  /**
   * Retorna todas las franjas reservadas por un cliente específico.
   * @param {string} clientName
   * @returns {TimeSlot[]}
   */
  getBookingsByClient(clientName) {
    return this._slots.filter(s => s.isBooked && s.clientName === clientName);
  }

  /**
   * Retorna el día con mayor número de reservas activas.
   * Retorna null si no hay ninguna reserva.
   * @returns {string|null}
   */
  getBusiestDay() {
    const booked = this._slots.filter(s => s.isBooked);
    if (booked.length === 0) return null;

    const countByDay = booked.reduce((acc, slot) => {
      acc[slot.day] = (acc[slot.day] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(countByDay).reduce(
      (busiest, [day, count]) => (count > busiest[1] ? [day, count] : busiest),
      ['', 0]
    )[0];
  }

  /**
   * Retorna la hora (número entero, 0–23) con más reservas iniciadas.
   * Retorna null si no hay ninguna reserva.
   * @returns {number|null}
   */
  getBusiestHour() {
    const booked = this._slots.filter(s => s.isBooked);
    if (booked.length === 0) return null;

    const countByHour = booked.reduce((acc, slot) => {
      const hour = Math.floor(slot.start / 60);
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    return Number(
      Object.entries(countByHour).reduce(
        (busiest, [hour, count]) => (count > busiest[1] ? [hour, count] : busiest),
        ['', 0]
      )[0]
    );
  }

  /**
   * Busca la siguiente franja disponible en un día a partir de un tiempo dado.
   * Incluye franjas que comienzan exactamente en el tiempo indicado.
   * Retorna null si no hay ninguna disponible.
   * @param {string} day
   * @param {number} fromMinutes - Tiempo de búsqueda en minutos desde medianoche
   * @returns {TimeSlot|null}
   */
  findNextAvailableSlot(day, fromMinutes) {
    const candidates = this._slots
      .filter(s => s.day === day && !s.isBooked && s.start >= fromMinutes)
      .sort((a, b) => a.start - b.start);

    return candidates.length > 0 ? candidates[0] : null;
  }

  /**
   * Calcula el porcentaje de franjas reservadas sobre el total para un día dado.
   * Retorna 0 si no hay franjas para ese día.
   * @param {string} day
   * @returns {number} Porcentaje (0–100)
   */
  getUtilizationRate(day) {
    const daySlots = this.getSlotsForDay(day);
    if (daySlots.length === 0) return 0;
    const booked = daySlots.filter(s => s.isBooked).length;
    return (booked / daySlots.length) * 100;
  }

  /**
   * Calcula el total de minutos reservados en un día específico.
   * @param {string} day
   * @returns {number}
   */
  getTotalBookedMinutes(day) {
    return this._slots
      .filter(s => s.day === day && s.isBooked)
      .reduce((total, s) => total + s.getDuration(), 0);
  }

  /**
   * Retorna un resumen de estadísticas del scheduler.
   * @returns {object}
   */
  getSummary() {
    const totalSlots = this._slots.length;
    const totalBooked = this._slots.filter(s => s.isBooked).length;
    const totalAvailable = totalSlots - totalBooked;
    const days = [...new Set(this._slots.map(s => s.day))];
    const utilizationByDay = days.map(day => ({
      day,
      utilization: this.getUtilizationRate(day).toFixed(1) + '%',
    }));
    return { totalSlots, totalBooked, totalAvailable, utilizationByDay };
  }
}

// Exportar para pruebas
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TimeSlot, Scheduler };
}
