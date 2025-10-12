import fs from 'node:fs';
import { randomUUID } from 'node:crypto';

const filePath = '../data/authors.json';

function createId() {
  return randomUUID();
}
