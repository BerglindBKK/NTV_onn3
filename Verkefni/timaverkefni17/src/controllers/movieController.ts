import { Request, Response } from 'express';
import { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie } from '../models/movieModel.js';

export const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies = await getAllMovies();
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
};

export const getMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid movie ID' });
      return;
    }

    const movie = await getMovieById(id);
    if (!movie) {
      res.status(404).json({ error: 'Movie not found' });
      return;
    }

    res.json(movie);
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
};

export const createMovieController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, release_year, rating, description } = req.body;

    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const newMovie = await createMovie({
      title,
      release_year,
      rating,
      description,
    });

    res.status(201).json(newMovie);
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ error: 'Failed to create movie' });
  }
};

export const updateMovieController = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid movie ID' });
      return;
    }

    const { title, release_year, rating, description } = req.body;
    const updatedMovie = await updateMovie(id, {
      title,
      release_year,
      rating,
      description,
    });

    if (!updatedMovie) {
      res.status(404).json({ error: 'Movie not found' });
      return;
    }

    res.json(updatedMovie);
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ error: 'Failed to update movie' });
  }
};

export const deleteMovieController = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid movie ID' });
      return;
    }

    const deletedMovie = await deleteMovie(id);
    if (!deletedMovie) {
      res.status(404).json({ error: 'Movie not found' });
      return;
    }

    res.json({ message: 'Movie deleted successfully', movie: deletedMovie });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ error: 'Failed to delete movie' });
  }
};
