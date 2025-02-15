import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const dueDate = searchParams.get('dueDate');
  const search = searchParams.get('search');
  const userId = searchParams.get('userId');

  try {
    const where: any = { userId };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (dueDate && dueDate !== 'all') {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const weekLater = new Date(today);
      weekLater.setDate(weekLater.getDate() + 7);
      const monthLater = new Date(today);
      monthLater.setMonth(monthLater.getMonth() + 1);

      switch (dueDate) {
        case 'today':
          where.dueDate = {
            gte: today,
            lt: tomorrow,
          };
          break;
        case 'tomorrow':
          where.dueDate = {
            gte: tomorrow,
            lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
          };
          break;
        case 'week':
          where.dueDate = {
            gte: today,
            lt: weekLater,
          };
          break;
        case 'month':
          where.dueDate = {
            gte: today,
            lt: monthLater,
          };
          break;
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Error fetching tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const task = await prisma.task.create({
      data: body,
    });
    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Error creating task' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') ?? undefined;
    const body = await request.json();

    const task = await prisma.task.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Error updating task' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') ?? undefined;

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Error deleting task' }, { status: 500 });
  }
}