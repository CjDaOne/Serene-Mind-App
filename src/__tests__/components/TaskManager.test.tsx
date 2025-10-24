import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskManager from '@/components/tasks/task-manager';
import { useTaskStore } from '@/lib/store';

// Mock the store
jest.mock('@/lib/store', () => ({
  useTaskStore: jest.fn(),
}));

const mockUseTaskStore = useTaskStore as jest.MockedFunction<typeof useTaskStore>;

describe('TaskManager', () => {
  const mockAddTask = jest.fn();
  const mockDeleteTask = jest.fn();
  const mockToggleTask = jest.fn();
  const mockUpdateSubtask = jest.fn();
  const mockAddSubtasks = jest.fn();

  beforeEach(() => {
    mockUseTaskStore.mockReturnValue({
      tasks: [],
      addTask: mockAddTask,
      deleteTask: mockDeleteTask,
      toggleTask: mockToggleTask,
      updateSubtask: mockUpdateSubtask,
      addSubtasks: mockAddSubtasks,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component', () => {
    render(<TaskManager />);
    expect(screen.getByText('Your Tasks')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument();
  });

  it('adds a task successfully', async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    const input = screen.getByPlaceholderText('Add a new task...');
    const submitButton = screen.getByRole('button', { name: /add task/i });

    await user.type(input, 'Test Task');
    await user.click(submitButton);

    expect(mockAddTask).toHaveBeenCalledWith({
      title: 'Test Task',
      completed: false,
      dueDate: expect.any(Date),
      priority: 'Medium',
      subtasks: [],
    });
  });

  it('shows validation error for empty title', async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    const submitButton = screen.getByRole('button', { name: /add task/i });
    await user.click(submitButton);

    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(mockAddTask).not.toHaveBeenCalled();
  });

  it('displays tasks when available', () => {
    mockUseTaskStore.mockReturnValue({
      tasks: [
        {
          id: '1',
          title: 'Test Task',
          completed: false,
          dueDate: new Date(),
          priority: 'High',
          subtasks: [],
        },
      ],
      addTask: mockAddTask,
      deleteTask: mockDeleteTask,
      toggleTask: mockToggleTask,
      updateSubtask: mockUpdateSubtask,
      addSubtasks: mockAddSubtasks,
    });

    render(<TaskManager />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('High Priority')).toBeInTheDocument();
  });

  it('toggles task completion', async () => {
    mockUseTaskStore.mockReturnValue({
      tasks: [
        {
          id: '1',
          title: 'Test Task',
          completed: false,
          dueDate: new Date(),
          priority: 'Medium',
          subtasks: [],
        },
      ],
      addTask: mockAddTask,
      deleteTask: mockDeleteTask,
      toggleTask: mockToggleTask,
      updateSubtask: mockUpdateSubtask,
      addSubtasks: mockAddSubtasks,
    });

    const user = userEvent.setup();
    render(<TaskManager />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(mockToggleTask).toHaveBeenCalledWith('1');
  });

  it('deletes a task', async () => {
    mockUseTaskStore.mockReturnValue({
      tasks: [
        {
          id: '1',
          title: 'Test Task',
          completed: false,
          dueDate: new Date(),
          priority: 'Medium',
          subtasks: [],
        },
      ],
      addTask: mockAddTask,
      deleteTask: mockDeleteTask,
      toggleTask: mockToggleTask,
      updateSubtask: mockUpdateSubtask,
      addSubtasks: mockAddSubtasks,
    });

    const user = userEvent.setup();
    render(<TaskManager />);

    const deleteButton = screen.getByRole('button', { name: /delete task/i });
    await user.click(deleteButton);

    expect(mockDeleteTask).toHaveBeenCalledWith('1');
  });
});
