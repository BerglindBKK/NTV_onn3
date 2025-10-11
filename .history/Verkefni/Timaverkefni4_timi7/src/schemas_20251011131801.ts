import * as z from 'zod';

export const taskSchema = z.object({
  task: zod.string().min(3).max(225),
});
