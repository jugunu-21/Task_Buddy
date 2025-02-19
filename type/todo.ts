import { Task } from '@prisma/client';
export type ITaskCategory = 'work' | 'personal' | 'home';
export type ITaskStatus = 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED';
export interface ITodos extends Omit<Task, 'dueDate'> {
    dueDate: Date;
    category: ITaskCategory;
}

export interface IAddTask extends Omit<Task, 'id' | 'completed' | 'userId'|'dueDate'> {
    dueDate: string;
  
}
