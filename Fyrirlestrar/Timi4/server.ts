import express from 'express';
import { addTask, loadTasks } from './tasks.js';

const app = express();
const port = 3009;

app.use(express.json());

app.use((request, response, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} ${request.method} ${request.originalUrl}`);
  if (request.method === 'POST' || request.method === 'PATCH') {
    console.log(request.body);
  }
  next();
});

app.get('/ping', (request, response) => {
  response.send('pong');
});

app.get('/tasks', (request, response) => {
  const tasks = loadTasks();
  response.json(tasks);
});

app.post('/tasks', (request, response) => {
  const { task } = request.body as { task: string };

  addTask(task);

  response.send('Ekkert mál');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
