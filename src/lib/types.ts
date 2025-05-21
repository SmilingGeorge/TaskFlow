export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: TaskPriority;
  category?: string;
  dueDate?: string; // ISO string for date, e.g., "2023-12-31"
  createdAt: string; // ISO string for datetime
  order: number; // For drag-and-drop reordering
}

export interface NotificationMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string; // ISO string for datetime
  read: boolean;
}

export type TaskFilterStatus = 'all' | 'active' | 'completed';
export type TaskFilterPriority = 'all' | TaskPriority;
export type TaskFilterDueDate = 'all' | 'today' | 'tomorrow' | 'overdue' | 'upcoming' | 'nodate';
