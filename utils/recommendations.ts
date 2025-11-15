import { Recipe, UserRating } from '@/types/recipe';

// Calculate recipe score based on user preferences and ratings
export function calculateRecipeScore(
  recipe: Recipe,
  userRatings: UserRating[],
  userDietary: string[],
  availableIngredients: string[]
): number {
  let score = 0;

  // 1. User's own rating (highest weight)
  const userRating = userRatings.find(r => r.recipeId === recipe.id);
  if (userRating) {
    score += userRating.rating * 10;
  }

  // 2. Dietary preferences match
  const dietaryMatch = recipe.dietary.filter(diet => userDietary.includes(diet)).length;
  score += dietaryMatch * 5;

  // 3. Ingredient match percentage
  if (availableIngredients.length > 0) {
    const matchCount = availableIngredients.filter(ingredient =>
      recipe.ingredients.some(recipeIng =>
        recipeIng.toLowerCase().includes(ingredient.toLowerCase()) ||
        ingredient.toLowerCase().includes(recipeIng.toLowerCase())
      )
    ).length;
    const matchPercentage = matchCount / recipe.ingredients.length;
    score += matchPercentage * 20;
  }

  // 4. Difficulty preference (easier recipes get slight boost)
  if (recipe.difficulty === 'Easy') {
    score += 2;
  }

  // 5. Cooking time (faster recipes get slight boost)
  if (recipe.cookingTime <= 30) {
    score += 3;
  }

  return score;
}

// Get personalized recipe recommendations
export function getRecommendedRecipes(
  recipes: Recipe[],
  userRatings: UserRating[],
  userDietary: string[],
  availableIngredients: string[] = [],
  limit: number = 6
): Recipe[] {
  // Calculate scores for all recipes
  const scoredRecipes = recipes.map(recipe => ({
    recipe,
    score: calculateRecipeScore(recipe, userRatings, userDietary, availableIngredients)
  }));

  // Sort by score descending
  scoredRecipes.sort((a, b) => b.score - a.score);

  // Return top recipes
  return scoredRecipes.slice(0, limit).map(item => item.recipe);
}

// Get similar recipes based on cuisine, dietary restrictions, and tags
export function getSimilarRecipes(
  targetRecipe: Recipe,
  allRecipes: Recipe[],
  limit: number = 4
): Recipe[] {
  const scoredRecipes = allRecipes
    .filter(recipe => recipe.id !== targetRecipe.id)
    .map(recipe => {
      let similarityScore = 0;

      // Same cuisine
      if (recipe.cuisine === targetRecipe.cuisine) {
        similarityScore += 10;
      }

      // Shared dietary restrictions
      const sharedDietary = recipe.dietary.filter(diet =>
        targetRecipe.dietary.includes(diet)
      ).length;
      similarityScore += sharedDietary * 5;

      // Shared tags
      const sharedTags = recipe.tags.filter(tag =>
        targetRecipe.tags.includes(tag)
      ).length;
      similarityScore += sharedTags * 3;

      // Similar difficulty
      if (recipe.difficulty === targetRecipe.difficulty) {
        similarityScore += 2;
      }

      // Similar cooking time (within 15 minutes)
      if (Math.abs(recipe.cookingTime - targetRecipe.cookingTime) <= 15) {
        similarityScore += 2;
      }

      return { recipe, similarityScore };
    });

  scoredRecipes.sort((a, b) => b.similarityScore - a.similarityScore);

  return scoredRecipes.slice(0, limit).map(item => item.recipe);
}
