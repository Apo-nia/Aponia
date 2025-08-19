// src/app/api/dashboard/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/dashboard/[userId] - Get dashboard data for user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // Get user info
    const user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found' 
        },
        { status: 404 }
      );
    }

    // Get today's tasks
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const todayTasks = await prisma.tasks.findMany({
      where: {
        user_id: userId,
        OR: [
          {
            deadline: {
              gte: startOfDay,
              lte: endOfDay
            }
          },
          {
            created_at: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        ]
      },
      orderBy: [
        { completed: 'asc' },
        { priority_no: 'desc' },
        { deadline: 'asc' }
      ]
    });

    // Separate completed and incomplete tasks
    const incompleteTasks = todayTasks.filter(task => !task.completed);
    const completedTasks = todayTasks.filter(task => task.completed);

    // Get task stats
    const totalTasks = todayTasks.length;
    const completedCount = completedTasks.length;
    const completionPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        user,
        tasks: {
          incomplete: incompleteTasks,
          completed: completedTasks,
          total: totalTasks,
          completedCount,
          completionPercentage
        }
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch dashboard data' 
      },
      { status: 500 }
    );
  }
}