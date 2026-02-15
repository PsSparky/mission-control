"use client";

import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";

interface Task {
  _id: Id<"tasks">;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: Id<"agents">;
  assignedAgentName?: string;
  assignedAgentEmoji?: string;
  createdAt: number;
  tags?: string[];
}

interface TaskCardProps {
  task: Task;
  onClick?: (taskId: Id<"tasks">) => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const getPriorityIndicator = () => {
    if (task.priority === "high" || task.priority === "urgent") {
      return <ArrowUpRight className="w-4 h-4 text-red-400" />;
    }
    return null;
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div 
      className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 hover:border-zinc-600 transition-colors group cursor-pointer"
      onClick={() => onClick?.(task._id)}
    >
      {/* Header with Priority */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-2 flex-1">
          {getPriorityIndicator()}
          <h4 className="text-sm font-bold text-white leading-snug flex-1">{task.title}</h4>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="w-4 h-4 text-zinc-500" />
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Assigned Agent */}
      {task.assignedAgentName && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-[10px]">
            {task.assignedAgentEmoji || "🤖"}
          </div>
          <span className="text-xs text-zinc-400">{task.assignedAgentName}</span>
          <span className="text-xs text-zinc-600">• {getTimeAgo(task.createdAt)}</span>
        </div>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {task.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-zinc-900 border border-zinc-700 rounded text-[10px] text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
