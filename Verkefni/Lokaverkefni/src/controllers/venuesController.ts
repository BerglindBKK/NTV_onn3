import { Request, Response, NextFunction } from "express";
import { getAllVenues } from "../models/venueModel";

//get all venues
export const getAllVenuesController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //fetches all venues from the database
    const venues = await getAllVenues();
    res.status(200).json(venues);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
