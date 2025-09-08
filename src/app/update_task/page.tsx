import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskForm } from "@/components/task-form";
import { getTask } from "@/app/actions/task-actions";

interface UpdateTaskPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function UpdateTaskPage({ searchParams }: UpdateTaskPageProps) {
  const params = await searchParams;
  const taskId = params.id;

  if (!taskId) {
    notFound();
  }

  const task = await getTask(taskId);

  if (!task) {
    notFound();
  }

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Update Task</CardTitle>
          <CardDescription>
            Make changes to your task below. Click update when youre done.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaskForm
            initialData={{
              id: task.id,
              title: task.title,
              description: task.description,
              deadline: task.deadline,
              reminder: task.reminder,
              category_no: task.category_no,
              priority_no: task.priority_no,
              completed: task.completed,
            }}
            mode="edit"
          />
        </CardContent>
      </Card>
    </div>
  );
}