import mongoose, { Schema, Document } from 'mongoose';

export interface IJournalEntry extends Document {
  userId: string;
  date: Date;
  mood: 'Happy' | 'Calm' | 'Sad' | 'Anxious' | 'Excited';
  content: string;
}

const JournalEntrySchema: Schema = new Schema({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  mood: { type: String, enum: ['Happy', 'Calm', 'Sad', 'Anxious', 'Excited'], required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.JournalEntry || mongoose.model<IJournalEntry>('JournalEntry', JournalEntrySchema);
