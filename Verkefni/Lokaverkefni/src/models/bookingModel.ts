import db from "../config/db.js";

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

export const cancelBooking = async (bookingId: number, userId: number) => {
  return db.tx(async (t) => {
    //checks if booking exists. and gets corresponding user and event
    const booking = await t.oneOrNone<{
      user_id: number;
      event_id: number;
      event_date: string;
    }>(
      `SELECT b.user_id, b.event_id, e.event_date
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.id = $1`,
      [bookingId]
    );
    if (!booking) {
      throw new Error("Booking not found");
    }
    if (booking.user_id !== userId) {
      throw new Error("Forbidden");
    }

    //check if event date is less thatn 24 hours away
    const eventDate = new Date(booking.event_date).getTime();
    const now = Date.now();
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    if (eventDate - now < TWENTY_FOUR_HOURS) {
      throw new Error(
        "Cancellation not allowed: event less than 24 hours away"
      );
    }

    // get booking items
    const bookingItem = await t.one<{
      ticket_id: number;
      quantity: number;
      booking_items_id: number;
    }>(
      `SELECT ticket_id, quantity, id AS booking_items_id
      FROM booking_items 
      WHERE booking_id = $1`,
      [bookingId]
    );
    const bookingItemsId = bookingItem.booking_items_id;

    //restore ticket stock
    await t.none(
      `UPDATE tickets
      SET stock = stock + $1
      WHERE id = $2`,
      [bookingItem.quantity, bookingItem.ticket_id]
    );

    //delete booking item
    const bookingItemsDeleted = await t.result(
      `DELETE FROM booking_items
      WHERE id = $1`,
      [bookingItemsId]
    );
    //check if booking items is deleted
    if (bookingItemsDeleted.rowCount === 0) {
      throw new Error("Booking item not found");
    }

    //delete booking
    const bookingDeleted = await t.result(
      `DELETE FROM bookings
      WHERE id = $1`,
      [bookingId]
    );
    //check if booking is deleted
    if (bookingDeleted.rowCount === 0) {
      throw new Error("Booking not found");
    }
    return { ok: true };
  });
};
