'use client';

import { useState, useEffect } from 'react';
import { recipes } from '@/data/recipes';
import { Recipe, UserPreferences } from '@/types/recipe';
import RecipeCard from '@/components/RecipeCard';
import RecipeModal from '@/components/RecipeModal';
import { getRecommendedRecipes } from '@/utils/recommendations';
import { Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function RecommendationsPage() {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    dietary: [],
    favorites: [],
    ratings: []
  });
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Load user preferences
  useEffect(() => {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      const prefs = JSON.parse(saved);
      setUserPreferences(prefs);
      
      // Get recommendations
      const recommended = getRecommendedRecipes(
        recipes,
        prefs.ratings,
        prefs.dietary,
        [],
        12
      );
      setRecommendedRecipes(recommended);
    }
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  const handleFavoriteToggle = (recipeId: string) => {
    setUserPreferences(prev => ({
      ...prev,
      favorites: prev.favorites.includes(recipeId)
        ? prev.favorites.filter(id => id !== recipeId)
        : [...prev.favorites, recipeId]
    }));
  };

  const handleRating = (recipeId: string, rating: number) => {
    const newPrefs = {
      ...userPreferences,
      ratings: [
        ...userPreferences.ratings.filter(r => r.recipeId !== recipeId),
        { recipeId, rating, timestamp: Date.now() }
      ]
    };
    setUserPreferences(newPrefs);
    
    // Recalculate recommendations
    const recommended = getRecommendedRecipes(
      recipes,
      newPrefs.ratings,
      newPrefs.dietary,
      [],
      12
    );
    setRecommendedRecipes(recommended);
  };

  const favoriteRecipes = recipes.filter(recipe =>
    userPreferences.favorites.includes(recipe.id)
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4"
          >
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-orange-600 dark:text-orange-400" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              Your Recommendations
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Personalized recipe suggestions based on your preferences and ratings
          </p>
        </div>

        {/* Recommended Recipes */}
        {recommendedRecipes.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Recommended for You
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendedRecipes.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={userPreferences.favorites.includes(recipe.id)}
                  userRating={userPreferences.ratings.find(r => r.recipeId === recipe.id)?.rating}
                  onFavoriteToggle={handleFavoriteToggle}
                  onRate={handleRating}
                  onClick={() => setSelectedRecipe(recipe)}
                  matchingIngredients={[]}
                />
              ))}
            </div>
          </section>
        )}

        {/* Favorite Recipes */}
        {favoriteRecipes.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Your Favorites ❤️
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteRecipes.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={true}
                  userRating={userPreferences.ratings.find(r => r.recipeId === recipe.id)?.rating}
                  onFavoriteToggle={handleFavoriteToggle}
                  onRate={handleRating}
                  onClick={() => setSelectedRecipe(recipe)}
                  matchingIngredients={[]}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {recommendedRecipes.length === 0 && favoriteRecipes.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Start Building Your Recommendations
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Rate recipes and save your favorites to get personalized recommendations
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              Explore Recipes
            </Link>
          </div>
        )}
      </div>

      {/* Recipe Modal */}
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
