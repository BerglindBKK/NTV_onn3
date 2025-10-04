import fs, { readFileSync } from 'node:fs';
import chalk from 'chalk';
import { randomUUID } from 'node:crypto';

const filePath = './movies.json';

function createId() {
    return randomUUID();
}

type Movie = {
    id: string;
    title: string;
    year: number;
    watched: boolean;
}

function loadMovie(): Movie[] {
    try {
        const data = readFileSync(filePath, 'utf8');
    return JSON.parse(data);
    }
    catch {
        return[];
    sdfsdf
    }
    
}
