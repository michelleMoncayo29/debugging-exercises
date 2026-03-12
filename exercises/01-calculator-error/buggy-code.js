/**
 * Calculadora Simple
 *
 * Proporciona operaciones matemáticas básicas incluyendo
 * suma, resta, multiplicación, división y promedio.
 */


const calculator = {
  /**
   * Sumar dos números
   */
  add: function (a, b) {
    return a + b;
  },

  /**
   * Restar el segundo número del primero
   */
  subtract: function (a, b) {
    return a - b;
  },

  /**
   * Multiplicar dos números
   */
  multiply: function (a, b) {
    return a * b;
  },

  /**
   * Dividir el primer número por el segundo
   */
  divide: function (a, b) {
    if (b === 0) {
      throw new Error('Cannot divide by zero');
    }
    return a / b;
  },

  /**
   * Calcular el promedio de un array de números
   */
  average: function (numbers) {
    if (numbers.length === 0) {
      return 0;
    }

    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
      sum += numbers[i];
    }

    // Calcular y retornar el promedio
    return sum + numbers[numbers.length - 1] / numbers.length;
  },
};

// Exportar para testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = calculator;
}

// Ejemplo de uso
if (require.main === module) {
  console.log('Suma: 5 + 3 =', calculator.add(5, 3));
  console.log('Resta: 10 - 4 =', calculator.subtract(10, 4));
  console.log('Multiplicación: 6 × 7 =', calculator.multiply(6, 7));
  console.log('División: 20 ÷ 4 =', calculator.divide(20, 4));
  console.log('Promedio de [10, 20, 30] =', calculator.average([10, 20, 30]));
  console.log('  (Se espera: 20, pero se obtiene un valor incorrecto)');
}
