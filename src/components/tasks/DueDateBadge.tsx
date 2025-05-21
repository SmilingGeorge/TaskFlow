"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { isToday, isTomorrow, isPast, parseISO, isValid, format } from 'date-fns';

interface DueDateBadgeProps {
  dueDate: string | undefined; // ISO date string "yyyy-MM-dd"
}

export function DueDateBadge({ dueDate }: DueDateBadgeProps) {
  if (!dueDate) {
    return null; 
  }

  const date = parseISO(dueDate);
  if (!isValid(date)) {
    return <Badge variant="outline" className="text-xs">Invalid Date</Badge>;
  }

  // Adjust date to be at the start of the day for accurate comparison with today
  const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = new Date();
  const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  let text = `Due ${format(normalizedDate, "MMM d")}`;
  let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";

  if (isToday(normalizedDate)) {
    text = "Due Today";
    variant = "default";
  } else if (isTomorrow(normalizedDate)) {
    text = "Due Tomorrow";
    variant = "secondary";
  } else if (isPast(normalizedDate) && !isToday(normalizedDate)) { // Check if past and not today
    text = "Overdue";
    variant = "destructive";
  } else if (normalizedDate > normalizedToday) {
     // Future date, already handled by default text and variant
  }


  return (
    <Badge variant={variant} className="text-xs whitespace-nowrap">
      {text}
    </Badge>
  );
}
