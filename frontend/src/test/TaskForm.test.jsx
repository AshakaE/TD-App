import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskForm from '../components/TaskForm';

describe('TaskForm', () => {
    it('renders the create form by default', () => {
        render(<TaskForm onSubmit={vi.fn()} />);
        expect(screen.getByText('Create New Task')).toBeInTheDocument();
        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
        expect(screen.getByText('Add Task')).toBeInTheDocument();
    });

    it('renders the edit form when initialData is provided', () => {
        const task = {
            id: '1',
            title: 'Test Task',
            description: 'Test desc',
            status: 'IN_PROGRESS',
            due_date: '2026-03-15T10:00:00.000Z',
        };
        render(<TaskForm onSubmit={vi.fn()} initialData={task} onCancel={vi.fn()} />);
        expect(screen.getByText('Edit Task')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test desc')).toBeInTheDocument();
        expect(screen.getByText('Update Task')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('calls onSubmit with form data when submitted', () => {
        const onSubmit = vi.fn();
        render(<TaskForm onSubmit={onSubmit} />);

        fireEvent.change(screen.getByLabelText(/title/i), {
            target: { value: 'New Task' },
        });
        fireEvent.change(screen.getByLabelText(/due date/i), {
            target: { value: '2026-04-01T12:00' },
        });
        fireEvent.click(screen.getByText('Add Task'));

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'New Task',
                status: 'TODO',
            })
        );
    });

    it('does not submit if title is empty', () => {
        const onSubmit = vi.fn();
        render(<TaskForm onSubmit={onSubmit} />);

        fireEvent.change(screen.getByLabelText(/due date/i), {
            target: { value: '2026-04-01T12:00' },
        });
        fireEvent.click(screen.getByText('Add Task'));

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('calls onCancel when cancel button is clicked', () => {
        const onCancel = vi.fn();
        render(
            <TaskForm
                onSubmit={vi.fn()}
                initialData={{ title: 'Test', due_date: '2026-03-15T10:00:00.000Z', status: 'TODO' }}
                onCancel={onCancel}
            />
        );

        fireEvent.click(screen.getByText('Cancel'));
        expect(onCancel).toHaveBeenCalled();
    });
});
