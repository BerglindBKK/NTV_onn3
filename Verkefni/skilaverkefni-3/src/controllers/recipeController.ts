import { Request, Response } from "express";
import {
  createRecipe,
  getAllRecipes,
  deleteRecipe,
  getRecipeById,
  updateRecipe,
  searchRecipes,
} from "../models/recipeModel";

//get recipe by id
export const getRecipeByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid recipe ID" });
      return;
    }

    const recipe = await getRecipeById(id);
    if (!recipe) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }
    console.log(recipe);
    res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recipe: " + error });
  }
};

//get all recipes
export const getAllRecipesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const recipes = await getAllRecipes();
    console.log(recipes);
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recipes: " + error });
  }
};

//creates a new recipe
export const createRecipeController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    //fetches the created recipe and displays it with 201
    const created = await createRecipe(req.body);
    res.status(201).json(created);
  } catch (error: any) {
    // Handle duplicate name (Postgres unique constraint)
    if (error?.code === "23505") {
      res.status(400).json({
        error: "Recipe already exists",
        message: `Recipe with name '${req.body?.name}' already exists`,
      });
      return;
    }
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch recipes",
    });
  }
};

export const updateRecipeController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
    }
    const updated = await updateRecipe(id, req.body);
    console.log("halló, er búið að updata mig?!:", updated);
    if (!updated) {
      res.status(404).json({ error: "Recipe not found" });
    }

    res.status(200).json(updated);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Failed to update recipe" });
  }
};

export const deleteRecipeController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid recipe ID" });
      return;
    }
    //tries to delete via model
    const ok = await deleteRecipe(id);
    if (!ok) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete recipe" });
  }
};

//search for  recipes
export const searchRecipesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const q = req.query.q as string;
    //checks if query is empty
    if (!q || q.trim() == "") {
      res.status(400).json({ error: "Search query is required" });
      return;
    }

    //return found recipes wrapped in an array
    const recipes = await searchRecipes(q);
    console.log("SEARCH ROUTE HIT. q =", q);
    res.status(200).json({ recipes });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Failed to search recipes" });
  }
};
