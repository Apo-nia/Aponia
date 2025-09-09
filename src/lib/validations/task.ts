import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().nullable(),
  deadline: z.date().nullable(),
  reminder: z.date().nullable(),
  category_no: z.string().nullable(),
  priority_no: z.string().nullable(),
  completed: z.boolean(),
  task_type: z.enum(["study", "content"]), // <— NEW
});

export type TaskFormData = z.infer<typeof taskFormSchema>;
