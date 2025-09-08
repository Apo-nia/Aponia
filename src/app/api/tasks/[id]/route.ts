// app/api/tasks/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/tasks/[id] - Get a specific task by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const task = await prisma.tasks.findUnique({
      where: { id }
    });

    if (!task) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Task not found' 
        },
        { status: 404 }
      );
    }

    // No need to serialize Int fields - they're JSON-safe
    const serializedTask = task;

    return NextResponse.json({
      success: true,
      data: serializedTask
    });

  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch task' 
      },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/[id] - Update a specific task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if task exists
    const existingTask = await prisma.tasks.findUnique({
      where: { id }
    });

    if (!existingTask) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Task not found' 
        },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    
    if (body.title !== undefined) {
      if (!body.title?.trim()) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Title cannot be empty' 
          },
          { status: 400 }
        );
      }
      updateData.title = body.title.trim();
    }
    
    if (body.description !== undefined) {
      updateData.description = body.description?.trim() || null;
    }
    
    if (body.completed !== undefined) {
      updateData.completed = body.completed;
    }
    
    if (body.deadline !== undefined) {
      updateData.deadline = body.deadline ? new Date(body.deadline) : null;
    }
    
    if (body.reminder !== undefined) {
      updateData.reminder = body.reminder ? new Date(body.reminder) : null;
    }
    
    if (body.category_no !== undefined) {
      updateData.category_no = body.category_no ? parseInt(body.category_no) : null;
    }
    
    if (body.priority_no !== undefined) {
      updateData.priority_no = body.priority_no ? parseInt(body.priority_no) : null;
    }

    const updatedTask = await prisma.tasks.update({
      where: { id },
      data: updateData
    });

    // No need to serialize Int fields - they're JSON-safe
    const serializedTask = updatedTask;

    return NextResponse.json({
      success: true,
      data: serializedTask,
      message: 'Task updated successfully'
    });

  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update task' 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete a specific task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if task exists
    const existingTask = await prisma.tasks.findUnique({
      where: { id }
    });

    if (!existingTask) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Task not found' 
        },
        { status: 404 }
      );
    }

    await prisma.tasks.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete task' 
      },
      { status: 500 }
    );
  }
}