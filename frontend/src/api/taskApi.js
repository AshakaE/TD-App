const API_BASE = '/api/tasks';

export async function fetchTasks() {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
}

export async function fetchTask(id) {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error('Failed to fetch task');
    return res.json();
}

export async function createTask(task) {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.errors?.join(', ') || 'Failed to create task');
    }
    return res.json();
}

export async function updateTask(id, updates) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.errors?.join(', ') || 'Failed to update task');
    }
    return res.json();
}

export async function updateTaskStatus(id, status) {
    const res = await fetch(`${API_BASE}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update task status');
    return res.json();
}

export async function deleteTask(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete task');
}
