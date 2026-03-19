/**
 * Pruebas para: Sistema de Seguimiento Nutricional de Recetas
 *
 * Por defecto prueban buggy-code.js para que veas los errores.
 * Cambia a solution.js cuando hayas corregido el código.
 *
 * Ejecutar con: npm test exercises/20-recipe-nutrition
 */

// IMPORTANTE: Cambiar esta línea para probar tu solución
const { Ingredient, Recipe, MealPlan } = require('./buggy-code.js');
// const { } = require('./solution.js');

describe('Sistema de Seguimiento Nutricional de Recetas', () => {
  describe('Ingredient - Cálculo de calorías del ingrediente', () => {
    test('debe calcular correctamente las calorías según la cantidad en gramos', () => {
      const ing = new Ingredient('Arroz', 100, 350);
      // 100g * 350 cal/100g = 350 cal
      expect(ing.getCalories()).toBe(350);
    });

    test('debe calcular calorías para cantidad parcial', () => {
      const ing = new Ingredient('Aceite', 50, 900);
      // 50g * 900 cal/100g = 450 cal
      expect(ing.getCalories()).toBe(450);
    });
  });

  describe('Recipe.getTotalCalories - Total de calorías de la receta', () => {
    test('debe sumar las calorías de todos los ingredientes', () => {
      const recipe = new Recipe('Pasta', 2);
      recipe.addIngredient(new Ingredient('Pasta', 200, 350));
      recipe.addIngredient(new Ingredient('Salsa', 100, 80));
      // (200*350/100) + (100*80/100) = 700 + 80 = 780
      expect(recipe.getTotalCalories()).toBe(780);
    });
  });

  describe('Recipe.getCaloriesPerServing - Calorías por porción', () => {
    test('debe dividir las calorías totales entre el número de porciones', () => {
      const recipe = new Recipe('Arroz con pollo', 2);
      recipe.addIngredient(new Ingredient('Arroz', 200, 350));
      recipe.addIngredient(new Ingredient('Pollo', 300, 200));
      // Total: (200*350/100) + (300*200/100) = 700 + 600 = 1300 cal
      // Por porción: 1300 / 2 = 650 (no 1300/2_ingredientes=650... espera, aquí coincide)
      expect(recipe.getCaloriesPerServing()).toBe(650);
    });

    test('debe calcular correctamente cuando porciones difiere del número de ingredientes', () => {
      const recipe = new Recipe('Smoothie', 3);
      recipe.addIngredient(new Ingredient('Banana', 100, 90));
      recipe.addIngredient(new Ingredient('Leche', 200, 60));
      // Total: 90 + 120 = 210 cal
      // Por porción correcta: 210 / 3 = 70
      // Buggy (divide entre ingredientes=2): 210 / 2 = 105
      expect(recipe.getCaloriesPerServing()).toBeCloseTo(70, 5);
    });

    test('debe calcular porción correcta con 1 ingrediente y 4 porciones', () => {
      const recipe = new Recipe('Sopa', 4);
      recipe.addIngredient(new Ingredient('Caldo', 1000, 20));
      // Total: 1000*20/100 = 200 cal
      // Por porción: 200 / 4 = 50
      // Buggy (divide entre 1 ingrediente): 200 / 1 = 200
      expect(recipe.getCaloriesPerServing()).toBe(50);
    });

    test('debe calcular porción correcta con 5 ingredientes y 1 porción', () => {
      const recipe = new Recipe('Postre individual', 1);
      recipe.addIngredient(new Ingredient('Harina', 100, 360));
      recipe.addIngredient(new Ingredient('Azúcar', 80, 400));
      recipe.addIngredient(new Ingredient('Mantequilla', 60, 717));
      recipe.addIngredient(new Ingredient('Huevo', 50, 155));
      recipe.addIngredient(new Ingredient('Cacao', 30, 400));
      // Total: 360 + 320 + 430.2 + 77.5 + 120 = 1307.7 cal
      // Por porción: 1307.7 / 1 = 1307.7
      // Buggy (divide entre 5): 1307.7 / 5 = 261.54
      expect(recipe.getCaloriesPerServing()).toBeCloseTo(1307.7, 0);
    });

    test('debe retornar 0 cuando no hay ingredientes', () => {
      const recipe = new Recipe('Vacía', 2);
      expect(recipe.getCaloriesPerServing()).toBe(0);
    });

    test('debe calcular porción correcta con 4 ingredientes y 2 porciones', () => {
      const recipe = new Recipe('Tortilla', 2);
      recipe.addIngredient(new Ingredient('Huevos', 120, 155));
      recipe.addIngredient(new Ingredient('Papa', 150, 77));
      recipe.addIngredient(new Ingredient('Cebolla', 50, 40));
      recipe.addIngredient(new Ingredient('Aceite', 20, 900));
      // Total: 186 + 115.5 + 20 + 180 = 501.5 cal
      // Por porción: 501.5 / 2 = 250.75
      // Buggy (divide entre 4): 501.5 / 4 = 125.375
      expect(recipe.getCaloriesPerServing()).toBeCloseTo(250.75, 1);
    });
  });

  describe('MealPlan - Plan de comidas diario', () => {
    test('debe calcular el total de calorías del día sumando todas las recetas', () => {
      const plan = new MealPlan('Lunes');
      const desayuno = new Recipe('Tostadas', 1);
      desayuno.addIngredient(new Ingredient('Pan', 60, 265));
      const almuerzo = new Recipe('Ensalada', 1);
      almuerzo.addIngredient(new Ingredient('Lechuga', 100, 15));
      plan.addRecipe(desayuno);
      plan.addRecipe(almuerzo);
      // Desayuno: 60*265/100=159, Almuerzo: 15 → Total=174
      expect(plan.getTotalDailyCalories()).toBeCloseTo(174, 1);
    });
  });
});
