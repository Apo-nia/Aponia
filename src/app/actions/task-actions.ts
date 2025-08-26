"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { TaskFormData } from "@/lib/validations/task";

export async function getTask(taskId: string) {
  try {
    const task = await prisma.tasks.findUnique({
      where: { id: taskId },
    });
    return task;
  } catch (error) {
    console.error("Failed to fetch task:", error);
    return null;
  }
}

export async function updateTask(taskId: string, data: TaskFormData) {
  try {
    const updatedTask = await prisma.tasks.update({
      where: { id: taskId },
      data: {
        title: data.title,
        description: data.description,
        deadline: data.deadline,
        reminder: data.reminder,
        category_no: data.category_no,
        priority_no: data.priority_no,
        completed: data.completed,
      },
    });
    
    revalidatePath("/tasks"); // Adjust path as needed
    return { success: true, task: updatedTask };
  } catch (error) {
    console.error("Failed to update task:", error);
    return { success: false, error: "Failed to update task" };
  }
}

export async function deleteTask(taskId: string) {
  try {
    await prisma.tasks.delete({
      where: { id: taskId },
    });
    
    revalidatePath("/tasks"); // Adjust path as needed
    redirect("/tasks"); // Redirect after deletion
  } catch (error) {
    console.error("Failed to delete task:", error);
    return { success: false, error: "Failed to delete task" };
  }
}

export async function toggleTaskComplete(taskId: string, completed: boolean) {
  try {
    const updatedTask = await prisma.tasks.update({
      where: { id: taskId },
      data: { completed },
    });
    
    revalidatePath("/tasks");
    return { success: true, task: updatedTask };
  } catch (error) {
    console.error("Failed to toggle task completion:", error);
    return { success: false, error: "Failed to toggle task completion" };
  }
}