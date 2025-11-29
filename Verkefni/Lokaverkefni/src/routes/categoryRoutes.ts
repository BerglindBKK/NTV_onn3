import express from "express";
import {
  getAllCategoriesController,
  getCategoryByIdController,
} from "../controllers/categoryController.js";
// import { validate } from "../middleware/validate.js";
// import { cuisineSchema } from "../schemas/cuisineSchema.js";

const router = express.Router();

router.get("/", getAllCategoriesController);
router.get("/:id", getCategoryByIdController);
export default router;
