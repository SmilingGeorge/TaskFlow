"use client";

import type { NotificationMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
  notification: NotificationMessage;
  onDismiss: (id: string) => void;
}

export function NotificationItem({ notification, onDismiss }: NotificationItemProps) {
  const Icon = {
    info: Info,
    success: CheckCircle2,
    warning: AlertCircle,
    error: XCircle,
  }[notification.type];

  return (
    <div
      className={cn(
        "flex items-start p-3 space-x-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow",
        {
          "bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700": notification.type === "info",
          "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700": notification.type === "success",
          "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-700": notification.type === "warning",
          "bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-700": notification.type === "error",
        }
      )}
    >
      <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", {
        "text-blue-500": notification.type === "info",
        "text-green-500": notification.type === "success",
        "text-yellow-500": notification.type === "warning",
        "text-red-500": notification.type === "error",
      })} />
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{notification.message}</p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
        </p>
      </div>
      <button
        onClick={() => onDismiss(notification.id)}
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss notification"
      >
        <XCircle className="h-4 w-4" />
      </button>
    </div>
  );
}
