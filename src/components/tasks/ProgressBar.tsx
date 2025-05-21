"use client";

import { Progress } from "@/components/ui/progress";

interface TaskProgressBarProps {
  completedTasks: number;
  totalTasks: number;
}

export function TaskProgressBar({ completedTasks, totalTasks }: TaskProgressBarProps) {
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1 text-sm">
        <span className="font-medium text-foreground">Task Progress</span>
        <span className="text-muted-foreground">
          {completedTasks} / {totalTasks} tasks completed
        </span>
      </div>
      <Progress value={progressPercentage} className="w-full h-3" aria-label={`Task completion progress: ${progressPercentage.toFixed(0)}%`} />
       <p className="sr-only">{`${progressPercentage.toFixed(0)}% of tasks completed.`}</p>
    </div>
  );
}
