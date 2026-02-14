import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import * as api from './api/taskApi';

const STATUS_LABELS = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' };

function App() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const [editingTask, setEditingTask] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const data = await api.fetchTasks();
            setTasks(data);
            setError(null);
        } catch (err) {
            setError('Failed to load tasks. Make sure the backend server is running.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const handleCreateTask = async (taskData) => {
        try {
            await api.createTask(taskData);
            await loadTasks();
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateTask = async (id, updates) => {
        try {
            await api.updateTask(id, updates);
            await loadTasks();
            setEditingTask(null);
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await api.updateTaskStatus(id, status);
            await loadTasks();
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.deleteTask(id);
            await loadTasks();
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const filteredTasks = filter === 'ALL'
        ? tasks
        : tasks.filter((t) => t.status === filter);

    return (
        <div className="app">
            <header className="app-header">
                <h1>Task Manager</h1>
                <p>Manage caseworker tasks efficiently</p>
            </header>

            {error && <div className="error-message" role="alert">{error}</div>}

            <TaskForm
                onSubmit={editingTask ? (data) => handleUpdateTask(editingTask.id, data) : handleCreateTask}
                initialData={editingTask}
                onCancel={editingTask ? () => setEditingTask(null) : undefined}
            />

            <div className="task-list-header">
                <h2>Tasks ({filteredTasks.length})</h2>
                <div className="filter-group">
                    {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map((s) => (
                        <button
                            key={s}
                            className={`filter-btn ${filter === s ? 'active' : ''}`}
                            onClick={() => setFilter(s)}
                        >
                            {s === 'ALL' ? 'All' : STATUS_LABELS[s]}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="empty-state">Loading tasks...</div>
            ) : (
                <TaskList
                    tasks={filteredTasks}
                    onStatusChange={handleStatusChange}
                    onEdit={setEditingTask}
                    onDelete={handleDeleteTask}
                />
            )}
        </div>
    );
}

export default App;
