import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const statusColors: Record<string, string> = {
  online: "bg-emerald-500",
  working: "bg-blue-500",
  idle: "bg-amber-500",
  offline: "bg-zinc-500",
};

export const statusDotColors: Record<string, string> = {
  online: "bg-emerald-400",
  working: "bg-blue-400 animate-pulse",
  idle: "bg-amber-400",
  offline: "bg-zinc-600",
};

export const priorityColors: Record<string, string> = {
  low: "text-zinc-400 bg-zinc-800",
  medium: "text-blue-400 bg-blue-900/30",
  high: "text-amber-400 bg-amber-900/30",
  urgent: "text-red-400 bg-red-900/30",
};

export const taskStatusColors: Record<string, string> = {
  queued: "text-zinc-400 bg-zinc-800",
  in_progress: "text-blue-400 bg-blue-900/30",
  completed: "text-emerald-400 bg-emerald-900/30",
  failed: "text-red-400 bg-red-900/30",
};

export const notificationTypeIcons: Record<string, string> = {
  info: "ℹ️",
  success: "✅",
  warning: "⚠️",
  error: "❌",
};
