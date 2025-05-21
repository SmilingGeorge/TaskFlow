"use client";

import { Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function NotificationCenter() {
  const { notifications, dismissNotification, clearAllNotifications, unreadCount, markAllAsRead } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 min-w-0 p-0 flex items-center justify-center text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Open notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4">
          <h4 className="font-medium text-sm">Notifications</h4>
        </div>
        <Separator />
        {notifications.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">No new notifications.</p>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="p-4 space-y-2">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onDismiss={dismissNotification}
                />
              ))}
            </div>
          </ScrollArea>
        )}
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2 flex justify-between items-center">
               <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                Mark all as read
              </Button>
              <Button variant="ghost" size="sm" onClick={clearAllNotifications} className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4 mr-1" /> Clear all
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
