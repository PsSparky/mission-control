"use client";

import { cn, timeAgo, notificationTypeIcons } from "@/lib/utils";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  timestamp: number;
}

interface NotificationListProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export function NotificationList({
  notifications,
  onMarkRead,
  onMarkAllRead,
}: NotificationListProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">🔔 Notifications</h2>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={onMarkAllRead}
            className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>
      <div className="divide-y divide-zinc-800/50 max-h-[600px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-zinc-600 text-sm">
            No notifications.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.read && onMarkRead(n._id)}
              className={cn(
                "px-4 py-3 transition-colors cursor-pointer",
                !n.read ? "bg-zinc-800/30 hover:bg-zinc-800/50" : "hover:bg-zinc-800/20"
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-base">{notificationTypeIcons[n.type]}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-zinc-200">{n.title}</h4>
                    {!n.read && (
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-zinc-600 mt-1">{timeAgo(n.timestamp)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
