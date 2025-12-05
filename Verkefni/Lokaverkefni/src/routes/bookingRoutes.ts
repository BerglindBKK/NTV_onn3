import express from "express";
import { getBookingsByUserController } from "../controllers/bookingController.js";

const router = express.Router();

router.get("/me", getBookingsByUserController);
export default router;
