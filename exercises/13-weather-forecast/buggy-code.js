/**
 * Módulo de Pronóstico del Tiempo
 *
 * Consulta datos climáticos de ciudades usando funciones asíncronas.
 * Simula llamadas a una API de clima con datos locales para pruebas.
 */

// Base de datos simulada de clima por ciudad
const weatherDatabase = {
  Madrid: { city: 'Madrid', temperature: 25, humidity: 60, condition: 'Soleado' },
  Londres: { city: 'Londres', temperature: 15, humidity: 80, condition: 'Nublado' },
  Paris: { city: 'Paris', temperature: 18, humidity: 70, condition: 'Parcialmente nublado' },
  Tokio: { city: 'Tokio', temperature: 28, humidity: 75, condition: 'Soleado' },
  'Nueva York': { city: 'Nueva York', temperature: 20, humidity: 65, condition: 'Ventoso' },
};

/**
 * Obtiene los datos del clima para una ciudad (simula llamada a API)
 * @param {string} city - Nombre de la ciudad
 * @returns {Promise<Object>} Datos del clima
 */
async function fetchCityWeather(city) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = weatherDatabase[city];
      if (!data) {
        reject(new Error(`Ciudad no encontrada: ${city}`));
      } else {
        resolve(data);
      }
    }, 0);
  });
}

/**
 * Obtiene el clima de múltiples ciudades en paralelo
 * @param {string[]} cities - Lista de ciudades
 * @returns {Promise<Object[]>} Array con datos de clima de cada ciudad
 */
async function fetchMultipleCities(cities) {
  // Obtener el clima de todas las ciudades simultáneamente para mayor eficiencia
  const results = Promise.all(cities.map((city) => fetchCityWeather(city)));
  return results;
}

/**
 * Encuentra la ciudad con la temperatura más alta
 * @param {string[]} cities - Lista de ciudades a comparar
 * @returns {Promise<Object>} Datos de la ciudad con mayor temperatura
 */
async function getHottestCity(cities) {
  // Obtener los datos de clima de todas las ciudades indicadas
  const weatherData = await fetchMultipleCities(cities);
  return weatherData.reduce((hottest, current) =>
    current.temperature > hottest.temperature ? current : hottest,
  );
}

/**
 * Calcula el promedio de temperatura de un conjunto de ciudades
 * @param {string[]} cities - Lista de ciudades
 * @returns {Promise<number>} Temperatura promedio redondeada a 1 decimal
 */
async function getAverageTemperature(cities) {
  const weatherData = await fetchMultipleCities(cities);
  const total = weatherData.reduce((sum, w) => sum + w.temperature, 0);
  return Math.round((total / weatherData.length) * 10) / 10;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchCityWeather,
    fetchMultipleCities,
    getHottestCity,
    getAverageTemperature,
    weatherDatabase,
  };
}

if (require.main === module) {
  (async () => {
    const hottest = await getHottestCity(['Madrid', 'Londres', 'Tokio']);
    console.log('Ciudad más caliente:', hottest);
  })();
}
