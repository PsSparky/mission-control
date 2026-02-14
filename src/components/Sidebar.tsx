"use client";

import {
  LayoutDashboard,
  Users,
  ListTodo,
  Activity,
  MessageSquare,
  Bell,
  FolderKanban,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "agents", label: "Agents", icon: Users },
  { id: "tasks", label: "Tasks", icon: ListTodo },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "projects", label: "Projects", icon: FolderKanban },
];

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  unreadCount: number;
}

export function Sidebar({ activeView, onViewChange, unreadCount }: SidebarProps) {
  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Mission Control</h1>
            <p className="text-xs text-zinc-500">The Small Council</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-violet-500/15 text-violet-400"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              )}
            >
              <Icon className="w-4.5 h-4.5" />
              {item.label}
            </button>
          );
        })}

        {/* Notifications with badge */}
        <button
          onClick={() => onViewChange("notifications")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
            activeView === "notifications"
              ? "bg-violet-500/15 text-violet-400"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
          )}
        >
          <Bell className="w-4.5 h-4.5" />
          Notifications
          {unreadCount > 0 && (
            <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {unreadCount}
            </span>
          )}
        </button>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-zinc-800">
        <button
          onClick={() => onViewChange("settings")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
            activeView === "settings"
              ? "bg-violet-500/15 text-violet-400"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
          )}
        >
          <Settings className="w-4.5 h-4.5" />
          Settings
        </button>
      </div>
    </div>
  );
}
