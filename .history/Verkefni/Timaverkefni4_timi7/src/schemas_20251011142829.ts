// import * as z from 'zod';

// export const movieSchema = z.object({
//   movie: z.string().min(3).max(225),
// });

// export const getMoviesSchema = z.object({
//   page: z.number().min(1),
//   limit: z.number().min(1),
// });

// export const getMoviesByIdSchema = z.object({
//   id: z.string().uuid(),
// });

import * as z from 'zod';

export const AddMovieRequest = z.object({
  movie: z.string().min(3).max(255),
});

export const MoviesQuery = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).optional(),
});

const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const UUIDParams = z.object({
  id: z
    .string()
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      'Invalid UUID format'
    ),
});

export const PatchMovies = z.object({
  done: z.boolean(),
});
