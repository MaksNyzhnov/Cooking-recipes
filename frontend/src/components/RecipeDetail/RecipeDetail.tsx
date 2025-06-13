import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Recipe } from '../../types/recipe';
import { api } from '../../services/api';
import styles from './RecipeDetail.module.css';

const useRecipe = (id: string) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const response = await api.getRecipeById(id);
        const recipeData = response.meals?.[0] || null;
        setRecipe(recipeData);
        setError(null);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError('Failed to fetch recipe details');
          console.error(err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchRecipe();

    return () => controller.abort();
  }, [id]);

  return { recipe, loading, error };
};

const useRelatedRecipes = (category: string | undefined, currentRecipeId: string | undefined) => {
  const [relatedRecipes, setRelatedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchRelatedRecipes = async () => {
      if (!category || !currentRecipeId) return;

      try {
        setLoading(true);
        const response = await api.getRecipes({ category });
        const filteredRecipes = (response.meals || [])
          .filter(r => r.idMeal !== currentRecipeId);
        setRelatedRecipes(filteredRecipes);
        setError(null);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError('Failed to fetch related recipes');
          console.error(err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchRelatedRecipes();

    return () => controller.abort();
  }, [category, currentRecipeId]);

  return { relatedRecipes, loading, error };
};

export const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { recipe, loading: recipeLoading, error: recipeError } = useRecipe(id!);
  const { 
    relatedRecipes, 
    loading: relatedLoading, 
    error: relatedError 
  } = useRelatedRecipes(recipe?.strCategory, recipe?.idMeal);

  if (recipeLoading) {
    return <div className={styles.loading}>Loading recipe details...</div>;
  }

  if (recipeError) {
    return <div className={styles.error}>{recipeError}</div>;
  }

  if (!recipe) {
    return <div className={styles.noRecipe}>Recipe not found</div>;
  }

  const ingredients = Object.entries(recipe)
    .filter(([key, value]) => key.startsWith('strIngredient') && value)
    .map(([key, value]) => {
      const measureKey = key.replace('strIngredient', 'strMeasure');
      const measure = recipe[measureKey as keyof Recipe] || '';
      return `${measure} ${value}`.trim();
    });

  return (
    <div className={styles.recipeDetail}>
      <div className={styles.mainContent}>
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className={styles.recipeImage}
        />
        <h1 className={styles.recipeName}>{recipe.strMeal}</h1>
        <Link
          to={`/?country=${recipe.strArea}`}
          className={styles.recipeArea}
        >
          {recipe.strArea}
        </Link>
        <div className={styles.instructions}>
          <h2>Instructions</h2>
          <p>{recipe.strInstructions}</p>
        </div>
        <div className={styles.ingredients}>
          <h2>Ingredients</h2>
          <ul>
            {ingredients.map((ingredient, index) => (
              <li key={index}>
                <Link to={`/?ingredient=${ingredient.split(' ').slice(1).join('_')}`}>
                  {ingredient}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.sidebar}>
        <h2>More {recipe.strCategory} Recipes</h2>
        <Link
          to={`/?category=${recipe.strCategory}`}
          className={styles.categoryLink}
        >
          View all {recipe.strCategory} recipes
        </Link>
        <div className={styles.relatedRecipesSection}>
          <h3 className={styles.relatedRecipesTitle}>
            Other {recipe.strCategory} Recipes
          </h3>
          {relatedLoading && <div className={styles.loading}>Loading related recipes...</div>}
          {relatedError && <div className={styles.error}>{relatedError}</div>}
          <div className={styles.relatedRecipes}>
            {relatedRecipes.map((relatedRecipe) => (
              <Link
                key={relatedRecipe.idMeal}
                to={`/recipe/${relatedRecipe.idMeal}`}
                className={styles.relatedRecipeCard}
              >
                <img
                  src={relatedRecipe.strMealThumb}
                  alt={relatedRecipe.strMeal}
                  className={styles.relatedRecipeImage}
                />
                <h3 className={styles.relatedRecipeName}>{relatedRecipe.strMeal}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 