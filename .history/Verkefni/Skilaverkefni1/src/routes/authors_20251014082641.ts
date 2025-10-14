import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { validate } from '../middleware/validate.js';
import { Author, addAuthors, loadAuthors } from '../service/authorsService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const authorsFilePath = path.join(__dirname, '../data/authors.json');

router.get('/', async (req, res, next: NextFunction) => {
  try {
    const authors = await loadAuthors();
    res.status(200).json(authors);
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
    res.status(200).json(author);
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
    const createdAuthor = await addAuthors(name, email, bio);
    res.status(201).json({ success: true, data: createdAuthor });
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
