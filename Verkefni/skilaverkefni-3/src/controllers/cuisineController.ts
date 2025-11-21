import { Request, Response, NextFunction } from "express";
import {
  createCuisine,
  getAllCuisines,
  deleteCuisine,
  getCuisineById,
  updateCuisine,
} from "../models/cuisineModel";
import { getRecipesByCuisineId } from "../models/recipeModel";

//get all cuisines
export const getAllCuisinesController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //teches all cuisines from the database
    const cuisines = await getAllCuisines();
    res.status(200).json(cuisines);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

//get cuisine by id
export const getCuisineByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    //checks if id is a number
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid cuisine ID" });
      return;
    }
    //fetches the cuisine by id
    const cuisine = await getCuisineById(id);
    //checks if cuisine exists
    if (!cuisine) {
      res.status(404).json({ error: "Cuisine not found" });
      return;
    }
    res.status(200).json(cuisine);
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};

//fetches all recipes for a specific cuisine id
export const getAllRecipesByCuisineController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    //checks if id is a number
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid cuisine ID" });
      return;
    }
    //fetches all recipes for this specific id
    const recipes = await getRecipesByCuisineId(id);

    const cuisineExists = await getCuisineById(id);
    if (!cuisineExists) {
      res.status(404).json({ error: "Cuisine not found" });
      return;
    }

    res.status(200).json(recipes);
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};

// updates a cusine for a specific id
export const updateCuisineController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    // checks if id is a number
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid cuisine ID" });
      return;
    }

    const { name } = req.body as { name: string };
    //checks if name is missing
    if (!name || name.trim() === "") {
      res.status(400).json({ error: "Cuisine name is required" });
      return;
    }
    //updates the cuisine
    const updated = await updateCuisine(id, name.trim());

    // 404 nothing updated - id not found
    if (!updated) {
      res.status(404).json({ error: "Cuisine not found" });
      return;
    }
    // 200 success
    res.status(200).json(updated);
  } catch (error: any) {
    if (error?.code === "23505") {
      res.status(400).json({
        error: "Cuisine already exists",
        message: `Cuisine with name '${req.body?.name}' already exists`,
      });
      return;
    }
    console.error(error);
    next(error);
  }
};

//create a cuisine
export const createCuisineController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // At this point, Zod has already validated req.body
    const { name } = req.body;
    console.log("createcontrollername:", name);
    //fetches the created cuisine
    const created = await createCuisine(name.trim());
    res.status(201).json(created);
  } catch (error: any) {
    // Checks if cuisine with this name already exists, if yes - error
    if (error?.code === "23505") {
      res.status(400).json({
        error: "Cuisine already exists",
        message: `Cuisine with name '${req.body?.name}' already exists`,
      });
      return;
    }
    console.error(error);
    next(error);
  }
};

//delete cuisine
export const deleteCuisineController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid cuisine ID" });
      return;
    }

    //tries to delete via model
    const ok = await deleteCuisine(id);

    if (!ok) {
      res.status(404).json({ error: "Cuisine not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    next(error);
  }
};
