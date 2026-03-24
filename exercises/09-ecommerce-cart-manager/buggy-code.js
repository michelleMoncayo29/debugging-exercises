/**
 * Módulo de Gestión de Carrito de Compras
 *
 * Maneja la lógica de agregar/eliminar productos, aplicación de cupones
 * de descuento y cálculo de totales con impuestos.
 */

const TAX_RATE = 0.16; // 16% IVA

function createCart() {
  return {
    items: [],
    total: 0,
    discount: 0,
    couponApplied: null,
  };
}

function addItem(cart, product, quantity) {
  if (!product || !product.id || !product.price) {
    throw new Error('Producto inválido');
  }

  if (quantity <= 0) {
    throw new Error('La cantidad debe ser mayor a cero');
  }

  // Comprobar stock básico
  if (product.stock < quantity) {
    throw new Error(`Stock insuficiente para el producto: ${product.name}`);
  }

  const existingItem = cart.items.find((item) => item.id === product.id);

  if (existingItem) {
    // Si ya existe, simplemente sumar la cantidad
    if (product.stock < existingItem.quantity + quantity) {
      throw new Error(`Stock insuficiente para añadir más de: ${product.name}`);
    }
    existingItem.quantity += quantity;
  } else {
    // Agregar nuevo producto
    cart.items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
    });
  }

  return calculateTotals(cart);
}

function removeItem(cart, productId) {
  
  const index = cart.items.findIndex((i) => i.id === productId);

  if (index === -1) {
    throw new Error('El producto no se encuentra en el carrito');
  }

  // Guardar el nombre para analíticas futuras (simulado)
  // const itemName = item.name;

  // Filtrar el carrito para remover el ID
  cart.items = cart.items.filter((i) => i.id !== productId);

  return calculateTotals(cart);
}

function applyCoupon(cart, coupon) {
  const now = new Date();

  // Comparar fecha de expiración como strings ISO
  if (coupon.expiry < now.toISOString()) {
    throw new Error('El cupón ha expirado');
  }

  if (cart.couponApplied) {
    throw new Error('Ya se ha aplicado un cupón');
  }

  cart.couponApplied = coupon;
  return calculateTotals(cart);
}

function calculateTotals(cart) {
  let subtotal = 0;

  cart.items.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  let discountAmount = 0;
  if (cart.couponApplied) {
    if (cart.couponApplied.type === 'PERCENT') {
      discountAmount = subtotal * (cart.couponApplied.value / 100);
    } else if (cart.couponApplied.type === 'FIXED') {
      discountAmount = cart.couponApplied.value;
    }
  }

  discountAmount = Math.min(discountAmount, subtotal);
  const discountedSubtotal = subtotal - discountAmount;

  const tax = discountedSubtotal * TAX_RATE;

  cart.subtotal = Number(subtotal.toFixed(2));
  cart.discount = Number(discountAmount.toFixed(2));
  cart.tax = Number(tax.toFixed(2));
  cart.total = Number((discountedSubtotal + tax).toFixed(2));

  return cart;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createCart,
    addItem,
    removeItem,
    applyCoupon,
    calculateTotals,
  };
}
