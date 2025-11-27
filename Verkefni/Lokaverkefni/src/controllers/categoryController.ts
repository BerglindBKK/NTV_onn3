import { Request, Response, NextFunction } from "express";
import { getAllCategories } from "../models/categoryModel";

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
