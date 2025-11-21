import { z } from "zod";

export const cuisineSchema = z.object({
  name: z.string().min(1, "Cuisine name is required").max(255, "Name too long"),
});
