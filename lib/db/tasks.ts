"use server"
import prisma from '../prisma';
import type { Task } from '@prisma/client';

export async function getAllTasks(userId: string): Promise<Task[]> {
  try {
    console.log("Attempting to fetch tasks for userId:", userId);
    
    if (!userId) {
      throw new Error('UserId is required to fetch tasks');
    }

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { dueDate: 'desc' }
    });

    if (!tasks) {
      console.warn('No tasks found for user:', userId);
      return [];
    }

    console.log(`Successfully fetched ${tasks.length} tasks for user:`, userId);
    return tasks;
  } catch (error) {
    console.error('Database error while fetching tasks:', error);
    if (error instanceof Error) {
      throw new Error(`Database connection error: ${error.message}`);
    }
    throw new Error('Failed to establish database connection');
  }
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