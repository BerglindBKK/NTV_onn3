import express from "express";
import {
  getMovies,
  getMovie,
  createMovieController,
  updateMovieController,
  deleteMovieController,
} from "../controllers/movieController.js";
import {
  createReviewController,
  getReviewsController,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/:movieId/reviews", createReviewController);
router.get("/:movieId/reviews", getReviewsController);

router.get("/", getMovies);
// router.get("/:id", getMovie);
router.post("/", createMovieController);
router.put("/:id", updateMovieController);
router.delete("/:id", deleteMovieController);

export default router;
