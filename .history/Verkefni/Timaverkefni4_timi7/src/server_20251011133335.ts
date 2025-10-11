import express, { NextFunction } from 'express';
import * as z from 'zod';
import { movieSchema, getMoviesSchema } from './schemas.js';
import {
  addMovie,
  loadMoviesAsync,
  loadMoviesAsyncPaginated,
  deleteMovie,
  markedAsWatched,
} from './movies.js';
import { errorHandler } from './middleware.js';
// import { zod } from 'zod';

const app = express();
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

app.post('/movies', async (request, response, next: NextFunction) => {
  request.body.movie;
  const { title } = request.body as { title: string };
  const { year } = request.body as { year: number };
  try {
    const validatedMovie = movieSchema.parse(request.body);
    console.log('validatedMovie', validatedMovie.movie);
    const createdMovie = await addMovie(title, year);
    response.status(201).json(createdMovie);
  } catch (error) {
    if (error instanceof zod.ZodError) {
      console.log('error.issues', error.issues);
      next(error.issues);
    }
    next(error);
    return;
  }
});

app.get('/movies', async (res, response) => {
  const { page, limit } = res.query;
  console.log(limit);
  const pageNum = parseInt(page as string);
  const sizeNum = parseInt(limit as string);
  const movies = await loadMoviesAsyncPaginated(pageNum, sizeNum);
  console.log(sizeNum);

  if (movies.length < sizeNum) {
    response.status(200).json({
      movies,
      isLastPage: true,
    });
  }
  response.status(200).json(movies);
});

app.get('/movies/:id', async (request, response) => {
  const { id } = request.params as { id: string };
  const movies = await loadMoviesAsync();

  const movie = movies.find((movie) => {
    return movie.id === id;
  });

  if (!movie) {
    response.status(404).send('not found');
    return;
  }
  response.status(200).json(movie);
});

app.delete('/movies/:id', async (request, response) => {
  const { id } = request.params as { id: string };
  const movies = await loadMoviesAsync();
  const movie = movies.find((movie) => {
    return movie.id === id;
  });

  if (!movie) {
    response.status(404).send('not found');
    return;
  }

  deleteMovie(movie.id);
  response.status(204).send('No content');
});

app.patch('/movies/:id', async (request, response, next: NextFunction) => {
  const { id } = request.params as { id: string };
  const { watched } = request.body as { watched: boolean };
  const movies = await loadMoviesAsync();
  const movie = movies.find((movie) => {
    return movie.id === id;
  });

  // if (!movie) {
  //   response.status(404).send('not found');
  //   return;
  // }

  try {
    await markedAsWatched(id, watched);
    throw new Error('markedAsWatched unsuccessful');
  } catch (error) {
    next(error);
    return;
  }

  //await markTaskDone(id, done)
  response.status(200).json(movie);
});

app.use(errorHandler);

app.listen(port, () => {
  console.log('ok');
});
