import { db } from "../config/db";

export interface Venue {
  id: number;
  name: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export const getAllVenues = async (): Promise<Venue[]> => {
  // pg-promise returns rows directly
  const rows = await db.any<Venue>("SELECT * FROM venues ORDER BY name");
  console.log("Venues fetched from database:", rows);
  return rows;
};
