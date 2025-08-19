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

    // Build where clause dynamically
    const where: any = {};
    
    if (completed !== null) {
      where.completed = completed === 'true';
    }
    
    if (category) {
      where.category_no = BigInt(category);
    }
    
    if (priority) {
      where.priority_no = BigInt(priority);
    }

    const tasks = await prisma.tasks.findMany({
      where,
      orderBy: [
        { priority_no: 'desc' },
        { created_at: 'desc' }
      ]
    });

    // Convert BigInt to string for JSON serialization
    const serializedTasks = tasks.map(task => ({
      ...task,
      category_no: task.category_no?.toString() || null,
      priority_no: task.priority_no?.toString() || null,
    }));

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
    
    if (body.category_no !== undefined) {
      taskData.category_no = BigInt(body.category_no);
    }
    
    if (body.priority_no !== undefined) {
      taskData.priority_no = BigInt(body.priority_no);
    }

    // If user_id is provided, include it (otherwise let DB generate default)
    if (body.user_id) {
      taskData.user_id = body.user_id;
    }

    const newTask = await prisma.tasks.create({
      data: taskData
    });

    // Serialize BigInt fields for JSON response
    const serializedTask = {
      ...newTask,
      category_no: newTask.category_no?.toString() || null,
      priority_no: newTask.priority_no?.toString() || null,
    };

    return NextResponse.json({
      success: true,
      data: serializedTask,
      message: 'Task created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating task:', error);
    
    // Handle Prisma validation errors
    if (error instanceof Error && error.message.includes('Invalid')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid data provided' 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create task' 
      },
      { status: 500 }
    );
  }
}

