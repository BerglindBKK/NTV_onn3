import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'node:fs/promises';

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

export async function loadAuthors(authorsFilePath: string): Promise<Author[]> {
  try {
    const data = await readFile(authorsFilePath, { encoding: 'utf8' });
    const jsondata = JSON.parse(data);
    console.log('JSON data:', jsondata);

    if (!Array.isArray(response)) {
      throw new Error('Expected JSON array');
    }
    return jsondata;
  } catch (error) {
    console.error('[loadAuthors] error:', error);
    return [];
    //add throw error when adding errorhandler
  }
}

export async function saveAuthors(): Promise<void> {}

export async function addAuthors(
  name: string,
  email: string,
  bio: string
): Promise<Author> {
  try {
    const authors = await loadAuthors(authorsFilePath);
  } catch (error) {
    console.error('[addAuthors] error:', error);
    //throw error seinna
  }
}
