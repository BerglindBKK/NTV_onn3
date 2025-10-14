import { z } from 'zod';

export const createArticleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  content: z.string().email('Invalid email format'),
  authorId: z.string().optional(),
});

export const idParamSchema = z.object({
  id: z.string().uuid(),
});

//   title: string, required, max 100 characters,
//   content: string, min 10 characters,
//   authorId: number, must be a positive number,
