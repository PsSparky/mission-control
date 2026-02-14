"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { NotificationList } from "./NotificationList";
import { Id } from "../../convex/_generated/dataModel";

export function NotificationsView() {
  const notifications = useQuery(api.notifications.list, {}) ?? [];
  const markRead = useMutation(api.notifications.markRead);
  const markAllRead = useMutation(api.notifications.markAllRead);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Notifications</h1>
        <span className="text-xs text-zinc-500">
          {notifications.filter((n) => !n.read).length} unread
        </span>
      </div>

      <NotificationList
        notifications={notifications}
        onMarkRead={(id) => markRead({ id: id as Id<"notifications"> })}
        onMarkAllRead={() => markAllRead({})}
      />
    </div>
  );
}
