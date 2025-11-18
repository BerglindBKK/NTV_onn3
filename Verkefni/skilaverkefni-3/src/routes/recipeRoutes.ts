import express from "express";
import {
  getAllRecipesController,
  getRecipeByIdController,
  createRecipeController,
  //   updateRecipeController,
  deleteRecipeController,
} from "../controllers/recipeController.js";
import { validate } from "../middleware/validate.js";
import { recipeSchema } from "../schemas/recipeSchema.js";

const router = express.Router();

router.get("/", getAllRecipesController);
router.get("/:id", getRecipeByIdController);
// router.put("/:id", updateRecipeController);
// router.post("/", createRecipeController);
router.post("/", validate(recipeSchema), createRecipeController);
router.delete("/:id", deleteRecipeController);
export default router;
