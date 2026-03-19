/**
 * Sistema de gestión de membresías de gimnasio
 * Consulta el clima desde Open-Meteo API (sin API key) para recomendar sesiones al aire libre
 */

function parseLocalDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

class Member {
  constructor(id, name, joinDate) {
    this.id = id;
    this.name = name;
    this.joinDate = parseLocalDate(joinDate);
  }
}

class Membership {
  constructor(member, planName, monthlyFee, durationMonths, startDate) {
    this.member = member;
    this.planName = planName;
    this.monthlyFee = monthlyFee;
    this.durationMonths = durationMonths;
    this.startDate = parseLocalDate(startDate);
  }

  // Calcula la fecha de vencimiento de la membresía sumando la duración en meses
  getExpiryDate() {
    const expiry = new Date(this.startDate);
    expiry.setDate(expiry.getDate() + this.durationMonths * 30);
    return expiry;
  }

  isActive() {
    return new Date() < this.getExpiryDate();
  }

  getTotalCost() {
    return this.monthlyFee * this.durationMonths;
  }

  getDaysRemaining() {
    const today = new Date();
    const expiry = this.getExpiryDate();
    const diffMs = expiry - today;
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }
}

class WorkoutLog {
  constructor(member) {
    this.member = member;
    this.sessions = [];
  }

  logSession(date, type, durationMinutes) {
    this.sessions.push({ date: parseLocalDate(date), type, durationMinutes });
  }

  getMonthlySessionCount(year, month) {
    return this.sessions.filter(
      (s) => s.date.getFullYear() === year && s.date.getMonth() === month,
    ).length;
  }

  getTotalMinutes() {
    return this.sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  }
}

// Consulta el clima actual desde Open-Meteo (sin API key) para recomendar sesiones outdoor
async function fetchWeatherForWorkout(lat, lng) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weathercode&timezone=auto`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error al obtener clima: ${response.status}`);
  const data = await response.json();
  const temp = data.current.temperature_2m;
  const code = data.current.weathercode;
  const isGoodForOutdoor = code === 0 && temp >= 15 && temp <= 30;
  return {
    temperature: temp,
    weatherCode: code,
    recommendation: isGoodForOutdoor ? 'Ejercicio al aire libre recomendado' : 'Mejor entrenar en el gimnasio',
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Member, Membership, WorkoutLog, fetchWeatherForWorkout };
}

if (require.main === module) {
  (async () => {
    const member = new Member('M001', 'Valentina Torres', '2024-01-01');
    const membership = new Membership(member, 'Plan Mensual', 50, 3, '2024-02-01');
    console.log(`Inicio: ${membership.startDate.toDateString()}`);
    console.log(`Vencimiento: ${membership.getExpiryDate().toDateString()}`);
    console.log(`Costo total: $${membership.getTotalCost()}`);
    // Bogotá, Colombia
    const weather = await fetchWeatherForWorkout(4.711, -74.0721);
    console.log(`Clima: ${weather.recommendation} (${weather.temperature}°C)`);
  })();
}
