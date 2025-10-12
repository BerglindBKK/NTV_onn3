import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { validate } from '../middleware/validate.js';
import { loadAuthors } from '../service/authorsService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const authorsFilePath = path.join(__dirname, '../data/authors.json');

router.get('/', async (req, res, next) => {
  const authors = await loadAuthors();
  res.status(200).json(authors);
});

// router.get('/', async (_req, res, next) => {
//   try {
//     // console.log('[GET] /api/authors'); // <-- confirm the route is hit
//     const authors = await loadAuthors();
//     res.status(200).json(authors);
//   } catch (err) {
//     next(err);
//   }
// });

export default router;

// ### Authors

// | Method | Endpoint                    | Description            |
// | ------ | --------------------------- | ---------------------- |
// | GET    | `/api/authors`              | Get all authors        |
// | GET    | `/api/authors/:id`          | Get author by ID       |
// | GET    | `/api/authors/:id/articles` | Get articles by author |
// | POST   | `/api/authors`              | Create new author      |
// | DELETE | `/api/authors/:id`          | Delete author          |
