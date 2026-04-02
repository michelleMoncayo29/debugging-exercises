/**
 * Sistema de seguimiento de portafolio de criptomonedas
 * Obtiene precios en tiempo real desde CoinGecko API (sin API key)
 */

class Transaction {
  constructor(coinId, amount, priceAtPurchase) {
    this.coinId = coinId;
    this.amount = amount;
    this.priceAtPurchase = priceAtPurchase;
    this.timestamp = new Date().toISOString();
  }
}

class Asset {
  constructor(coinId) {
    this.coinId = coinId;
    this.transactions = [];
  }

  addTransaction(amount, priceAtPurchase) {
    this.transactions.push(new Transaction(this.coinId, amount, priceAtPurchase));
  }

  getTotalUnits() {
    return this.transactions.reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalInvested() {
    return this.transactions.reduce((sum, t) => sum + t.amount * t.priceAtPurchase, 0);
  }

  // Calcula el costo promedio de compra por unidad del activo
  getAverageCost() {
    if (this.transactions.length === 0) return 0;
    const totalInvested = this.getTotalInvested();
    const totalUnits = this.getTotalUnits();
    return totalInvested / totalUnits;
  }

  getCurrentValue(currentPrice) {
    return this.getTotalUnits() * currentPrice;
  }

  getProfitLoss(currentPrice) {
    return this.getCurrentValue(currentPrice) - this.getTotalInvested();
  }
}

class Portfolio {
  constructor(name) {
    this.name = name;
    this.assets = {};
  }

  addAsset(coinId) {
    if (!this.assets[coinId]) {
      this.assets[coinId] = new Asset(coinId);
    }
    return this.assets[coinId];
  }

  buy(coinId, amount, priceAtPurchase) {
    const asset = this.addAsset(coinId);
    asset.addTransaction(amount, priceAtPurchase);
  }

  getTotalInvested() {
    return Object.values(this.assets).reduce((sum, asset) => sum + asset.getTotalInvested(), 0);
  }

  getTotalCurrentValue(prices) {
    return Object.values(this.assets).reduce((sum, asset) => {
      const currentPrice = prices[asset.coinId] || 0;
      return sum + asset.getCurrentValue(currentPrice);
    }, 0);
  }

  getTotalProfitLoss(prices) {
    return this.getTotalCurrentValue(prices) - this.getTotalInvested();
  }

  getSummary(prices) {
    const summary = {};
    for (const [coinId, asset] of Object.entries(this.assets)) {
      const currentPrice = prices[coinId] || 0;
      summary[coinId] = {
        units: asset.getTotalUnits(),
        totalInvested: asset.getTotalInvested(),
        averageCost: asset.getAverageCost(),
        currentValue: asset.getCurrentValue(currentPrice),
        profitLoss: asset.getProfitLoss(currentPrice),
      };
    }
    return summary;
  }
}

// Obtiene precios actuales desde CoinGecko (sin API key)
async function fetchCryptoPrices(coinIds) {
  const ids = coinIds.join(',');
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error al obtener precios: ${response.status}`);
  const data = await response.json();
  const prices = {};
  for (const [id, value] of Object.entries(data)) {
    prices[id] = value.usd;
  }
  return prices;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Transaction, Asset, Portfolio, fetchCryptoPrices };
}

if (require.main === module) {
  (async () => {
    const portfolio = new Portfolio('Mi Portafolio');
    portfolio.buy('bitcoin', 0.5, 40000);
    portfolio.buy('bitcoin', 0.3, 45000);
    portfolio.buy('ethereum', 2, 2500);
    const coinIds = Object.keys(portfolio.assets);
    const prices = await fetchCryptoPrices(coinIds);
    console.log('Precios actuales:', prices);
    console.log('Resumen:', JSON.stringify(portfolio.getSummary(prices), null, 2));
  })();
}
