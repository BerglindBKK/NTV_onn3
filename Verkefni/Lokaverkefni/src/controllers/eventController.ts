import { Request, Response, NextFunction } from "express";
import { getAllEvents, getEventById } from "../models/eventModel";

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

export const getEventByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    //checks if id is a number
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid event ID" });
      return;
    }

    const event = await getEventById(id);
    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
