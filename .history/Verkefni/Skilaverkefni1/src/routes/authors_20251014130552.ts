import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
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

router.get('/', async (req, res, next: NextFunction) => {
  try {
    const authors = await loadAuthors();
    // always returns something, if doesn't exist an empty array so no need for error if empty
    res.status(200).json({
      success: true,
      data: authors,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const authors = await loadAuthors();

    const author = authors.find((author: Author) => {
      return author.id === id;
    });
    if (!author)
      return res
        .status(404)
        .json({ success: false, error: 'Author not found' });

    return res.status(200).json({ success: true, data: author });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next: NextFunction) => {
  try {
    const { name, email, bio } = req.body as {
      name: string;
      email: string;
      bio: string;
    };
    const createdAuthor = await addAuthor(name, email, bio);

    if (!createdAuthor)
      return res.status(500).json({
        error: {
          message: 'Validation failed',
          details: [
            {
              field: 'name',
              message: 'Name is required',
            },
            {
              field: 'email',
              message: 'Invalid email format',
            },
          ],
        },
      });

    res.status(201).json({ success: true, data: createdAuthor });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const clear = clearAuthor(id);
    if (!clear) return res.status(404);
    res.status(204).send('author deleted');
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
