import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { validate } from '../middleware/validate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const articlesFilePath = path.join(__dirname, '../data/articles.json');

export default router;

// ### Articles

// | Method | Endpoint            | Description        |
// | ------ | ------------------- | ------------------ |
// | GET    | `/api/articles`     | Get all articles   |
// | GET    | `/api/articles/:id` | Get article by ID  |
// | POST   | `/api/articles`     | Create new article |
// | DELETE | `/api/articles/:id` | Delete article     |
