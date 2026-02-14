import React from 'react';
import TaskCard from './TaskCard';

function TaskList({ tasks, onStatusChange, onEdit, onDelete }) {
    if (tasks.length === 0) {
        return <div className="empty-state">No tasks found. Create one above!</div>;
    }

    return (
        <div>
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={onStatusChange}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

export default TaskList;
