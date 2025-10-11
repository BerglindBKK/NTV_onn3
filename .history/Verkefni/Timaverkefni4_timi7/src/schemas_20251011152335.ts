import * as z from 'zod';

export const movieSchema = z.object({
  //   movie: z.string().min(3).max(225),
  title: z.string().min(1).max(225),
  year: z.coerce.number().int(),
});

export const getMoviesSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1),
});

export const getMoviesByIdSchema = z.object({
  id: z.string().uuid(),
});
