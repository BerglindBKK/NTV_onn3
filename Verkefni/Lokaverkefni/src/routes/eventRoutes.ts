import express from "express";
import {
  getFilteredEventsController,
  getEventByIdController,
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getFilteredEventsController);
router.get("/:id", getEventByIdController);

export default router;
