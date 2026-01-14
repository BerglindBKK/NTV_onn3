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
  city?: string;
  date_from?: string;
  date_to?: string;
  sort?: "date" | "price" | "popularity";
}

export const getAllEvents = async (): Promise<Event[]> => {
  // pg-promise returns rows directly
  const rows = await db.any<Event>(
    "SELECT id, title, description, event_date, category_id,venue_id, created_at, updated_at FROM events ORDER BY title"
  );
  return rows;
};

export const getEventById = async (event_id: number) => {
  const event = await db.oneOrNone<Event>(
    `SELECT * FROM events WHERE id = $1`,
    [event_id]
  );
  if (!event) return null;

  const tickets = await db.any(
    `SELECT id, price, stock
    FROM tickets
    WHERE event_id = $1
    ORDER BY price ASC
    `,
    [event_id]
  );
  return { ...event, tickets };
};

export const getFilteredEvents = async (filters: Filters) => {
  // Stores SQL WHERE conditions dynamically
  const conditions: string[] = [];

  // Stores values for query ($1, $2, ...)
  const values: any[] = [];
  let index = 1;

  if (filters.title) {
    conditions.push(`e.title ILIKE $${index++}`);
    values.push(`%${filters.title}%`);
  }

  // filters for category
  if (filters.category_id) {
    conditions.push(`e.category_id = $${index++}`);
    values.push(filters.category_id);
  }

  // filters for venue
  if (filters.venue_id) {
    conditions.push(`e.venue_id = $${index++}`);
    values.push(filters.venue_id);
  }

  //filters for city, searchable
  if (filters.city) {
    conditions.push(`v.city ILIKE $${index++}`);
    values.push(`%filters.city%`);
  }
  // filters for events starting on (inclusive) this date
  if (filters.date_from) {
    conditions.push(`e.event_date >= $${index++}`);
    values.push(filters.date_from);
  }

  // filters for events ending on (inclusive) this date
  if (filters.date_to) {
    conditions.push(`e.event_date <= $${index++}`);
    values.push(filters.date_to);
  }
  //upcoming events only
  conditions.push(`e.event_date > NOW()`);

  const whereLogic = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  // Sorting
  let orderBy = "e.event_date ASC"; // default

  if (filters.sort === "date") {
    orderBy = "e.event_date ASC";
  }

  if (filters.sort === "price") {
    orderBy = "MIN(t.price) ASC";
  }

  if (filters.sort === "popularity") {
    orderBy = "COUNT(bi.id) DESC";
  }

  // final query
  const query = `
    SELECT e.*,
    MIN(t.price) AS min_price,
    COUNT(bi.id) AS popularity
    FROM events e
    JOIN venues v ON v.id = e.venue_id
    LEFT JOIN tickets t ON t.event_id = e.id
    LEFT JOIN bookings b ON b.event_id = e.id
    LEFT JOIN booking_items bi ON bi.booking_id = b.id
    ${whereLogic}
    GROUP BY e.id
    ORDER BY ${orderBy}
  `;

  return db.any(query, values);
};
