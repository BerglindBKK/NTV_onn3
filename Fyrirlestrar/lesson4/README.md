# Lesson 4 - Task Manager

A simple task management application with both CLI and HTTP server interfaces.

## Commands

### Task CLI

Manage tasks from the command line:

```bash
npm start add "Task description" # Add a new task
npm start list                   # List all tasks
npm start done <task id>         # Mark a task as done
npm start clear                  # Clear all tasks
```

### HTTP Server

Start the server with auto-reload:

```bash
npm run server
```

The server runs on `http://localhost:3009`

#### API Endpoints

**GET /ping**

- Health check endpoint
- Returns: `pong`

**GET /tasks**

- Get all tasks
- Returns: JSON array of tasks

**POST /tasks**

- Add a new task
- Body: `{ "task": "Task description" }`
- Returns: `Ekkert mál`
