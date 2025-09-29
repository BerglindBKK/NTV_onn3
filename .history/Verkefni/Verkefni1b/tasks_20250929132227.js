import fs from "node:fs";
import chalk from "chalk";

const filePath = "./tasks.json";

// loads tasks
function loadTasks() {
  try {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, "utf8").trim();
    if (!data) return [];
    const parsed = JSON.parse(data);
    console.log(parsed);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Save tasks to the file tasks.json
function saveTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

export function addTask(task) {
  const tasks = loadTasks();

  const newTask = {
    description: task,
    done: false,
  };

  tasks.push(newTask);
  saveTasks(tasks);
  console.log(chalk.green(`Added task: ${task} `));
}

// List all tasks from the file tasks.json and print them to the console
export function listTasks() {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log(chalk.yellow("No tasks found. Add a task to get started!"));
    return;
  }
  console.log(chalk.blue("Your Tasks:"));
  tasks.forEach((task, index) => {
    const checkmark = task.done ? "  - [✔]" : "  - [ ]";
    console.log(`${checkmark} ${index + 1}. ${task.description}`);
  });
}

// Mark a task as done in the file tasks.json
export function markTaskDone(index) {
  const tasks = loadTasks();

  if (index < 1 || index > tasks.length) {
    console.log(chalk.red("Error: Invalid task number."));
    return;
  } else tasks[index - 1].done = true;
  console.log(tasks[index - 1]);

  saveTasks(tasks);
  console.log(chalk.green(`"Marked task" ${index} "as done"`));
}

// Clear all tasks from the file tasks.json
export function clearTasks() {
  fs.writeFileSync(filePath, JSON.stringify([], null, 2), "utf8");
  console.log(chalk.green("all tasks cleared"));
}
