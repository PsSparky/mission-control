"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Sidebar } from "@/components/Sidebar";
import { DashboardView } from "@/components/DashboardView";
import { AgentsView } from "@/components/AgentsView";
import { TasksView } from "@/components/TasksView";
import { ActivityView } from "@/components/ActivityView";
import { MessagesView } from "@/components/MessagesView";
import { NotificationsView } from "@/components/NotificationsView";
import { ProjectsView } from "@/components/ProjectsView";
import { Settings, Zap } from "lucide-react";

function SettingsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-white">Settings</h1>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Mission Control</h2>
            <p className="text-xs text-zinc-500">The Small Council • v1.0.0</p>
          </div>
        </div>
        <div className="space-y-3 text-sm text-zinc-400">
          <p>
            <span className="text-zinc-600">Backend:</span> Convex (real-time)
          </p>
          <p>
            <span className="text-zinc-600">Frontend:</span> Next.js + React + Tailwind
          </p>
          <p>
            <span className="text-zinc-600">Agents:</span> OpenClaw sessions
          </p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4" /> API Integration
        </h3>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Agents update their status by calling Convex mutations directly.
          Use the <code className="text-violet-400 bg-zinc-800 px-1 py-0.5 rounded">agents.updateStatus</code> and{" "}
          <code className="text-violet-400 bg-zinc-800 px-1 py-0.5 rounded">activities.log</code> mutations
          from your OpenClaw agent scripts.
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeView, setActiveView] = useState("dashboard");
  const unreadCount = useQuery(api.notifications.unreadCount, {}) ?? 0;

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView />;
      case "agents":
        return <AgentsView />;
      case "tasks":
        return <TasksView />;
      case "activity":
        return <ActivityView />;
      case "messages":
        return <MessagesView />;
      case "notifications":
        return <NotificationsView />;
      case "projects":
        return <ProjectsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        unreadCount={unreadCount}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">{renderView()}</div>
      </main>
    </div>
  );
}
