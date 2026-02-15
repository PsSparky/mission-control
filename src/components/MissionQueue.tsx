"use client";

import { TaskCard } from "./TaskCard";
import { Id } from "../../convex/_generated/dataModel";

interface Task {
  _id: Id<"tasks">;
  title: string;
  description?: string;
  status: "inbox" | "assigned" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: Id<"agents">;
  assignedAgentName?: string;
  assignedAgentEmoji?: string;
  createdAt: number;
  tags?: string[];
}

const COLUMNS = [
  { id: "inbox", name: "INBOX", color: "bg-zinc-500" },
  { id: "assigned", name: "ASSIGNED", color: "bg-blue-500" },
  { id: "in_progress", name: "IN PROGRESS", color: "bg-amber-500" },
  { id: "review", name: "REVIEW", color: "bg-violet-500" },
  { id: "done", name: "DONE", color: "bg-emerald-500" },
] as const;

interface MissionQueueProps {
  tasks: Task[];
  onTaskClick?: (taskId: Id<"tasks">) => void;
}

export function MissionQueue({ tasks, onTaskClick }: MissionQueueProps) {
  const getTasksByStatus = (status: string) => {
    return tasks.filter((t) => t.status === status);
  };

  const getStatusCounts = () => {
    return {
      inbox: getTasksByStatus("inbox").length,
      assigned: getTasksByStatus("assigned").length,
      in_progress: getTasksByStatus("in_progress").length,
      review: getTasksByStatus("review").length,
      done: getTasksByStatus("done").length,
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="flex-1 bg-zinc-900 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Mission Queue</h2>
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
            </div>
          </div>

          {/* Filter pills removed — column headers below are enough */}
        </div>

        {/* Kanban Columns */}
        <div className="grid grid-cols-5 gap-4">
          {COLUMNS.map((col) => {
            const columnTasks = getTasksByStatus(col.id);
            return (
              <div key={col.id} className="flex flex-col">
                {/* Column Header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 ${col.color} rounded-full`} />
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                    {col.name}
                  </h3>
                  <span className="ml-auto px-2 py-0.5 bg-zinc-800 rounded-full text-xs font-semibold text-zinc-500">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Task Cards */}
                <div className="space-y-3 flex-1">
                  {columnTasks.length === 0 ? (
                    <div className="bg-zinc-800/30 border border-dashed border-zinc-700 rounded-lg p-6 text-center">
                      <p className="text-xs text-zinc-600">No tasks</p>
                    </div>
                  ) : (
                    columnTasks.map((task) => <TaskCard key={task._id} task={task} onClick={onTaskClick} />)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
