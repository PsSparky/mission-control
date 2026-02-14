"use client";

import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

interface Activity {
  _id: Id<"activities">;
  agentName: string;
  action: string;
  description: string;
  timestamp: number;
}

interface Agent {
  _id: Id<"agents">;
  name: string;
  emoji?: string;
}

const FEED_TABS = [
  { id: "all", name: "All" },
  { id: "tasks", name: "Tasks" },
  { id: "comments", name: "Comments" },
  { id: "decisions", name: "Decisions" },
  { id: "docs", name: "Docs" },
  { id: "status", name: "Status" },
] as const;

export function LiveFeed({ activities, agents }: { activities: Activity[]; agents: Agent[] }) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const getActionColor = (action: string) => {
    switch (action) {
      case "spawned":
      case "started":
        return "bg-emerald-500";
      case "commented":
      case "updated":
        return "bg-blue-500";
      case "completed":
        return "bg-violet-500";
      case "failed":
      case "error":
        return "bg-red-500";
      default:
        return "bg-zinc-500";
    }
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

  const getAgentCounts = () => {
    const counts: Record<string, number> = {};
    activities.forEach((activity) => {
      counts[activity.agentName] = (counts[activity.agentName] || 0) + 1;
    });
    return counts;
  };

  const agentCounts = getAgentCounts();
  const filteredActivities = selectedAgent
    ? activities.filter((a) => a.agentName === selectedAgent)
    : activities;

  return (
    <aside className="w-80 bg-zinc-900 border-l border-zinc-800 overflow-y-auto">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Live Feed</h2>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400">LIVE</span>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {FEED_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${
                  isActive
                    ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                    : "bg-zinc-800 text-zinc-500 border border-zinc-700 hover:border-zinc-600"
                }`}
              >
                {tab.name}
                <span className="ml-1.5 text-zinc-600">{activities.length}</span>
              </button>
            );
          })}
        </div>

        {/* Agent Filters */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedAgent(null)}
              className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${
                !selectedAgent
                  ? "bg-zinc-700 text-zinc-200 border border-zinc-600"
                  : "bg-zinc-800 text-zinc-500 border border-zinc-700 hover:border-zinc-600"
              }`}
            >
              All Agents
            </button>
            {agents.map((agent) => {
              const isSelected = selectedAgent === agent.name;
              const count = agentCounts[agent.name] || 0;
              return (
                <button
                  key={agent._id}
                  onClick={() => setSelectedAgent(agent.name)}
                  className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${
                    isSelected
                      ? "bg-zinc-700 text-zinc-200 border border-zinc-600"
                      : "bg-zinc-800 text-zinc-500 border border-zinc-700 hover:border-zinc-600"
                  }`}
                >
                  {agent.emoji} {agent.name}
                  <span className="ml-1.5 text-zinc-600">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feed Items */}
        <div className="space-y-3">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs text-zinc-600">No activity yet</p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity._id} className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <div className={`w-2 h-2 ${getActionColor(activity.action)} rounded-full mt-1.5 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      <span className="font-bold text-violet-400">{activity.agentName}</span>{" "}
                      {activity.description}
                    </p>
                    <p className="text-[10px] text-zinc-600 mt-1">{getTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
