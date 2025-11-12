import express from "express";
import {
  getCuisines,
  createCuisineController,
} from "../controllers/cuisineController.js";

const router = express.Router();

router.get("/", getCuisines);
router.post("/", createCuisineController);
export default router;
