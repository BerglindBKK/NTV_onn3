import dotenv from "dotenv";
dotenv.config();

import express from "express";

import eventRoutes from "./routes/eventRoutes";
import venueRoutes from "./routes/venueRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middleware/errorHandler";
console.log("Connected to database:", process.env.PGDATABASE);
const app = express();
app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;
