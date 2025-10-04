import fs, { readFileSync, writeFileSync } from 'node:fs';
import chalk from 'chalk';
import { randomUUID } from 'node:crypto';
import { stringify } from 'node:querystring';

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

export function loadMovies(): Movie[] {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
    }
    catch {
        return[];
    }
}

export function saveMovies(movies: Movie[]) {
    fs.writeFileSync(filePath, JSON.stringify(movies, null, 2));
}


export function addMovie(title: string, year: number) {
    const movies = loadMovies();

    const newMovie = {
        id: createId(),
        title,
        year,
        watched: false
    };
    movies.push(newMovie);
    saveMovies(movies);
    return newMovie;
}

export function deleteMovie(id: string) {
    const movies = loadMovies();

    const movie = movies.find((movie) => {
        return movie.id === id;
    });

    if(!movie) {
        return;
    }

    const newMovies = movies.filter((movie => {
        return movie.id !== id;
    }))
    saveMovies(newMovies);
}
