import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile, writeFile } from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authorsFilePath = path.join(__dirname, '../data/authors.json');

function createId() {
  return randomUUID();
}

export type Author = {
  id: string;
  name: string;
  email: string;
  bio?: string;
};

export async function loadAuthors(): Promise<Author[]> {
  try {
    const data = await readFile(authorsFilePath, { encoding: 'utf8' });
    const jsondata = JSON.parse(data);
    console.log('loading JSON data:', jsondata);

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

export async function saveAuthors(authors: Author[]): Promise<void> {
  try {
    await writeFile(authorsFilePath, JSON.stringify(authors, null, 2));
  } catch (e) {
    if (e instanceof Error) {
      throw new Error('saveAuthors: ' + e.message);
    }
    throw new Error('unknown Errror');
  }
}

export async function addAuthor(
  name: string,
  email: string,
  bio?: string
): Promise<Author> {
  try {
    const authors = await loadAuthors();

    const newAuthor = {
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
      throw new Error('loadAuthors: ' + e.message);
    }
    throw new Error('unknown error');
  }
}

export async function clearAuthor(id: string): Promise<boolean> {
  try {
    const authors = await loadAuthors();
    const author = authors.find((author) => {
      return author.id === id;
    });

    if (!author) {
      return false;
    }

    const newAuthors = authors.filter((author) => {
      return author.id !== id;
    });

    await saveAuthors(newAuthors);
    return true;
  } catch (err) {
    throw new Error('clearAuthor error ');
  }
}
