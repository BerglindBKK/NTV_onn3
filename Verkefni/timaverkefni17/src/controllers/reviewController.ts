import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createReview, getReviewsByMovieId } from "../models/reviewModel.js";
import { UserTokenPayload } from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw Error("Missing JWT_SECRET in environment");
}

export const createReviewController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split("Bearer ")[1];
    if (!token) {
      res
        .status(400)
        .json({ error: "Aðgangur óheimill. Ekkert token fannst." });
      return;
    }

    const decodedToken = jwt.verify(
      token,
      JWT_SECRET
    ) as unknown as UserTokenPayload;

    const userId = decodedToken.sub;

    const { rating, comment } = req.body;
    const movieId = parseInt(req.params.movieId);

    // Validate movieId
    if (isNaN(movieId)) {
      res.status(400).json({ error: "Invalid movie ID" });
      return;
    }

    // Validate rating
    if (!rating || typeof rating !== "number") {
      res
        .status(400)
        .json({ error: "Rating is required and must be a number" });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: "Rating must be between 1 and 5" });
      return;
    }

    const newReview = await createReview({
      rating,
      comment,
      movie_id: movieId,
      user_id: userId,
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
  }
};

export const getReviewsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const movieId = parseInt(req.params.movieId);

    if (isNaN(movieId)) {
      res.status(400).json({ error: "Invalid movie ID" });
      return;
    }

    const reviews = await getReviewsByMovieId(movieId);
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};
