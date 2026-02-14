"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AgentCard } from "./AgentCard";
import { statusColors } from "@/lib/utils";

export function AgentsView() {
  const agents = useQuery(api.agents.list, {}) ?? [];

  const grouped = {
    working: agents.filter((a) => a.status === "working"),
    online: agents.filter((a) => a.status === "online"),
    idle: agents.filter((a) => a.status === "idle"),
    offline: agents.filter((a) => a.status === "offline"),
  };

  const groups = [
    { key: "working", label: "Working", agents: grouped.working },
    { key: "online", label: "Online", agents: grouped.online },
    { key: "idle", label: "Idle", agents: grouped.idle },
    { key: "offline", label: "Offline", agents: grouped.offline },
  ].filter((g) => g.agents.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Agents</h1>
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          {Object.entries(grouped).map(([status, list]) => (
            <span key={status} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
              {list.length} {status}
            </span>
          ))}
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center text-zinc-600">
          No agents registered yet.
        </div>
      ) : (
        groups.map((group) => (
          <div key={group.key}>
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              {group.label} ({group.agents.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.agents.map((agent) => (
                <AgentCard key={agent._id} agent={agent} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
