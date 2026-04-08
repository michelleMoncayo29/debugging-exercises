/**
 * Calculadora de rutas de entrega para logística
 * Obtiene coordenadas de direcciones desde Nominatim OpenStreetMap (sin API key)
 */

// Fórmula de Haversine para calcular distancia en km entre dos puntos geográficos
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

class Depot {
  constructor(name, lat, lng) {
    this.name = name;
    this.lat = lat;
    this.lng = lng;
  }
}

class Stop {
  constructor(address, lat, lng, packages) {
    this.address = address;
    this.lat = lat;
    this.lng = lng;
    this.packages = packages;
  }
}

class RouteCalculator {
  // Calcula la distancia total de la ruta: depósito → parada1 → parada2 → ... → depósito
  calculateRouteDistance(depot, stops) {
    if (stops.length === 0) return 0;
    let totalDistance = 0;
    let current = depot;
    for (const stop of stops) {
      totalDistance += haversineDistance(current.lat, current.lng, stop.lat, stop.lng);
      current = stop;
    }
    totalDistance += haversineDistance(current.lat, current.lng, depot.lat, depot.lng);
    return totalDistance;
  }

  getEstimatedDuration(distanceKm, avgSpeedKmh = 40) {
    return (distanceKm / avgSpeedKmh) * 60; // en minutos
  }

  getTotalPackages(stops) {
    return stops.reduce((sum, s) => sum + s.packages, 0);
  }

  getRouteSummary(depot, stops) {
    const distance = this.calculateRouteDistance(depot, stops);
    return {
      depot: depot.name,
      totalStops: stops.length,
      totalPackages: this.getTotalPackages(stops),
      totalDistanceKm: Math.round(distance * 10) / 10,
      estimatedMinutes: Math.round(this.getEstimatedDuration(distance)),
    };
  }
}

// Obtiene coordenadas de una dirección usando Nominatim OpenStreetMap (sin API key)
async function fetchCoordinates(address) {
  const query = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'DeliveryRouteExercise/1.0' },
  });
  if (!response.ok) throw new Error(`Error al obtener coordenadas: ${response.status}`);
  const data = await response.json();
  if (data.length === 0) throw new Error(`Dirección no encontrada: ${address}`);
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Depot, Stop, RouteCalculator, haversineDistance, fetchCoordinates };
}

if (require.main === module) {
  (async () => {
    const calc = new RouteCalculator();
    const depotCoords = await fetchCoordinates('Bogotá, Colombia');
    const depot = new Depot('Bodega Central', depotCoords.lat, depotCoords.lng);
    const stop1Coords = await fetchCoordinates('Usaquén, Bogotá');
    const stop2Coords = await fetchCoordinates('Chapinero, Bogotá');
    const stop3Coords = await fetchCoordinates('La Candelaria, Bogotá');
    const stops = [
      new Stop('Usaquén', stop1Coords.lat, stop1Coords.lng, 5),
      new Stop('Chapinero', stop2Coords.lat, stop2Coords.lng, 3),
      new Stop('La Candelaria', stop3Coords.lat, stop3Coords.lng, 8),
    ];
    console.log('Resumen de ruta:', calc.getRouteSummary(depot, stops));
  })();
}
