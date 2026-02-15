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
import { Users, LayoutGrid, Activity } from "lucide-react";

type MobileTab = "agents" | "queue" | "feed";

export default function Home() {
  // State for selected items
  const [selectedTaskId, setSelectedTaskId] = useState<Id<"tasks"> | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<Id<"agents"> | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("queue");

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

  const MOBILE_TABS: { id: MobileTab; label: string; icon: typeof Users }[] = [
    { id: "agents", label: "Agents", icon: Users },
    { id: "queue", label: "Queue", icon: LayoutGrid },
    { id: "feed", label: "Feed", icon: Activity },
  ];

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      {/* Top Header */}
      <Header agentsActive={agentsActive} tasksInQueue={tasksInQueue} />

      {/* === DESKTOP: 3-Column Layout (hidden on mobile) === */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Left: Agents Sidebar (or Agent Detail) */}
        <aside className="w-64 bg-zinc-900 border-r border-zinc-800 overflow-y-auto flex-shrink-0">
          {selectedAgentId ? (
            <AgentDetailPanel 
              agentId={selectedAgentId} 
              onBack={handleBackToAgentList}
              onTaskClick={handleTaskClick}
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

      {/* === MOBILE: Tab-based Layout (hidden on desktop) === */}
      <div className="flex flex-col flex-1 overflow-hidden md:hidden">
        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          {mobileTab === "agents" && (
            <div className="bg-zinc-900 min-h-full">
              {selectedAgentId ? (
                <AgentDetailPanel 
                  agentId={selectedAgentId} 
                  onBack={handleBackToAgentList}
                  onTaskClick={handleTaskClick}
                />
              ) : (
                <AgentSidebar 
                  agents={agents} 
                  onAgentClick={handleAgentClick}
                  mobile
                />
              )}
            </div>
          )}
          {mobileTab === "queue" && (
            <MissionQueue 
              tasks={enrichedTasks} 
              onTaskClick={handleTaskClick}
              mobile
            />
          )}
          {mobileTab === "feed" && (
            <LiveFeed 
              activities={activities} 
              agents={agents} 
              onTaskClick={handleTaskClick}
              mobile
            />
          )}
        </div>

        {/* Bottom Tab Bar */}
        <nav className="flex items-center bg-zinc-900 border-t border-zinc-800 px-2 py-2 flex-shrink-0">
          {MOBILE_TABS.map((tab) => {
            const isActive = mobileTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setMobileTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? "text-violet-400"
                    : "text-zinc-500"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wide">{tab.label}</span>
              </button>
            );
          })}
        </nav>
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
