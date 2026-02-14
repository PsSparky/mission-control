"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { TaskBoard } from "./TaskBoard";

export function TasksView() {
  const tasks = useQuery(api.tasks.list, {}) ?? [];
  const agents = useQuery(api.agents.list, {}) ?? [];
  const taskStats = useQuery(api.tasks.stats, {}) ?? {
    total: 0,
    queued: 0,
    inProgress: 0,
    completed: 0,
    failed: 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Tasks</h1>
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <span>{taskStats.total} total</span>
          <span className="text-blue-400">{taskStats.inProgress} active</span>
          <span className="text-emerald-400">{taskStats.completed} done</span>
        </div>
      </div>

      <TaskBoard tasks={tasks} agents={agents} />
    </div>
  );
}
