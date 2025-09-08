import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskForm } from "@/components/task-form";
// import { createClient } from "@/lib/client";
import { createClient } from "@/lib/server"; // or your supabase server helper

export default async function CreateTaskPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create Task</CardTitle>
          <CardDescription>
            Fill in the details below and click create when you’re done.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaskForm mode="create" userId={user?.id ?? null} />
        </CardContent>
      </Card>
    </div>
  );
}