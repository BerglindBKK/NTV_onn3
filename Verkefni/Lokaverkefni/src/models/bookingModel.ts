import db from "../config/db.js";

// export interface Booking {
//   id: number;
//   user_id: number;
//   event_id: number;
//   created_at: string;
//   updated_at: string;
// }

export interface BookingInput {
  user_id: number;
  event_id: number;
  ticket_id: number;
  quantity: number;
}

export interface BookingHistoryRow {
  id: number;
  created_at: string;
  title: string;
  event_date: string;
  ticket_id: number;
  quantity: number;
  price: number;
  total_price: number;
}

// Gets Bookings for the requested user.
// Returns empty array if there are no bookings
export const getBookingsByUser = async (
  userId: number
): Promise<BookingHistoryRow[]> => {
  const rows = await db.any<BookingHistoryRow>(
    `SELECT b.id, b.created_at, e.title, e.event_date, bi.ticket_id, bi.quantity, t.price, (bi.quantity * t.price) AS total_price
     FROM bookings b
     JOIN events e ON e.id = b.event_id
     JOIN booking_items bi ON bi.booking_id = b.id
     JOIN tickets t ON t.id = bi.ticket_id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC, b.id DESC
    `,
    [userId]
  );
  console.log("Bookings fetched from database:", rows);
  return rows;
};

export const createBooking = async (data: BookingInput) => {
  const { user_id, event_id, ticket_id, quantity } = data;

  // creates the booking in multiple steps
  return db.tx(async (t) => {
    //checks if the event exists and if it is in the future
    const event = await t.oneOrNone<{ event_date: string }>(
      `SELECT event_date FROM events WHERE id=$1`,
      [event_id]
    );
    if (!event) throw new Error("Event not found");
    if (new Date(event.event_date) < new Date())
      throw new Error("Event is in the past");

    //checks if the event ticket exists and if it belongs to the correct event
    const ticket = await t.oneOrNone<{ event_id: number }>(
      `SELECT event_id FROM tickets WHERE id=$1`,
      [ticket_id]
    );
    if (!ticket) throw new Error("Ticket not found");
    if (ticket.event_id !== event_id)
      throw new Error("Ticket does not belong to event");

    //updates ticket and checks if there are tickets available
    const updated = await t.result(
      `UPDATE tickets
      SET stock = stock - $1
      WHERE id = $2 AND stock >= $1`,
      [quantity, ticket_id]
    );

    if (updated.rowCount === 0) {
      throw new Error("Not enough tickets available");
    }

    //creates booking header /inserts into bookings table
    const booking = await t.one<{ id: number; created_at: string }>(
      `INSERT INTO bookings (user_id, event_id)
      VALUES ($1, $2)
      RETURNING id, created_at`,
      [user_id, event_id]
    );

    // creates booking item / inserts into booking_tiems table
    await t.none(
      `INSERT INTO booking_items (booking_id, ticket_id, quantity)
    VALUES ($1, $2, $3)`,
      [booking.id, ticket_id, quantity]
    );

    //returns confirmation
    return {
      booking_id: booking.id,
      event_id,
      ticket_id,
      quantity,
      created_at: booking.created_at,
    };
  });
};
