import mongoose, { Schema, Document } from 'mongoose';

export interface ISubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface ITask extends Document {
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: Date;
  subtasks: ISubtask[];
  priority: 'Low' | 'Medium' | 'High';
}

const SubtaskSchema: Schema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const TaskSchema: Schema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date, required: true },
  subtasks: [SubtaskSchema],
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
