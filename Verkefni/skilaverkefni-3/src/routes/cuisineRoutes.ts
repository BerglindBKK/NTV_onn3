import express from "express";
import { validate } from "../middleware/validate.js";
import { cuisineSchema } from "../schemas/cuisineSchema.js";
import {
  getAllCuisinesController,
  createCuisineController,
  deleteCuisineController,
} from "../controllers/cuisineController.js";

const router = express.Router();

router.get("/", getAllCuisinesController);
router.post("/", validate(cuisineSchema), createCuisineController);
router.delete("/:id", deleteCuisineController);
export default router;
