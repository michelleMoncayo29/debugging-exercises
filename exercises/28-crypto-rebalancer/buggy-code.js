/**
 * Sistema de rebalanceo automático de portafolio de criptomonedas
 * Obtiene precios actuales desde CoinGecko API (sin API key)
 */

class Asset {
  constructor(coinId, targetPercentage, currentUnits) {
    this.coinId = coinId;
    this.targetPercentage = targetPercentage; // Porcentaje objetivo (0-100)
    this.currentUnits = currentUnits;
  }

  getCurrentValue(price) {
    return this.currentUnits * price;
  }
}

class Portfolio {
  constructor(name) {
    this.name = name;
    this.assets = [];
  }

  addAsset(asset) {
    this.assets.push(asset);
  }

  getTotalCurrentValue(prices) {
    return this.assets.reduce((sum, asset) => {
      return sum + asset.getCurrentValue(prices[asset.coinId] || 0);
    }, 0);
  }

  // Genera un plan de rebalanceo para alcanzar las asignaciones objetivo de cada activo
  getRebalancePlan(prices) {
    const totalValue = this.getTotalCurrentValue(prices);
    if (totalValue === 0) return [];

    return this.assets.map((asset) => {
      const currentPrice = prices[asset.coinId] || 0;
      const currentValue = asset.getCurrentValue(currentPrice);
      const targetValue = (asset.targetPercentage / 100) * totalValue;
      const difference = targetValue - currentValue;

      return {
        coinId: asset.coinId,
        currentValue: Math.round(currentValue * 100) / 100,
        targetValue: Math.round(targetValue * 100) / 100,
        targetPercentage: asset.targetPercentage,
        action: difference > 0 ? 'comprar' : difference < 0 ? 'vender' : 'mantener',
        amountUsd: Math.round(Math.abs(difference) * 100) / 100,
      };
    });
  }

  isBalanced(prices, tolerancePercent = 5) {
    const plan = this.getRebalancePlan(prices);
    return plan.every((item) => {
      const totalValue = this.getTotalCurrentValue(prices);
      const currentPct = (item.currentValue / totalValue) * 100;
      return Math.abs(currentPct - item.targetPercentage) <= tolerancePercent;
    });
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
  module.exports = { Asset, Portfolio, fetchCryptoPrices };
}

if (require.main === module) {
  (async () => {
    const portfolio = new Portfolio('Mi Portafolio Diversificado');
    portfolio.addAsset(new Asset('bitcoin', 60, 0.1));
    portfolio.addAsset(new Asset('ethereum', 30, 2));
    portfolio.addAsset(new Asset('cardano', 10, 1000));

    const coinIds = portfolio.assets.map((a) => a.coinId);
    const prices = await fetchCryptoPrices(coinIds);
    console.log('Precios actuales:', prices);
    console.log('\nPlan de rebalanceo:');
    const plan = portfolio.getRebalancePlan(prices);
    plan.forEach((item) => {
      console.log(`  ${item.coinId}: ${item.action} $${item.amountUsd} (objetivo: ${item.targetPercentage}%)`);
    });
  })();
}
