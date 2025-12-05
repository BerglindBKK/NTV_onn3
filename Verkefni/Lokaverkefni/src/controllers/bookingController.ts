import { Request, Response, NextFunction } from "express";
import { getBookingsByUser } from "../models/bookingModel.js";

//get bookings for a specific user
export const getBookingsByUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    //middleware checks user's authorarization,
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
