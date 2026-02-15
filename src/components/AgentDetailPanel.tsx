"use client";

import { ArrowLeft, User, Clock } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface AgentDetailPanelProps {
  agentId: Id<"agents">;
  onBack: () => void;
  onTaskClick?: (taskId: Id<"tasks">) => void;
}

const STATUS_COLORS = {
  online: "bg-emerald-500 text-emerald-400",
  working: "bg-emerald-500 text-emerald-400",
  idle: "bg-amber-500 text-amber-400",
  offline: "bg-zinc-600 text-zinc-400",
};

const ROLE_BADGES = {
  lead: { label: "LEAD", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  coordinator: { label: "COORD", color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  developer: { label: "DEV", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  qa: { label: "QA", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
};

export function AgentDetailPanel({ agentId, onBack, onTaskClick }: AgentDetailPanelProps) {
  const agent = useQuery(api.agents.get, { id: agentId });
  const tasks = useQuery(api.tasks.list, { assignedTo: agentId }) ?? [];
  const activities = useQuery(api.activities.list, { agentId, limit: 20 }) ?? [];

  if (!agent) {
    return (
      <div className="p-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <p className="text-sm text-zinc-500">Loading...</p>
      </div>
    );
  }

  const badge = ROLE_BADGES[agent.agentType || "developer"];
  const statusColor = STATUS_COLORS[agent.status];

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "Never";
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "spawned":
      case "started":
      case "completed":
        return "bg-emerald-500";
      case "commented":
      case "updated":
        return "bg-blue-500";
      case "decided":
        return "bg-violet-500";
      default:
        return "bg-zinc-500";
    }
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Agents
      </button>

      {/* Agent Header */}
      <div className="mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
            {agent.emoji || "🤖"}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-2">{agent.name}</h2>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 text-xs font-bold border rounded ${badge.color}`}>
                {badge.label}
              </span>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-800 rounded">
                <div className={`w-2 h-2 rounded-full ${statusColor.split(" ")[0]}`} />
                <span className={`text-xs font-bold uppercase ${statusColor.split(" ")[1]}`}>
                  {agent.status}
                </span>
              </div>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">{agent.role}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
            <div className="text-xs text-zinc-500 mb-1">Model</div>
            <div className="text-sm font-mono text-zinc-300">{agent.model}</div>
          </div>
          <div className="p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
            <div className="text-xs text-zinc-500 mb-1">Tasks Completed</div>
            <div className="text-sm font-bold text-white">{agent.totalTasksCompleted || 0}</div>
          </div>
          <div className="p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg col-span-2">
            <div className="text-xs text-zinc-500 mb-1">Last Heartbeat</div>
            <div className="text-sm text-zinc-300">{formatDate(agent.lastHeartbeat)}</div>
          </div>
        </div>

        {/* Current Task */}
        {agent.currentTask && (
          <div className="mt-3 p-3 bg-violet-500/10 border border-violet-500/20 rounded-lg">
            <div className="text-xs text-violet-400 font-bold mb-1">Current Task</div>
            <div className="text-sm text-violet-300">{agent.currentTask}</div>
          </div>
        )}
      </div>

      {/* Assigned Tasks */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
            Assigned Tasks
          </h3>
          <span className="px-2 py-0.5 bg-zinc-800 rounded-full text-xs font-semibold text-zinc-500">
            {tasks.length}
          </span>
        </div>
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <div className="p-4 bg-zinc-800/30 border border-dashed border-zinc-700 rounded-lg text-center">
              <p className="text-xs text-zinc-600">No assigned tasks</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors cursor-pointer"
                onClick={() => onTaskClick?.(task._id)}
              >
                <div className="text-sm font-bold text-white mb-1">{task.title}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 uppercase">{task.status.replace("_", " ")}</span>
                  <span className="text-xs text-zinc-600">•</span>
                  <span className="text-xs text-zinc-500 uppercase">{task.priority}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide flex items-center gap-2">
            <Clock className="w-3 h-3" />
            Recent Activity
          </h3>
          <span className="px-2 py-0.5 bg-zinc-800 rounded-full text-xs font-semibold text-zinc-500">
            {activities.length}
          </span>
        </div>
        <div className="space-y-2">
          {activities.length === 0 ? (
            <div className="p-4 bg-zinc-800/30 border border-dashed border-zinc-700 rounded-lg text-center">
              <p className="text-xs text-zinc-600">No recent activity</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity._id}
                className="p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg"
              >
                <div className="flex items-start gap-2">
                  <div className={`w-2 h-2 ${getActionColor(activity.action)} rounded-full mt-1.5 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {activity.description}
                    </p>
                    <p className="text-[10px] text-zinc-600 mt-1">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
