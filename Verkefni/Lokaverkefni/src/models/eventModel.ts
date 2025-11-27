import { db } from "../config/db";

export interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  category_id: number;
  venue_id: number;
  created_at: string;
  updated_at: string;
}

export const getAllEvents = async (): Promise<Event[]> => {
  // pg-promise returns rows directly
  const rows = await db.any<Event>(
    "SELECT id, title, description, event_date, category_id,venue_id, created_at, updated_at FROM events ORDER BY title"
  );
  console.log("Events fetched from database:", rows);
  return rows;
};

export const getEventById = async (id: number): Promise<Event | null> => {
  const row = await db.oneOrNone<Event>("SELECT * FROM events WHERE id=$1", [
    id,
  ]);
  return row;
};
