import express from 'express';

const app = express();
const port = 3009;

app.use(express.json());

app.post('/movies', (request, response) => {
  request.body.movie; 
  const { movie } = request.body as { movie: string };
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
