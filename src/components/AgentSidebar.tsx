"use client";

import { Id } from "../../convex/_generated/dataModel";

interface Agent {
  _id: Id<"agents">;
  name: string;
  role: string;
  agentType?: "lead" | "coordinator" | "developer" | "qa";
  emoji?: string;
  status: "online" | "idle" | "working" | "offline";
  currentTask?: string;
  lastHeartbeat?: number;
}

interface AgentSidebarProps {
  agents: Agent[];
  onAgentClick?: (agentId: Id<"agents">) => void;
  mobile?: boolean;
}

export function AgentSidebar({ agents, onAgentClick, mobile }: AgentSidebarProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "working":
      case "online":
        return "text-emerald-400";
      case "idle":
        return "text-amber-400";
      default:
        return "text-zinc-600";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "working":
      case "online":
        return "bg-emerald-500";
      case "idle":
        return "bg-amber-500";
      default:
        return "bg-zinc-600";
    }
  };

  const getRoleBadge = (type: string) => {
    switch (type) {
      case "lead":
        return { label: "LEAD", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
      case "coordinator":
        return { label: "COORD", color: "bg-violet-500/10 text-violet-400 border-violet-500/20" };
      case "developer":
        return { label: "DEV", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
      case "qa":
        return { label: "QA", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
      default:
        return { label: "AGT", color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" };
    }
  };

  const getTimeAgo = (timestamp?: number) => {
    if (!timestamp) return "";
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // On mobile, we render without the aside wrapper (parent handles it)
  return (
    <div className={mobile ? "p-4" : "p-4"}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Agents</h2>
        <div className="px-2 py-0.5 bg-zinc-800 rounded-full text-xs font-semibold text-zinc-400">
          {agents.length}
        </div>
      </div>

      {/* Agent List — grid on mobile, stack on desktop */}
      <div className={mobile ? "grid grid-cols-1 gap-3" : "space-y-3"}>
        {agents.map((agent) => {
          const badge = getRoleBadge(agent.agentType || "developer");
          return (
            <div 
              key={agent._id} 
              className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 cursor-pointer hover:border-zinc-600 transition-colors"
              onClick={() => onAgentClick?.(agent._id)}
            >
              {/* Agent Header */}
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                  {agent.emoji || "🤖"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-white truncate">{agent.name}</h3>
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold border rounded ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${getStatusDot(agent.status)}`} />
                    <span className={`text-xs font-semibold uppercase ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Role Description */}
              <p className="text-xs text-zinc-500 mb-2 leading-relaxed">
                {agent.role}
              </p>

              {/* Current Task */}
              {agent.currentTask && (
                <div className="mt-2 pt-2 border-t border-zinc-700/50">
                  <p className="text-xs text-zinc-400 line-clamp-2">
                    {agent.currentTask}
                  </p>
                </div>
              )}

              {/* Time Ago */}
              {agent.lastHeartbeat && (
                <div className="mt-2 text-[10px] text-zinc-600">
                  {getTimeAgo(agent.lastHeartbeat)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
