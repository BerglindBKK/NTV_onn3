import express from "express";
import {
  getAllEventsController,
  getEventByIdController,
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getAllEventsController);
router.get("/:id", getEventByIdController);

export default router;
