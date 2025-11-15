'use client';

import { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    difficulty: string[];
    maxCookingTime: number;
    dietary: string[];
  };
  setFilters: (filters: any) => void;
}

export default function FilterPanel({ filters, setFilters }: FilterPanelProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const difficulties = ['Easy', 'Medium', 'Hard'];
  const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'];

  const toggleDifficulty = (diff: string) => {
    setFilters({
      ...filters,
      difficulty: filters.difficulty.includes(diff)
        ? filters.difficulty.filter(d => d !== diff)
        : [...filters.difficulty, diff]
    });
  };

  const toggleDietary = (diet: string) => {
    setFilters({
      ...filters,
      dietary: filters.dietary.includes(diet)
        ? filters.dietary.filter(d => d !== diet)
        : [...filters.dietary, diet]
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-4">
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="w-5 h-5 text-orange-600" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Filters</h2>
      </div>

      {/* Difficulty */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Difficulty</h3>
        <div className="space-y-2">
          {difficulties.map(diff => (
            <label key={diff} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.difficulty.includes(diff)}
                onChange={() => toggleDifficulty(diff)}
                className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
              />
              <span className="text-gray-700 dark:text-gray-300">{diff}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Cooking Time */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Max Cooking Time: {filters.maxCookingTime} min
        </h3>
        <input
          type="range"
          min="10"
          max="120"
          step="10"
          value={filters.maxCookingTime}
          onChange={(e) => setFilters({ ...filters, maxCookingTime: parseInt(e.target.value) })}
          className="w-full accent-orange-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>10 min</span>
          <span>120 min</span>
        </div>
      </div>

      {/* Dietary Restrictions */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Dietary</h3>
        <div className="space-y-2">
          {dietaryOptions.map(diet => (
            <label key={diet} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.dietary.includes(diet)}
                onChange={() => toggleDietary(diet)}
                className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
              />
              <span className="text-gray-700 dark:text-gray-300 capitalize">{diet}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      {isClient && (
        <button
          onClick={() => setFilters({ difficulty: [], maxCookingTime: 120, dietary: [] })}
          className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          suppressHydrationWarning={true}
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
