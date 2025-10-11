import fs from 'node:fs';
import fsPromise from 'node:fs/promises';
import chalk from 'chalk';
import { randomUUID } from 'node:crypto';

const filePath = './movies.json';

function createId() {
  return randomUUID();
}

export type Movie = {
  id: string;
  title: string;
  year: number;
  watched: boolean;
};

export async function loadMoviesAsync(): Promise<Movie[]> {
  try {
    const data = await fsPromise.readFile(filePath, 'utf8');
    const response = JSON.parse(data);
    console.log(typeof JSON.parse(data));
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function loadMoviesAsyncPaginated(
  page: number,
  limit: number
): Promise<Movie[]> {
  try {
    const data = await fsPromise.readFile(filePath, 'utf8');
    const response = JSON.parse(data);

    if (!Array.isArray(response)) {
      throw new Error('Expected JSON array');
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return response.slice(startIndex, endIndex);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export function saveMovies(movies: Movie[]) {
  fs.writeFileSync(filePath, JSON.stringify(movies, null, 2));
}

export async function addMovie(title: string, year: number) {
  const movies = await loadMoviesAsync();

  const newMovie = {
    id: createId(),
    title,
    year,
    watched: false,
  };
  movies.push(newMovie);
  saveMovies(movies);
  return newMovie;
}

export async function deleteMovie(id: string) {
  const movies = await loadMoviesAsync();

  const movie = movies.find((movie) => {
    return movie.id === id;
  });

  if (!movie) {
    return;
  }

  const newMovies = movies.filter((movie) => {
    return movie.id !== id;
  });
  saveMovies(newMovies);
}

export async function markedAsWatched(
  id: string,
  watched = true
): Promise<boolean> {
  const movies = await loadMoviesAsync();
  const movie = movies.find((movie) => {
    return movie.id === id;
  });

  if (!movie) {
    return false;
  }

  movie.watched = watched;
  saveMovies(movies);
  return true;
}
