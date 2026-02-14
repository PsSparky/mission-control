"use client";

import { cn, priorityColors, timeAgo } from "@/lib/utils";

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "queued" | "in_progress" | "completed" | "failed";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  createdAt: number;
  completedAt?: number;
  tags?: string[];
}

interface TaskBoardProps {
  tasks: Task[];
  agents: { _id: string; name: string; emoji?: string }[];
  view?: "kanban" | "list";
}

const columns = [
  { id: "queued" as const, label: "Queued", dotColor: "bg-zinc-400" },
  { id: "in_progress" as const, label: "In Progress", dotColor: "bg-blue-400" },
  { id: "completed" as const, label: "Completed", dotColor: "bg-emerald-400" },
  { id: "failed" as const, label: "Failed", dotColor: "bg-red-400" },
];

function TaskCard({
  task,
  agentName,
}: {
  task: Task;
  agentName?: string;
}) {
  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3 hover:border-zinc-600 transition-all cursor-default">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-zinc-200 leading-snug">{task.title}</h4>
        <span
          className={cn(
            "text-[10px] px-1.5 py-0.5 rounded font-medium uppercase shrink-0",
            priorityColors[task.priority]
          )}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-zinc-500 mt-1.5 line-clamp-2">{task.description}</p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-700 text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-2.5">
        {agentName && (
          <span className="text-xs text-zinc-500">→ {agentName}</span>
        )}
        <span className="text-[10px] text-zinc-600 ml-auto">{timeAgo(task.createdAt)}</span>
      </div>
    </div>
  );
}

export function TaskBoard({ tasks, agents }: TaskBoardProps) {
  const agentMap = new Map(agents.map((a) => [a._id, a]));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        return (
          <div key={col.id} className="bg-zinc-900 border border-zinc-800 rounded-xl">
            <div className="p-3 border-b border-zinc-800 flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", col.dotColor)} />
              <h3 className="text-sm font-medium text-zinc-300">{col.label}</h3>
              <span className="text-xs text-zinc-600 ml-auto">{colTasks.length}</span>
            </div>
            <div className="p-2 space-y-2 max-h-[400px] overflow-y-auto">
              {colTasks.length === 0 ? (
                <p className="text-xs text-zinc-700 text-center py-4">No tasks</p>
              ) : (
                colTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    agentName={
                      task.assignedTo ? agentMap.get(task.assignedTo)?.name : undefined
                    }
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
