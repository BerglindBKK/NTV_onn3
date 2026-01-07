import { Request, Response, NextFunction } from "express";
import { getBookingsByUser, createBooking } from "../models/bookingModel.js";

//get bookings for a specific user
export const getBookingsByUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    // middleware checks user's authorarization,
    // verifies JWT signatures and
    // extracts id from token and attaches userId to req.user
    // If user.id.id is missing, the user is not authenticated
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    // fetches ookings for user returns [] if no bookings
    const bookings = await getBookingsByUser(userId);

    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

//create a booking
export const createBookingController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("BODY:", req.body);
    const { event_id, ticket_id, quantity } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    //checks if all the inputs from user are integers
    //if not return error 400
    if (
      !Number.isInteger(event_id) ||
      !Number.isInteger(ticket_id) ||
      !Number.isInteger(quantity)
    ) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    //checks if quantity is a positive integer
    if (quantity < 1) {
      res.status(400).json({ error: "Quantity must be at least 1" });
      return;
    }
    // create booking
    const created = await createBooking({
      user_id: userId,
      event_id,
      ticket_id,
      quantity,
    });
    res.status(201).json(created);
  } catch (error: any) {
    const msg = error?.message;

    if (msg === "Event not found" || msg === "Ticket not found") {
      res.status(404).json({ error: msg });
      return;
    }

    if (
      msg === "Event is in the past" ||
      msg === "Not enough tickets available" ||
      msg === "Ticket does not belong to event"
    ) {
      res.status(409).json({ error: msg });

      return;
    }

    next(error);
  }
};
