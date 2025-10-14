import express, { Request, Response, NextFunction } from 'express';
// import fs from 'fs/promises';
// import path from 'path';
// import { fileURLToPath } from 'url';
import { validate } from '../middleware/validate.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const articlesFilePath = path.join(__dirname, '../data/articles.json');

const router = express.Router();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const authorsFilePath = path.join(__dirname, '../data/authors.json');
const router = express.Router();

/**
 * Get all authors
 * @route   GET /api/authors
 * @returns 200 - { success: true, data: Author[] } (may be empty)
 * @returns 500 - via global error handler
 */
router.get('/', async (_req, res, next: NextFunction) => {
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
 * Get author by ID
 * @route   GET /api/authors/:id
 * @desc    Returns an author by id
 * @returns 200 - { success: true, data: Author }
 * @returns 404 - { success: false, error: 'Author not found' }
 */
router.get(
  '/:id',
  validateParams(idParamSchema),
  async (req, res, next: NextFunction) => {
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
  }
);

/**
 * Create a new author
 * @route   POST /api/authors
 * @desc    Creates a new author
 * @returns 201 - { success: true, data: Author }
 * @returns 500 - via global error handler (validation will be added later)
 */
router.post(
  '/',
  validate(createAuthorSchema),
  async (req, res, next: NextFunction) => {
    try {
      const { name, email, bio } = req.body as {
        name: string;
        email: string;
        bio?: string;
      };

      //creates a new author
      const createdAuthor = await addAuthor(name, email, bio);

      //returns a 201 when new author created
      res.status(201).json({
        success: true,
        data: createdAuthor,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Delete an author by id
 * @route   DELETE /api/authors/:id
 * @desc    Deletes an author
 * @returns 200 - { success: true, message: 'Author deleted successfully' }
 * @returns 404 - { success: false, error: 'Author not found' }
 */
router.delete(
  '/:id',
  validateParams(idParamSchema),
  async (req, res, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };

      //tries to delete author via helper function, returns 404 false if not found
      const clear = await clearAuthor(id);
      if (!clear)
        return res
          .status(404)
          .json({ success: false, error: 'Author not found' });

      //successfully deleted
      return res
        .status(200)
        .json({ success: true, message: 'Author deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

// ### Articles

// | Method | Endpoint            | Description        |
// | ------ | ------------------- | ------------------ |
// | GET    | `/api/articles`     | Get all articles   |
// | GET    | `/api/articles/:id` | Get article by ID  |
// | POST   | `/api/articles`     | Create new article |
// | DELETE | `/api/articles/:id` | Delete article     |
