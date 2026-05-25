import type { Types } from 'mongoose';
import { Schema, type Document, model } from 'mongoose';

export interface IComment {
  author: Types.ObjectId
  body: string
  createdAt: Date
}

export interface ITicket extends Document {
  title: string
  description: string
  status: 'open' | 'in_progress' | 'closed' | 'canceled'
  priority: 'low' | 'medium' | 'high'
  createdBy: Types.ObjectId
  assignedTo?: Types.ObjectId | null
  comments: IComment[]
}

const commentSchema = new Schema<IComment>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    body:   { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const ticketSchema = new Schema<ITicket>(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status:      { type: String, enum: ['open', 'in_progress', 'closed'], default: 'open' },
    priority:    { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    createdBy:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo:  { type: Schema.Types.ObjectId, ref: 'User', default: null },
    comments:    [commentSchema],
  },
  { timestamps: true },
);

export const Ticket = model<ITicket>('Ticket', ticketSchema);
