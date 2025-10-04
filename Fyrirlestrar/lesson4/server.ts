import express, { Request } from 'express';
import { addTask, clearTask, loadTasks, markTaskDone, Task } from './tasks.js';

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
  response.status(200).send('pong');
});

app.delete('/tasks/:id', (request, response) => {
  const { id } = request.params as { id: string };
  const tasks = loadTasks();
  const task = tasks.find((task) => {
    return task.id === id;
  });

  if (!task) {
    response.status(404).send(null);
    return;
  }

  clearTask(task.id);
  response.status(204).send('');
});

app.patch('/tasks/:id', (request, response) => {
  const { id } = request.params as { id: string };
  const { done } = request.body as {
    done: boolean;
  };

  const tasks = loadTasks();
  const foundTask = tasks.find((task) => {
    return task.id === id;
  });

  if (!foundTask) {
    response.status(404).send(null);
    return;
  }

  markTaskDone(foundTask.id, done);
  response.status(204).send('');
});

app.get('/tasks/:id', (request, response) => {
  const { id } = request.params as { id: string };
  const tasks = loadTasks();
  const task = tasks.find((task) => {
    return task.id === id;
  });

  if (!task) {
    response.status(404).send(null);
    return;
  }

  response.status(200).json(task);
});

app.get('/tasks', (request, response) => {
  const tasks = loadTasks();
  response.status(200).json(tasks);
});

app.post('/tasks', (request, response) => {
  request.body.task;
  const { task } = request.body as { task: string };

  const createdTask = addTask(task);

  response.status(201).json(createdTask);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
