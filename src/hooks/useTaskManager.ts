
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Task, TaskPriority, TaskFilterStatus, TaskFilterPriority, TaskFilterDueDate } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { isToday, isTomorrow, isPast, parseISO, isValid, startOfDay, addDays } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from './useNotifications';
import { ALL_CATEGORIES_VALUE } from '@/components/tasks/FilterControls';


const TASKS_STORAGE_KEY = 'taskflow-tasks';

export function useTaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { addNotification: addPersistentNotification } = useNotifications();


  // Filters and Search Term
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskFilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<TaskFilterPriority>('all');
  const [filterCategory, setFilterCategory] = useState<string>(ALL_CATEGORIES_VALUE); 
  const [filterDueDate, setFilterDueDate] = useState<TaskFilterDueDate>('all');

  // Load tasks from localStorage
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage", error);
      toast({ title: "Error", description: "Could not load tasks.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Save tasks to localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks to localStorage", error);
        toast({ title: "Error", description: "Could not save tasks.", variant: "destructive" });
      }
    }
  }, [tasks, isLoading, toast]);

  const addTask = useCallback((text: string, priority: TaskPriority, category?: string, dueDate?: string) => {
    const newTask: Task = {
      id: uuidv4(),
      text,
      completed: false,
      priority,
      category: category, // Already handles undefined if no category or "None" is selected
      dueDate,
      createdAt: new Date().toISOString(),
      order: tasks.length, // Append to the end
    };
    setTasks(prevTasks => [...prevTasks, newTask].sort((a, b) => a.order - b.order));
    toast({ title: "Task Added", description: `"${text}" has been added.`, variant: "default" });
    addPersistentNotification(`Task "${text}" added.`, "success");
  }, [tasks.length, toast, addPersistentNotification]);

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    const task = tasks.find(t => t.id === id);
    if (task) {
        toast({ title: "Task Updated", description: `"${task.text}" marked as ${!task.completed ? 'complete' : 'active'}.`});
        addPersistentNotification(`Task "${task.text}" status updated.`, "info");
    }
  }, [tasks, toast, addPersistentNotification]);

  const deleteTask = useCallback((id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    if (taskToDelete) {
      toast({ title: "Task Deleted", description: `"${taskToDelete.text}" has been deleted.`, variant: "destructive" });
      addPersistentNotification(`Task "${taskToDelete.text}" deleted.`, "error");
    }
  }, [tasks, toast, addPersistentNotification]);
  
  const updateTask = useCallback((updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task).sort((a,b) => a.order - b.order));
    toast({ title: "Task Updated", description: `"${updatedTask.text}" has been updated.`});
    addPersistentNotification(`Task "${updatedTask.text}" details updated.`, "info");
  }, [toast, addPersistentNotification]);


  const reorderTasks = useCallback((reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
    toast({ title: "Tasks Reordered", description: "Task order has been updated."});
  }, [toast]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    tasks.forEach(task => {
      if (task.category) uniqueCategories.add(task.category);
    });
    return Array.from(uniqueCategories).sort();
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        // Search term filter
        if (searchTerm && !task.text.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        // Status filter
        if (filterStatus === 'active' && task.completed) return false;
        if (filterStatus === 'completed' && !task.completed) return false;
        // Priority filter
        if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
        
        // Category filter
        if (filterCategory === 'uncategorized') {
          if (task.category) return false; 
        } else if (filterCategory !== ALL_CATEGORIES_VALUE) {
          if (task.category !== filterCategory) return false; 
        }
        // If filterCategory is ALL_CATEGORIES_VALUE, all tasks pass this part of the filter.

        // Due date filter
        if (filterDueDate !== 'all') {
          if (!task.dueDate && filterDueDate !== 'nodate') return false;
          if (task.dueDate && filterDueDate === 'nodate') return false;
          if (task.dueDate) {
            const date = parseISO(task.dueDate);
             if (!isValid(date)) return filterDueDate === 'nodate'; // Treat invalid dates as no date for filtering purposes.
            const normalizedDate = startOfDay(date); // Normalize to start of day

            if (filterDueDate === 'today' && !isToday(normalizedDate)) return false;
            if (filterDueDate === 'tomorrow' && !isTomorrow(normalizedDate)) return false;
            if (filterDueDate === 'overdue' && (!isPast(normalizedDate) || isToday(normalizedDate))) return false;
            if (filterDueDate === 'upcoming') {
                const today = startOfDay(new Date());
                if (normalizedDate <= today || isTomorrow(normalizedDate)) return false; // not today, not tomorrow, but in future
            }
          }
        }
        return true;
      })
      .sort((a, b) => a.order - b.order);
  }, [tasks, searchTerm, filterStatus, filterPriority, filterCategory, filterDueDate]);

  const progress = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completedCount = tasks.filter(task => task.completed).length;
    return (completedCount / tasks.length) * 100;
  }, [tasks]);
  
  const completedTasksCount = useMemo(() => tasks.filter(task => task.completed).length, [tasks]);
  const totalTasksCount = tasks.length;


  return {
    tasks: filteredTasks, // Return filtered tasks for display
    allTasks: tasks, // Return all tasks for operations like category generation
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
    // Filters
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
  };
}
