const express = require('express');
const TaskModel = require('../models/taskModel');
const {
    validateCreateTask,
    validateUpdateStatus,
    validateUpdateTask,
} = require('../middleware/validation');

function createTaskRouter(db) {
    const router = express.Router();
    const taskModel = new TaskModel(db);

    /**
     * POST /api/tasks
     * Create a new task
     * Body: { title: string, description?: string, status?: string, due_date: string }
     */
    router.post('/', validateCreateTask, (req, res) => {
        try {
            const task = taskModel.create(req.body);
            res.status(201).json(task);
        } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({ error: 'Failed to create task' });
        }
    });

    /**
     * GET /api/tasks
     * Retrieve all tasks
     */
    router.get('/', (req, res) => {
        try {
            const tasks = taskModel.findAll();
            res.json(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            res.status(500).json({ error: 'Failed to fetch tasks' });
        }
    });

    /**
     * GET /api/tasks/:id
     * Retrieve a task by ID
     */
    router.get('/:id', (req, res) => {
        try {
            const task = taskModel.findById(req.params.id);
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json(task);
        } catch (error) {
            console.error('Error fetching task:', error);
            res.status(500).json({ error: 'Failed to fetch task' });
        }
    });

    /**
     * PATCH /api/tasks/:id/status
     * Update the status of a task
     * Body: { status: string }
     */
    router.patch('/:id/status', validateUpdateStatus, (req, res) => {
        try {
            const task = taskModel.updateStatus(req.params.id, req.body.status);
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json(task);
        } catch (error) {
            console.error('Error updating task status:', error);
            res.status(500).json({ error: 'Failed to update task status' });
        }
    });

    /**
     * PUT /api/tasks/:id
     * Update a task
     * Body: { title?: string, description?: string, status?: string, due_date?: string }
     */
    router.put('/:id', validateUpdateTask, (req, res) => {
        try {
            const task = taskModel.update(req.params.id, req.body);
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json(task);
        } catch (error) {
            console.error('Error updating task:', error);
            res.status(500).json({ error: 'Failed to update task' });
        }
    });

    /**
     * DELETE /api/tasks/:id
     * Delete a task
     */
    router.delete('/:id', (req, res) => {
        try {
            const deleted = taskModel.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting task:', error);
            res.status(500).json({ error: 'Failed to delete task' });
        }
    });

    return router;
}

module.exports = createTaskRouter;
