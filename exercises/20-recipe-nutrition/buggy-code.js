/**
 * Sistema de seguimiento nutricional de recetas
 * Obtiene información nutricional desde Open Food Facts API (sin API key)
 */

class Ingredient {
  constructor(name, amountGrams, caloriesPer100g) {
    this.name = name;
    this.amountGrams = amountGrams;
    this.caloriesPer100g = caloriesPer100g;
  }

  getCalories() {
    return (this.amountGrams * this.caloriesPer100g) / 100;
  }
}

class Recipe {
  constructor(name, servings) {
    this.name = name;
    this.servings = servings;
    this.ingredients = [];
  }

  addIngredient(ingredient) {
    this.ingredients.push(ingredient);
  }

  getTotalCalories() {
    return this.ingredients.reduce((sum, ing) => sum + ing.getCalories(), 0);
  }

  // Calcula las calorías por porción dividiendo el total entre las porciones de la receta
  getCaloriesPerServing() {
    if (this.ingredients.length === 0) return 0;
    return this.getTotalCalories() / this.servings;
  }

  getNutritionalSummary() {
    return {
      recipeName: this.name,
      servings: this.servings,
      totalCalories: Math.round(this.getTotalCalories()),
      caloriesPerServing: Math.round(this.getCaloriesPerServing()),
    };
  }
}

class MealPlan {
  constructor(day) {
    this.day = day;
    this.recipes = [];
  }

  addRecipe(recipe) {
    this.recipes.push(recipe);
  }

  getTotalDailyCalories() {
    return this.recipes.reduce((sum, r) => sum + r.getTotalCalories(), 0);
  }

  getAverageCaloriesPerMeal() {
    if (this.recipes.length === 0) return 0;
    return this.getTotalDailyCalories() / this.recipes.length;
  }
}

// Busca información nutricional en Open Food Facts (sin API key)
async function fetchNutrition(productName) {
  const query = encodeURIComponent(productName);
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1&page_size=1`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error al consultar Open Food Facts: ${response.status}`);
  const data = await response.json();
  if (!data.products || data.products.length === 0) {
    throw new Error(`Producto no encontrado: ${productName}`);
  }
  const product = data.products[0];
  return {
    name: product.product_name || productName,
    caloriesPer100g: product.nutriments?.['energy-kcal_100g'] || 0,
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Ingredient, Recipe, MealPlan, fetchNutrition };
}

if (require.main === module) {
  (async () => {
    const recipe = new Recipe('Ensalada César', 4);
    const { caloriesPer100g: calLechuga } = await fetchNutrition('lechuga');
    const { caloriesPer100g: calPollo } = await fetchNutrition('pollo a la plancha');
    const { caloriesPer100g: calQueso } = await fetchNutrition('queso parmesano');
    recipe.addIngredient(new Ingredient('Lechuga', 200, calLechuga));
    recipe.addIngredient(new Ingredient('Pollo', 150, calPollo));
    recipe.addIngredient(new Ingredient('Queso', 50, calQueso));
    console.log(recipe.getNutritionalSummary());
  })();
}
