import db from '../config/db.js';

export interface Movie {
  id?: number;
  title: string;
  release_year?: number;
  rating?: number;
  description?: string;
  created_at?: Date;
}

export const getAllMovies = async (): Promise<Movie[]> => {
  return await db.query('SELECT * FROM movies ORDER BY created_at DESC');
};

export const getMovieById = async (id: number): Promise<Movie | null> => {
  return await db.oneOrNone('SELECT * FROM movies WHERE id = $1', [id]);
};

export const createMovie = async (movie: Movie): Promise<Movie> => {
  return await db.one(
    'INSERT INTO movies (title, release_year, rating, description) VALUES ($1, $2, $3, $4) RETURNING *',
    [movie.title, movie.release_year, movie.rating, movie.description]
  );
};

export const updateMovie = async (id: number, movie: Partial<Movie>): Promise<Movie | null> => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  if (movie.title !== undefined) {
    fields.push(`title = $${paramCount++}`);
    values.push(movie.title);
  }
  if (movie.release_year !== undefined) {
    fields.push(`release_year = $${paramCount++}`);
    values.push(movie.release_year);
  }
  if (movie.rating !== undefined) {
    fields.push(`rating = $${paramCount++}`);
    values.push(movie.rating);
  }
  if (movie.description !== undefined) {
    fields.push(`description = $${paramCount++}`);
    values.push(movie.description);
  }

  if (fields.length === 0) {
    return null;
  }

  values.push(id);
  const query = `UPDATE movies SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;

  return await db.oneOrNone(query, values);
};

export const deleteMovie = async (id: number): Promise<Movie | null> => {
  return await db.oneOrNone('DELETE FROM movies WHERE id = $1 RETURNING *', [id]);
};
