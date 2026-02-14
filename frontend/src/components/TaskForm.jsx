import React, { useState, useEffect } from 'react';

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];

function TaskForm({ onSubmit, initialData, onCancel }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('TODO');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            setStatus(initialData.status || 'TODO');
            setDueDate(initialData.due_date ? initialData.due_date.slice(0, 16) : '');
        } else {
            setTitle('');
            setDescription('');
            setStatus('TODO');
            setDueDate('');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !dueDate) return;

        onSubmit({
            title: title.trim(),
            description: description.trim() || undefined,
            status,
            due_date: new Date(dueDate).toISOString(),
        });

        if (!initialData) {
            setTitle('');
            setDescription('');
            setStatus('TODO');
            setDueDate('');
        }
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <h2>{initialData ? 'Edit Task' : 'Create New Task'}</h2>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter task title"
                        required
                        maxLength={255}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {s === 'TODO' ? 'To Do' : s === 'IN_PROGRESS' ? 'In Progress' : 'Done'}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter task description (optional)"
                        rows={2}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="dueDate">Due Date *</label>
                    <input
                        id="dueDate"
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="form-actions">
                {onCancel && (
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                )}
                <button type="submit" className="btn btn-primary">
                    {initialData ? 'Update Task' : 'Add Task'}
                </button>
            </div>
        </form>
    );
}

export default TaskForm;
