import db from "../config/db.js";

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export type UserTokenPayload = {
  sub: number;
};

export type CreateUser = Pick<User, "email" | "password_hash" | "name">;

export type UpdateUserInput = {
  id: number;
  name: string | null;
  email: string | null;
  password_hash: string | null;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await db.oneOrNone("SELECT * FROM users WHERE email = $1", [email]);
};

export const findUserById = async (id: number): Promise<User | null> => {
  return await db.oneOrNone("SELECT * FROM users WHERE id = $1", [id]);
};

export const createUser = async (user: CreateUser): Promise<User> => {
  return await db.one(
    "INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at, updated_at",
    [user.email, user.name, user.password_hash]
  );
};

//updates user information in database
export const updateUser = async (data: UpdateUserInput) => {
  const { id, name, email, password_hash } = data;
  return await db.one(
    `UPDATE users
    SET
      name = COALESCE($1, name),
      email = COALESCE($2, email),
      password_hash = COALESCE($3, password_hash),
      updated_at = NOW()
    WHERE id = $4
    RETURNING id, name, email, created_at, updated_at;
`,
    [name, email, password_hash, id]
  );
};

export const cancelAllBookingsAndDeleteUser = async (userId: number) => {
  return db.tx(async (t) => {
    //checks if booking exists. and gets corresponding user and event
    const bookingIds = await t.any<{
      id: number;
    }>(
      `SELECT b.id
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.user_id = $1
      AND e.event_date > NOW()`,
      [userId]
    );

    //loop through the bookings
    for (const b of bookingIds) {
      //finding ticket_id and quantity fir each booking
      const items = await t.any<{ ticket_id: number; quantity: number }>(
        `SELECT ticket_id, quantity FROM booking_items WHERE booking_id = $1`,
        [b.id]
      );

      //return tickets to stock
      for (const item of items) {
        await t.none(`UPDATE tickets SET stock = stock + $1 WHERE id = $2`, [
          item.quantity,
          item.ticket_id,
        ]);
      }

      // delete booking items and booking. Cascade will delete remaining bookings and booking items
      await t.none(`DELETE FROM booking_items WHERE booking_id = $1`, [b.id]);
      await t.none(`DELETE FROM bookings WHERE id = $1`, [b.id]);
    }
    const result = await t.result(`DELETE FROM users WHERE id = $1`, [userId]);
    if (result.rowCount === 0) throw new Error("User not found");

    return { ok: true };
  });
};
