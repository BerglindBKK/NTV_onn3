import pgPromise from "pg-promise";
import dotenv from "dotenv";

dotenv.config();

const pgp = pgPromise({});

const db = pgp({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  user: process.env.PGUSER,
});

db.connect()
  .then((obj) => {
    console.log("✅ Connected to PostgreSQL with pg-promise");
    obj.done();
  })
  .catch((error) => {
    console.error("❌ Database connection error:", error.message);
  });

export default db;
