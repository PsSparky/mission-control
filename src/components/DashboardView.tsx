"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { StatsCards } from "./StatsCards";
import { AgentCard } from "./AgentCard";
import { ActivityFeed } from "./ActivityFeed";
import { TaskBoard } from "./TaskBoard";
import { MessagePanel } from "./MessagePanel";

export function DashboardView() {
  const agents = useQuery(api.agents.list, {}) ?? [];
  const agentStats = useQuery(api.agents.stats, {}) ?? {
    total: 0,
    online: 0,
    working: 0,
    idle: 0,
    offline: 0,
  };
  const taskStats = useQuery(api.tasks.stats, {}) ?? {
    total: 0,
    queued: 0,
    inProgress: 0,
    completed: 0,
    failed: 0,
  };
  const tasks = useQuery(api.tasks.list, { limit: 50 }) ?? [];
  const activities = useQuery(api.activities.list, { limit: 30 }) ?? [];
  const messages = useQuery(api.messages.list, { limit: 20 }) ?? [];

  return (
    <div className="space-y-6">
      {/* Stats overview */}
      <StatsCards agentStats={agentStats} taskStats={taskStats} />

      {/* Agent roster */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Agent Roster
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {agents.length === 0 ? (
            <div className="col-span-3 bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-600">
              No agents registered yet. They&apos;ll appear here once connected.
            </div>
          ) : (
            agents.map((agent) => (
              <AgentCard key={agent._id} agent={agent} />
            ))
          )}
        </div>
      </div>

      {/* Task board */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Task Board
        </h2>
        <TaskBoard tasks={tasks} agents={agents} />
      </div>

      {/* Activity + Messages side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivityFeed activities={activities} />
        <MessagePanel messages={messages} />
      </div>
    </div>
  );
}
