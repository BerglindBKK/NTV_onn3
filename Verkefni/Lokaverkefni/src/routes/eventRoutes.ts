import express from "express";
import { getAllEventsController } from "../controllers/eventController";
// import { validate } from "../middleware/validate.js";
// import { cuisineSchema } from "../schemas/cuisineSchema.js";

const router = express.Router();

router.get("/", getAllEventsController);
export default router;
