// src/models/todo.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Todo extends Document {
  name: string;
  description: string;
  status: boolean;
  duedate: string;
}

const todoSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: Boolean, default: false },
  duedate: { type: String, required: true },
});

// สร้างโมเดล `Todo` ถ้าไม่มีอยู่แล้ว
const TodoModel: Model<Todo> = mongoose.models.Todo || mongoose.model('todos', todoSchema);

export default TodoModel;
