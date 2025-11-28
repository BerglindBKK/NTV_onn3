import { beforeAll, afterAll } from "vitest";
import { db } from "../src/config/db";

// Reset DB before tests if needed:
beforeAll(async () => {
  // OPTIONAL: clean tables here
});

afterAll(async () => {
  await db.$pool.end(); // closes pg-promise connection
});
