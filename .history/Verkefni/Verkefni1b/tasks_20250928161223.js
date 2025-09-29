import fs from 'node:fs';
import chalk from 'chalk';

const filePath = './tasks.json';

// Load tasks from the file tasks.json and return the list of tasks as an array
function loadTasks() {
  try {
    const data = fs.readFileSync(filePath, 'utf8'); 
    const tasks = JSON.parse(data);
  } catch {
    return [];
  }
}

// Save tasks to the file tasks.json
function saveTasks(tasks) {
    console.log('TODO: Implement saveTasks function');
    console.log(`
        1. Save tasks to the file tasks.json
    `);
}

// Add a new task to the file tasks.json
export function addTask(task) {
    let tasks = [];
    if (fs.existsSync(filePath)) {
    loadTasks();
    }

    const newTask = {
    description: task,
    done: false
    };

    tasks.push(newTask);
    console.log('TODO: Implement addTask function');
    console.log(`
        1. Load tasks from the file tasks.json
        2. Add the new task to the tasks array
        3. Save the tasks to the file tasks.json
        4. Print "Added task: "${task}" in green color
    `);

}

// List all tasks from the file tasks.json and print them to the console
export function listTasks() {
    console.log('TODO: Implement listTasks function');
    console.log(`
        1. Load tasks from the file tasks.json
        2. If there are no tasks, print "No tasks found. Add a task to get started!" in yellow color
        3. If there are tasks, print "Your Tasks:" in blue color
        4. Print each task in the following format:
            - [✔] Task number and task description -  if the task is done
            - [ ] Task number and task description - if the task is not done
            - the task number and the task description
    `);
}

// Mark a task as done in the file tasks.json
export function markTaskDone(index) {

    console.log('TODO: Implement markTaskDone function');
    console.log(`
        1. Load tasks from the file tasks.json
        2. If the task number is invalid, print "Error: Invalid task number." in red color
        3. If the task number is valid, mark the task as done and save the tasks to the file tasks.json
        4. Print "Marked task #${index} as done." in green color
    `);
}

// Clear all tasks from the file tasks.json
export function clearTasks() {
    console.log('TODO: Implement clearTasks function');
    console.log(`
        1. Clear all tasks from the file tasks.json
        2. Print "All tasks cleared!" in green color
    `);
}
