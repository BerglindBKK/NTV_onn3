import { Request, Response } from "express";
import { createCuisine, getAllCuisines } from "../models/cuisineModel";
// import { getAllMovies, createMovie } from '../models/movieModel.js';

export const getCuisines = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cuisines = await getAllCuisines();
    res.json(cuisines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch cuisines: " + error });
  }
};

export const createCuisineController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body;
    const response = await createCuisine(name);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create cuisine: " + error });
  }
};
