import { db } from "../config/db.js";

export interface Cuisine {
  id: number;
  name: string;
}

export const getAllCuisines = async (): Promise<Cuisine[]> => {
  // pg-promise returns rows directly
  const rows = await db.any<Cuisine>(
    "SELECT id, name FROM cuisines ORDER BY id"
  );
  console.log("Cuisines fetched from database:", rows);
  return rows;
};

export const getCuisineById = async (id: number): Promise<Cuisine | null> => {
  const cuisine = await db.oneOrNone(
    "SELECT id, name FROM cuisines WHERE id = $1",
    [id]
  );
  return cuisine;
};

export const updateCuisine = async (
  id: number,
  name: string
): Promise<Cuisine | null> => {
  // console.log("id:", id, "name:", name);
  const cuisine = await db.oneOrNone<Cuisine>(
    "UPDATE cuisines SET name = $1 WHERE id=$2 RETURNING id,name",
    [name, id]
  );
  // console.log("id:", id, "name:", name);
  return cuisine;
};

export const createCuisine = async (name: string): Promise<Cuisine> => {
  // returns exactly one row
  const row = await db.one(
    "INSERT INTO cuisines (name) VALUES ($1) RETURNING id, name",
    [name]
  );
  return row;
};

export const deleteCuisine = async (id: number): Promise<boolean> => {
  //deletes row
  const result = await db.result("DELETE FROM cuisines WHERE id = $1", [id]);
  //true if at least one was deleted. If no id matched that id - row count is 0
  return result.rowCount > 0;
};
