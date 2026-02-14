"use client";

import { cn, statusDotColors, timeAgo } from "@/lib/utils";
import { Bot, Clock, Cpu } from "lucide-react";

interface Agent {
  _id: string;
  name: string;
  role: string;
  model: string;
  status: "online" | "idle" | "working" | "offline";
  emoji?: string;
  currentTask?: string;
  lastHeartbeat?: number;
  totalTasksCompleted?: number;
}

interface AgentCardProps {
  agent: Agent;
  compact?: boolean;
}

export function AgentCard({ agent, compact = false }: AgentCardProps) {
  return (
    <div
      className={cn(
        "bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-all duration-200",
        agent.status === "working" && "border-blue-800/50 shadow-blue-900/20 shadow-lg"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-lg">
            {agent.emoji || <Bot className="w-5 h-5 text-zinc-400" />}
          </div>
          {/* Status dot */}
          <div
            className={cn(
              "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-zinc-900",
              statusDotColors[agent.status]
            )}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white truncate">{agent.name}</h3>
            <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 capitalize">
              {agent.status}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">{agent.role}</p>
        </div>
      </div>

      {!compact && (
        <>
          {/* Current task */}
          {agent.currentTask && agent.status === "working" && (
            <div className="mt-3 p-2 bg-blue-950/30 border border-blue-900/30 rounded-lg">
              <p className="text-xs text-blue-300 truncate">
                🔧 {agent.currentTask}
              </p>
            </div>
          )}

          {/* Meta */}
          <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              {agent.model}
            </span>
            {agent.lastHeartbeat && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo(agent.lastHeartbeat)}
              </span>
            )}
            {(agent.totalTasksCompleted ?? 0) > 0 && (
              <span className="text-emerald-400">
                ✓ {agent.totalTasksCompleted} tasks
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
