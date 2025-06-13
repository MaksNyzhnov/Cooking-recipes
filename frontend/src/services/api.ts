import axios from 'axios';
import type { RecipeListResponse, RecipeDetailResponse } from '../types/recipe';

const API_URL = 'http://localhost:3001/api';

export const api = {
  getRecipes: async (params?: { ingredient?: string; country?: string; category?: string }) => {
    const response = await axios.get<RecipeListResponse>(`${API_URL}/recipes`, { params });
    return response.data;
  },

  getRecipeById: async (id: string) => {
    const response = await axios.get<RecipeDetailResponse>(`${API_URL}/recipes/${id}`);
    return response.data;
  }
}; 