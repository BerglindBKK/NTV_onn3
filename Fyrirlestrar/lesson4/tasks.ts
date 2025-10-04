import fs from 'node:fs';
import chalk from 'chalk';
import { randomUUID } from 'node:crypto';

const filePath = './tasks.json';

function createId() {
  return randomUUID();
}

export type Task = {
  id: string;
  task: string;
  done: boolean;
};

export function loadTasks(): Task[] {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

export function addTask(task: string): Task {
  const tasks = loadTasks();
  const newTask = {
    task,
    done: false,
    id: createId(),
  };
  tasks.push(newTask);
  saveTasks(tasks);
  console.log(chalk.green(`Added task: "${task}"`));
  return newTask;
}

export function listTasks() {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log(chalk.yellow('No tasks found. Add a task to get started!'));
    return;
  }
  console.log(chalk.blue('Your Tasks:'));
  tasks.forEach((t, i) => {
    const status = t.done ? chalk.green('[✔]') : chalk.red('[ ]');
    console.log(`${i + 1}. ${status} ${t.task} (${t.id})`);
  });
}

export function markTaskDone(id: string, done = true): boolean {
  const tasks = loadTasks();

  const task = tasks.find((task) => {
    return task.id === id;
  });

  if (!task) {
    return false;
  }

  task.done = done;
  saveTasks(tasks);
  console.log(chalk.green(`Marked task #${id} as done.`));
  return true;
}

export function clearTask(id: string) {
  const tasks = loadTasks();
  const task = tasks.find((task) => {
    return task.id === id;
  });

  if (!task) {
    return;
  }

  const newTasks = tasks.filter((task) => {
    return task.id !== id;
  });
  saveTasks(newTasks);
}

export function clearTasks() {
  saveTasks([]);
  console.log(chalk.green('All tasks cleared!'));
}
