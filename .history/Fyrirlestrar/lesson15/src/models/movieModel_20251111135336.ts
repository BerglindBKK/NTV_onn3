import pool from "../config/db.js";

export interface Movie {
  name: string;
  category_name: string;
  rating: number;
  launch_year: number;
}

export interface Actor {
  name: string;
  birth_year: number;
  nationality: string;
}

export interface AddActorMoviesRequest {
  movie_id: number;
  actor_id: number;
}

export interface GetActorMoviesRequest {
  actor_id: number;
}

export interface GetActorMoviesResponse {
  movie_name: string;
  movie_category: string;
  rating: number;
}

export const createMovie = async (movie: Movie): Promise<Movie[]> => {
  try {
    const result = await pool.query(
      "INSERT INTO movies (category_name, name, rating, launch_year) VALUES ($1, $2, $3, $4)",
      [movie.category_name, movie.name, movie.rating, movie.launch_year]
    );
    return result.rows;
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

export const createActor = async (actor: Actor): Promise<number> => {
  try {
    const result = await pool.query(
      "INSERT INTO actor (name, birth_year, nationality) VALUES ($1, $2, $3) RETURNING ID",
      [actor.name, actor.birth_year, actor.nationality]
    );
    return result;
  } catch (e: any) {
    throw new Error(e as string);
  }
};

export const AddActorMovies = async (
  movieActors: AddActorMoviesRequest
): Promise<void> => {
  try {
    const result = await pool.query(
      "INSERT INTO movie_actors (mocie_id, actor_id) VALUES ($1, $2)",
      [movieActors.movie_id, movieActors.actor_id]
    );
  } catch (e: any) {
    throw new Error(e as string);
  }
};

export const getActorMovies = async (
  actorMovies: GetActorMoviesRequest
): Promise<Movie[]> => {
  try {
    const result = await pool.query(
      `SELECT m.name, m.category FROM movies m
      LEFT JOIN movie_actors ma ON ma.movie_id = m.id
      WHERE ma.actor_id = $1;`,
      [actorMovies.actor_id]
    );
    return result;
  } catch (e: any) {
    throw new Error(e as string);
  }
};
