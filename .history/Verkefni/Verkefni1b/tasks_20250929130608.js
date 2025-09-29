import fs from "node:fs";
import chalk from "chalk";

const filePath = "./tasks.json";

// checks if filepath exists
//reads file in data (checks whitespace)
//if no data exists - returns empty array
//parses json data into constant
//if parsed is array it returns array - if not it returns an empty array
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
  console.log(chalk.green(`"Marked task" ${index + 1} "as done"`));
  // console.log('TODO: Implement markTaskDone function');
  // console.log(`
  //     1. Load tasks from the file tasks.json
  //     2. If the task number is invalid, print "Error: Invalid task number." in red color
  //     3. If the task number is valid, mark the task as done and save the tasks to the file tasks.json
  //     4. Print "Marked task #${index} as done." in green color
  // `);
}

// Clear all tasks from the file tasks.json
export function clearTasks() {
  const tasks = loadTasks();
  fs.writeFileSync(filePath, JSON.stringify([], null, 2), "utf8");
  console.log("all tasks cleared");
  // console.log("TODO: Implement clearTasks function");
  // console.log(`
  //       1. Clear all tasks from the file tasks.json
  //       2. Print "All tasks cleared!" in green color
  //   `);
}
