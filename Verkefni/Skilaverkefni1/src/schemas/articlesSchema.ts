import { z } from 'zod';

export const createArticlesSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  content: z.string().min(10),
  authorId: z.string().optional(),
});

export const idParamSchema = z.object({
  id: z.string().uuid(),
});

//   title: string, required, max 100 characters,
//   content: string, min 10 characters,
//   authorId: number, must be a positive number,
