import { Request, Response, NextFunction } from "express";
import { getAllEvents } from "../models/eventModel";

//get all cuisines
export const getAllEventsController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //fetches all events from the database
    const events = await getAllEvents();
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
