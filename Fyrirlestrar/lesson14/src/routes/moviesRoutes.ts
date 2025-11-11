import express from 'express';
import { getMovies, createMovieController } from '../controllers/movieController.js';

const router = express.Router();

router.get('/', getMovies);
router.post('/', createMovieController)
export default router;
