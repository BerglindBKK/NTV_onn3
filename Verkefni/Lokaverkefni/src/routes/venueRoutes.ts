import express from "express";
import {
  getAllVenuesController,
  getVenueByIdController,
} from "../controllers/venueController.js";

const router = express.Router();

router.get("/", getAllVenuesController);
router.get("/:id", getVenueByIdController);
export default router;
