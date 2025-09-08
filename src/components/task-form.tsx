"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { TaskFormData, taskFormSchema } from "@/lib/validations/task";
import { createTask, updateTask, deleteTask, toggleTaskComplete } from "@/app/actions/task-actions";
import { loadPlanningMode, type PlanningMode } from "@/lib/helper/planningMode";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";



interface TaskFormProps {
  initialData?: {
    id: string;
    title: string | null;
    description: string | null;
    deadline: Date | null;
    reminder: Date | null;
    category_no: number | null;
    priority_no: number | null;
    completed: boolean | null;
  };
  mode?: "create" | "edit";
  userId?: string | null; // <— NEW
}

// Custom DateTimePicker component integrated
function DateTimePicker({ 
  value, 
  onChange, 
  placeholder = "Select date and time" 
}: { 
  value?: Date | null; 
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(value || undefined);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      if (date) {
        newDate.setHours(date.getHours());
        newDate.setMinutes(date.getMinutes());
      }
      setDate(newDate);
      onChange(newDate);
    }
  };

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    value: string
  ) => {
    const currentDate = date || new Date();
    const newDate = new Date(currentDate);
    
    if (type === "hour") {
      const hour = parseInt(value);
      const isPM = newDate.getHours() >= 12;
      newDate.setHours(isPM ? (hour % 12) + 12 : hour % 12);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value));
    } else if (type === "ampm") {
      const currentHours = newDate.getHours();
      if (value === "PM" && currentHours < 12) {
        newDate.setHours(currentHours + 12);
      } else if (value === "AM" && currentHours >= 12) {
        newDate.setHours(currentHours - 12);
      }
    }
    
    setDate(newDate);
    onChange(newDate);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MM/dd/yyyy hh:mm aa") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      date && (date.getHours() % 12 === hour % 12 || (date.getHours() === 0 && hour === 12))
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      date && date.getMinutes() === minute ? "default" : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("minute", minute.toString())}
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="">
              <div className="flex sm:flex-col p-2">
                {["AM", "PM"].map((ampm) => (
                  <Button
                    key={ampm}
                    size="icon"
                    variant={
                      date &&
                      ((ampm === "AM" && date.getHours() < 12) ||
                        (ampm === "PM" && date.getHours() >= 12))
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("ampm", ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function TaskForm({ initialData, mode = "edit", userId }: TaskFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // pull planning mode from localStorage (default = 'study')
  const [planningMode, setPlanningMode] = useState<PlanningMode>('study');
  useEffect(() => {
    console.log("loadPlanningMode(userId)");
    console.log("userId");
    console.log(userId);

    console.log(loadPlanningMode(userId));
    setPlanningMode(loadPlanningMode(userId));
  }, [userId]);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      deadline: initialData?.deadline || null,
      reminder: initialData?.reminder || null,
      category_no: initialData?.category_no || null,
      priority_no: initialData?.priority_no || null,
      completed: initialData?.completed ?? false,
      task_type: planningMode, // <— bind default to current mode
    },
  });

  // keeping task_type synced when user toggles navbar mode before opening form
  useEffect(() => {
    form.setValue('task_type', planningMode);
  }, [planningMode, form]);

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      if (mode === "edit" && initialData?.id) {
        const result = await updateTask(initialData.id, data);
        if (result.success) {
          toast.success("Task updated successfully");
          router.refresh();
        } else {
          toast.error(result.error || "Failed to update task");
        }
      }
      // Handle create mode here when needed
      else if(mode === "create") {
        // CREATE FLOW
        const result = await createTask({
          ...data,
          task_type: planningMode, // <— ensure we send it
        });
        if (result.success) {
          toast.success("Task created successfully");
          router.push("/dashboard");
        } else {
          toast.error(result.error || "Failed to create task");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    
    setIsDeleting(true);
    try {
      await deleteTask(initialData.id);
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
      setIsDeleting(false);
    }
  };

  const handleToggleComplete = async () => {
    if (!initialData?.id) return;
    
    setIsToggling(true);
    try {
      const newStatus = !form.getValues("completed");
      const result = await toggleTaskComplete(initialData.id, newStatus);
      if (result.success) {
        form.setValue("completed", newStatus);
        toast.success(`Task marked as ${newStatus ? "completed" : "incomplete"}`);
        router.refresh();
      } else {
        toast.error("Failed to update task status");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsToggling(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter task description"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deadline</FormLabel>
                <FormControl>
                  <DateTimePicker
                    value={field.value}
                    onChange={(date) => field.onChange(date || null)}
                    placeholder="Select deadline"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reminder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reminder</FormLabel>
                <FormControl>
                  <DateTimePicker
                    value={field.value}
                    onChange={(date) => field.onChange(date || null)}
                    placeholder="Select reminder time"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Work</SelectItem>
                    <SelectItem value="2">Personal</SelectItem>
                    <SelectItem value="3">Shopping</SelectItem>
                    <SelectItem value="4">Health</SelectItem>
                    <SelectItem value="5">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Low</SelectItem>
                    <SelectItem value="2">Medium</SelectItem>
                    <SelectItem value="3">High</SelectItem>
                    <SelectItem value="4">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {mode === "edit" && (
          <FormField
            control={form.control}
            name="completed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">
                  Completed
                </FormLabel>
              </FormItem>
            )}
          />
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "edit" ? "Update Task" : "Create Task"}
          </Button>

          {mode === "edit" && (
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={handleToggleComplete}
                disabled={isToggling}
              >
                {isToggling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Toggle Status
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" disabled={isDeleting}>
                    {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the task.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}

          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
