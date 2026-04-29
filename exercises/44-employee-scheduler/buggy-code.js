/**
 * Employee Scheduler
 *
 * Sistema de asignación de turnos de trabajo con validación de disponibilidad,
 * límite de horas semanales y detección de solapamientos.
 */

class Shift {
  constructor(name, startHour, endHour) {
    this.name = name;
    this.startHour = startHour;
    this.endHour = endHour;
  }

  getDuration() {
    return this.endHour - this.startHour;
  }

  // Detecta si este turno se solapa con otro
  overlaps(other) {
    // Usa >= en vez de > bloqueando turnos consecutivos válidos
    return this.startHour < other.endHour && this.endHour > other.startHour;
  }
}

class Employee {
  constructor(id, name, availableDays, maxWeeklyHours) {
    this.id = id;
    this.name = name;
    this.availableDays = availableDays;
    this.maxWeeklyHours = maxWeeklyHours;
    this.assignments = []; // [{ shift, day }]
  }

  isAvailable(day) {
    return this.availableDays.includes(day);
  }

  getAssignmentsForDay(day) {
    return this.assignments
      .filter(a => a.day === day)
      .map(a => a.shift);
  }
}

class Scheduler {
  constructor() {
    this.assignments = [];
  }

  assignShift(employee, shift, day) {
    if (!employee.isAvailable(day)) {
      throw new Error(`${employee.name} no está disponible el ${day}`);
    }

    const currentHours = this.getTotalHours(employee);
    if (currentHours + shift.getDuration() > employee.maxWeeklyHours) {
      throw new Error(
        `Asignar este turno excedería el máximo de ${employee.maxWeeklyHours}h semanales para ${employee.name}`
      );
    }

    const dayShifts = employee.getAssignmentsForDay(day);
    const hasOverlap = dayShifts.some(existing => existing.overlaps(shift));
    if (hasOverlap) {
      throw new Error(`El turno se solapa con uno ya asignado a ${employee.name} el ${day}`);
    }

    employee.assignments.push({ shift, day });
    this.assignments.push({ employee, shift, day });
    return this;
  }

  getTotalHours(employee) {
    return employee.assignments.reduce(
      (total, { shift }) => total + shift.getDuration(),
      0
    );
  }

  getUnderscheduled(employees, minHours) {
    return employees.filter(emp => this.getTotalHours(emp) < minHours);
  }

  getCoverageReport(days) {
    return days.map(day => {
      const dayAssignments = this.assignments.filter(a => a.day === day);
      return {
        day,
        employeeCount: dayAssignments.length,
        totalHours: dayAssignments.reduce((sum, a) => sum + a.shift.getDuration(), 0),
        employees: dayAssignments.map(a => ({
          name: a.employee.name,
          shift: `${a.shift.startHour}:00-${a.shift.endHour}:00`,
          hours: a.shift.getDuration(),
        })),
      };
    });
  }

  getWeeklySummary(employees) {
    return employees
      .map(emp => ({
        id: emp.id,
        name: emp.name,
        assignedHours: this.getTotalHours(emp),
        maxHours: emp.maxWeeklyHours,
        utilizationRate: Math.round((this.getTotalHours(emp) / emp.maxWeeklyHours) * 100),
        shifts: emp.assignments.map(a => ({
          day: a.day,
          shift: a.shift.name,
          hours: a.shift.getDuration(),
        })),
      }))
      .sort((a, b) => b.assignedHours - a.assignedHours);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Employee, Shift, Scheduler };
}

if (require.main === module) {
  const scheduler = new Scheduler();
  const emp = new Employee('E001', 'Ana López', ['lunes', 'martes'], 40);
  scheduler.assignShift(emp, new Shift('morning', 8, 16), 'lunes');
  console.log('Horas:', scheduler.getTotalHours(emp));
}
