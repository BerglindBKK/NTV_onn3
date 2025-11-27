import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
app.use(express.json());

// Routes go here

// Error middleware
app.use(errorHandler);

export default app;
