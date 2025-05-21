"use client";

import type { Task } from "@/lib/types";
import { TaskItem } from "./TaskItem";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"; // Needs: npm install @hello-pangea/dnd
import { useEffect, useState } from "react";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onReorderTasks: (tasks: Task[]) => void;
  onUpdateTask: (task: Task) => void;
}

export function TaskList({ tasks, onToggleComplete, onDelete, onReorderTasks, onUpdateTask }: TaskListProps) {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(typeof window !== 'undefined');
  }, []);
  
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order property for all tasks
    const updatedItems = items.map((task, index) => ({ ...task, order: index }));
    onReorderTasks(updatedItems);
  };

  if (!isBrowser) {
    return null; // Or a loading skeleton
  }

  if (tasks.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No tasks yet. Add one above!</p>;
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <TaskItem
                      task={task}
                      onToggleComplete={onToggleComplete}
                      onDelete={onDelete}
                      onUpdateTask={onUpdateTask}
                      isDragging={snapshot.isDragging}
                      draggableProps={provided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
