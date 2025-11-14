import express from "express";
import { validate } from "../middleware/validate.js";
import { cuisineSchema } from "../schemas/cuisineSchema.js";
import {
  getAllCuisinesController,
  getCuisineByIdController,
  createCuisineController,
  updateCuisineController,
  deleteCuisineController,
} from "../controllers/cuisineController.js";

const router = express.Router();

router.get("/", getAllCuisinesController);
router.get("/:id", getCuisineByIdController);
router.put("/:id", updateCuisineController);
router.post("/", createCuisineController);
router.delete("/:id", deleteCuisineController);
export default router;
