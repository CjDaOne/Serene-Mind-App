import { z } from 'zod';

export const Priority = z.enum(['Low', 'Medium', 'High']);

export const SubtaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
});

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  completed: z.boolean(),
  dueDate: z.date(),
  subtasks: z.array(SubtaskSchema),
  priority: Priority,
});

export const CreateTaskSchema = TaskSchema.omit({ id: true }).extend({
  dueDate: z.coerce.date(),
});

export const TaskDTO = TaskSchema.extend({
  dueDate: z.string().datetime(),
});

export type Task = z.infer<typeof TaskSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;
export type TaskDTO = z.infer<typeof TaskDTO>;
export type Subtask = z.infer<typeof SubtaskSchema>;
export type Priority = z.infer<typeof Priority>;

export function toTaskDTO(task: Task): TaskDTO {
  return {
    ...task,
    dueDate: task.dueDate.toISOString(),
  };
}

export function fromTaskDTO(dto: TaskDTO): Task {
  return {
    ...dto,
    dueDate: new Date(dto.dueDate),
  };
}
