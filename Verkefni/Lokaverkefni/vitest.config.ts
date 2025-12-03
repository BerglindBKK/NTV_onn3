import { defineConfig } from "vitest/config";
import dotenv from "dotenv";

// Force Vitest to load .env.test
dotenv.config({ path: ".env.test" });

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["./tests/setup.ts"],
    environmentOptions: {
      tsconfigFile: "tsconfig.test.json",
    },
  },
});
