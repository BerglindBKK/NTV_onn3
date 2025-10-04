import express from 'express';
import { addMovie, loadMovies } from './movies.js';

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
  response.status(200).json(movies)
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
