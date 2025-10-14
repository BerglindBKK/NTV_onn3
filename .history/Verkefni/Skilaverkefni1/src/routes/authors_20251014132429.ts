import express, { Request, Response, NextFunction } from 'express';
// import fs from 'fs/promises';
// import path from 'path';
// import { fileURLToPath } from 'url';
import { validate } from '../middleware/validate.js';
import {
  Author,
  addAuthor,
  loadAuthors,
  clearAuthor,
} from '../service/authorsService.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const authorsFilePath = path.join(__dirname, '../data/authors.json');
const router = express.Router();

/**
 * Get all authors
 * @route GET /api/authors
 * @returns 200 - Authors[] if the authors were found
 * @returns 500 if there was an error (via global error handler)
 */
router.get('/', async (req, res, next: NextFunction) => {
  try {
    //loads authors from file storage
    const authors = await loadAuthors();
    // always returns an array but possibly empty -> no need for error if empty
    res.status(200).json({
      success: true,
      data: authors,
    });
  } catch (err) {
    //pass errors to error handler
    next(err);
  }
});

/**
 * Get all authors
 * @route GET /api/authors/:id
 * @desc Returns an author by id
 * @returns 200 - author if the author is found
 * @returns 404 if author is nor found
 */
router.get('/:id', async (req, res, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const authors = await loadAuthors();

    //loads all authors and finds the author matching the id
    const author = authors.find((author: Author) => {
      return author.id === id;
    });

    //returns 404 if the author is not found
    if (!author)
      return res
        .status(404)
        .json({ success: false, error: 'Author not found' });

    //if author is found - returns the matching author
    return res.status(200).json({ success: true, data: author });
  } catch (err) {
    next(err);
  }
});

/**
 * Get all movies
 * @route GET /api/authors/:id
 * @desc Returns an author by id
 * @returns 200 - author if the author is found
 * @returns 404 if author is nor found
 */
router.post('/', async (req, res, next: NextFunction) => {
  try {
    const { name, email, bio } = req.body as {
      name: string;
      email: string;
      bio?: string;
    };
    const createdAuthor = await addAuthor(name, email, bio);

    res.status(201).json({
      success: true,
      data: createdAuthor,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const clear = await clearAuthor(id);
    if (!clear)
      return res
        .status(404)
        .json({ success: false, error: 'Author not found' });

    return res
      .status(200)
      .json({ success: true, message: 'Author deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;

// ### Authors

// | Method | Endpoint                    | Description            |
// | ------ | --------------------------- | ---------------------- |
// | GET    | `/api/authors`              | Get all authors        |
// | GET    | `/api/authors/:id`          | Get author by ID       |
// | GET    | `/api/authors/:id/articles` | Get articles by author |
// | POST   | `/api/authors`              | Create new author      |
// | DELETE | `/api/authors/:id`          | Delete author          |
