import { Request, Response, NextFunction } from "express";
import {
  createRecipe,
  getAllRecipes,
  deleteRecipe,
  getRecipeById,
  updateRecipe,
  searchRecipes,
} from "../models/recipeModel";
import { getCuisineById } from "../models/cuisineModel";

// Fetches recipe for a specific id
export const getRecipeByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    //checks if id is a number, if not - throws an error
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid recipe ID" });
      return;
    }

    // fetches athe recipe for the id from the database
    const recipe = await getRecipeById(id);
    // checks if this recipe exist in the database
    if (!recipe) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }
    res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

//vfetches all recipes
export const getAllRecipesController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // fetches all recipes from database - returns an empty array if database is empty
    const recipes = await getAllRecipes();
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

//creates a new recipe
export const createRecipeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //fetches the created recipe
    const cuisineId = Number(req.body.cuisine_id);
    console.log("CuisineId: ", cuisineId);
    const cuisineExists = await getCuisineById(cuisineId);
    if (!cuisineExists) {
      res.status(404).json({ error: "Cuisine not found" });
      return;
    }
    const created = await createRecipe(req.body);
    res.status(201).json(created);
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};

// Updates a recipe
export const updateRecipeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // gets the id from user and checks if it is a number
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid recipe ID" });
      return;
    }
    //fetches the updated recipe after passing in the body from user
    const updated = await updateRecipe(id, req.body);
    // if recipe not found - error
    if (!updated) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }
    res.status(200).json(updated);
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};

// deletes a recipe by id
export const deleteRecipeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    //checks if the id is a number
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid recipe ID" });
      return;
    }
    //tries to delete from the database - if recipe is not found - error
    const ok = await deleteRecipe(id);
    if (!ok) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

//search for  recipes
export const searchRecipesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const q = req.query.q as string;
    //return found recipes wrapped in an array
    const recipes = await searchRecipes(q);
    res.status(200).json({ recipes });
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};
