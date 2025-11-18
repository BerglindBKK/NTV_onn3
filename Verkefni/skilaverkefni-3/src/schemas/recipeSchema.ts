import { z } from "zod";

export const recipeSchema = z.object({
  title: z
    .string("Title is required")
    .min(1, "Title is required")
    .max(255, "Title too long"),

  description: z
    .string()
    .max(5000, "Description too long")
    .optional()
    .nullable(),

  cook_time_minutes: z
    .number("Cook time must be a positive number")
    .int("Cook time must be an integer")
    .positive("Cook time must be positive")
    .optional(),

  difficulty: z.string().max(50, "Difficulty too long").optional().nullable(),

  rating: z
    .number()
    .min(0, "Rating must be between 0 and 5")
    .max(5, "Rating must be between 0 and 5")
    .optional(),

  cuisine_id: z
    .number("Cusine_id is required")
    .int("Cuisine ID must be an integer"),
});

export type RecipeInput = z.infer<typeof recipeSchema>;
