import fs from 'node:fs';
import { randomUUID } from 'node:crypto';

const filePath = '../data/authors.json';

function createId() {
  return randomUUID();
}

export type Author = {
  id: string;
  name: string;
  email: string;
  bio: string;
};

export function loadAuthors(): Author[] {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}
