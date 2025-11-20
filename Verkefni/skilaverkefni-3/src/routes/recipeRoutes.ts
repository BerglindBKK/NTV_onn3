import express, { Request, Response, NextFunction } from "express";
import {
  getAllRecipesController,
  getRecipeByIdController,
  createRecipeController,
  updateRecipeController,
  deleteRecipeController,
  searchRecipesController,
} from "../controllers/recipeController.js";
import { validate } from "../middleware/validate.js";
import { recipeSchema } from "../schemas/recipeSchema.js";

const router = express.Router();

// Route handles both getAllRecipes and search
//checks for a search case and if query was given or empty
//if search query empty -  400 error
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const qRaw = req.query.q;

  if (typeof qRaw === "string") {
    const q = qRaw.trim();

    if (!q) {
      res.status(400).json({ error: "Search query is required" });
      return;
    }
    //if search query is ok - return serach results
    return searchRecipesController(req, res, next);
  }
  //if no search attempted - return all recipes
  return getAllRecipesController(req, res, next);
});

// router.get("/all", getAllRecipesController);
router.get("/:id", getRecipeByIdController);

//routes with body validated with schema
router.put("/:id", validate(recipeSchema), updateRecipeController);
router.post("/", validate(recipeSchema), createRecipeController);

router.delete("/:id", deleteRecipeController);

export default router;
