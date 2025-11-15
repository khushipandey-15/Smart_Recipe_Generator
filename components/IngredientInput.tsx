'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Plus, Camera } from 'lucide-react';
import ImageRecognition from './ImageRecognition';

interface IngredientInputProps {
  selectedIngredients: string[];
  setSelectedIngredients: (ingredients: string[]) => void;
}

const commonIngredients = [
  'chicken', 'beef', 'pork', 'shrimp', 'salmon', 'egg',
  'tomato', 'onion', 'garlic', 'carrot', 'broccoli', 'spinach',
  'bell pepper', 'mushroom', 'potato', 'rice', 'pasta', 'flour',
  'cheese', 'milk', 'butter', 'olive oil', 'soy sauce', 'salt',
  'pepper', 'basil', 'lemon', 'lime'
];

export default function IngredientInput({
  selectedIngredients,
  setSelectedIngredients
}: IngredientInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const suggestions = commonIngredients.filter(
    ing => 
      ing.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedIngredients.includes(ing)
  );

  const addIngredient = (ingredient: string) => {
    const trimmed = ingredient.trim().toLowerCase();
    if (trimmed && !selectedIngredients.includes(trimmed)) {
      setSelectedIngredients([...selectedIngredients, trimmed]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      addIngredient(inputValue);
    }
  };

  const handleIngredientsDetected = (ingredients: string[]) => {
    const newIngredients = ingredients.filter(
      ing => !selectedIngredients.includes(ing.toLowerCase())
    ).map(ing => ing.toLowerCase());
    setSelectedIngredients([...selectedIngredients, ...newIngredients]);
    setShowImageUpload(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Your Ingredients
      </h2>

      {/* Input and Camera Button */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Type an ingredient (e.g., chicken, tomato)..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && inputValue && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => addIngredient(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-orange-50 dark:hover:bg-gray-600 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => inputValue.trim() && addIngredient(inputValue)}
          className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add
        </button>

        <button
          onClick={() => setShowImageUpload(!showImageUpload)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
          title="Upload ingredient photo"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>

      {/* Image Recognition Component */}
      {showImageUpload && (
        <div className="mb-4">
          <ImageRecognition onIngredientsDetected={handleIngredientsDetected} />
        </div>
      )}

      {/* Selected Ingredients */}
      {selectedIngredients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedIngredients.map(ingredient => (
            <span
              key={ingredient}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full font-medium"
            >
              {ingredient}
              <button
                onClick={() => removeIngredient(ingredient)}
                className="hover:text-orange-600 dark:hover:text-orange-400"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      )}

      {selectedIngredients.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          Add ingredients to find matching recipes
        </p>
      )}
    </div>
  );
}
