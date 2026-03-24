const { Property, Transaction, RealEstateAgency, COMMISSION_RATE } = require('./buggy-code');

describe('Property', () => {
  let prop;

  beforeEach(() => {
    prop = new Property('P001', 'apartment', 80, 160000, 2, 'Centro', 10, 'A1');
  });

  test('crea una propiedad con todos sus atributos', () => {
    expect(prop.id).toBe('P001');
    expect(prop.type).toBe('apartment');
    expect(prop.area).toBe(80);
    expect(prop.price).toBe(160000);
    expect(prop.bedrooms).toBe(2);
    expect(prop.sold).toBe(false);
  });

  test('getPricePerSqMeter retorna precio dividido entre área', () => {
    // 160000 / 80 = 2000
    expect(prop.getPricePerSqMeter()).toBe(2000);
  });

  test('getPricePerSqMeter retorna valor mayor que 1 para propiedades reales', () => {
    const house = new Property('H1', 'house', 200, 400000, 4, 'Norte', 0, 'A1');
    // 400000 / 200 = 2000 (no 0.0005 que daría con operandos invertidos)
    expect(house.getPricePerSqMeter()).toBeGreaterThan(1);
  });

  test('getPricePerSqMeter: precio más alto por m² para propiedad más cara por m²', () => {
    const cheap = new Property('C1', 'apartment', 100, 100000, 2, 'Sur', 0, 'A1');
    const expensive = new Property('E1', 'apartment', 100, 200000, 2, 'Centro', 0, 'A1');
    expect(expensive.getPricePerSqMeter()).toBeGreaterThan(cheap.getPricePerSqMeter());
  });

  test('isAffordable retorna true si el precio no supera el máximo', () => {
    expect(prop.isAffordable(200000)).toBe(true);
    expect(prop.isAffordable(160000)).toBe(true);
    expect(prop.isAffordable(100000)).toBe(false);
  });

  test('getDaysOnMarket retorna la diferencia entre día actual y día de listado', () => {
    expect(prop.getDaysOnMarket(40)).toBe(30);
    expect(prop.getDaysOnMarket(10)).toBe(0);
  });

  test('getValueCategory clasifica correctamente según el precio', () => {
    expect(new Property('A', 'apartment', 50, 80000, 1, 'X', 0, 'A1').getValueCategory()).toBe('económico');
    expect(new Property('B', 'house', 100, 200000, 3, 'X', 0, 'A1').getValueCategory()).toBe('medio');
    expect(new Property('C', 'house', 200, 450000, 4, 'X', 0, 'A1').getValueCategory()).toBe('alto');
    expect(new Property('D', 'house', 400, 800000, 5, 'X', 0, 'A1').getValueCategory()).toBe('lujo');
  });

  test('getSummary retorna un objeto con los campos clave de la propiedad', () => {
    const summary = prop.getSummary();
    expect(summary.id).toBe('P001');
    expect(summary.pricePerSqMeter).toBe(2000);
    expect(summary.sold).toBe(false);
  });
});

describe('Transaction', () => {
  let tx;

  beforeEach(() => {
    // Listado: 200000 | Vendido: 180000 → descuento 10%
    tx = new Transaction('P001', 'A1', 200000, 180000, 100);
  });

  test('crea una transacción con todos sus atributos', () => {
    expect(tx.propertyId).toBe('P001');
    expect(tx.agentId).toBe('A1');
    expect(tx.listedPrice).toBe(200000);
    expect(tx.salePrice).toBe(180000);
    expect(tx.closingDay).toBe(100);
  });

  test('getDiscount retorna la diferencia entre precio listado y precio de venta', () => {
    expect(tx.getDiscount()).toBe(20000);
  });

  test('getDiscountPercentage retorna el porcentaje sobre el precio listado', () => {
    // (200000 - 180000) / 200000 * 100 = 10%
    expect(tx.getDiscountPercentage()).toBeCloseTo(10);
  });

  test('getDiscountPercentage: distintos valores de descuento', () => {
    // (300000 - 270000) / 300000 * 100 = 10%
    const tx2 = new Transaction('P2', 'A2', 300000, 270000, 50);
    expect(tx2.getDiscountPercentage()).toBeCloseTo(10);

    // (500000 - 450000) / 500000 * 100 = 10% (no 11.11% que daría con bug)
    const tx3 = new Transaction('P3', 'A3', 500000, 450000, 80);
    expect(tx3.getDiscountPercentage()).toBeCloseTo(10);
  });

  test('getDiscountPercentage es positivo cuando se vende por debajo del listado', () => {
    expect(tx.getDiscountPercentage()).toBeGreaterThan(0);
  });

  test('getCommission retorna el porcentaje correcto del precio de venta', () => {
    expect(tx.getCommission()).toBeCloseTo(180000 * COMMISSION_RATE);
  });

  test('wasSoldAboveListing retorna false cuando se vendió con descuento', () => {
    expect(tx.wasSoldAboveListing()).toBe(false);
  });

  test('wasSoldAboveListing retorna true cuando se vendió sobre el precio listado', () => {
    const tx2 = new Transaction('P2', 'A2', 200000, 210000, 50);
    expect(tx2.wasSoldAboveListing()).toBe(true);
  });

  test('getSummary retorna un objeto con descuento y comisión calculados', () => {
    const summary = tx.getSummary();
    expect(summary.discount).toBe(20000);
    expect(summary.discountPercentage).toBeCloseTo(10);
    expect(summary.commission).toBeCloseTo(5400);
  });
});

describe('RealEstateAgency - propiedades', () => {
  let agency;

  beforeEach(() => {
    agency = new RealEstateAgency('Inmobiliaria Norte');
    agency.addAgent('A1', 'Laura Gómez');
    agency.addAgent('A2', 'Carlos Ruiz');

    agency.addProperty('P001', 'apartment', 75, 150000, 2, 'Centro', 5, 'A1');
    agency.addProperty('P002', 'house', 200, 350000, 4, 'Norte', 10, 'A1');
    agency.addProperty('P003', 'apartment', 60, 90000, 1, 'Sur', 15, 'A2');
    agency.addProperty('P004', 'commercial', 300, 500000, 0, 'Centro', 20, 'A2');
    agency.addProperty('P005', 'house', 180, 280000, 3, 'Este', 25, 'A1');
  });

  test('addProperty agrega propiedades al inventario', () => {
    expect(agency.properties).toHaveLength(5);
  });

  test('addProperty no agrega duplicados', () => {
    agency.addProperty('P001', 'apartment', 75, 150000, 2, 'Centro', 5, 'A1');
    expect(agency.properties).toHaveLength(5);
  });

  test('getPropertyById retorna la propiedad correcta', () => {
    const p = agency.getPropertyById('P002');
    expect(p.price).toBe(350000);
  });

  test('getAvailableProperties retorna solo propiedades no vendidas', () => {
    agency.recordSale('P001', 'A1', 145000, 60);
    expect(agency.getAvailableProperties()).toHaveLength(4);
  });

  test('getPropertiesByType filtra por tipo correctamente', () => {
    expect(agency.getPropertiesByType('apartment')).toHaveLength(2);
    expect(agency.getPropertiesByType('house')).toHaveLength(2);
    expect(agency.getPropertiesByType('commercial')).toHaveLength(1);
  });

  test('getPropertiesInPriceRange retorna propiedades dentro del rango', () => {
    const inRange = agency.getPropertiesInPriceRange(100000, 300000);
    expect(inRange).toHaveLength(2); // P001 y P005
    expect(inRange.every(p => p.price >= 100000 && p.price <= 300000)).toBe(true);
  });

  test('getPropertiesByAgent retorna propiedades asignadas al agente', () => {
    expect(agency.getPropertiesByAgent('A1')).toHaveLength(3);
    expect(agency.getPropertiesByAgent('A2')).toHaveLength(2);
  });

  test('getPropertiesByBedrooms filtra por rango de habitaciones', () => {
    const twoToThree = agency.getPropertiesByBedrooms(2, 3);
    expect(twoToThree).toHaveLength(2); // P001(2) y P005(3)
  });

  test('getMostExpensiveProperty retorna la propiedad de mayor precio', () => {
    expect(agency.getMostExpensiveProperty().id).toBe('P004');
  });

  test('getCheapestProperty retorna la propiedad de menor precio', () => {
    expect(agency.getCheapestProperty().id).toBe('P003');
  });

  test('getPropertiesAboveAveragePrice retorna propiedades sobre el promedio', () => {
    // Promedio: (150000+350000+90000+500000+280000)/5 = 274000
    const aboveAvg = agency.getPropertiesAboveAveragePrice();
    expect(aboveAvg.every(p => p.price > 274000)).toBe(true);
  });

  test('getPropertyValueDistribution retorna conteo por categoría de valor', () => {
    const dist = agency.getPropertyValueDistribution();
    expect(dist['económico']).toBe(1); // P003 (90000)
    expect(dist['medio']).toBe(2);     // P001, P005
  });

  test('getMostPopularType retorna el tipo con más propiedades listadas', () => {
    // apartment: 2, house: 2, commercial: 1 → apartment o house (empate)
    const popular = agency.getMostPopularType();
    expect(['apartment', 'house']).toContain(popular);
  });

  test('getExpensiveUnsold retorna propiedades disponibles sobre umbral', () => {
    const expensive = agency.getExpensiveUnsold(200000);
    expect(expensive.every(p => p.price >= 200000 && !p.sold)).toBe(true);
  });
});

describe('RealEstateAgency - ventas y transacciones', () => {
  let agency;

  beforeEach(() => {
    agency = new RealEstateAgency('Inmobiliaria Sur');
    agency.addAgent('A1', 'Laura Gómez');
    agency.addAgent('A2', 'Carlos Ruiz');
    agency.addAgent('A3', 'María Torres');

    agency.addProperty('P001', 'apartment', 75, 150000, 2, 'Centro', 5, 'A1');
    agency.addProperty('P002', 'house', 200, 350000, 4, 'Norte', 10, 'A2');
    agency.addProperty('P003', 'apartment', 60, 90000, 1, 'Sur', 15, 'A1');
    agency.addProperty('P004', 'commercial', 300, 500000, 0, 'Centro', 20, 'A3');
    agency.addProperty('P005', 'house', 180, 280000, 3, 'Este', 25, 'A2');

    // P001 (listed 150000) → sold 142500 (5% desc) day 60
    agency.recordSale('P001', 'A1', 142500, 60);
    // P002 (listed 350000) → sold 336000 (4% desc) day 90
    agency.recordSale('P002', 'A2', 336000, 90);
    // P003 (listed 90000) → sold 87300 (3% desc) day 45
    agency.recordSale('P003', 'A1', 87300, 45);
    // P004 (listed 500000) → sold 475000 (5% desc) day 120
    agency.recordSale('P004', 'A3', 475000, 120);
  });

  test('recordSale registra la transacción y marca la propiedad como vendida', () => {
    expect(agency.transactions).toHaveLength(4);
    expect(agency.getPropertyById('P001').sold).toBe(true);
  });

  test('recordSale retorna null si la propiedad ya fue vendida', () => {
    const result = agency.recordSale('P001', 'A1', 140000, 70);
    expect(result).toBeNull();
  });

  test('recordSale retorna null si la propiedad no existe', () => {
    expect(agency.recordSale('NOEXISTE', 'A1', 100000, 50)).toBeNull();
  });

  test('getSalesByAgent retorna las ventas del agente indicado', () => {
    expect(agency.getSalesByAgent('A1')).toHaveLength(2); // P001 y P003
    expect(agency.getSalesByAgent('A3')).toHaveLength(1); // P004
  });

  test('getSalesInRange retorna ventas cerradas dentro del rango de días', () => {
    const range = agency.getSalesInRange(40, 95);
    // P003 (day 45), P001 (day 60), P002 (day 90)
    expect(range).toHaveLength(3);
  });

  test('getTotalRevenue retorna la suma de precios reales de venta', () => {
    // 142500 + 336000 + 87300 + 475000 = 1040800
    expect(agency.getTotalRevenue()).toBe(1040800);
  });

  test('getTotalCommissions retorna el total de comisiones al 3%', () => {
    expect(agency.getTotalCommissions()).toBeCloseTo(1040800 * COMMISSION_RATE);
  });

  test('getAverageSalePrice usa precios reales de venta, no precios listados', () => {
    // Promedio precios venta: 1040800 / 4 = 260200
    // Con bug usaría: (150000+350000+90000+500000)/4 = 272500
    expect(agency.getAverageSalePrice()).toBeCloseTo(260200);
  });

  test('getSalesByType retorna conteo e ingresos agrupados por tipo', () => {
    const byType = agency.getSalesByType();
    expect(byType.apartment.count).toBe(2);
    expect(byType.apartment.revenue).toBe(142500 + 87300);
    expect(byType.house.count).toBe(1);
  });

  test('getAgentCommission retorna la comisión acumulada del agente', () => {
    // A1: (142500 + 87300) * 0.03 = 6894
    expect(agency.getAgentCommission('A1')).toBeCloseTo(6894);
  });
});

describe('RealEstateAgency - análisis y estadísticas', () => {
  let agency;

  beforeEach(() => {
    agency = new RealEstateAgency('Inmobiliaria Este');
    agency.addAgent('A1', 'Laura Gómez');
    agency.addAgent('A2', 'Carlos Ruiz');
    agency.addAgent('A3', 'María Torres');

    agency.addProperty('P001', 'apartment', 75, 150000, 2, 'Centro', 0, 'A1');
    agency.addProperty('P002', 'house', 200, 400000, 4, 'Norte', 0, 'A2');
    agency.addProperty('P003', 'apartment', 60, 90000, 1, 'Sur', 0, 'A1');
    agency.addProperty('P004', 'commercial', 300, 500000, 0, 'Centro', 0, 'A3');

    // A1: vende P001 (150000→120000, -20%) y P003 (90000→85500, -5%)
    // Total ventas A1 = 205500
    agency.recordSale('P001', 'A1', 120000, 60);
    agency.recordSale('P003', 'A1', 85500, 30);

    // A2: vende P002 (400000→380000, -5%)
    // Total ventas A2 = 380000
    agency.recordSale('P002', 'A2', 380000, 90);

    // A3: vende P004 (500000→475000, -5%)
    // Total ventas A3 = 475000
    agency.recordSale('P004', 'A3', 475000, 120);
  });

  test('getTopAgents retorna agentes ordenados por volumen de ventas descendente', () => {
    // A3=475000, A2=380000, A1=205500
    const top = agency.getTopAgents(3);
    expect(top[0].id).toBe('A3');
    expect(top[1].id).toBe('A2');
    expect(top[2].id).toBe('A1');
  });

  test('getTopAgents(1) retorna el agente con mayor volumen', () => {
    const top1 = agency.getTopAgents(1);
    expect(top1).toHaveLength(1);
    expect(top1[0].id).toBe('A3');
    expect(top1[0].totalSales).toBe(475000);
  });

  test('getTopAgents incluye salesCount y commission en cada entrada', () => {
    const top = agency.getTopAgents(1);
    expect(top[0].salesCount).toBe(1);
    expect(top[0].commission).toBeCloseTo(475000 * COMMISSION_RATE);
  });

  test('getAgentRanking retorna todos los agentes en orden de volumen', () => {
    const ranking = agency.getAgentRanking();
    expect(ranking).toHaveLength(3);
    expect(ranking[0].totalSales).toBeGreaterThanOrEqual(ranking[1].totalSales);
    expect(ranking[1].totalSales).toBeGreaterThanOrEqual(ranking[2].totalSales);
  });

  test('getAveragePriceByType retorna el precio promedio por tipo de inmueble', () => {
    // apartment: (150000 + 90000) / 2 = 120000
    const avgByType = agency.getAveragePriceByType();
    expect(avgByType.apartment).toBe(120000);
    expect(avgByType.house).toBe(400000);
  });

  test('getAverageDaysOnMarket retorna el promedio de días en mercado de propiedades vendidas', () => {
    // P001: 60-0=60, P003: 30-0=30, P002: 90-0=90, P004: 120-0=120
    // Promedio: (60+30+90+120)/4 = 75
    expect(agency.getAverageDaysOnMarket()).toBe(75);
  });

  test('getDiscountStatistics retorna promedio, máximo y mínimo de descuentos', () => {
    // P001: (150000-120000)/150000*100 = 20%
    // P003: (90000-85500)/90000*100 = 5%
    // P002: (400000-380000)/400000*100 = 5%
    // P004: (500000-475000)/500000*100 = 5%
    const stats = agency.getDiscountStatistics();
    expect(stats.average).toBeCloseTo(8.75); // (20+5+5+5)/4
    expect(stats.max).toBeCloseTo(20);
    expect(stats.min).toBeCloseTo(5);
  });

  test('getBestDeal retorna la transacción con mayor descuento porcentual', () => {
    const deal = agency.getBestDeal();
    // P001 tiene 20% de descuento, el mayor
    expect(deal.propertyId).toBe('P001');
  });

  test('getMarketSummary retorna un resumen completo del mercado', () => {
    const summary = agency.getMarketSummary();
    expect(summary.name).toBe('Inmobiliaria Este');
    expect(summary.totalProperties).toBe(4);
    expect(summary.soldProperties).toBe(4);
    expect(summary.availableProperties).toBe(0);
    expect(summary.totalRevenue).toBe(120000 + 85500 + 380000 + 475000);
  });
});
