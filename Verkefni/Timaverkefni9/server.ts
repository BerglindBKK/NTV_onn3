import express, { NextFunction } from 'express';
import { errorHandler, validate, validateParams, validateQuery } from './middleware.js';
import { UUIDParams, AddMovieRequest, PatchMovies, MoviesQuery } from './schemas.js';
import {
  addMoviesAsync,
  clearMoviesAsync,
  filePathUrl,
  loadMoviesPaginatedAsync,
  markMoviesDoneAsync,
  MovieResponse,
} from './movies.js';
import dotenv from 'dotenv';

dotenv.config();

export const app = express();
const port = 3009;

app.use(express.json());

app.use((request, response, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} ${request.method} ${request.originalUrl}`);
  if (request.method === 'POST' || request.method === 'PATCH') {
    console.log(request.body);
  }

  next();
});

/**
 * Delete a movie
 * @route DELETE /movies/:id
 * @param id - The id of the movie to delete
 * @returns 204 if the movie was deleted successfully
 * @returns 404 if the movie was not found
 * @returns 500 if there was an error
 */
app.delete(
  '/movies/:id',
  validateParams(UUIDParams),
  async (request, response, next: NextFunction) => {
    const { id } = request.params;

    const movies = await loadMoviesPaginatedAsync(filePathUrl, 1, 10);
    const movie = movies.find((movie: MovieResponse) => {
      return movie.id === id;
    });

    if (!movie) {
      response.status(404).json({ success: false, error: 'Movie not found' });
      return;
    }

    try {
      const success = await clearMoviesAsync(movie.id);
      if (!success) {
        response.status(404).json({ success: false, error: 'Movie not found' });
        return;
      }
      response.status(204).send({ success: true, message: 'Movie deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Update a movie
 * @route PATCH /movies/:id
 * @param id - The id of the movie to update
 * @returns 204 if the movie was updated successfully
 * @returns 404 if the movie was not found
 * @returns 500 if there was an error
 */
app.patch(
  '/movies/:id',
  validateParams(UUIDParams),
  validate(PatchMovies),
  async (request, response, next: NextFunction) => {
    const { id } = request.params;
    const { done } = request.body;

    try {
      const success = await markMoviesDoneAsync(id, done);
      if (!success) {
        response.status(404).json({ success: false, error: 'Movie not found' });
        return;
      }
      response.status(204).send({ success: true, message: 'Movie updated successfully' });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get a movie
 * @route GET /movies/:id
 * @param id - The id of the movie to get
 * @returns 200 - MovieResponse if the movie was found
 * @returns 404 if the movie was not found
 * @returns 500 if there was an error
 */
app.get(
  '/movies/:id',
  validateParams(UUIDParams),
  async (request, response, next: NextFunction) => {
    const { id } = request.params;

    const movies = await loadMoviesPaginatedAsync(filePathUrl, 1, 10);
    const movie = movies.find((movie: MovieResponse) => {
      return movie.id === id;
    });

    if (!movie) {
      response.status(404).json({ success: false, error: 'Movie not found' });
      return;
    }

    response.status(200).json({ success: true, data: movie });
  }
);

/**
 * Get all movies
 * @route GET /movies
 * @param page - The page number to get
 * @param limit - The number of movies to get per page
 * @returns 200 - MovieResponse[] if the movies were found
 * @returns 500 if there was an error
 */
app.get('/movies', validateQuery(MoviesQuery), async (request, response, next: NextFunction) => {
  const { page, limit } = request.query as { page?: number; limit?: number };

  try {
    const movies = await loadMoviesPaginatedAsync(filePathUrl, page, limit);
    response.status(200).json({
      success: true,
      data: movies,
      pagination: { page, limit },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Create a movie
 * @route POST /movies
 * @param movie - The movie to create
 * @returns 201 - MovieResponse if the movie was created
 * @returns 500 if there was an error
 */
app.post('/movies', validate(AddMovieRequest), async (request, response, next: NextFunction) => {
  try {
    const { movie } = request.body;
    const createdMovie = await addMoviesAsync(movie);

    response.status(201).json({ success: true, data: createdMovie });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is using database: ${filePathUrl}`);
    console.log(`Server is running on http://localhost:${port}`);
  });
}
