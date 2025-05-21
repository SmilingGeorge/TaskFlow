"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import type { TaskFilterStatus, TaskFilterPriority, TaskFilterDueDate, TaskPriority } from "@/lib/types";

interface FilterControlsProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  filterStatus: TaskFilterStatus;
  onFilterStatusChange: (status: TaskFilterStatus) => void;
  filterPriority: TaskFilterPriority;
  onFilterPriorityChange: (priority: TaskFilterPriority) => void;
  filterCategory: string;
  onFilterCategoryChange: (category: string) => void;
  filterDueDate: TaskFilterDueDate;
  onFilterDueDateChange: (dueDate: TaskFilterDueDate) => void;
  categories: string[];
}

export function FilterControls({
  searchTerm,
  onSearchTermChange,
  filterStatus,
  onFilterStatusChange,
  filterPriority,
  onFilterPriorityChange,
  filterCategory,
  onFilterCategoryChange,
  filterDueDate,
  onFilterDueDateChange,
  categories,
}: FilterControlsProps) {
  return (
    <div className="p-4 bg-card shadow-sm rounded-lg mb-6 space-y-4">
      <div className="flex items-center space-x-2">
        <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Filter & Search</h3>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-10"
          aria-label="Search tasks"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="filter-status" className="text-xs font-medium text-muted-foreground block mb-1">Status</label>
          <Select value={filterStatus} onValueChange={(value) => onFilterStatusChange(value as TaskFilterStatus)} name="filter-status">
            <SelectTrigger aria-label="Filter by status">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="filter-priority" className="text-xs font-medium text-muted-foreground block mb-1">Priority</label>
          <Select value={filterPriority} onValueChange={(value) => onFilterPriorityChange(value as TaskFilterPriority)} name="filter-priority">
            <SelectTrigger aria-label="Filter by priority">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="filter-category" className="text-xs font-medium text-muted-foreground block mb-1">Category</label>
          <Select value={filterCategory} onValueChange={onFilterCategoryChange} name="filter-category">
            <SelectTrigger aria-label="Filter by category">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              <SelectItem value="uncategorized">Uncategorized</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="filter-due-date" className="text-xs font-medium text-muted-foreground block mb-1">Due Date</label>
          <Select value={filterDueDate} onValueChange={(value) => onFilterDueDateChange(value as TaskFilterDueDate)} name="filter-due-date">
            <SelectTrigger aria-label="Filter by due date">
              <SelectValue placeholder="Filter by due date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Due Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="tomorrow">Tomorrow</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="nodate">No Due Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
