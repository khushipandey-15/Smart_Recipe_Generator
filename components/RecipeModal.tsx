'use client';

import { Recipe } from '@/types/recipe';
import { X, Heart, Clock, Users, Star, ChefHat } from 'lucide-react';
import { useState } from 'react';

interface RecipeModalProps {
  recipe: Recipe;
  isFavorite: boolean;
  userRating?: number;
  onClose: () => void;
  onFavoriteToggle: (recipeId: string) => void;
  onRate: (recipeId: string, rating: number) => void;
}

export default function RecipeModal({
  recipe,
  isFavorite,
  userRating,
  onClose,
  onFavoriteToggle,
  onRate
}: RecipeModalProps) {
  const [servings, setServings] = useState(recipe.servings);
  const [hoveredStar, setHoveredStar] = useState(0);

  const servingMultiplier = servings / recipe.servings;

  const handleRate = (rating: number) => {
    onRate(recipe.id, rating);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-yellow-500 p-6 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">{recipe.name}</h2>
            <p className="text-orange-100">{recipe.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Quick Stats & Actions */}
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="font-semibold">{recipe.cookingTime} minutes</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <ChefHat className="w-5 h-5 text-orange-600" />
              <span className="font-semibold">{recipe.difficulty}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Users className="w-5 h-5 text-orange-600" />
              <span className="font-semibold">{recipe.servings} servings</span>
            </div>
            <button
              onClick={() => onFavoriteToggle(recipe.id)}
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Saved' : 'Save'}
            </button>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Rate this recipe</h3>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredStar || userRating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
              {recipe.cuisine}
            </span>
            {recipe.dietary.map(diet => (
              <span key={diet} className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-semibold">
                {diet}
              </span>
            ))}
            {recipe.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>

          {/* Nutrition */}
          <div className="bg-orange-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-gray-800 dark:text-white mb-3">Nutrition per serving</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-600">{Math.round(recipe.nutrition.calories * servingMultiplier)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Calories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{Math.round(recipe.nutrition.protein * servingMultiplier)}g</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Protein</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{Math.round(recipe.nutrition.carbs * servingMultiplier)}g</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Carbs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{Math.round(recipe.nutrition.fat * servingMultiplier)}g</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Fat</div>
              </div>
            </div>
          </div>

          {/* Serving Size Adjuster */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Adjust Servings</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-bold"
              >
                -
              </button>
              <span className="text-xl font-semibold">{servings} servings</span>
              <button
                onClick={() => setServings(servings + 1)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-orange-600 mt-1">•</span>
                  <span className="text-gray-700 dark:text-gray-300 capitalize">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Instructions</h3>
            <ol className="space-y-4">
              {recipe.steps.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
