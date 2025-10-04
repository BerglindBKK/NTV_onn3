import express from 'express';
import { addMovie, loadMovies, deleteMovie } from './movies.js';

const app = express();
const port = 3009;

app.use(express.json());

app.post('/movies', (request, response) => {
  request.body.movie; 
  const { title } = request.body as { title: string };
  const { year } = request.body as { year: number };
  const createdMovie = addMovie(title, year);
  response.status(201).json(createdMovie);
})

app.get('/movies', (request, response) => {
  const movies = loadMovies();
  response.status(200).json(movies);
})

app.get('/movies/:id', (request, response) => {
const { id } = request.params as { id : string }
  const movies = loadMovies();

  const movie = movies.find((movie) => {
    return movie.id === id;
  })

  if (!movie) {
    response.status(404).send(null);
    return;
  }
  response.status(200).json(movie);
})

app.delete ('movies/:id', (request, response) => {
  const { id } = request.params as {id : string }
  const movies = loadMovies();
  const movie = movies.find((movie) => {
    return movie.id === id;
  })

  if (!movie) {
    response.status(400).send(null);
    return;
  }

  deleteMovie(movie.id)
  response.status(204).send('');
  
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
