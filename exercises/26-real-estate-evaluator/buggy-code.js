/**
 * Sistema de evaluación del mercado inmobiliario
 * Obtiene listados de propiedades desde JSONPlaceholder API
 */

class Property {
  constructor(id, address, price, areaSqm, bedrooms) {
    this.id = id;
    this.address = address;
    this.price = price;
    this.areaSqm = areaSqm;
    this.bedrooms = bedrooms;
  }

  getPricePerSqm() {
    return this.price / this.areaSqm;
  }
}

class Listing {
  constructor(property, agentName, daysOnMarket) {
    this.property = property;
    this.agentName = agentName;
    this.daysOnMarket = daysOnMarket;
  }
}

class MarketAnalyzer {
  constructor() {
    this.listings = [];
  }

  addListing(listing) {
    this.listings.push(listing);
  }

  getAveragePrice() {
    if (this.listings.length === 0) return 0;
    const total = this.listings.reduce((sum, l) => sum + l.property.price, 0);
    return total / this.listings.length;
  }

  // Calcula la mediana de precios para representar el precio típico del mercado
  getMedianPrice() {
    if (this.listings.length === 0) return 0;
    const prices = this.listings.map((l) => l.property.price).sort((a, b) => a - b);
    const mid = Math.floor(prices.length / 2);
    if (prices.length % 2 === 0) {
      return (prices[mid - 1] + prices[mid]) / 2;
    }
    return prices[mid];
  }

  getPriceRange() {
    if (this.listings.length === 0) return { min: 0, max: 0 };
    const prices = this.listings.map((l) => l.property.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }

  getAverageDaysOnMarket() {
    if (this.listings.length === 0) return 0;
    const total = this.listings.reduce((sum, l) => sum + l.daysOnMarket, 0);
    return total / this.listings.length;
  }

  getAffordableListings(maxPrice) {
    return this.listings.filter((l) => l.property.price <= maxPrice);
  }
}

// Obtiene listados simulados desde JSONPlaceholder (sin API key)
async function fetchListings(limit = 10) {
  const url = `https://jsonplaceholder.typicode.com/posts?_limit=${limit}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error al obtener listados: ${response.status}`);
  const posts = await response.json();
  return posts.map((post) => {
    const price = 100000 + (post.id * 31337) % 900000;
    const area = 50 + (post.id * 13) % 200;
    const property = new Property(post.id, post.title.slice(0, 30), price, area, 1 + (post.id % 4));
    return new Listing(property, `Agente ${post.userId}`, 5 + (post.id * 7) % 180);
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Property, Listing, MarketAnalyzer, fetchListings };
}

if (require.main === module) {
  (async () => {
    const analyzer = new MarketAnalyzer();
    const listings = await fetchListings(10);
    listings.forEach((l) => analyzer.addListing(l));
    console.log('Precio promedio:', analyzer.getAveragePrice().toLocaleString());
    console.log('Precio mediana:', analyzer.getMedianPrice().toLocaleString());
    console.log('Rango de precios:', analyzer.getPriceRange());
  })();
}
