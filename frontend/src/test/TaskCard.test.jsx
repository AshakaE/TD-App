import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskCard from '../components/TaskCard';

const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'A test description',
    status: 'TODO',
    due_date: '2026-12-01T12:00:00.000Z',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
};

describe('TaskCard', () => {
    it('renders task information', () => {
        render(
            <TaskCard
                task={mockTask}
                onStatusChange={vi.fn()}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );
        expect(screen.getByText('Test Task')).toBeInTheDocument();
        expect(screen.getByText('A test description')).toBeInTheDocument();
        expect(screen.getByText('To Do')).toBeInTheDocument();
    });

    it('renders status badge with correct class', () => {
        render(
            <TaskCard
                task={mockTask}
                onStatusChange={vi.fn()}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );
        const badge = screen.getByText('To Do');
        expect(badge.className).toContain('status-TODO');
    });

    it('calls onEdit when edit button is clicked', () => {
        const onEdit = vi.fn();
        render(
            <TaskCard
                task={mockTask}
                onStatusChange={vi.fn()}
                onEdit={onEdit}
                onDelete={vi.fn()}
            />
        );
        fireEvent.click(screen.getByText('Edit'));
        expect(onEdit).toHaveBeenCalledWith(mockTask);
    });

    it('calls onDelete when delete button is clicked', () => {
        const onDelete = vi.fn();
        render(
            <TaskCard
                task={mockTask}
                onStatusChange={vi.fn()}
                onEdit={vi.fn()}
                onDelete={onDelete}
            />
        );
        fireEvent.click(screen.getByText('Delete'));
        expect(onDelete).toHaveBeenCalledWith('1');
    });

    it('calls onStatusChange with next status when status button clicked', () => {
        const onStatusChange = vi.fn();
        render(
            <TaskCard
                task={mockTask}
                onStatusChange={onStatusChange}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );
        fireEvent.click(screen.getByText('→ In Progress'));
        expect(onStatusChange).toHaveBeenCalledWith('1', 'IN_PROGRESS');
    });

    it('does not show description if null', () => {
        const taskNoDesc = { ...mockTask, description: null };
        render(
            <TaskCard
                task={taskNoDesc}
                onStatusChange={vi.fn()}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );
        expect(screen.queryByText('A test description')).not.toBeInTheDocument();
    });
});
