import { beforeAll, afterAll } from "vitest";
import db from "../src/config/db";
import fs from "fs";
import path from "path";

// Reset DB before tests if needed:
beforeAll(async () => {
  // await db.none(`
  //   TRUNCATE
  //     booking_items,
  //     bookings,
  //     tickets,
  //     events,
  //     venues,
  //     categories,
  //     users
  //   RESTART IDENTITY CASCADE;
  // `);

  const seedPath = path.resolve(__dirname, "../src/sql/seed.sql");
  const seedSQL = fs.readFileSync(seedPath, "utf8");
  console.log("Using seed file:", seedPath);
  await db.none(seedSQL);
});

// // Load seed.sql
// const seedSQL = fs.readFileSync("src/sql/seed.sql").toString();
// await db.none(seedSQL);

// closes pg-promise connection
afterAll(async () => {
  await db.$pool.end();
});
