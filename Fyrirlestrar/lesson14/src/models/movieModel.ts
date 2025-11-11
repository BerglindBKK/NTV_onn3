import db from "../config/db.js";

export interface Movie {
  id: string;
  name: string;
  done: boolean;
}

export const getAllMovies = async (): Promise<Movie[]> => {
  const movies = await db.manyOrNone<Movie>(
    "SELECT id, name, done FROM movies ORDER BY id"
  );
  return movies;
};

export const createMovie = async (
  name: string,
  done: boolean
): Promise<Movie> => {
  const movie = await db.one<Movie>(
    "INSERT INTO movies (name, done) VALUES ($1, $2) RETURNING id, name, done",
    [name, done]
  );
  return movie;
};
