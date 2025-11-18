import { db } from "../config/db.js";

//input fields from user
// title and cuisine_id mandatory
export interface RecipeInput {
  title: string;
  description?: string | null;
  cook_time_minutes?: number | null;
  difficulty?: string | null;
  rating?: number | null;
  cuisine_id: number;
}

// output fields from both cuisine and recipes databases
export interface Recipe {
  id: number;
  title: string;
  description?: string | null;
  cook_time_minutes?: number | null;
  difficulty?: string | null;
  rating?: number | null;
  created_at: string;
  cuisine_id: number;
  cuisine_name?: string;
}

// fetches one specific recipe by id and returns (one row) in the shape of Recipe or none
// joins cuisine table and adds cusine name to the recipe results
export const getRecipeById = async (id: number): Promise<Recipe | null> => {
  return db.oneOrNone<Recipe>(
    `SELECT 
        r.id,
        r.title,
        r.description,
        r.cook_time_minutes,
        r.difficulty,
        r.rating,
        r.created_at,
        r.cuisine_id,
        c.name AS cuisine_name
     FROM recipes r
     JOIN cuisines c ON r.cuisine_id = c.id
     WHERE r.id = $1`,
    [id]
  );
};

// fetches all recipes
// joins the tables and fetchs cuisine name and adds it to Recipe
// returns an array of Recipes (many lines)
export const getAllRecipes = async (): Promise<
  (Recipe & { cuisine_name: string })[]
> => {
  return db.any(
    `SELECT 
        r.id,
        r.title,
        r.description,
        r.cook_time_minutes,
        r.difficulty,
        r.rating,
        r.created_at,
        r.cuisine_id,
        c.name AS cuisine_name
     FROM recipes r
     JOIN cuisines c ON r.cuisine_id = c.id
     ORDER BY r.id`
  );
};

// creates a recipe
// takes in input from user and adds id, joins cuisine table and adds cuisine name
// Returns one Recipe
export const createRecipe = async (data: RecipeInput): Promise<Recipe> => {
  const {
    title,
    description,
    cook_time_minutes,
    difficulty,
    rating,
    cuisine_id,
  } = data;

  // returns only one row, withour cuisine_name
  const row = await db.one<Recipe>(
    `INSERT INTO recipes (title, description, cook_time_minutes, difficulty, rating, cuisine_id) 
    VALUES ($1, $2, $3, $4, $5, $6) 
    RETURNING id, title, description, cook_time_minutes, difficulty, rating, created_at, cuisine_id`,
    [
      title,
      description ?? null,
      cook_time_minutes ?? null,
      difficulty ?? null,
      rating ?? null,
      cuisine_id,
    ]
  );

  // selects the new row, joins with cuisine table and returns with cuisine_name
  const recipeWithCuisine = await getRecipeById(row.id);

  // throws an error if null
  if (!recipeWithCuisine) {
    throw new Error("Recipe not found after creation");
  }

  //returns a Recipe with all output fields
  return recipeWithCuisine;
};

// deletes a recipe by id
// function returns true if at least one row was deleted.
// If no id matched that id - row count is 0
export const deleteRecipe = async (id: number): Promise<boolean> => {
  const result = await db.result("DELETE FROM recipes WHERE id = $1", [id]);
  return result.rowCount > 0;
};
