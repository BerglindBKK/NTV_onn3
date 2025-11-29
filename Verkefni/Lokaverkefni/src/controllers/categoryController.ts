import { Request, Response, NextFunction } from "express";
import { getAllCategories, getCategoryById } from "../models/categoryModel.js";

//get all categories
export const getAllCategoriesController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //fetches all categories from the database
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getCategoryByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    //checks if id is a number
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid category ID" });
      return;
    }

    const category = await getCategoryById(id);
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
