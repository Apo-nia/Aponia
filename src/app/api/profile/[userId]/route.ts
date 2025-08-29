// src/app/api/profile/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/profile/[userId] - Get user profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

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

    return NextResponse.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch user profile' 
      },
      { status: 500 }
    );
  }
}

// PUT /api/profile/[userId] - Update user profile
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found' 
        },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    
    if (body.first_name !== undefined) {
      updateData.first_name = body.first_name?.trim() || null;
    }
    
    if (body.last_name !== undefined) {
      updateData.last_name = body.last_name?.trim() || null;
    }
    
    if (body.date_of_birth !== undefined) {
      updateData.date_of_birth = body.date_of_birth ? new Date(body.date_of_birth) : null;
    }
    
    if (body.category !== undefined) {
      updateData.category = Array.isArray(body.category) ? body.category : [];
    }
    
    if (body.max_priority !== undefined) {
      updateData.max_priority = body.max_priority ? parseInt(body.max_priority) : null;
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update profile' 
      },
      { status: 500 }
    );
  }
}