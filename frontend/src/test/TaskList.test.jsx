import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskList from '../components/TaskList';

const mockTasks = [
    {
        id: '1',
        title: 'Task One',
        description: 'Description one',
        status: 'TODO',
        due_date: '2026-05-01T12:00:00.000Z',
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
    },
    {
        id: '2',
        title: 'Task Two',
        description: null,
        status: 'IN_PROGRESS',
        due_date: '2026-06-01T12:00:00.000Z',
        created_at: '2026-01-02T00:00:00.000Z',
        updated_at: '2026-01-02T00:00:00.000Z',
    },
];

describe('TaskList', () => {
    it('renders empty state when no tasks', () => {
        render(
            <TaskList
                tasks={[]}
                onStatusChange={vi.fn()}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );
        expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
    });

    it('renders all tasks', () => {
        render(
            <TaskList
                tasks={mockTasks}
                onStatusChange={vi.fn()}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );
        expect(screen.getByText('Task One')).toBeInTheDocument();
        expect(screen.getByText('Task Two')).toBeInTheDocument();
        expect(screen.getByText('Description one')).toBeInTheDocument();
    });
});
