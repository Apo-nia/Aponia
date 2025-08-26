import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().nullable(),
  deadline: z.date().nullable(),
  reminder: z.date().nullable(),
  category_no: z.number().int().min(0).nullable(),
  priority_no: z.number().int().min(0).nullable(),
  completed: z.boolean(),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;
