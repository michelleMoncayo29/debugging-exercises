/**
 * Motor de precios para servicio de transporte compartido
 * Obtiene coordenadas desde Nominatim OpenStreetMap (sin API key)
 */

// Fórmula de Haversine para calcular distancia entre dos coordenadas geográficas
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

class Location {
  constructor(name, lat, lng) {
    this.name = name;
    this.lat = lat;
    this.lng = lng;
  }
}

class Ride {
  constructor(origin, destination, distanceKm, durationMin, surge = 1.0) {
    this.origin = origin;
    this.destination = destination;
    this.distanceKm = distanceKm;
    this.durationMin = durationMin;
    this.surge = surge;
  }
}

class PriceCalculator {
  constructor() {
    this.BASE_FARE = 2.5;
    this.PER_KM_RATE = 1.2;
    this.PER_MIN_RATE = 0.25;
  }

  getDistanceFare(ride) {
    return ride.distanceKm * this.PER_KM_RATE;
  }

  getTimeFare(ride) {
    return ride.durationMin * this.PER_MIN_RATE;
  }

  // Calcula la tarifa total del viaje incluyendo el multiplicador de demanda (surge)
  calculateFare(ride) {
    const distanceFare = this.getDistanceFare(ride);
    const timeFare = this.getTimeFare(ride);
    return (this.BASE_FARE + distanceFare + timeFare) * ride.surge;
  }

  getBreakdown(ride) {
    return {
      baseFare: this.BASE_FARE,
      distanceFare: Math.round(this.getDistanceFare(ride) * 100) / 100,
      timeFare: Math.round(this.getTimeFare(ride) * 100) / 100,
      surgeMultiplier: ride.surge,
      total: Math.round(this.calculateFare(ride) * 100) / 100,
    };
  }
}

// Obtiene coordenadas de un lugar usando Nominatim OpenStreetMap (sin API key)
async function fetchCoordinates(placeName) {
  const query = encodeURIComponent(placeName);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'RideshareExercise/1.0' },
  });
  if (!response.ok) throw new Error(`Error al obtener coordenadas: ${response.status}`);
  const data = await response.json();
  if (data.length === 0) throw new Error(`Lugar no encontrado: ${placeName}`);
  return new Location(placeName, parseFloat(data[0].lat), parseFloat(data[0].lon));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Location, Ride, PriceCalculator, haversineDistance, fetchCoordinates };
}

if (require.main === module) {
  (async () => {
    const calculator = new PriceCalculator();
    const origin = await fetchCoordinates('Bogotá, Colombia');
    const destination = await fetchCoordinates('Medellín, Colombia');
    const distanceKm = haversineDistance(origin.lat, origin.lng, destination.lat, destination.lng);
    const ride = new Ride(origin, destination, distanceKm, 60, 1.5);
    console.log('Desglose del viaje:', calculator.getBreakdown(ride));
  })();
}
