"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, PlusCircle } from "lucide-react";
import type { TaskPriority } from "@/lib/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskFormProps {
  onAddTask: (text: string, priority: TaskPriority, category?: string, dueDate?: string) => void;
  categories: string[];
}

export function TaskForm({ onAddTask, categories }: TaskFormProps) {
  const [taskText, setTaskText] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [category, setCategory] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim() === "") return;
    
    let finalCategory = category;
    if (category === "new_category" && newCategory.trim() !== "") {
      finalCategory = newCategory.trim();
    } else if (category === "new_category") {
      finalCategory = undefined; // No category if new is selected but empty
    }
    
    onAddTask(taskText.trim(), priority, finalCategory, dueDate ? format(dueDate, "yyyy-MM-dd") : undefined);
    setTaskText("");
    setPriority("medium");
    setCategory("");
    setNewCategory("");
    setDueDate(undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-card shadow-md rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Add New Task</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <Input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Enter task description..."
          className="lg:col-span-2"
          aria-label="Task description"
        />
        <div className="flex flex-col space-y-1.5">
            <label htmlFor="priority-select" className="text-sm font-medium text-muted-foreground">Priority</label>
            <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)} name="priority-select">
            <SelectTrigger aria-label="Select task priority">
                <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
            </SelectContent>
            </Select>
        </div>
         <div className="flex flex-col space-y-1.5">
            <label htmlFor="due-date-popover" className="text-sm font-medium text-muted-foreground">Due Date</label>
            <Popover>
                <PopoverTrigger asChild name="due-date-popover">
                <Button
                    variant={"outline"}
                    className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                    )}
                    aria-label="Select due date"
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                />
                </PopoverContent>
            </Popover>
        </div>
        <div className="flex flex-col space-y-1.5">
            <label htmlFor="category-select" className="text-sm font-medium text-muted-foreground">Category</label>
            <Select value={category} onValueChange={setCategory} name="category-select">
                <SelectTrigger aria-label="Select task category">
                    <SelectValue placeholder="Category (optional)" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    <SelectItem value="new_category">Create new category...</SelectItem>
                </SelectContent>
            </Select>
        </div>
        {category === "new_category" && (
          <Input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category name"
            className="md:col-span-2 lg:col-span-1"
            aria-label="New category name"
          />
        )}
        <Button type="submit" className="w-full lg:col-start-4">
          <PlusCircle className="mr-2 h-5 w-5" /> Add Task
        </Button>
      </div>
    </form>
  );
}
