'use client';

import { Recipe } from '@/types/recipe';
import { Heart, Clock, Users, TrendingUp, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  userRating?: number;
  onFavoriteToggle: (recipeId: string) => void;
  onRate: (recipeId: string, rating: number) => void;
  onClick: () => void;
  matchingIngredients: string[];
}

export default function RecipeCard({
  recipe,
  isFavorite,
  userRating,
  onFavoriteToggle,
  onClick,
  matchingIngredients
}: RecipeCardProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group">
      <div onClick={onClick}>
        {/* Recipe Image Placeholder */}
        <div className="h-48 bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center text-white text-6xl">
          🍽️
        </div>

        {/* Recipe Info */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              {recipe.name}
            </h3>
            {isClient && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle(recipe.id);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
                suppressHydrationWarning={true}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
            {recipe.description}
          </p>

          {/* Matching Ingredients Badge */}
          {matchingIngredients.length > 0 && (
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">
                {matchingIngredients.length} matching ingredient{matchingIngredients.length > 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${difficultyColors[recipe.difficulty]}`}>
              {recipe.difficulty}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {recipe.cuisine}
            </span>
            {recipe.dietary.map(diet => (
              <span key={diet} className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                {diet}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.cookingTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} servings</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold">{recipe.nutrition.calories}</span>
              <span>cal</span>
            </div>
          </div>

          {/* User Rating Display */}
          {userRating && (
            <div className="mt-3 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= userRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
