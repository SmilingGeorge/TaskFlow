import { cn } from "@/lib/utils";
import type { TaskPriority } from "@/lib/types";

interface TaskCardProps {
  children: React.ReactNode;
  priority: TaskPriority;
  isCompleted: boolean;
  isDragging?: boolean;
  className?: string;
}

export function TaskCard({ children, priority, isCompleted, isDragging, className }: TaskCardProps) {
  return (
    <div
      className={cn(
        "bg-card p-4 rounded-lg shadow-sm border-l-4 transition-all duration-150 ease-in-out hover:shadow-md",
        {
          "border-red-500": priority === "high" && !isCompleted,
          "border-yellow-500": priority === "medium" && !isCompleted,
          "border-green-500": priority === "low" && !isCompleted,
          "border-gray-300 dark:border-gray-600": isCompleted,
          "opacity-60 bg-card/80": isCompleted,
          "ring-2 ring-primary shadow-xl": isDragging,
        },
        className
      )}
    >
      {children}
    </div>
  );
}
