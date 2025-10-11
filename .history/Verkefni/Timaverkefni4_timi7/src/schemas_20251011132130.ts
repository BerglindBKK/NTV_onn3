import * as z from 'zod';

export const taskSchema = z.object({
  task: z.string().min(3).max(225),
});

export const getMoviesSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1),
});
