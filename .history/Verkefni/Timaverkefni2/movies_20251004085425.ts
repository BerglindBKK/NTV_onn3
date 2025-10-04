import fs, { readFileSync } from 'node:fs';
import chalk from 'chalk';
import { randomUUID } from 'node:crypto';

const filePath = './movies.json';

function createId() {
    return randomUUID();
}

export type Movie = {
    id: string;
    title: string;
    year: number;
    watched: boolean;
}

function loadMovies(): Movie[] {
    try {
        const data = readFileSync(filePath, 'utf8');
    return JSON.parse(data);
    }
    catch {
        return[];
    }
}

function addMovie(title: string, year: number) {
    const movies = loadMovies();
    const newMovie = {
        id: createId(),
        title,
        year,
        watched: false
    };
if(!newMovie) {
    return;
}
    movies.push(newMovie);
    return newMovie;
}
