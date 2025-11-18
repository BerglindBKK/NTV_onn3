//src/app.ts
//core Express setup for the whole API
//It creates the app, adds middleware, attaches routes, and then exports it so the server can start it.

// tools to create an HTTP server, handle routes (GET, POST, etc.)
import express from "express";
//Imports the router that contains all the endpoints
import cuisineRoutes from "./routes/cuisineRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
//creates a new Express application instance
const app = express();

//adds middleware that automatically parses JSON request bodies (req.body)
app.use(express.json());

//GET /api/cuisines → goes to the getCuisines function
app.use("/api/cuisines", cuisineRoutes);
app.use("/api/recipes", recipeRoutes);

app.use(errorHandler);

export default app;
