const COMMISSION_RATE = 0.03;

const VALUE_CATEGORIES = {
  economic: { label: 'económico', max: 100000 },
  mid: { label: 'medio', max: 300000 },
  high: { label: 'alto', max: 600000 },
  luxury: { label: 'lujo', max: Infinity },
};

class Property {
  constructor(id, type, area, price, bedrooms, location, listedDay, agentId) {
    this.id = id;
    this.type = type;
    this.area = area;
    this.price = price;
    this.bedrooms = bedrooms;
    this.location = location;
    this.listedDay = listedDay;
    this.agentId = agentId;
    this.sold = false;
  }

  getPricePerSqMeter() {
    return this.area / this.price; // BUG 1: operandos invertidos
  }

  isAffordable(maxPrice) {
    return this.price <= maxPrice;
  }

  getDaysOnMarket(currentDay) {
    return currentDay - this.listedDay;
  }

  getValueCategory() {
    if (this.price < VALUE_CATEGORIES.economic.max) return VALUE_CATEGORIES.economic.label;
    if (this.price < VALUE_CATEGORIES.mid.max) return VALUE_CATEGORIES.mid.label;
    if (this.price < VALUE_CATEGORIES.high.max) return VALUE_CATEGORIES.high.label;
    return VALUE_CATEGORIES.luxury.label;
  }

  getSummary() {
    return {
      id: this.id,
      type: this.type,
      price: this.price,
      area: this.area,
      pricePerSqMeter: this.getPricePerSqMeter(),
      valueCategory: this.getValueCategory(),
      sold: this.sold,
    };
  }
}

class Transaction {
  constructor(propertyId, agentId, listedPrice, salePrice, closingDay) {
    this.propertyId = propertyId;
    this.agentId = agentId;
    this.listedPrice = listedPrice;
    this.salePrice = salePrice;
    this.closingDay = closingDay;
  }

  getDiscount() {
    return this.listedPrice - this.salePrice;
  }

  getDiscountPercentage() {
    return ((this.listedPrice - this.salePrice) / this.salePrice) * 100; // BUG 2: denominador incorrecto
  }

  getCommission() {
    return this.salePrice * COMMISSION_RATE;
  }

  wasSoldAboveListing() {
    return this.salePrice > this.listedPrice;
  }

  getSummary() {
    return {
      propertyId: this.propertyId,
      agentId: this.agentId,
      listedPrice: this.listedPrice,
      salePrice: this.salePrice,
      discount: this.getDiscount(),
      discountPercentage: this.getDiscountPercentage(),
      commission: this.getCommission(),
    };
  }
}

class RealEstateAgency {
  constructor(name) {
    this.name = name;
    this.properties = [];
    this.transactions = [];
    this.agents = [];
  }

  addAgent(id, name) {
    if (!this.agents.find(a => a.id === id)) {
      this.agents.push({ id, name });
    }
  }

  addProperty(id, type, area, price, bedrooms, location, listedDay, agentId) {
    if (!this.properties.find(p => p.id === id)) {
      this.properties.push(
        new Property(id, type, area, price, bedrooms, location, listedDay, agentId)
      );
    }
  }

  getPropertyById(id) {
    return this.properties.find(p => p.id === id) || null;
  }

  getAvailableProperties() {
    return this.properties.filter(p => !p.sold);
  }

  getSoldProperties() {
    return this.properties.filter(p => p.sold);
  }

  getPropertiesByType(type) {
    return this.properties.filter(p => p.type === type);
  }

  getPropertiesInPriceRange(min, max) {
    return this.properties.filter(p => p.price >= min && p.price <= max);
  }

  getPropertiesByAgent(agentId) {
    return this.properties.filter(p => p.agentId === agentId);
  }

  getPropertiesByBedrooms(min, max) {
    return this.properties.filter(p => p.bedrooms >= min && p.bedrooms <= max);
  }

  getMostExpensiveProperty() {
    if (this.properties.length === 0) return null;
    return [...this.properties].sort((a, b) => b.price - a.price)[0];
  }

  getCheapestProperty() {
    if (this.properties.length === 0) return null;
    return [...this.properties].sort((a, b) => a.price - b.price)[0];
  }

  getPropertiesAboveAveragePrice() {
    if (this.properties.length === 0) return [];
    const avg = this.properties.reduce((sum, p) => sum + p.price, 0) / this.properties.length;
    return this.properties.filter(p => p.price > avg);
  }

  getPropertyValueDistribution() {
    return this.properties.reduce((acc, p) => {
      const cat = p.getValueCategory();
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
  }

  getMostPopularType() {
    if (this.properties.length === 0) return null;
    const types = [...new Set(this.properties.map(p => p.type))];
    return types.sort(
      (a, b) => this.getPropertiesByType(b).length - this.getPropertiesByType(a).length
    )[0];
  }

  recordSale(propertyId, agentId, salePrice, closingDay) {
    const property = this.getPropertyById(propertyId);
    if (!property || property.sold) return null;
    property.sold = true;
    const tx = new Transaction(propertyId, agentId, property.price, salePrice, closingDay);
    this.transactions.push(tx);
    return tx;
  }

  getSalesByAgent(agentId) {
    return this.transactions.filter(t => t.agentId === agentId);
  }

  getSalesInRange(startDay, endDay) {
    return this.transactions.filter(t => t.closingDay >= startDay && t.closingDay <= endDay);
  }

  getSalesByType() {
    return this.transactions.reduce((acc, t) => {
      const property = this.getPropertyById(t.propertyId);
      if (!property) return acc;
      if (!acc[property.type]) acc[property.type] = { count: 0, revenue: 0 };
      acc[property.type].count += 1;
      acc[property.type].revenue += t.salePrice;
      return acc;
    }, {});
  }

  getTotalRevenue() {
    return this.transactions.reduce((sum, t) => sum + t.salePrice, 0);
  }

  getTotalCommissions() {
    return this.transactions.reduce((sum, t) => sum + t.getCommission(), 0);
  }

  getAverageSalePrice() {
    if (this.transactions.length === 0) return 0;
    return this.transactions.reduce((sum, t) => sum + t.listedPrice, 0) / this.transactions.length; // BUG 3: usa listedPrice en vez de salePrice
  }

  getAgentCommission(agentId) {
    return this.getSalesByAgent(agentId).reduce((sum, t) => sum + t.getCommission(), 0);
  }

  getTopAgents(n) {
    const agentStats = this.agents.map(agent => {
      const sales = this.getSalesByAgent(agent.id);
      const totalSales = sales.reduce((sum, t) => sum + t.salePrice, 0);
      const commission = sales.reduce((sum, t) => sum + t.getCommission(), 0);
      return { id: agent.id, name: agent.name, salesCount: sales.length, totalSales, commission };
    });
    return agentStats.sort((a, b) => a.totalSales - b.totalSales).slice(0, n); // BUG 4: orden ascendente
  }

  getAgentRanking() {
    return this.getTopAgents(this.agents.length);
  }

  getAveragePriceByType() {
    const types = [...new Set(this.properties.map(p => p.type))];
    return types.reduce((acc, type) => {
      const props = this.getPropertiesByType(type);
      acc[type] = props.reduce((sum, p) => sum + p.price, 0) / props.length;
      return acc;
    }, {});
  }

  getAverageDaysOnMarket() {
    const soldIds = new Set(this.transactions.map(t => t.propertyId));
    const soldProperties = this.properties.filter(p => soldIds.has(p.id));
    if (soldProperties.length === 0) return 0;
    const total = soldProperties.reduce((sum, p) => {
      const tx = this.transactions.find(t => t.propertyId === p.id);
      return sum + (tx.closingDay - p.listedDay);
    }, 0);
    return total / soldProperties.length;
  }

  getDiscountStatistics() {
    if (this.transactions.length === 0) return null;
    const discounts = this.transactions.map(t => t.getDiscountPercentage());
    const avg = discounts.reduce((sum, d) => sum + d, 0) / discounts.length;
    return {
      average: avg,
      max: Math.max(...discounts),
      min: Math.min(...discounts),
    };
  }

  getBestDeal() {
    if (this.transactions.length === 0) return null;
    return [...this.transactions].sort(
      (a, b) => b.getDiscountPercentage() - a.getDiscountPercentage()
    )[0];
  }

  getExpensiveUnsold(threshold) {
    return this.getAvailableProperties().filter(p => p.price >= threshold);
  }

  getMarketSummary() {
    return {
      name: this.name,
      totalProperties: this.properties.length,
      availableProperties: this.getAvailableProperties().length,
      soldProperties: this.getSoldProperties().length,
      totalRevenue: this.getTotalRevenue(),
      averageSalePrice: this.getAverageSalePrice(),
      totalCommissions: this.getTotalCommissions(),
      averageDaysOnMarket: this.getAverageDaysOnMarket(),
    };
  }
}

module.exports = { Property, Transaction, RealEstateAgency, COMMISSION_RATE };
