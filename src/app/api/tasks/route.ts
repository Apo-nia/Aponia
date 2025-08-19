// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/tasks - Retrieve all tasks with optional filtering
export async function GET(request: NextRequest) {
  try {
    
    const { searchParams } = new URL(request.url);
    const completed = searchParams.get('completed');
    const category = searchParams.get('category_no');
    const priority = searchParams.get('priority_no');
    const deadline = searchParams.get('deadline');
    const deadlineBefore = searchParams.get('deadline_before');
    const deadlineAfter = searchParams.get('deadline_after');

    // Build where clause dynamically
    const where: any = {};
    
    if (completed !== null) {
      where.completed = completed === 'true';
    }
    
    if (category) {
      where.category_no = parseInt(category);
    }
    
    if (priority) {
      where.priority_no = parseInt(priority);
    }

    // Handle deadline filtering
    if (deadline) {
      // Exact deadline match (same day)
      const targetDate = new Date(deadline);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      where.deadline = {
        gte: startOfDay,
        lte: endOfDay
      };
    } else {
      // Range filtering
      if (deadlineAfter || deadlineBefore) {
        where.deadline = {};
        
        if (deadlineAfter) {
          where.deadline.gte = new Date(deadlineAfter);
        }
        
        if (deadlineBefore) {
          where.deadline.lte = new Date(deadlineBefore);
        }
      }
    }

    const tasks = await prisma.tasks.findMany({
      where,
      orderBy: [
        { priority_no: 'desc' },
        { created_at: 'desc' }
      ]
    });

    // No need to serialize Int fields - they're JSON-safe
    const serializedTasks = tasks;

    return NextResponse.json({
      success: true,
      data: serializedTasks,
      count: tasks.length
    });

  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch tasks' 
      },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title?.trim()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Title is required' 
        },
        { status: 400 }
      );
    }

    // Prepare data for insertion
    const taskData: any = {
      title: body.title.trim(),
      description: body.description?.trim() || null,
      completed: body.completed || false,
    };

    // Handle optional fields with proper type conversion
    if (body.deadline) {
      taskData.deadline = new Date(body.deadline);
    }
    
    if (body.reminder) {
      taskData.reminder = new Date(body.reminder);
    }
    
    if (body.category_no !== undefined && body.category_no !== null && body.category_no !== '') {
      taskData.category_no = parseInt(body.category_no);
    }
    
    if (body.priority_no !== undefined && body.priority_no !== null && body.priority_no !== '') {
      taskData.priority_no = parseInt(body.priority_no);
    }

    // If user_id is provided, include it (otherwise let DB generate default)
    if (body.user_id) {
      taskData.user_id = body.user_id;
    }

    const newTask = await prisma.tasks.create({
      data: taskData
    });

    return NextResponse.json({
      success: true,
      data: newTask,
      message: 'Task created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create task' 
      },
      { status: 500 }
    );
  }
}

