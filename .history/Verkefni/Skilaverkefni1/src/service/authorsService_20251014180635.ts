import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile, writeFile } from 'node:fs/promises';

// Resolve the absolute path to authors.json in /data
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authorsFilePath = path.join(__dirname, '../data/authors.json');

// Generate a unique UUID for each author
function createId() {
  return randomUUID();
}

/// Type definition for an Author object
export type Author = {
  id: string;
  name: string;
  email: string;
  bio?: string;
};

/**
 * Load all authors from JSON file
 * @returns Array of authors (empty if file exists but has no entries)
 * @throws Error if file cannot be read or JSON is invalid
 */
export async function loadAuthors(): Promise<Author[]> {
  try {
    const data = await readFile(authorsFilePath, { encoding: 'utf8' });
    const jsondata = JSON.parse(data);

    // Validate expected data structure
    if (!Array.isArray(jsondata)) {
      throw new Error('Expected JSON array');
    }
    return jsondata;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error('loadAuthors: ' + e.message);
    }
    throw new Error('loadAuthors: Unknown error');
  }
}

/**
 * Save authors array back to JSON file
 * @param authors - Updated list of authors
 * @throws Error if writing fails
 */
export async function saveAuthors(authors: Author[]): Promise<void> {
  try {
    await writeFile(authorsFilePath, JSON.stringify(authors, null, 2));
  } catch (e) {
    if (e instanceof Error) {
      throw new Error('saveAuthors: ' + e.message);
    }
    throw new Error('saveAuthors: unknown Errror');
  }
}

/**
 * Add a new author to storage
 * @param name - Author's name
 * @param email - Author's email
 * @param bio - Optional bio text
 * @returns Newly created author object
 * @throws Error if reading or writing fails
 */
export async function addAuthor(
  name: string,
  email: string,
  bio?: string
): Promise<Author> {
  try {
    const authors = await loadAuthors();

    const newAuthor: Author = {
      id: createId(),
      name,
      email,
      bio: bio,
    };

    authors.push(newAuthor);
    await saveAuthors(authors);
    return newAuthor;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error('addAuthors: ' + e.message);
    }
    throw new Error('unknown error');
  }
}

/**
 * Delete an author by ID
 * @param id - Author's unique identifier
 * @returns true if deleted successfully, false if not found
 * @throws Error if reading or writing fails
 */
export async function clearAuthor(id: string): Promise<boolean> {
  try {
    const authors = await loadAuthors();
    const author = authors.find((author) => {
      return author.id === id;
    });

    // Return false if author not found
    if (!author) {
      return false;
    }

    // Filter out the matching author and save
    const newAuthors = authors.filter((author) => {
      return author.id !== id;
    });

    await saveAuthors(newAuthors);
    return true;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error('clearAuthor: ' + e.message);
    }
    throw new Error('unknown error');
  }
}
