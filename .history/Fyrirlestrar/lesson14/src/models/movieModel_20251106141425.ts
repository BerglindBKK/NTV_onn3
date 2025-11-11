import pool from '../config/db.js'

export interface Movie {
    name: string;
}

export const getAllMovies = async (): Promise<Movie[]> => {
  const result = await pool.query('SELECT *FROM movies');
  console.log('Movies fetched from database:', result);
  return result;
}

export const createMovie = async (name: string): Promise<Movie[]> => {
    const result = await pool.query(
        'INSERT INTO movies (name) VALUES ($1) RETURNING *', [name]
    );
    return result;
}