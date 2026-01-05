import db from "../config/db.js";

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

export interface Filters {
  title?: string;
  category_id?: number;
  venue_id?: number;
  date_from?: string;
  date_to?: string;
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

export const getFilteredEvents = async (filters: Filters) => {
  // Stores SQL WHERE conditions dynamically
  const conditions: string[] = [];

  // Stores values for query ($1, $2, ...)
  const values: any[] = [];
  let index = 1;

  if (filters.title) {
    conditions.push(`title ILIKE $${index++}`);
    values.push(`%${filters.title}%`);
  }

  // filters for category
  if (filters.category_id) {
    conditions.push(`category_id = $${index++}`);
    values.push(filters.category_id);
  }

  // filters for venue
  if (filters.venue_id) {
    conditions.push(`venue_id = $${index++}`);
    values.push(filters.venue_id);
  }

  // filters for events starting on (inclusive) this date
  if (filters.date_from) {
    conditions.push(`event_date >= $${index++}`);
    values.push(filters.date_from);
  }

  // filters for events ending on (inclusive) this date
  if (filters.date_to) {
    conditions.push(`event_date <= $${index++}`);
    values.push(filters.date_to);
  }

  // Sorting

  // if the filter exists - builds where clause
  const whereLogic =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  // final query
  const query = `
    SELECT *
    FROM events
    ${whereLogic}
    ORDER BY event_date ASC
  `;

  return db.any(query, values);
};
