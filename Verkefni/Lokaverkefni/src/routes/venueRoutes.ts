import express from "express";
import {
  getAllVenuesController,
  getVenueByIdController,
} from "../controllers/venueController.js";
// import { validate } from "../middleware/validate.js";
// import { cuisineSchema } from "../schemas/cuisineSchema.js";

const router = express.Router();

router.get("/", getAllVenuesController);
router.get("/:id", getVenueByIdController);
export default router;
