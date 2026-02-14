import React from 'react';

const STATUS_LABELS = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' };
const NEXT_STATUS = { TODO: 'IN_PROGRESS', IN_PROGRESS: 'DONE', DONE: 'TODO' };

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function isOverdue(dateStr, status) {
    if (status === 'DONE') return false;
    return new Date(dateStr) < new Date();
}

function TaskCard({ task, onStatusChange, onEdit, onDelete }) {
    const overdue = isOverdue(task.due_date, task.status);

    return (
        <div className="task-card" data-testid="task-card">
            <div className="task-content">
                <div className="task-title">{task.title}</div>
                {task.description && (
                    <div className="task-description">{task.description}</div>
                )}
                <div className="task-meta">
                    <span className={`status-badge status-${task.status}`}>
                        {STATUS_LABELS[task.status]}
                    </span>
                    <span className={overdue ? 'overdue' : ''}>
                        Due: {formatDate(task.due_date)}
                        {overdue && ' (Overdue)'}
                    </span>
                </div>
            </div>
            <div className="task-actions">
                <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => onStatusChange(task.id, NEXT_STATUS[task.status])}
                    title={`Move to ${STATUS_LABELS[NEXT_STATUS[task.status]]}`}
                >
                    → {STATUS_LABELS[NEXT_STATUS[task.status]]}
                </button>
                <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => onEdit(task)}
                    title="Edit task"
                >
                    Edit
                </button>
                <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(task.id)}
                    title="Delete task"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default TaskCard;
