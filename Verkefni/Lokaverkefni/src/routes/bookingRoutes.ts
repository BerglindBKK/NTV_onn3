import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getBookingsByUserController,
  createBookingController,
  cancelBookingController,
} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/me", authMiddleware, getBookingsByUserController);
router.post("/", authMiddleware, createBookingController);
router.delete("/:id", authMiddleware, cancelBookingController);
export default router;
