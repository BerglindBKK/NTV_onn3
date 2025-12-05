import dotenv from "dotenv";
dotenv.config();

import express from "express";

import eventRoutes from "./routes/eventRoutes";
import venueRoutes from "./routes/venueRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import authRoutes from "./routes/authRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { authMiddleware } from "./middleware/authMiddleware";
console.log("Connected to database:", process.env.PGDATABASE);
const app = express();
app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", authMiddleware, bookingRoutes);

app.use(errorHandler);

export default app;
