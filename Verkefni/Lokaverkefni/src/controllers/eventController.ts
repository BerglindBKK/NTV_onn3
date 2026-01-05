import { Request, Response, NextFunction } from "express";
import { getEventById, getFilteredEvents } from "../models/eventModel.js";

//get all events, filters optional
export const getFilteredEventsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filters = {
      title: req.query.title as string | undefined,
      category_id: req.query.category_id
        ? Number(req.query.category_id)
        : undefined,
      venue_id: req.query.venue_id ? Number(req.query.venue_id) : undefined,
      date_from: req.query.date_from as string | undefined,
      date_to: req.query.date_to as string | undefined,
      sort: req.query.sort as string | undefined,
    };

    const events = await getFilteredEvents(filters);
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

//get specific events
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
