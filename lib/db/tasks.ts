"use server"
import prisma  from '../prisma';
import type { Task } from '@prisma/client';

export async function getAllTasks(userId: string): Promise<Task[]> {
  return await prisma.task.findMany({
    where: { userId },
    orderBy: { dueDate: 'desc' }
  });
}

export async function createTask(data: Omit<Task, 'id'>): Promise<Task> {
  return await prisma.task.create({
    data
  });
}

export async function updateTaskdb(id: string, data: Partial<Task>): Promise<Task> {
  return await prisma.task.update({
    where: { id },
    data
  });
}
export async function updateStatusdb(id: string, status:string): Promise<Task> {
  return await prisma.task.update({
    where: { id },
    data: { status }
  });
}
export async function deleteTask(id: string): Promise<Task> {
  return await prisma.task.delete({
    where: { id }
  });
}

// export async function toggleTaskCompletion(id: string, completed: boolean): Promise<Task> {
//   return await prisma.task.update({
//     where: { id },
//     data: { completed }
//   });
// }