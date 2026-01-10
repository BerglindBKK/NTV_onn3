import db from "../config/db.js";

export interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  created_at: string;
  updated_at: string;
}

export interface EventAtVenue {
  id: number;
  title: string;
  event_date: string;
}

export const getAllVenues = async (): Promise<Venue[]> => {
  // pg-promise returns rows directly
  const rows = await db.any<Venue>("SELECT * FROM venues ORDER BY name");
  console.log("Venues fetched from database:", rows);
  return rows;
};

export const getVenueById = async (id: number): Promise<Venue | null> => {
  const row = await db.oneOrNone<Venue>("SELECT * FROM venues WHERE id = $1", [
    id,
  ]);
  return row;
};

export const getUpcomingEventsByVenueId = async (
  venueId: number
): Promise<EventAtVenue[]> => {
  const row = await db.any<{
    id: number;
    title: string;
    event_date: string;
  }>(
    `SELECT e.id, e.title, e.event_date 
    FROM events e
    JOIN venues v ON e.venue_id = v.id
    WHERE e.event_date > NOW() AND e.venue_id = $1`,
    [venueId]
  );

  return row;
};
