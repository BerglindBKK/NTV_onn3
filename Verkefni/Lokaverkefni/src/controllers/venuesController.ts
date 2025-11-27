import { Request, Response, NextFunction } from "express";
import { getAllVenues, getVenueById } from "../models/venueModel";

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

export const getVenueByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    //checks if id is a number
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid venue ID" });
      return;
    }
    const venue = await getVenueById(id);
    res.status(200).json(venue);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
