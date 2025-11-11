import pool from "../config/db.js";

export interface Movie {
  name: string;
  category_name: string;
  rating: number;
  launch_year: number;
}

export const createMovie = async (movie: Movie): Promise<Movie[]> => {
  try {
    const result = await pool.query(
      "INSERT INTO movies (category_name, name, rating, launch_year) VALUES",
      [movie.category_name, movie.name, movie.rating, movie.launch_year]
    );
    return result;
  } catch (e: any) {
    throw new Error(e as string);
  }
};

export const getAllMovies = async (): Promise<Movie[]> => {
  try {
    const result = await pool.query("SELECT* FROM movies");
    return result;
  } catch (e: any) {
    console.log(e.message);
    throw new Error(e as string);
  }
};

export const createActor = async (movie: Movie): Promise<Movie[]> => {
  try {
    const result = await pool.query(
      "INSERT INTO actor (category_name, name, rating, launch_year) VALUES",
      [movie.category_name, movie.name, movie.rating, movie.launch_year]
    );
    return result;
  } catch (e: any) {
    throw new Error(e as string);
  }
};
