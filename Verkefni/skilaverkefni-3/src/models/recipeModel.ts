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

// fetches one specific recipe by id and returns (one row) in the shape of Recipe or none
// joins cuisine table and adds cusine name to the recipe results
export const getRecipesByCuisineId = async (id: number): Promise<Recipe[]> => {
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
     WHERE r.cuisine_id = $1`,
    [id]
  );
};

// fetches all recipes, paginated
// joins the tables and fetchs cuisine name and adds it to Recipe
// returns an array of Recipes (many lines)
export const getAllRecipes = async (
  page = 1,
  limit = 10
): Promise<(Recipe & { cuisine_name: string })[]> => {
  const offset = (page - 1) * limit;
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
     ORDER BY r.id
     LIMIT $1 OFFSET $2`,
    [limit, offset]
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

// updates a recipe
export const updateRecipe = async (
  id: number,
  data: RecipeInput
): Promise<Recipe | null> => {
  // takes id from the user, selects every field of the corresponding row and remembers as existing
  const existing = await db.oneOrNone<Recipe>(
    "SELECT * FROM recipes WHERE id = $1",
    [id]
  );

  if (!existing) return null;

  // merging data - checks if the user entered new data, if yes - use it, if not - then use the existing data field and stores the new data
  const updatedData = {
    title: data.title ?? existing.title,
    description: data.description ?? existing.description,
    cook_time_minutes: data.cook_time_minutes ?? existing.cook_time_minutes,
    difficulty: data.difficulty ?? existing.difficulty,
    rating: data.rating ?? existing.rating,
    cuisine_id: data.cuisine_id ?? existing.cuisine_id,
  };

  // replaces every field of the row with the updatead data (some information can/will remain the same) and returns to the controller
  // created timestamp remains the same
  const updated = await db.none(
    `UPDATE recipes SET
     title = $1,
     description = $2,
     cook_time_minutes = $3,
     difficulty = $4,
     rating = $5,
     cuisine_id = $6
   WHERE id = $7`,
    [
      updatedData.title,
      updatedData.description,
      updatedData.cook_time_minutes,
      updatedData.difficulty,
      updatedData.rating,
      updatedData.cuisine_id,
      id,
    ]
  );

  //fetches the new recipe by its id  and returns it
  const updatedRecipe = await getRecipeById(id);
  return updatedRecipe;
};

// deletes a recipe by id
// function returns true if at least one row was deleted.
// If no id matched that id - row count is 0
export const deleteRecipe = async (id: number): Promise<boolean> => {
  const result = await db.result("DELETE FROM recipes WHERE id = $1", [id]);
  return result.rowCount > 0;
};

// searches for recipes after name or description
export const searchRecipes = async (q: string): Promise<Recipe[]> => {
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
     WHERE r.title ILIKE $1
        OR r.description ILIKE $1
        OR c.name ILIKE $1`,
    [`%${q}%`]
  );
};
