import pool from "../config/db.js";

export interface Movie {
  id: string;
  name: string;
  done: boolean;
}

export const getAllMovies = async (): Promise<Movie[]> => {
  const result = await pool.query("SELECT *FROM movies");
  console.log("Movies fetched from database:", result);
  return result.rows;
};

export const createMovie = async (
  name: string,
  done: boolean
): Promise<Movie[]> => {
  const result = await pool.query(
    "INSERT INTO movies (name) VALUES ($1) RETURNING *",
    [name, done]
  );
  return result.rows[0];
};
