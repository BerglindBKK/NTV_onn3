import express from "express";
import { getAllVenuesController } from "../controllers/venuesController";
// import { validate } from "../middleware/validate.js";
// import { cuisineSchema } from "../schemas/cuisineSchema.js";

const router = express.Router();

router.get("/", getAllVenuesController);
export default router;
