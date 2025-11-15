'use client';

import { useState, useEffect } from 'react';
import { recipes } from '@/data/recipes';
import { Recipe, UserPreferences } from '@/types/recipe';
import RecipeCard from '@/components/RecipeCard';
import IngredientInput from '@/components/IngredientInput';
import FilterPanel from '@/components/FilterPanel';
import RecipeModal from '@/components/RecipeModal';
import { ChefHat } from 'lucide-react';

export default function Home() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipes);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    dietary: [],
    favorites: [],
    ratings: []
  });
  const [filters, setFilters] = useState({
    difficulty: [] as string[],
    maxCookingTime: 120,
    dietary: [] as string[]
  });

  // Load user preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      setUserPreferences(JSON.parse(saved));
    }
  }, []);

  // Save user preferences to localStorage
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  // Filter recipes based on ingredients and filters
  useEffect(() => {
    let filtered = recipes;

    // Filter by ingredients
    if (selectedIngredients.length > 0) {
      filtered = filtered.filter(recipe => {
        const matchCount = selectedIngredients.filter(ingredient =>
          recipe.ingredients.some(recipeIng =>
            recipeIng.toLowerCase().includes(ingredient.toLowerCase()) ||
            ingredient.toLowerCase().includes(recipeIng.toLowerCase())
          )
        ).length;
        return matchCount > 0;
      }).sort((a, b) => {
        // Sort by number of matching ingredients (descending)
        const aMatches = selectedIngredients.filter(ingredient =>
          a.ingredients.some(recipeIng =>
            recipeIng.toLowerCase().includes(ingredient.toLowerCase()) ||
            ingredient.toLowerCase().includes(recipeIng.toLowerCase())
          )
        ).length;
        const bMatches = selectedIngredients.filter(ingredient =>
          b.ingredients.some(recipeIng =>
            recipeIng.toLowerCase().includes(ingredient.toLowerCase()) ||
            ingredient.toLowerCase().includes(recipeIng.toLowerCase())
          )
        ).length;
        return bMatches - aMatches;
      });
    }

    // Filter by difficulty
    if (filters.difficulty.length > 0) {
      filtered = filtered.filter(recipe => filters.difficulty.includes(recipe.difficulty));
    }

    // Filter by cooking time
    filtered = filtered.filter(recipe => recipe.cookingTime <= filters.maxCookingTime);

    // Filter by dietary restrictions
    if (filters.dietary.length > 0) {
      filtered = filtered.filter(recipe =>
        filters.dietary.every(diet => recipe.dietary.includes(diet))
      );
    }

    setFilteredRecipes(filtered);
  }, [selectedIngredients, filters]);

  const handleFavoriteToggle = (recipeId: string) => {
    setUserPreferences(prev => ({
      ...prev,
      favorites: prev.favorites.includes(recipeId)
        ? prev.favorites.filter(id => id !== recipeId)
        : [...prev.favorites, recipeId]
    }));
  };

  const handleRating = (recipeId: string, rating: number) => {
    setUserPreferences(prev => ({
      ...prev,
      ratings: [
        ...prev.ratings.filter(r => r.recipeId !== recipeId),
        { recipeId, rating, timestamp: Date.now() }
      ]
    }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1">
            <FilterPanel filters={filters} setFilters={setFilters} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Ingredient Input */}
            <div className="mb-6">
              <IngredientInput
                selectedIngredients={selectedIngredients}
                setSelectedIngredients={setSelectedIngredients}
              />
            </div>

            {/* Recipe Results */}
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                {selectedIngredients.length > 0
                  ? `Found ${filteredRecipes.length} recipes`
                  : `All Recipes (${filteredRecipes.length})`}
              </h2>
              {selectedIngredients.length > 0 && (
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Showing recipes that match your ingredients
                </p>
              )}
            </div>

            {/* Recipe Grid */}
            {filteredRecipes.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRecipes.map(recipe => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={userPreferences.favorites.includes(recipe.id)}
                    userRating={userPreferences.ratings.find(r => r.recipeId === recipe.id)?.rating}
                    onFavoriteToggle={handleFavoriteToggle}
                    onRate={handleRating}
                    onClick={() => setSelectedRecipe(recipe)}
                    matchingIngredients={selectedIngredients.filter(ingredient =>
                      recipe.ingredients.some(recipeIng =>
                        recipeIng.toLowerCase().includes(ingredient.toLowerCase()) ||
                        ingredient.toLowerCase().includes(recipeIng.toLowerCase())
                      )
                    )}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  No recipes found matching your criteria.
                </p>
                <p className="text-gray-500 dark:text-gray-500 mt-2">
                  Try adjusting your filters or adding different ingredients.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          isFavorite={userPreferences.favorites.includes(selectedRecipe.id)}
          userRating={userPreferences.ratings.find(r => r.recipeId === selectedRecipe.id)?.rating}
          onClose={() => setSelectedRecipe(null)}
          onFavoriteToggle={handleFavoriteToggle}
          onRate={handleRating}
        />
      )}
    </main>
  );
}
