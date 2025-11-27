// src/config/db.ts
// pg-promise library: a wrapper around node-postgres
// dotenv: to load variables from .env file into process.env
import pgPromise from "pg-promise";
import dotenv from "dotenv";

//HReads your .env file once at startup and populates process.env (so PGHOST, PGUSER, etc. are available).
dotenv.config();

//Initializes pg-promise with optional settings ({} = defaults)
//pgp is a factory that also holds helpers (pgp.helpers, pgp.as, etc.)
const pgp = pgPromise({});

//Creates a Database instance configured from  env vars.
//Number(process.env.PGPORT) ensures the port is a number.
export const db = pgp({
  host: process.env.PGHOST || "",
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE || "",
  user: process.env.PGUSER || "",
  password: process.env.PGPASSWORD || "",
});
export default db;
