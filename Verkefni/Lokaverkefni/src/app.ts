import express from "express";
import dotenv from "dotenv";
import eventRoutes from "./routes/eventRoutes";
import venueRoutes from "./routes/venueRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/categories", categoryRoutes);

// Error middleware
app.use(errorHandler);

export default app;
