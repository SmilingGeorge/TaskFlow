"use client";

import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskProgressBar } from "@/components/tasks/ProgressBar";
import { FilterControls } from "@/components/tasks/FilterControls";
import { useTaskManager } from "@/hooks/useTaskManager";
import { Skeleton } from "@/components/ui/skeleton";

export default function TaskFlowPage() {
  const {
    tasks,
    isLoading,
    addTask,
    toggleTaskComplete,
    deleteTask,
    updateTask,
    reorderTasks,
    categories,
    progress,
    completedTasksCount,
    totalTasksCount,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    filterCategory,
    setFilterCategory,
    filterDueDate,
    setFilterDueDate,
  } = useTaskManager();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <TaskProgressBar completedTasks={completedTasksCount} totalTasks={totalTasksCount} />
      
      <TaskForm onAddTask={addTask} categories={categories} />

      <FilterControls
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        filterPriority={filterPriority}
        onFilterPriorityChange={setFilterPriority}
        filterCategory={filterCategory}
        onFilterCategoryChange={setFilterCategory}
        filterDueDate={filterDueDate}
        onFilterDueDateChange={setFilterDueDate}
        categories={categories}
      />

      <TaskList
        tasks={tasks}
        onToggleComplete={toggleTaskComplete}
        onDelete={deleteTask}
        onReorderTasks={reorderTasks}
        onUpdateTask={updateTask}
      />
    </div>
  );
}
