import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskManager from '@/components/tasks/task-manager';

global.fetch = jest.fn();

describe('TaskManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  it('renders the component', async () => {
    render(<TaskManager />);
    await waitFor(() => {
      expect(screen.getByText('Your Tasks')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument();
    });
  });

  it('fetches tasks on mount', async () => {
    render(<TaskManager />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/tasks');
    });
  });

  it('displays tasks when available', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [
        {
          _id: '1',
          title: 'Test Task',
          completed: false,
          dueDate: new Date().toISOString(),
          priority: 'High',
          subtasks: [],
        },
      ],
    });

    render(<TaskManager />);
    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByText('High Priority')).toBeInTheDocument();
    });
  });

  it('shows validation error for empty title', async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    await waitFor(() => {
      expect(screen.getByText('Your Tasks')).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /add task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  it('displays "no tasks" message when empty', async () => {
    render(<TaskManager />);
    await waitFor(() => {
      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    });
  });
});
