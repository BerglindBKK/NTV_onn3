import express from "express";
import { getAllCategoriesController } from "../controllers/categoryController";
// import { validate } from "../middleware/validate.js";
// import { cuisineSchema } from "../schemas/cuisineSchema.js";

const router = express.Router();

router.get("/", getAllCategoriesController);
export default router;
