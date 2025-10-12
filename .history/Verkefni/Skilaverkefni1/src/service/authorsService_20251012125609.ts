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

export async function loadAuthors(): Promise<Author[]> {
  try {
    const data = await readFile(authorsFilePath, { encoding: 'utf8' });
    const jsondata = JSON.parse(data);
    console.log('JSON data:', jsondata);
    return jsondata;
  } catch (error) {
    console.error('[loadAuthors] error:', error);
    return [];
  }
}

// export async function loadAuthors(): Promise<Author[]> {
//   try {
//     console.log('[loadAuthors] reading:', authorsFilePath); // <-- log the path
//     const data = await readFile(authorsFilePath, { encoding: 'utf8' });
//     const json = JSON.parse(data);
//     console.log(
//       '[loadAuthors] count:',
//       Array.isArray(json) ? json.length : 'not array'
//     ); // <-- log count
//     return json;
//   } catch (error) {
//     console.error('[loadAuthors] error:', error);
//     return [];
//   }
// }
