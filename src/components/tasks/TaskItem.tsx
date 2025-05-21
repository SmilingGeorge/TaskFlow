"use client";

import type { Task, TaskPriority } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit3, GripVertical, Flag } from "lucide-react";
import { DueDateBadge } from "./DueDateBadge";
import { Badge } from "@/components/ui/badge";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateTask: (task: Task) => void;
  isDragging?: boolean;
  draggableProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function TaskItem({ task, onToggleComplete, onDelete, onUpdateTask, isDragging, draggableProps }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority);

  const handleUpdate = () => {
    if (editText.trim() === "") return;
    onUpdateTask({ ...task, text: editText.trim(), priority: editPriority });
    setIsEditing(false);
  };

  const priorityStyles = {
    low: { iconColor: "text-green-500", label: "Low" },
    medium: { iconColor: "text-yellow-500", label: "Medium" },
    high: { iconColor: "text-red-500", label: "High" },
  };

  if (isEditing) {
    return (
      <TaskCard priority={editPriority} isCompleted={task.completed} className="mb-2">
        <div className="flex flex-col space-y-2">
          <Input value={editText} onChange={(e) => setEditText(e.target.value)} className="text-lg" />
          <Select value={editPriority} onValueChange={(value) => setEditPriority(value as TaskPriority)}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          {/* Add inputs for category and due date if needed for editing */}
          <div className="flex space-x-2 justify-end">
            <Button onClick={handleUpdate} size="sm">Save</Button>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        </div>
      </TaskCard>
    );
  }

  return (
    <TaskCard priority={task.priority} isCompleted={task.completed} isDragging={isDragging} className="mb-2" {...draggableProps}>
      <div className="flex items-start space-x-3">
        <div {...draggableProps} className="cursor-grab touch-none p-1 -ml-1" aria-label="Drag to reorder task">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task.id)}
          className="mt-1"
          aria-labelledby={`task-text-${task.id}`}
        />
        <div className="flex-1">
          <label
            htmlFor={`task-${task.id}`}
            id={`task-text-${task.id}`}
            className={cn(
              "block text-base font-medium text-foreground break-words",
              task.completed && "line-through text-muted-foreground"
            )}
          >
            {task.text}
          </label>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Flag className={cn("h-3 w-3 mr-1", priorityStyles[task.priority].iconColor)} />
              <span>{priorityStyles[task.priority].label} Priority</span>
            </div>
            {task.category && <Badge variant="outline">{task.category}</Badge>}
            <DueDateBadge dueDate={task.dueDate} />
          </div>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} aria-label={`Edit task ${task.text}`}>
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} className="text-destructive hover:text-destructive/90" aria-label={`Delete task ${task.text}`}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </TaskCard>
  );
}
