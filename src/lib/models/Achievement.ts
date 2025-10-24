import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  userId: string;
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string; // Store icon name as string
}

const AchievementSchema: Schema = new Schema({
  userId: { type: String, required: true },
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  unlocked: { type: Boolean, default: false },
  icon: { type: String, required: true },
}, { timestamps: true });

// Compound index to ensure unique achievement per user
AchievementSchema.index({ userId: 1, id: 1 }, { unique: true });

export default mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', AchievementSchema);
