import express from "express";
import { db } from "./config/db.js";
import cuisineRoutes from "./routes/cuisineRoutes.js";
// import recipesRoutes from "./routes/recipesRoutes.js";
const app = express();

app.use(express.json());
app.use("/api/cuisines", cuisineRoutes);
// app.use("/api/recipes", recipesRoutes);

export default app;

// test route just to confirm everything works
// app.get("/", async (req, res) => {
//   const result = await db.one("SELECT current_database()");
//   res.json({ message: "API is running!", database: result.current_database });
// });
