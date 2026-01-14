import dotenv from "dotenv";

// use the test database when testing
if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config();
}

import pgPromise from "pg-promise";

const pgp = pgPromise();

const db = pgp({
  host: process.env.PGHOST!,
  port: Number(process.env.PGPORT!),
  database: process.env.PGDATABASE!,
  user: process.env.PGUSER!,
  password: process.env.PGPASSWORD,
});

export default db;
