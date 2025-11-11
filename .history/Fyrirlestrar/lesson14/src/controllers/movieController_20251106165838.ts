import { Request, Response } from "express";
import { getAllMovies, createMovie } from "../models/movieModel.js";

export const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies = await getAllMovies();
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch movies: " + error });
  }
};

export const createMovieController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, done = false } = req.body;
    const response = await createMovie(name);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create movie: " + error });
  }
};
