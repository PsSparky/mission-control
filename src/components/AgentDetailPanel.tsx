"use client";

import { ArrowLeft, Clock, FileText, ChevronDown, ChevronRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState, useEffect } from "react";

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

// Map Convex session key → API query param
function getAgentParam(sessionKey?: string): string | null {
  if (!sessionKey) return null;
  if (sessionKey === "agent:main:main") return "sparky";
  if (sessionKey === "agent:jon-snow:main") return "jon";
  if (sessionKey === "agent:brienne:main") return "brienne";
  return null;
}

interface AgentFile {
  name: string;
  path: string;
  content: string;
  exists: boolean;
}

function FileCard({ file }: { file: AgentFile }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-zinc-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-zinc-800 hover:bg-zinc-750 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-violet-400 flex-shrink-0" />
          <span className="text-sm font-mono font-semibold text-violet-300">{file.name}</span>
        </div>
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-zinc-500 flex-shrink-0" />
        )}
      </button>
      {expanded && (
        <div className="bg-zinc-900 border-t border-zinc-700">
          <pre className="p-4 text-xs text-zinc-300 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
            {file.content}
          </pre>
        </div>
      )}
    </div>
  );
}

function FilesTab({ sessionKey }: { sessionKey?: string }) {
  const agentParam = getAgentParam(sessionKey);
  const [files, setFiles] = useState<AgentFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentParam) {
      setError("Unknown agent — cannot map to file system.");
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/agent-files?agent=${agentParam}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setFiles(data.files ?? []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message ?? "Failed to load files");
        setLoading(false);
      });
  }, [agentParam]);

  if (!agentParam) {
    return (
      <div className="p-4 bg-zinc-800/30 border border-dashed border-zinc-700 rounded-lg text-center">
        <p className="text-xs text-zinc-600">No file mapping for this agent</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 text-center">
        <p className="text-xs text-zinc-500 animate-pulse">Loading files…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
        <p className="text-xs text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="p-4 bg-zinc-800/30 border border-dashed border-zinc-700 rounded-lg text-center">
        <p className="text-xs text-zinc-600">No files found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <FileCard key={file.path} file={file} />
      ))}
    </div>
  );
}

type Tab = "tasks" | "activity" | "files";

export function AgentDetailPanel({ agentId, onBack, onTaskClick }: AgentDetailPanelProps) {
  const agent = useQuery(api.agents.get, { id: agentId });
  const tasks = useQuery(api.tasks.list, { assignedTo: agentId }) ?? [];
  const activities = useQuery(api.activities.list, { agentId, limit: 20 }) ?? [];
  const [activeTab, setActiveTab] = useState<Tab>("tasks");

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

  const tabs: { id: Tab; label: string }[] = [
    { id: "tasks", label: "Tasks" },
    { id: "activity", label: "Activity" },
    { id: "files", label: "Files" },
  ];

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

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-zinc-800/50 p-1 rounded-lg border border-zinc-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === tab.id
                ? "bg-violet-600 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "tasks" && (
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
      )}

      {activeTab === "activity" && (
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
      )}

      {activeTab === "files" && (
        <FilesTab sessionKey={agent.sessionKey} />
      )}
    </div>
  );
}
