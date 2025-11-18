import { Request, Response } from "express";
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
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cuisines = await getAllCuisines();
    res.status(200).json(cuisines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch cuisines: " + error });
  }
};

//get cuisine by id
export const getCuisineByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    console.log(id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid cuisine ID" });
      return;
    }

    const cuisine = await getCuisineById(id);
    if (!cuisine) {
      res.status(404).json({ error: "Cuisine not found" });
      return;
    }
    res.status(200).json(cuisine);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch cuisine" });
  }
};

export const getAllRecipesByCuisineController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid cuisine ID" });
      return;
    }
    const recipes = await getRecipesByCuisineId(id);
    console.log("eru hér uppskriftir góðan daginn? : ", recipes);
    if (!recipes) {
      res.status(404).json({ error: "Recipies not found" });
      return;
    }
    res.status(200).json(recipes);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};

// export const getAllRecipesByCuisineController = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const id = Number(req.params.id);
//   } catch (error: any) {}
// };

export const updateCuisineController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    // 400: bad id - don't hit DB
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid cuisine ID" });
      return;
    }

    const { name } = req.body as { name: string };

    if (!name || name.trim() === "") {
      res.status(400).json({ error: "Cuisine name is required" });
      return;
    }

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
    res.status(500).json({ error: "Failed to fetch cuisine" });
  }
};

//create a cuisine
export const createCuisineController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // At this point, Zod has already validated req.body
    const { name } = req.body;
    console.log("createcontrollername:", name);
    //fetches the created cuisine and displays it with 201
    const created = await createCuisine(name.trim());
    res.status(201).json(created);
  } catch (error: any) {
    // Handle duplicate name (Postgres unique constraint)
    if (error?.code === "23505") {
      res.status(400).json({
        error: "Cuisine already exists",
        message: `Cuisine with name '${req.body?.name}' already exists`,
      });
      return;
    }
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch cuisines",
    });
  }
};

export const deleteCuisineController = async (
  req: Request,
  res: Response
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
    res.status(500).json({ error: "Failed to delete cuisine" });
  }
};
