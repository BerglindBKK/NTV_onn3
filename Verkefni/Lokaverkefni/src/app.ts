import express from "express";
import dotenv from "dotenv";
import eventRoutes from "./routes/eventRoutes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/events", eventRoutes);

// Error middleware
app.use(errorHandler);

export default app;
