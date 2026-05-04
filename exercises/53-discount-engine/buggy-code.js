/**
 * Discount Engine
 *
 * Motor de descuentos: porcentual, fijo, apilado, cupones, volumen,
 * buy X get Y, umbrales de pedido y canje de puntos.
 */

function applyPercentageDiscount(price, rate) {
  return Math.round(price * (1 - rate) * 100) / 100;
}

function applyFlatDiscount(price, amount) {
  return Math.max(0, Math.round((price - amount) * 100) / 100);
}

function stackDiscounts(price, discountRates) {
  return discountRates.reduce(
    (currentPrice, rate) => applyPercentageDiscount(currentPrice, rate),
    price,
  );
}

function calculateCouponDiscount(price, coupon) {
  if (!coupon || coupon.expired) return price;
  if (coupon.type === "percentage") {
    return applyPercentageDiscount(price, coupon.value);
  }
  if (coupon.type === "flat") {
    return applyFlatDiscount(price, coupon.value);
  }
  return price;
}

function getBestOffer(price, offerGroups) {
  const finalPrices = offerGroups.map((group) => stackDiscounts(price, group));
  return Math.min(...finalPrices);
}

function calculateOrderTotal(items) {
  return items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
}

function applyVolumeDiscount(quantity, tiers) {
  const tier = [...tiers]
    .sort((a, b) => b.minQuantity - a.minQuantity)
    .find((t) => quantity >= t.minQuantity);
  return tier ? tier.rate : 0;
}

function calculateBuyXGetY(items, rule) {
  const { buyX, getY, productId, discountRate } = rule;
  const eligible = items.find((i) => i.id === productId);
  if (!eligible) return 0;
  const sets = Math.floor(eligible.quantity / (buyX + getY));
  return sets * getY * eligible.price * discountRate;
}

function applyOrderThresholdDiscount(total, thresholds) {
  const threshold = [...thresholds]
    .sort((a, b) => b.minAmount - a.minAmount)
    .find((t) => total >= t.minAmount);
  return threshold ? threshold.rate : 0;
}

function calculateLoyaltyPoints(total, pointsPerDollar = 1) {
  return Math.floor(total * pointsPerDollar);
}

function redeemPoints(total, points, pointValue = 0.01) {
  const discount = Math.min(points * pointValue, total);
  return Math.round((total - discount) * 100) / 100;
}

function formatDiscountSummary(
  originalPrice,
  finalPrice,
  coupon,
  stackedRates,
) {
  const totalSaved = Math.round((originalPrice - finalPrice) * 100) / 100;
  const savingsPercent = Math.round((totalSaved / originalPrice) * 10000) / 100;
  return {
    originalPrice,
    finalPrice,
    totalSaved,
    savingsPercent,
    couponApplied: coupon ? coupon.code : null,
    discountsApplied: stackedRates.length,
  };
}

function buildCheckoutSummary(items, discountRates, coupon, loyaltyPoints) {
  const subtotal = calculateOrderTotal(items);
  const afterStack = stackDiscounts(subtotal, discountRates);
  const afterCoupon = calculateCouponDiscount(afterStack, coupon);
  const final = redeemPoints(afterCoupon, loyaltyPoints);
  const pointsEarned = calculateLoyaltyPoints(final);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    afterStackedDiscounts: Math.round(afterStack * 100) / 100,
    afterCoupon: Math.round(afterCoupon * 100) / 100,
    finalTotal: Math.round(final * 100) / 100,
    totalSaved: Math.round((subtotal - final) * 100) / 100,
    loyaltyPointsEarned: pointsEarned,
  };
}

function getDiscountBreakdown(price, discountRates) {
  const steps = [];
  let current = price;
  for (const rate of discountRates) {
    const after = applyPercentageDiscount(current, rate);
    steps.push({
      rate,
      before: current,
      after,
      saved: Math.round((current - after) * 100) / 100,
    });
    current = after;
  }
  return steps;
}

function applyFlashSalePrice(originalPrice, salePrice, isActive) {
  if (!isActive) return originalPrice;
  return Math.min(originalPrice, salePrice);
}

function calculateGroupDiscount(cartTotal, groupSize, minGroupSize, groupRate) {
  if (groupSize < minGroupSize) return cartTotal;
  return applyPercentageDiscount(cartTotal, groupRate);
}

function applyMembershipTier(price, tier) {
  const tierRates = { bronze: 0.05, silver: 0.1, gold: 0.15, platinum: 0.2 };
  const rate = tierRates[tier] || 0;
  return applyPercentageDiscount(price, rate);
}

function compareOfferStrategies(price, strategies) {
  return strategies
    .map((strategy) => ({
      name: strategy.name,
      finalPrice: stackDiscounts(price, strategy.rates),
      totalSaved:
        Math.round((price - stackDiscounts(price, strategy.rates)) * 100) / 100,
    }))
    .sort((a, b) => a.finalPrice - b.finalPrice);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    applyPercentageDiscount,
    applyFlatDiscount,
    stackDiscounts,
    calculateCouponDiscount,
    getBestOffer,
    calculateOrderTotal,
    applyVolumeDiscount,
    calculateBuyXGetY,
    applyOrderThresholdDiscount,
    calculateLoyaltyPoints,
    redeemPoints,
    formatDiscountSummary,
    buildCheckoutSummary,
    getDiscountBreakdown,
    applyFlashSalePrice,
    calculateGroupDiscount,
    applyMembershipTier,
    compareOfferStrategies,
  };
}
