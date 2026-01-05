import db from "../config/db.js";

export interface Booking {
  id: number;
  user_id: number;
  event_id: number;
  created_at: string;
  updated_at: string;
}

// gets Bookings for the requested user. 
// Returns empty array i f no bookings
export const getBookingsByUser = async (userId: number): Promise<Booking[]> => {
  const rows = await db.any<Booking>(
    "SELECT * from bookings WHERE user_id=$1",
    [userId]
  );
  console.log("Bookings fetched from database:", rows);
  return rows;
};
