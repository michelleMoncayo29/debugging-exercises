/**
 * Stock Portfolio
 *
 * Gestión de portafolio de acciones: posiciones, retornos, retorno anualizado
 * compuesto, diversificación y análisis de rendimiento.
 */

class StockPortfolio {
  constructor() {
    this.positions = new Map(); // symbol → { shares, avgCost, lots }
  }

  addPosition(symbol, shares, purchasePrice, purchaseDate) {
    if (shares <= 0) throw new Error("Shares must be a positive number");
    if (purchasePrice <= 0) throw new Error("Purchase price must be positive");

    if (this.positions.has(symbol)) {
      const existing = this.positions.get(symbol);
      const totalShares = existing.shares + shares;
      const totalCost =
        existing.avgCost * existing.shares + purchasePrice * shares;
      existing.avgCost = totalCost / totalShares;
      existing.shares = totalShares;
      existing.lots.push({ shares, purchasePrice, purchaseDate });
    } else {
      this.positions.set(symbol, {
        symbol,
        shares,
        purchasePrice,
        avgCost: purchasePrice,
        purchaseDate,
        lots: [{ shares, purchasePrice, purchaseDate }],
      });
    }
  }

  getPosition(symbol) {
    const pos = this.positions.get(symbol);
    if (!pos) throw new Error(`Position ${symbol} not found`);
    return pos;
  }

  removePosition(symbol) {
    if (!this.positions.has(symbol))
      throw new Error(`Position ${symbol} not found`);
    this.positions.delete(symbol);
  }

  getPositionValue(symbol, currentPrice) {
    const pos = this.getPosition(symbol);
    return Math.round(pos.shares * currentPrice * 100) / 100;
  }

  getPositionReturn(symbol, currentPrice) {
    const pos = this.getPosition(symbol);
    return (
      Math.round(((currentPrice - pos.avgCost) / pos.avgCost) * 10000) / 10000
    );
  }

  getPositionProfit(symbol, currentPrice) {
    const pos = this.getPosition(symbol);
    return Math.round((currentPrice - pos.avgCost) * pos.shares * 100) / 100;
  }

  getCostBasis() {
    return [...this.positions.values()].reduce(
      (sum, pos) => sum + pos.avgCost * pos.shares,
      0,
    );
  }

  getPortfolioValue(prices) {
    return [...this.positions.keys()].reduce((sum, symbol) => {
      const price = prices[symbol];
      if (price === undefined) return sum;
      return sum + this.getPositionValue(symbol, price);
    }, 0);
  }

  getTotalReturn(prices) {
    const currentValue = this.getPortfolioValue(prices);
    const costBasis = this.getCostBasis();
    if (costBasis === 0) return 0;
    return Math.round(((currentValue - costBasis) / costBasis) * 10000) / 10000;
  }

  getAnnualizedReturn(totalReturn, years) {
    if (years <= 0) throw new Error("Years must be positive");
    // (1 + retornoTotal) ^ (1 / años) - 1;

    // return Math.round((1 + totalReturn) * (1 / years) - 1)
    // return Math.round((totalReturn / years) * 100000) / 100000;
    return (
      Math.round((Math.pow(1 + totalReturn, 1 / years) - 1) * 100000) / 100000
    );
  }

  getDiversification(prices) {
    const totalValue = this.getPortfolioValue(prices);
    if (totalValue === 0) return [];
    return [...this.positions.keys()]
      .map((symbol) => {
        const price = prices[symbol] || 0;
        const value = this.getPositionValue(symbol, price);
        return {
          symbol,
          value,
          percentage: Math.round((value / totalValue) * 10000) / 100,
        };
      })
      .sort((a, b) => b.percentage - a.percentage);
  }

  getTopPerformers(prices) {
    return [...this.positions.keys()]
      .filter((symbol) => prices[symbol] !== undefined)
      .map((symbol) => ({
        symbol,
        returnPct: this.getPositionReturn(symbol, prices[symbol]),
        profit: this.getPositionProfit(symbol, prices[symbol]),
        currentValue: this.getPositionValue(symbol, prices[symbol]),
      }))
      .sort((a, b) => b.returnPct - a.returnPct);
  }

  getUnrealizedGains(prices) {
    return [...this.positions.keys()]
      .filter((symbol) => prices[symbol] !== undefined)
      .reduce(
        (sum, symbol) => sum + this.getPositionProfit(symbol, prices[symbol]),
        0,
      );
  }

  getSectorAllocation(sectorMap, prices) {
    const allocation = {};
    const totalValue = this.getPortfolioValue(prices);
    if (totalValue === 0) return {};

    for (const [symbol] of this.positions.entries()) {
      const sector = sectorMap[symbol] || "Unknown";
      const value = this.getPositionValue(symbol, prices[symbol] || 0);
      allocation[sector] = (allocation[sector] || 0) + value;
    }

    return Object.fromEntries(
      Object.entries(allocation).map(([sector, value]) => [
        sector,
        Math.round((value / totalValue) * 10000) / 100,
      ]),
    );
  }

  getRebalancePlan(prices, targetAllocations) {
    const totalValue = this.getPortfolioValue(prices);
    return Object.entries(targetAllocations).map(([symbol, targetPct]) => {
      const targetValue = totalValue * targetPct;
      const currentValue = this.getPositionValue(symbol, prices[symbol] || 0);
      const diff = targetValue - currentValue;
      const action = diff > 0 ? "BUY" : diff < 0 ? "SELL" : "HOLD";
      return {
        symbol,
        currentValue: Math.round(currentValue * 100) / 100,
        targetValue: Math.round(targetValue * 100) / 100,
        diff: Math.round(diff * 100) / 100,
        action,
      };
    });
  }

  exportSummary(prices) {
    const totalValue = this.getPortfolioValue(prices);
    const costBasis = this.getCostBasis();
    return {
      positions: this.getDiversification(prices),
      totalValue: Math.round(totalValue * 100) / 100,
      costBasis: Math.round(costBasis * 100) / 100,
      totalReturn: this.getTotalReturn(prices),
      unrealizedGains: Math.round(this.getUnrealizedGains(prices) * 100) / 100,
      topPerformers: this.getTopPerformers(prices).slice(0, 3),
    };
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { StockPortfolio };
}
