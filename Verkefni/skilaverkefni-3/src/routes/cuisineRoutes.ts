import express from "express";
import {
  getAllCuisinesController,
  getCuisineByIdController,
  createCuisineController,
  updateCuisineController,
  deleteCuisineController,
} from "../controllers/cuisineController.js";
import { validate } from "../middleware/validate.js";
import { cuisineSchema } from "../schemas/cuisineSchema.js";

const router = express.Router();

router.get("/", getAllCuisinesController);
router.get("/:id", getCuisineByIdController);
router.put("/:id", validate(cuisineSchema), updateCuisineController);
router.post("/", validate(cuisineSchema), createCuisineController);
router.delete("/:id", deleteCuisineController);
export default router;
