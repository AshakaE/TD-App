# HMCTS Task Manager

A full-stack task management application for HMCTS caseworkers, built with **Node.js/Express** (backend) and **React** (frontend).

## Features

- Create tasks with title, optional description, status, and due date
- View all tasks with status filtering (To Do, In Progress, Done)
- Update task details and status
- Delete tasks with confirmation
- Overdue task highlighting
- Input validation and error handling
- Responsive UI

## Tech Stack

| Layer    | Technology                     |
|----------|--------------------------------|
| Backend  | Node.js, Express               |
| Database | SQLite (via better-sqlite3)    |
| Frontend | React, Vite                    |
| Testing  | Jest + Supertest, Vitest + RTL |

## Prerequisites

- **Node.js** v18+ and npm

## Running the App

### 1. Start the Backend

```bash
cd backend
npm install
npm run dev
```

The API server starts at **http://localhost:4000**.

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app starts at **http://localhost:3000**. The Vite dev server proxies `/api` requests to the backend automatically.

## Running Tests

### Backend (19 tests)

```bash
cd backend
npm test
```

### Frontend (13 tests)

```bash
cd frontend
npm test
```

## Available Scripts

### Backend

| Command         | Description                      |
|-----------------|----------------------------------|
| `npm run dev`   | Start with auto-reload (nodemon) |
| `npm start`     | Start in production mode         |
| `npm test`      | Run tests with coverage          |

### Frontend

| Command           | Description                  |
|-------------------|------------------------------|
| `npm run dev`     | Start dev server (port 3000) |
| `npm run build`   | Build for production         |
| `npm run preview` | Preview production build     |
| `npm test`        | Run tests                    |

## API Documentation

Base URL: `http://localhost:4000`

### Endpoints

| Method   | Endpoint                | Description        |
|----------|-------------------------|--------------------|
| `POST`   | `/api/tasks`            | Create a task      |
| `GET`    | `/api/tasks`            | Get all tasks      |
| `GET`    | `/api/tasks/:id`        | Get a task by ID   |
| `PUT`    | `/api/tasks/:id`        | Update a task      |
| `PATCH`  | `/api/tasks/:id/status` | Update task status |
| `DELETE` | `/api/tasks/:id`        | Delete a task      |
| `GET`    | `/health`               | Health check       |

### Task Schema

| Field       | Type   | Required | Description                              |
|-------------|--------|----------|------------------------------------------|
| id          | string | auto     | UUID, generated on creation              |
| title       | string | yes      | Task title (max 255 chars)               |
| description | string | no       | Optional task description                |
| status      | string | no       | `TODO` (default), `IN_PROGRESS`, `DONE`  |
| due_date    | string | yes      | ISO 8601 date/time                       |
| created_at  | string | auto     | ISO 8601 timestamp                       |
| updated_at  | string | auto     | ISO 8601 timestamp                       |

### Example: Create a Task

```bash
curl -X POST http://localhost:4000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Review case files",
    "description": "Review files for case #1234",
    "status": "TODO",
    "due_date": "2026-03-15T10:00:00.000Z"
  }'
```

### Error Responses

Validation errors return **400** with:

```json
{
  "errors": ["Title is required and must be a non-empty string"]
}
```

Not found errors return **404** with:

```json
{
  "error": "Task not found"
}
```

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── app.js              # Express app setup
│   │   ├── server.js           # Server entry point
│   │   ├── database.js         # SQLite database setup
│   │   ├── models/
│   │   │   └── taskModel.js    # Task data model
│   │   ├── middleware/
│   │   │   └── validation.js   # Request validation
│   │   └── routes/
│   │       └── taskRoutes.js   # API route handlers
│   └── tests/
│       └── tasks.test.js       # API integration tests
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Main application component
│   │   ├── api/
│   │   │   └── taskApi.js      # API client functions
│   │   ├── components/
│   │   │   ├── TaskForm.jsx    # Create/edit task form
│   │   │   ├── TaskList.jsx    # Task list container
│   │   │   └── TaskCard.jsx    # Individual task card
│   │   └── test/
│   │       ├── TaskForm.test.jsx
│   │       ├── TaskList.test.jsx
│   │       └── TaskCard.test.jsx
│   └── vite.config.js
└── README.md
```
