export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  steps: string[];
  cuisine: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cookingTime: number; // in minutes
  servings: number;
  dietary: string[]; // e.g., 'vegetarian', 'vegan', 'gluten-free', 'dairy-free'
  nutrition: {
    calories: number;
    protein: number; // in grams
    carbs: number;
    fat: number;
  };
  image?: string;
  tags: string[];
}

export interface UserRating {
  recipeId: string;
  rating: number; // 1-5
  timestamp: number;
}

export interface UserPreferences {
  dietary: string[];
  favorites: string[];
  ratings: UserRating[];
}
