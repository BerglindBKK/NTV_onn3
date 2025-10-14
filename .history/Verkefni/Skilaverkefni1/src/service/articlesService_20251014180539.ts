// import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile, writeFile } from 'node:fs/promises';

// Resolve the absolute path to articles.json in /data
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const articlesFilePath = path.join(__dirname, '../data/articles.json');

// Generate a unique UUID for each article
function createId() {
  return randomUUID();
}

/// Type definition for an Article object
export type Article = {
  id: string;
  title: string;
  content: string;
  authorId: string;
};

/**
 * Load all articles from JSON file
 * @returns Array of articles (empty if file exists but has no entries)
 * @throws Error if file cannot be read or JSON is invalid
 */
export async function loadArticles(): Promise<Article[]> {
  try {
    const data = await readFile(articlesFilePath, { encoding: 'utf8' });
    const jsondata = JSON.parse(data);

    // Validate expected data structure
    if (!Array.isArray(jsondata)) {
      throw new Error('Expected JSON array');
    }
    return jsondata;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error('loadArticles: ' + e.message);
    }
    throw new Error('loadArticles: Unknown error');
  }
}

/**
 * Save articles array back to JSON file
 * @param articles - Updated list of articles
 * @throws Error if writing fails
 */
export async function saveArticles(articles: Article[]): Promise<void> {
  try {
    await writeFile(articlesFilePath, JSON.stringify(articles, null, 2));
  } catch (e) {
    if (e instanceof Error) {
      throw new Error('saveArticles: ' + e.message);
    }
    throw new Error('saveArticles: unknown Errror');
  }
}

/**
 * Add a new article to storage
 * @param title - Article's title
 * @param content - Article's content
 * @param authorId - Article's AuthorId
 * @returns Newly created article object
 * @throws Error if reading or writing fails
 */
export async function addArticle(
  title: string,
  content: string,
  authorId: string
): Promise<Article> {
  try {
    const articles = await loadArticles();

    const newArticle: Article = {
      id: createId(),
      title,
      content,
      authorId,
    };

    articles.push(newArticle);
    await saveArticles(articles);
    return newArticle;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error('addArticles: ' + e.message);
    }
    throw new Error('unknown error');
  }
}

/**
 * Delete an article by ID
 * @param id - Article's unique identifier
 * @returns true if deleted successfully, false if not found
 * @throws Error if reading or writing fails
 */
export async function clearArticle(id: string): Promise<boolean> {
  try {
    const articles = await loadArticles();
    const article = articles.find((article) => {
      return article.id === id;
    });

    // Return false if article not found
    if (!article) {
      return false;
    }

    // Filter out the matching article and save
    const newArticles = articles.filter((article) => {
      return article.id !== id;
    });

    await saveArticles(newArticles);
    return true;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error('clearArticle: ' + e.message);
    }
    throw new Error('unknown error');
  }
}
