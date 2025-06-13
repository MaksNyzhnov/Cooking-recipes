import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Recipe } from '../../types/recipe';
import { api } from '../../services/api';
import styles from './RecipeList.module.css';

export const RecipeList = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  const getPageTitle = () => {
    const ingredient = searchParams.get('ingredient');
    const country = searchParams.get('country');
    const category = searchParams.get('category');

    if (ingredient) {
      return `Recipes with ${ingredient.replace(/_/g, ' ')}`;
    }
    if (country) {
      return `${country} Recipes`;
    }
    if (category) {
      return `${category} Recipes`;
    }
    return 'All Recipes';
  };

  useEffect(() => {
    

    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const params: { ingredient?: string; country?: string; category?: string } = {};
        
        if (searchParams.get('ingredient')) {
          params.ingredient = searchParams.get('ingredient')!;
        } else if (searchParams.get('country')) {
          params.country = searchParams.get('country')!;
        } else if (searchParams.get('category')) {
          params.category = searchParams.get('category')!;
        }

        const response = await api.getRecipes(params);
        
          setRecipes(response.meals || []);
          
      } catch (err) {
       
          setError('Failed to fetch recipes');
          
        
      } finally {
       
          setLoading(false);
        }
      
    };

    fetchRecipes();

  }, [searchParams]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (recipes.length === 0) {
    return <div className={styles.noRecipes}>No recipes found</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>{getPageTitle()}</h2>
      <div className={styles.recipeList}>
        {recipes.map((recipe) => (
          <Link
            key={recipe.idMeal}
            to={`/recipe/${recipe.idMeal}`}
            className={styles.recipeCard}
          >
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className={styles.recipeImage}
            />
            <h3 className={styles.recipeName}>{recipe.strMeal}</h3>
            <p className={styles.recipeCategory}>{recipe.strCategory}</p>
            <p className={styles.recipeArea}>{recipe.strArea}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}; 