import bcrypt from 'bcryptjs';
import { Schema, type Document, model } from 'mongoose';

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: 'client' | 'agent'
  createdAt: Date
  comparePassword(candidate: string): Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role:     { type: String, enum: ['client', 'agent'], default: 'client' },
  },
  { timestamps: true },
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) { return; }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete (ret as Partial<IUser>).password;
    return ret;
  },
});

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = model<IUser>('User', userSchema);
