import express from "express";
import dotenv from "dotenv";
import eventRoutes from "./routes/eventRoutes";
import venueRoutes from "./routes/venueRoutes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/venues", venueRoutes);

// Error middleware
app.use(errorHandler);

export default app;
