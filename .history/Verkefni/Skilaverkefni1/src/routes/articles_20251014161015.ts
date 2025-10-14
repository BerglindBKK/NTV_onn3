import express, { Request, Response, NextFunction } from 'express';
// import fs from 'fs/promises';
// import path from 'path';
// import { fileURLToPath } from 'url';
import { validate } from '../middleware/validate.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const articlesFilePath = path.join(__dirname, '../data/articles.json');

const router = express.Router();

/**
 * Get all articles
 * @route   GET /api/articles
 * @returns 200 - { success: true, data: Article[] } (may be empty)
 * @returns 500 - via global error handler
 */
router.get('/', async (_req, res, next: NextFunction) => {
  try {
    //loads articles from file storage
    const articles = await loadArticles();
    // always returns an array but possibly empty -> no need for error if empty
    res.status(200).json({
      success: true,
      data: articles,
    });
  } catch (err) {
    //pass errors to error handler
    next(err);
  }
});

/**
 * Get article by ID
 * @route   GET /api/article/:id
 * @desc    Returns an article by id
 * @returns 200 - { success: true, data: Article }
 * @returns 404 - { success: false, error: 'Article not found' }
 */
router.get(
  '/:id',
  //   validateParams(idParamSchema),
  async (req, res, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      const articles = await loadArticles();

      //loads all artiles and finds the article matching the id
      const article = articles.find((article: Article) => {
        return article.id === id;
      });

      //returns 404 if the article is not found
      if (!article)
        return res
          .status(404)
          .json({ success: false, error: 'Article not found' });

      //if article is found - returns the matching article
      return res.status(200).json({ success: true, data: article });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Create a new article
 * @route   POST /api/articles
 * @desc    Creates a new article
 * @returns 201 - { success: true, data: Article }
 * @returns 500 - via global error handler (validation will be added later)
 */
router.post(
  '/',
  //   validate(createArticleSchema),
  async (req, res, next: NextFunction) => {
    try {
      const { title, content, authorId } = req.body as {
        title: string;
        content: string;
        authorId: string;
      };

      //creates a new article
      const createdArticle = await addArticle(title, content, authorId);

      //returns a 201 when new aticle created
      res.status(201).json({
        success: true,
        data: createdArticle,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Delete an articleby id
 * @route   DELETE /api/articles/:id
 * @desc    Deletes an article
 * @returns 200 - { success: true, message: 'Article deleted successfully' }
 * @returns 404 - { success: false, error: 'Article not found' }
 */
router.delete(
  '/:id',
  //   validateParams(idParamSchema),
  async (req, res, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };

      //tries to delete article via helper function, returns 404 false if not found
      const clear = await clearArticle(id);
      if (!clear)
        return res
          .status(404)
          .json({ success: false, error: 'Article not found' });

      //successfully deleted
      return res
        .status(200)
        .json({ success: true, message: 'Article deleted successfully' });
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
