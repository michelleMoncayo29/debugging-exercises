/**
 * Módulo de lógica fundamental para una tienda de comercio electrónico.
 *
 * Contiene funciones para gestionar el carrito, impuestos, envíos y descuentos.
 */

/**
 * Calcula el subtotal de los productos en el carrito.
 * @param {Object[]} items - Lista de productos ({ price, quantity })
 * @returns {number} Subtotal calculado
 */
function calculateSubtotal(items) {
  // Sumar precios por cantidad de cada producto
  // const prices = items.reduce((acc, item) => acc + item.price * item.quantity);
  
  let sum = 0;
  for (i = 0; i < items.length; i++){
    const object = items[i];
    let sumValor = object.price * object.quantity;
    sum += sumValor;
  }

  return sum;
}

/**
 * Aplica un cupón de descuento al total.
 * @param {number} total - Monto total
 * @param {string} couponCode - Código del cupón
 * @returns {number} Total con descuento aplicado
 */
function applyCoupon(total, couponCode) {
  const coupons = {
    SUMMER10: 0.1,
    WELCOME20: 0.2,
  };

  const casesInsensitive = couponCode ? couponCode.toUpperCase() : '';
  // Buscar descuento. Comparar con los códigos disponibles.
  const discount = coupons[casesInsensitive] || 0;

  return total * (1 - discount);
}

applyCoupon(100, 'summer10');

/**
 * Calcula el impuesto sobre un monto dado.
 * @param {number} amount - Monto base
 * @param {number} taxRate - Tasa de impuesto (ej. 21 para 21%)
 * @returns {number} El monto del impuesto
 */
function calculateTax(amount, taxRate) {
  // Calcular el monto del impuesto sumando la tasa al monto original
  // console.log((amount * taxRate) / 100);
  return amount * taxRate / 100;
}

// calculateTax(100, 21);

/**
 * Determina el costo de envío basado en el peso y el estado de membresía.
 * @param {number} weight - Peso en kg
 * @param {boolean} isPremium - Si el usuario es miembro premium
 * @returns {number} Costo de envío
 */
function getShippingFee(weight, isPremium) {
  // Envío gratis para premium
  if (isPremium) return 0;

  // Si pesa 10kg o más cuesta 25, si pesa menos cuesta 10
  if (weight >= 10) return 25;
  if (weight > 0) return 10;
  return 0;
}

/**
 * Agrega un producto al carrito o incrementa su cantidad si ya existe.
 * @param {Object[]} cart - El carrito actual
 * @param {Object} newItem - El producto a agregar
 * @returns {Object[]} El carrito actualizado (sin mutar el original)
 */
function addItem(cart, newItem) {
  const existingItemIndex = cart.findIndex((item) => item.id === newItem.id);
  // console.log(existingItemIndex);

  if (existingItemIndex > -1) {
    // Si ya existe, actualizar la cantidad
    const newCart = [...cart];
    newCart[existingItemIndex] = {
      ...newCart[existingItemIndex],
      quantity: newCart[existingItemIndex].quantity + newItem.quantity,
    };

    return newCart;
  }

  return [...cart, newItem];
}

// addItem([{ id: 1, name: 'A', quantity: 1 }], { id: 2, name: 'B', quantity: 1 });

/**
 * Elimina un producto del carrito por su ID.
 * @param {Object[]} cart - El carrito actual
 * @param {number} itemId - ID del producto a eliminar
 * @returns {Object[]} El carrito filtrado
 */
function removeItem(cart, itemId) {
  return cart.filter((item) => item.id !== itemId);
}

/**
 * Formatea un resumen simple del pedido.
 * @param {Object} order - Objeto pedido ({ total, itemsCount })
 * @returns {string} Resumen formateado
 */
function formatOrderSummary(order) {
  // Retornar un string con la cantidad y el total
  return `Pedido: ${order.itemsCount} productos - Total: $${order.total.toFixed(2)}`;
}

// Exportar funciones
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateSubtotal,
    applyCoupon,
    calculateTax,
    getShippingFee,
    addItem,
    removeItem,
    formatOrderSummary,
  };
}
