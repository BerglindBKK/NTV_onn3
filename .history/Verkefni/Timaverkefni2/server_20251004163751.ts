import express from 'express';
import { addMovie, loadMovies, deleteMovie, markedAsWatched } from './movies.js';

const app = express();
const port = 3009;

app.use(express.json());

app.post('/movies', (request, response) => {
  request.body.movie; 
  const { title } = request.body as { title: string };
  const { year } = request.body as { year: number };
  const createdMovie = addMovie(title, year);
  response.status(201).json(createdMovie).send('Created');
})

app.get('/movies', (request, response) => {
  const movies = loadMovies();
  response.status(200).json(movies).send('OK');
})

app.get('/movies/:id', (request, response) => {
const { id } = request.params as { id : string }
  const movies = loadMovies();

  const movie = movies.find((movie) => {
    return movie.id === id;
  })

  if (!movie) {
    response.status(404).send('not found');
    return;
  }
  response.status(200).json(movie);
})

app.delete ('/movies/:id', (request, response) => {
  const { id } = request.params as {id : string }
  const movies = loadMovies();
  const movie = movies.find((movie) => {
    return movie.id === id;
  })

  if (!movie) {
    response.status(404).send('not found');
    return;
  }

  deleteMovie(movie.id)
  response.status(204).send('No content');
})

app.patch('/movies/:id', (request, response) => {
  const { id } = request.params as {id: string};
  const { watched } = request.body as {watched: boolean};
  const movies = loadMovies();
  const movie = movies.find((movie) => {
    return movie.id === id;
  })

  if (!movie) {
    response.status(404).send('not found');
    return;
  }

  markedAsWatched(id, watched)

  response.status(200).json(movie)
})

app.listen(port, () => {
  console.log('ok');
});
