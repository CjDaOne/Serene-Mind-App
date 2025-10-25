import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task } from '@/lib/types';

// Mock API functions - replace with real API calls
const fetchTasks = async (): Promise<Task[]> => {
  // TODO: Replace with actual API call
  return [];
};

const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  // TODO: Replace with actual API call
  return { ...task, id: Date.now().toString() };
};

const updateTask = async (task: Task): Promise<Task> => {
  // TODO: Replace with actual API call
  return task;
};

const deleteTask = async (id: string): Promise<void> => {
  // TODO: Replace with actual API call
};

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};