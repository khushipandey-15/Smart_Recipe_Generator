// Common ingredient substitutions for when users don't have exact ingredients
export const ingredientSubstitutions: Record<string, string[]> = {
  // Proteins
  'chicken': ['turkey', 'pork', 'tofu'],
  'beef': ['pork', 'lamb', 'ground turkey'],
  'pork': ['chicken', 'beef', 'turkey'],
  'shrimp': ['prawns', 'scallops', 'fish'],
  'salmon': ['tuna', 'trout', 'mackerel'],
  
  // Dairy
  'milk': ['almond milk', 'soy milk', 'oat milk'],
  'butter': ['margarine', 'coconut oil', 'olive oil'],
  'cheese': ['nutritional yeast', 'cashew cheese'],
  'mozzarella': ['provolone', 'cheddar', 'swiss'],
  'parmesan': ['pecorino', 'asiago', 'grana padano'],
  'sour cream': ['greek yogurt', 'plain yogurt'],
  
  // Vegetables
  'spinach': ['kale', 'swiss chard', 'arugula'],
  'broccoli': ['cauliflower', 'brussels sprouts'],
  'carrot': ['parsnip', 'sweet potato'],
  'bell pepper': ['poblano pepper', 'anaheim pepper'],
  'onion': ['shallot', 'leek', 'scallion'],
  'tomato': ['canned tomatoes', 'tomato paste', 'tomato sauce'],
  
  // Grains & Pasta
  'rice': ['quinoa', 'couscous', 'bulgur'],
  'pasta': ['rice noodles', 'zucchini noodles', 'soba noodles'],
  'flour': ['almond flour', 'coconut flour', 'whole wheat flour'],
  'bread': ['tortilla', 'pita', 'naan'],
  
  // Seasonings
  'basil': ['oregano', 'thyme', 'parsley'],
  'oregano': ['basil', 'marjoram', 'thyme'],
  'soy sauce': ['tamari', 'coconut aminos', 'worcestershire sauce'],
  'lemon': ['lime', 'vinegar'],
  'lime': ['lemon', 'vinegar'],
  'garlic': ['garlic powder', 'shallot'],
  'ginger': ['ginger powder', 'galangal'],
  
  // Other
  'egg': ['flax egg', 'chia egg', 'applesauce'],
  'olive oil': ['vegetable oil', 'canola oil', 'avocado oil'],
  'white wine': ['chicken broth', 'apple cider vinegar', 'white grape juice'],
  'sugar': ['honey', 'maple syrup', 'agave'],
};

export function getSubstitutions(ingredient: string): string[] {
  const normalized = ingredient.toLowerCase().trim();
  return ingredientSubstitutions[normalized] || [];
}

export function findRecipesWithSubstitutions(
  recipes: any[],
  availableIngredients: string[],
  maxMissingIngredients: number = 3
) {
  return recipes.map(recipe => {
    const missingIngredients: string[] = [];
    const substitutionOptions: Record<string, string[]> = {};
    
    recipe.ingredients.forEach((recipeIng: string) => {
      const hasIngredient = availableIngredients.some(avail =>
        recipeIng.toLowerCase().includes(avail.toLowerCase()) ||
        avail.toLowerCase().includes(recipeIng.toLowerCase())
      );
      
      if (!hasIngredient) {
        missingIngredients.push(recipeIng);
        const subs = getSubstitutions(recipeIng);
        if (subs.length > 0) {
          substitutionOptions[recipeIng] = subs;
        }
      }
    });
    
    return {
      ...recipe,
      missingIngredients,
      substitutionOptions,
      canMakeWithSubstitutions: missingIngredients.length <= maxMissingIngredients
    };
  }).filter(recipe => recipe.canMakeWithSubstitutions);
}
