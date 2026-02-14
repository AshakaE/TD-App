const request = require('supertest');
const Database = require('better-sqlite3');
const createApp = require('../src/app');

let app;
let db;

beforeEach(() => {
    db = new Database(':memory:');
    db.pragma('journal_mode = WAL');
    db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'TODO' CHECK(status IN ('TODO', 'IN_PROGRESS', 'DONE')),
      due_date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
    app = createApp(db);
});

afterEach(() => {
    db.close();
});

describe('POST /api/tasks', () => {
    it('should create a task with valid data', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .send({
                title: 'Test Task',
                description: 'A test task',
                status: 'TODO',
                due_date: '2026-03-01T12:00:00.000Z',
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Test Task');
        expect(res.body.description).toBe('A test task');
        expect(res.body.status).toBe('TODO');
    });

    it('should create a task with default status TODO', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .send({
                title: 'Default Status Task',
                due_date: '2026-03-01T12:00:00.000Z',
            });

        expect(res.status).toBe(201);
        expect(res.body.status).toBe('TODO');
    });

    it('should return 400 if title is missing', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .send({
                due_date: '2026-03-01T12:00:00.000Z',
            });

        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
    });

    it('should return 400 if due_date is missing', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .send({
                title: 'No due date',
            });

        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
    });

    it('should return 400 if status is invalid', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .send({
                title: 'Bad Status',
                status: 'INVALID',
                due_date: '2026-03-01T12:00:00.000Z',
            });

        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
    });

    it('should return 400 if due_date is invalid', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .send({
                title: 'Bad Date',
                due_date: 'not-a-date',
            });

        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
    });
});

describe('GET /api/tasks', () => {
    it('should return an empty array when no tasks exist', async () => {
        const res = await request(app).get('/api/tasks');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('should return all tasks', async () => {
        await request(app).post('/api/tasks').send({
            title: 'Task 1',
            due_date: '2026-03-01T12:00:00.000Z',
        });
        await request(app).post('/api/tasks').send({
            title: 'Task 2',
            due_date: '2026-04-01T12:00:00.000Z',
        });

        const res = await request(app).get('/api/tasks');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
    });
});

describe('GET /api/tasks/:id', () => {
    it('should return a task by ID', async () => {
        const createRes = await request(app).post('/api/tasks').send({
            title: 'Find Me',
            due_date: '2026-03-01T12:00:00.000Z',
        });

        const res = await request(app).get(`/api/tasks/${createRes.body.id}`);
        expect(res.status).toBe(200);
        expect(res.body.title).toBe('Find Me');
    });

    it('should return 404 for non-existent task', async () => {
        const res = await request(app).get('/api/tasks/non-existent-id');
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Task not found');
    });
});

describe('PATCH /api/tasks/:id/status', () => {
    it('should update task status', async () => {
        const createRes = await request(app).post('/api/tasks').send({
            title: 'Status Task',
            due_date: '2026-03-01T12:00:00.000Z',
        });

        const res = await request(app)
            .patch(`/api/tasks/${createRes.body.id}/status`)
            .send({ status: 'IN_PROGRESS' });

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('IN_PROGRESS');
    });

    it('should return 400 for invalid status', async () => {
        const createRes = await request(app).post('/api/tasks').send({
            title: 'Status Task',
            due_date: '2026-03-01T12:00:00.000Z',
        });

        const res = await request(app)
            .patch(`/api/tasks/${createRes.body.id}/status`)
            .send({ status: 'INVALID' });

        expect(res.status).toBe(400);
    });

    it('should return 404 for non-existent task', async () => {
        const res = await request(app)
            .patch('/api/tasks/non-existent-id/status')
            .send({ status: 'DONE' });

        expect(res.status).toBe(404);
    });
});

describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
        const createRes = await request(app).post('/api/tasks').send({
            title: 'Original Title',
            due_date: '2026-03-01T12:00:00.000Z',
        });

        const res = await request(app)
            .put(`/api/tasks/${createRes.body.id}`)
            .send({ title: 'Updated Title', status: 'DONE' });

        expect(res.status).toBe(200);
        expect(res.body.title).toBe('Updated Title');
        expect(res.body.status).toBe('DONE');
    });

    it('should return 404 for non-existent task', async () => {
        const res = await request(app)
            .put('/api/tasks/non-existent-id')
            .send({ title: 'Updated' });

        expect(res.status).toBe(404);
    });
});

describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
        const createRes = await request(app).post('/api/tasks').send({
            title: 'Delete Me',
            due_date: '2026-03-01T12:00:00.000Z',
        });

        const res = await request(app).delete(`/api/tasks/${createRes.body.id}`);
        expect(res.status).toBe(204);

        const getRes = await request(app).get(`/api/tasks/${createRes.body.id}`);
        expect(getRes.status).toBe(404);
    });

    it('should return 404 for non-existent task', async () => {
        const res = await request(app).delete('/api/tasks/non-existent-id');
        expect(res.status).toBe(404);
    });
});

describe('Health check', () => {
    it('should return ok', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
    });
});

describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
        const res = await request(app).get('/unknown-route');
        expect(res.status).toBe(404);
    });
});
