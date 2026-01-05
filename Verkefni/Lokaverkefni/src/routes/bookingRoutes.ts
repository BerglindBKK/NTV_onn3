import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getBookingsByUserController,
  createBookingController,
} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/me", authMiddleware, getBookingsByUserController);
router.post("/", authMiddleware, createBookingController);
export default router;
