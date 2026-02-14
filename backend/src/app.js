const express = require('express');
const cors = require('cors');
const createTaskRouter = require('./routes/taskRoutes');
const { db } = require('./database');

function createApp(database) {
    const app = express();
    const dbToUse = database || db;

    app.use(cors());
    app.use(express.json());

    app.use('/api/tasks', createTaskRouter(dbToUse));

    // Health check
    app.get('/health', (req, res) => {
        res.json({ status: 'ok' });
    });

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({ error: 'Route not found' });
    });

    // Error handler
    app.use((err, req, res, next) => {
        console.error('Unhandled error:', err);
        res.status(500).json({ error: 'Internal server error' });
    });

    return app;
}

module.exports = createApp;
