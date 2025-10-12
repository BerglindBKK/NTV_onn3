import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import path from 'path';
import { fileURLToPath } from 'url';

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
    const data = await fs.readFile(authorsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}
