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
  bio: string;
};

export async function loadAuthors(): Promise<Author[]> {
  try {
    const data = await readFile(authorsFilePath, { encoding: 'utf8' });
    const jsondata = JSON.parse(data);
    console.log('JSON data:', jsondata);

    if (!Array.isArray(jsondata)) {
      throw new Error('Expected JSON array');
    }
    return jsondata;
  } catch (error) {
    console.error('[loadAuthors] error:', error);
    return [];
    //add throw error when adding errorhandler
  }
}

export async function saveAuthors(authors: Author[]): Promise<void> {
  await writeFile(authorsFilePath, JSON.stringify(authors, null, 2));
  //try/catch + errors
}

export async function addAuthors(
  name: string,
  email: string,
  bio: string
): Promise<Author> {
  try {
    const authors = await loadAuthors();

    const newAuthor = {
      id: createId(),
      name: name,
      email: email,
      bio: bio,
    };

    authors.push(newAuthor);
    await saveAuthors(authors);
    return newAuthor;
  } catch (error) {
    console.error('[addAuthors] error:', error);
    throw new Error('addAuthor error '); //laga við errormeðhöndlun
    //throw error seinna
  }
}

export async function clearAuthor(id: string): Promise<boolean> {
  try {
    const authors = await loadAuthors();
    const author = authors.find((author) => {
      return author.id === id;
    });

    if (!author) {
      throw new Error('Author not found');
    }

    const newAuthors = authors.filter((author) => {
      return author.id !== id;
    });

    await saveAuthors(authorsFilePath, newAuthors);
    return true;
  } catch (err) {
    throw new Error('clearAuthor error ');
  }
}
