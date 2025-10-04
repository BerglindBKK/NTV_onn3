import fs from 'node:fs';
import chalk from 'chalk';
import { randomUUID } from 'node:crypto';

const filePath = './movies.json';

function createId() {
    return randomUUID();
}

