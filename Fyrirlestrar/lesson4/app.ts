import chalk from 'chalk';
import { addTask, clearTasks, listTasks, markTaskDone } from './tasks';

const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'add':
    if (!arg) {
      console.log(chalk.red('Error: Please provide a task description.'));
    } else {
      addTask(arg);
    }
    break;

  case 'list':
    listTasks();
    break;

  case 'done':
    if (!arg) {
      console.log(chalk.red('Error: Please provide the task id to mark as done.'));
    } else {
      markTaskDone(arg);
    }
    break;

  case 'clear':
    clearTasks();
    break;

  default:
    console.log(chalk.yellow('Usage:'));
    console.log(chalk.cyan('  node app.js add "Task description"') + ' - Add a new task');
    console.log(chalk.cyan('  node app.js list') + ' - List all tasks');
    console.log(chalk.cyan('  node app.js done <task number>') + ' - Mark a task as done');
    console.log(chalk.cyan('  node app.js clear') + ' - Clear all tasks');
    break;
}
