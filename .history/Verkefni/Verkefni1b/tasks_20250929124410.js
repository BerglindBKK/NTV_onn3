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
  // console.log('TODO: Implement saveTasks function');
  // console.log(`
  //     1. Save tasks to the file tasks.json
  // `);
}

// loads tasks from loadTasks()
// byr til nýtt task
// pushar nýja taski á endann á fylkinu
//
export function addTask(task) {
  const tasks = loadTasks();

  const newTask = {
    description: task,
    done: false,
  };

  tasks.push(newTask);
  saveTasks(tasks);
  console.log(chalk.green(`Added task: ${task} `));

  // console.log('TODO: Implement addTask function');
  // console.log(`
  //     1. Load tasks from the file tasks.json
  //     2. Add the new task to the tasks array
  //     3. Save the tasks to the file tasks.json
  //     4. Print "Added task: ${task} in green color
  // `);
}

// List all tasks from the file tasks.json and print them to the console
export function listTasks() {
  const tasks = loadTasks();
  if (!tasks) {
    console.log(chalk.yellow("No tasks found. Add a task to get started!"));
    return;
  }
  console.log(chalk.blue("Your Tasks:"));
  tasks.forEach((task, index) => {
    const checkmark = task.done ? "  - [✔]" : "  - [ ]";
    console.log(`${checkmark} ${index + 1}. ${task.description}`);
  });

  // console.log('TODO: Implement listTasks function');
  // console.log(`
  //     1. Load tasks from the file tasks.json
  //     2. If there are no tasks, print "No tasks found. Add a task to get started!" in yellow color
  //     3. If there are tasks, print "Your Tasks:" in blue color
  //     4. Print each task in the following format:
  //         - [✔] Task number and task description -  if the task is done
  //         - [ ] Task number and task description - if the task is not done
  //         - the task number and the task description
  // `);
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
  tasks = loadTasks();
  clearTasks;
  console.log("all tasks cleared");
  console.log("TODO: Implement clearTasks function");
  console.log(`
        1. Clear all tasks from the file tasks.json
        2. Print "All tasks cleared!" in green color
    `);
}
