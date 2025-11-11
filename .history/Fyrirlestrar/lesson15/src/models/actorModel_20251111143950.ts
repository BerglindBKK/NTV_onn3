import pool from "../config/db.js";

export interface Actor {
  name: string;
  birth_year: number;
  nationality: string;
}

// Create a new actor
export const createActor = async (actor: Actor): Promise<Actor[]> => {
  try {
    const result = await pool.query(
      "INSERT INTO actors (name, birth_year, nationality) VALUES ($1, $2, $3) RETURNING *",
      [actor.name, actor.birth_year, actor.nationality]
    );
    return result;
  } catch (e: any) {
    throw new Error(e as string);
  }
};

// Get one actor by id
export const getActor = async (id: number): Promise<Actor[]> => {
  try {
    const result = await pool.query("SELECT * FROM actors WHERE id = $1", [id]);
    return result;
  } catch (e: any) {
    throw new Error(e as string);
  }
};
