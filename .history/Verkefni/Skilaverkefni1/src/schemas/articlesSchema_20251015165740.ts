import { z } from 'zod';

export const createArticlesSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  content: z.string().min(10),
  authorId: z.string().uuid('authorId must be a valid UUID'),
});

export const idParamSchema = z.object({
  id: z.string().uuid(),
});
