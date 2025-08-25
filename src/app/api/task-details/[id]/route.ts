import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;

    // Mock task details data - replace with actual database query
    const taskDetails = {
      id: taskId,
      title: "Sample Task",
      description: "This is a detailed description of the task. It includes all the important information about what needs to be done.",
      dueDate: "2025-08-26",
      priority: "High",
      completedHours: 2,
      tags: ["urgent", "project-alpha", "development"]
    };

    // Simulate different tasks based on ID
    if (taskId === "1") {
      taskDetails.title = "Complete Project Documentation";
      taskDetails.description = "Write comprehensive documentation for the new project including API references, user guides, and deployment instructions.";
      taskDetails.priority = "High";
    } else if (taskId === "2") {
      taskDetails.title = "Review Code Changes";
      taskDetails.description = "Review the latest pull requests and provide feedback on the code quality and implementation.";
      taskDetails.priority = "Medium";
    } else if (taskId === "3") {
      taskDetails.title = "Team Meeting Preparation";
      taskDetails.description = "Prepare agenda and materials for the upcoming team meeting scheduled for next week.";
      taskDetails.priority = "Low";
    }

    return NextResponse.json({
      success: true,
      task: taskDetails
    });

  } catch (error) {
    console.error('Error fetching task details:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch task details' 
      },
      { status: 500 }
    );
  }
}
