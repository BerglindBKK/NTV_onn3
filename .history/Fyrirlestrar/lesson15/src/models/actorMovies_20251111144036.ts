import pool from "../config/db.js";

export interface ActorMovie {
  movie_id: number;
  actor_id: number;
}

// Link actor ↔ movie
export const createActorMovie = async (link: ActorMovie) => {
  try {
    const result = await pool.query(
      "INSERT INTO movie_actors (movie_id, actor_id) VALUES ($1, $2) RETURNING *",
      [link.movie_id, link.actor_id]
    );
    return result;
  } catch (e: any) {
    throw new Error(e as string);
  }
};

// Get all movies for one actor
export const getActorMovies = async (actor_id: number) => {
  try {
    const result = await pool.query(
      `SELECT m.id, m.name, m.category_name, m.rating, m.launch_year
         FROM movies m
         JOIN movie_actors ma ON ma.movie_id = m.id
        WHERE ma.actor_id = $1`,
      [actor_id]
    );
    return result;
  } catch (e: any) {
    throw new Error(e as string);
  }
};
