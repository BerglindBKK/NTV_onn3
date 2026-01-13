import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  cancelAllBookingsAndDeleteUserController,
  updateUserProfileController,
} from "../controllers/userController.js";

const router = express.Router();

router.patch("/me", authMiddleware, updateUserProfileController);
router.delete("/me", authMiddleware, cancelAllBookingsAndDeleteUserController);
export default router;
