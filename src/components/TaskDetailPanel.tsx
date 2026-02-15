"use client";

import { X, Clock, Calendar, User, Tag, CheckCircle, Circle } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface TaskDetailPanelProps {
  taskId: Id<"tasks">;
  onClose: () => void;
}

const STATUS_COLORS = {
  inbox: "bg-zinc-500",
  assigned: "bg-blue-500",
  in_progress: "bg-amber-500",
  review: "bg-violet-500",
  done: "bg-emerald-500",
};

const PRIORITY_COLORS = {
  low: "bg-zinc-500 text-zinc-300",
  medium: "bg-blue-500 text-blue-300",
  high: "bg-amber-500 text-amber-300",
  urgent: "bg-red-500 text-red-300",
};

const STATUS_TIMELINE = [
  { status: "inbox", label: "Created", icon: Circle },
  { status: "assigned", label: "Assigned", icon: Circle },
  { status: "in_progress", label: "In Progress", icon: Circle },
  { status: "review", label: "Review", icon: Circle },
  { status: "done", label: "Done", icon: CheckCircle },
];

export function TaskDetailPanel({ taskId, onClose }: TaskDetailPanelProps) {
  const task = useQuery(api.tasks.list, {})?.find((t) => t._id === taskId);
  const agents = useQuery(api.agents.list, {}) ?? [];

  if (!task) {
    return null;
  }

  const assignedAgent = task.assignedTo ? agents.find((a) => a._id === task.assignedTo) : null;

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIndex = (status: string) => {
    return STATUS_TIMELINE.findIndex((s) => s.status === status);
  };

  const currentStatusIndex = getStatusIndex(task.status);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-[480px] bg-zinc-900 border-l border-zinc-800 shadow-2xl z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-bold text-white leading-tight pr-8">
              {task.title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          {/* Status & Priority Badges */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`flex items-center gap-2 px-3 py-1.5 ${STATUS_COLORS[task.status]}/20 border border-${STATUS_COLORS[task.status]}/30 rounded-lg`}>
              <div className={`w-2 h-2 ${STATUS_COLORS[task.status]} rounded-full`} />
              <span className="text-xs font-bold uppercase tracking-wide text-white">
                {task.status.replace("_", " ")}
              </span>
            </div>
            <div className={`px-3 py-1.5 ${PRIORITY_COLORS[task.priority]}/20 border border-current/30 rounded-lg`}>
              <span className="text-xs font-bold uppercase tracking-wide">
                {task.priority}
              </span>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-2">
                Description
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {task.description}
              </p>
            </div>
          )}

          {/* Assigned Agent */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-2 flex items-center gap-2">
              <User className="w-3 h-3" />
              Assigned To
            </h3>
            {assignedAgent ? (
              <div className="flex items-center gap-3 p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-sm">
                  {assignedAgent.emoji || "🤖"}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{assignedAgent.name}</div>
                  <div className="text-xs text-zinc-500">{assignedAgent.role}</div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-zinc-800/30 border border-dashed border-zinc-700 rounded-lg text-sm text-zinc-500">
                Unassigned
              </div>
            )}
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                <Tag className="w-3 h-3" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="mb-6 space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-2 flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              Timeline
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-zinc-800/30 border border-zinc-700 rounded-lg">
                <span className="text-xs text-zinc-500">Created</span>
                <span className="text-xs text-zinc-300 font-mono">{formatDate(task.createdAt)}</span>
              </div>
              {task.startedAt && (
                <div className="flex items-center justify-between p-3 bg-zinc-800/30 border border-zinc-700 rounded-lg">
                  <span className="text-xs text-zinc-500">Started</span>
                  <span className="text-xs text-zinc-300 font-mono">{formatDate(task.startedAt)}</span>
                </div>
              )}
              {task.completedAt && (
                <div className="flex items-center justify-between p-3 bg-zinc-800/30 border border-zinc-700 rounded-lg">
                  <span className="text-xs text-zinc-500">Completed</span>
                  <span className="text-xs text-zinc-300 font-mono">{formatDate(task.completedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Clock className="w-3 h-3" />
              Progress
            </h3>
            <div className="relative">
              {STATUS_TIMELINE.map((step, idx) => {
                const isCompleted = idx <= currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;
                const Icon = step.icon;

                return (
                  <div key={step.status} className="flex items-start gap-3 mb-4 last:mb-0">
                    {/* Vertical Line */}
                    {idx < STATUS_TIMELINE.length - 1 && (
                      <div
                        className={`absolute left-[11px] top-[28px] w-0.5 h-8 ${
                          isCompleted ? "bg-emerald-500" : "bg-zinc-700"
                        }`}
                        style={{ marginTop: `${idx * 64}px` }}
                      />
                    )}

                    {/* Icon */}
                    <div
                      className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                        isCompleted
                          ? "bg-emerald-500 border-emerald-500"
                          : "bg-zinc-800 border-zinc-700"
                      }`}
                    >
                      <Icon
                        className={`w-3 h-3 ${
                          isCompleted ? "text-white" : "text-zinc-600"
                        }`}
                      />
                    </div>

                    {/* Label */}
                    <div className="flex-1 pt-0.5">
                      <div
                        className={`text-sm font-bold ${
                          isCurrent ? "text-white" : isCompleted ? "text-emerald-400" : "text-zinc-600"
                        }`}
                      >
                        {step.label}
                      </div>
                      {step.status === "inbox" && task.createdAt && (
                        <div className="text-xs text-zinc-500 mt-0.5">
                          {formatDate(task.createdAt)}
                        </div>
                      )}
                      {step.status === "in_progress" && task.startedAt && (
                        <div className="text-xs text-zinc-500 mt-0.5">
                          {formatDate(task.startedAt)}
                        </div>
                      )}
                      {step.status === "done" && task.completedAt && (
                        <div className="text-xs text-zinc-500 mt-0.5">
                          {formatDate(task.completedAt)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Result */}
          {task.result && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-2">
                Result
              </h3>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <p className="text-sm text-emerald-300 leading-relaxed">
                  {task.result}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
