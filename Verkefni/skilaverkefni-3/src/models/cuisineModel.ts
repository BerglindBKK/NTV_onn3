import pool from "../config/db.js";

export interface Cuisine {
  id: number;
  name: string;
}

export const getAllCuisines = async (): Promise<Cuisine[]> => {
  const result = await pool.query("SELECT *FROM cuisines");
  console.log("Cuisines fetched from database:", result);
  return result;
};

export const createCuisine = async (name: string): Promise<Cuisine[]> => {
  const result = await pool.query(
    "INSERT INTO cuisines (name) VALUES ($1) RETURNING *",
    [name]
  );
  return result;
};
