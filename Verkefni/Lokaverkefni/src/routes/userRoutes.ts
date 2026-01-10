import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { updateUserProfileController } from "../controllers/userController.js";

const router = express.Router();

router.patch("/me", authMiddleware, updateUserProfileController);
export default router;
