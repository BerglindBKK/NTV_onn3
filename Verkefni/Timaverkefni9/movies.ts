import { readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

export const filePathUrl = process.env.DB_FILE || './movies.json';

function createId() {
  return randomUUID();
}

export type MovieResponse = {
  id: string;
  title: string;
  done: boolean;
};

/**
 * Load movies from a file asynchronously and paginate them
 * @param filePath - The path to the file to load movies from
 * @param page - The page number to load
 * @param limit - The number of movies to load per page
 * @returns An array of movies
 */
export async function loadMoviesPaginatedAsync(
  filePath: string,
  page: number | undefined,
  limit: number | undefined
): Promise<MovieResponse[]> {
  try {
    const data = await readFile(filePath, 'utf8');
    const response = JSON.parse(data);

    if (!Array.isArray(response)) {
      throw new Error('Expected JSON array');
    }

    // If page or limit are undefined, return all tasks
    if (page === undefined || limit === undefined) {
      return response;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return response.slice(startIndex, endIndex);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('loadMoviesPaginatedAsync: ' + error.message);
    }
    throw new Error('loadMoviesAsyncPaginated: Unknown error');
  }
}

/**
 * Save movies to a file asynchronously
 * @param filePath - The path to the file to save movies to
 * @param movies - The movies to save
 */
export async function saveMoviesAsync(filePath: string, movies: MovieResponse[]): Promise<void> {
  try {
    await writeFile(filePath, JSON.stringify(movies, null, 2));
  } catch (e) {
    if (e instanceof Error) {
      throw new Error('saveMoviesAsync: ' + e.message);
    }
    throw new Error('saveMoviesAsync: Unknown error');
  }
}

/**
 * Add a movie to the file asynchronously
 * @param movie - The movie to add
 * @returns The added movie
 */
export async function addMoviesAsync(movie: string): Promise<MovieResponse> {
  try {
    const movies = await loadMoviesPaginatedAsync(filePathUrl, 1, 10);
    const newMovie = {
      id: createId(),
      title: movie,
      done: false,
    };
    movies.push(newMovie);
    await saveMoviesAsync(filePathUrl, movies);

    return newMovie;
  } catch (error: any) {
    throw new Error('addMoviesAsync: ' + error.message);
  }
}

/**
 * Mark a movie as done asynchronously
 * @param id - The id of the movie to mark as done
 * @param done - The status to mark the movie as
 * @returns True if the movie was marked as done, false otherwise
 */
export async function markMoviesDoneAsync(id: string, done = true): Promise<boolean> {
  try {
    const movies = await loadMoviesPaginatedAsync(filePathUrl, 1, 10);

    const movie = movies.find((movie) => movie.id === id);

    if (!movie) {
      throw new Error('Movie not found');
    }

    movie.done = done;

    await saveMoviesAsync(filePathUrl, movies);

    return true;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error('markMoviesDoneAsync: ' + e.message);
    }
    throw new Error('markMoviesDoneAsync: Unknown error');
  }
}

/**
 * Clear a movie from the file asynchronously
 * @param id - The id of the movie to clear
 * @returns True if the movie was cleared, false otherwise
 */
export async function clearMoviesAsync(id: string): Promise<boolean> {
  try {
    const movies = await loadMoviesPaginatedAsync(filePathUrl, 1, 10);
    const movie = movies.find((movie) => {
      return movie.id === id;
    });

    if (!movie) {
      throw new Error('Movie not found');
    }

    const newMovies = movies.filter((movie) => {
      return movie.id !== id;
    });

    await saveMoviesAsync(filePathUrl, newMovies);

    return true;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error('clearMoviesAsync: ' + e.message);
    }
    throw new Error('clearMoviesAsync: Unknown error');
  }
}
