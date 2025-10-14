import { z } from 'zod';

export const createAuthorSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Onvalid email format'),
  bio: z.string().optional(),
});

// export const idParamSchema = z.object({
//   id: z.string().uuid(),
// });

//   name: string, required, max 100 characters,
//   email: string, email,
//   bio: string, optional,
