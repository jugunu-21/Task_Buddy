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
  const task = await prisma.task.create({
    data
  });

  // Log the creation activity
  await prisma.activityLog.create({
    data: {
      taskId: task.id,
      userId: data.userId,
      action: 'created',
      changes: { newTask: data }
    }
  });

  return task;
}

export async function updateTaskdb(id: string, data: Partial<Task>): Promise<Task> {
  // Get the current state of the task
  const oldTask = await prisma.task.findUnique({ where: { id } });

  const task = await prisma.task.update({
    where: { id },
    data
  });

  // Log the update activity
  await prisma.activityLog.create({
    data: {
      taskId: id,
      userId: data.userId || task.userId,
      action: 'updated',
      changes: { before: oldTask, after: data }
    }
  });

  return task;
}
export async function updateStatusdb(id: string, status:string): Promise<Task> {
  const oldTask = await prisma.task.findUnique({ where: { id } });
  
  const task = await prisma.task.update({
    where: { id },
    data: { status }
  });

  // Log the status change activity
  await prisma.activityLog.create({
    data: {
      taskId: id,
      userId: task.userId,
      action: 'status_changed',
      changes: { oldStatus: oldTask?.status, newStatus: status }
    }
  });

  return task;
}
export async function deleteTask(id: string): Promise<Task> {
  const task = await prisma.task.findUnique({ where: { id } });
  
  // Create deletion activity log before deleting the task
  if (task) {
    await prisma.activityLog.create({
      data: {
        taskId: id,
        userId: task.userId,
        action: 'deleted',
        changes: { deletedTask: task }
      }
    });
  }

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