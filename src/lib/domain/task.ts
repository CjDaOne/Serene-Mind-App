import { z } from 'zod';
import type { TaskMetrics as CoreTaskMetrics } from '@/core/index';

// Mirrors core/types.ts TaskMetrics exactly so the bridge is a no-op.
// 1 = minimal, 3 = moderate, 5 = intensive. Defaults at 2 (light) for
// a recovery-oriented system — new tasks assume low cost until told otherwise.
export const TaskMetricsSchema = z.object({
  cognitiveLoad: z.union([
    z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5),
  ]).default(2),
  emotionalFriction: z.union([
    z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5),
  ]).default(2),
  energyDemand: z.union([
    z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5),
  ]).default(2),
}) satisfies z.ZodType<CoreTaskMetrics, z.ZodTypeDef, unknown>;

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
  subtasks: z.array(SubtaskSchema).default([]),
  priority: Priority,
  metrics: TaskMetricsSchema,
  // createdAt carried for the engine bridge (lastActiveAt baseline)
  createdAt: z.date().optional(),
});

export const CreateTaskSchema = TaskSchema.omit({ id: true, createdAt: true }).extend({
  dueDate: z.coerce.date(),
  metrics: TaskMetricsSchema.default({
    cognitiveLoad: 2,
    emotionalFriction: 2,
    energyDemand: 2,
  }),
});

export const TaskDTO = TaskSchema.extend({
  dueDate: z.string().datetime(),
  createdAt: z.string().datetime().optional(),
});

export type Task = z.infer<typeof TaskSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;
export type TaskDTO = z.infer<typeof TaskDTO>;
export type Subtask = z.infer<typeof SubtaskSchema>;
export type Priority = z.infer<typeof Priority>;
export type TaskMetrics = z.infer<typeof TaskMetricsSchema>;

export function toTaskDTO(task: Task): TaskDTO {
  return {
    ...task,
    dueDate: task.dueDate.toISOString(),
    createdAt: task.createdAt?.toISOString(),
  };
}

export function fromTaskDTO(dto: TaskDTO): Task {
  return {
    ...dto,
    dueDate: new Date(dto.dueDate),
    createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
    // Backward compatibility: existing DB tasks without metrics get light defaults
    metrics: dto.metrics ?? {
      cognitiveLoad: 2,
      emotionalFriction: 2,
      energyDemand: 2,
    },
  };
}
