"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Header } from "@/components/Header";
import { AgentSidebar } from "@/components/AgentSidebar";
import { AgentDetailPanel } from "@/components/AgentDetailPanel";
import { MissionQueue } from "@/components/MissionQueue";
import { LiveFeed } from "@/components/LiveFeed";
import { TaskDetailPanel } from "@/components/TaskDetailPanel";

export default function Home() {
  // State for selected items
  const [selectedTaskId, setSelectedTaskId] = useState<Id<"tasks"> | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<Id<"agents"> | null>(null);

  // Fetch all data
  const agents = useQuery(api.agents.list, {}) ?? [];
  const tasks = useQuery(api.tasks.list, {}) ?? [];
  const activities = useQuery(api.activities.list, { limit: 50 }) ?? [];

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

  // Handlers
  const handleTaskClick = (taskId: Id<"tasks">) => {
    setSelectedTaskId(taskId);
  };

  const handleAgentClick = (agentId: Id<"agents">) => {
    setSelectedAgentId(agentId);
  };

  const handleCloseTaskDetail = () => {
    setSelectedTaskId(null);
  };

  const handleBackToAgentList = () => {
    setSelectedAgentId(null);
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      {/* Top Header */}
      <Header agentsActive={agentsActive} tasksInQueue={tasksInQueue} />

      {/* Main 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Agents Sidebar (or Agent Detail) */}
        <aside className="w-64 bg-zinc-900 border-r border-zinc-800 overflow-y-auto">
          {selectedAgentId ? (
            <AgentDetailPanel 
              agentId={selectedAgentId} 
              onBack={handleBackToAgentList} 
            />
          ) : (
            <AgentSidebar 
              agents={agents} 
              onAgentClick={handleAgentClick} 
            />
          )}
        </aside>

        {/* Center: Mission Queue */}
        <MissionQueue 
          tasks={enrichedTasks} 
          onTaskClick={handleTaskClick} 
        />

        {/* Right: Live Feed */}
        <LiveFeed 
          activities={activities} 
          agents={agents} 
          onTaskClick={handleTaskClick}
        />
      </div>

      {/* Task Detail Slide-Over Panel */}
      {selectedTaskId && (
        <TaskDetailPanel 
          taskId={selectedTaskId} 
          onClose={handleCloseTaskDetail} 
        />
      )}
    </div>
  );
}
