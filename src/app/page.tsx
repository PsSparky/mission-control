"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Header } from "@/components/Header";
import { AgentSidebar } from "@/components/AgentSidebar";
import { MissionQueue } from "@/components/MissionQueue";
import { LiveFeed } from "@/components/LiveFeed";

export default function Home() {
  // Fetch all data
  const agents = useQuery(api.agents.list, {}) ?? [];
  const tasks = useQuery(api.tasks.list, {}) ?? [];
  const activities = useQuery(api.activities.recent, { limit: 50 }) ?? [];

  // Calculate metrics
  const agentsActive = agents.filter(
    (a) => a.status === "online" || a.status === "working"
  ).length;
  
  const tasksInQueue = tasks.filter(
    (t) => t.status !== "done"
  ).length;

  // Enrich tasks with agent data
  const enrichedTasks = tasks.map((task) => {
    const agent = task.assignedTo ? agents.find((a) => a._id === task.assignedTo) : null;
    return {
      ...task,
      assignedAgentName: agent?.name,
      assignedAgentEmoji: agent?.emoji,
    };
  });

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      {/* Top Header */}
      <Header agentsActive={agentsActive} tasksInQueue={tasksInQueue} />

      {/* Main 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Agents Sidebar */}
        <AgentSidebar agents={agents} />

        {/* Center: Mission Queue */}
        <MissionQueue tasks={enrichedTasks} />

        {/* Right: Live Feed */}
        <LiveFeed activities={activities} agents={agents} />
      </div>
    </div>
  );
}
