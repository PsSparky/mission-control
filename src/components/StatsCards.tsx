"use client";

import { Users, ListTodo, Activity, CheckCircle2 } from "lucide-react";

interface StatsCardsProps {
  agentStats: {
    total: number;
    online: number;
    working: number;
    idle: number;
    offline: number;
  };
  taskStats: {
    total: number;
    queued: number;
    inProgress: number;
    completed: number;
    failed: number;
  };
}

export function StatsCards({ agentStats, taskStats }: StatsCardsProps) {
  const stats = [
    {
      label: "Active Agents",
      value: agentStats.online + agentStats.working,
      total: agentStats.total,
      icon: Users,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Tasks In Progress",
      value: taskStats.inProgress,
      total: taskStats.total,
      icon: Activity,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Queued",
      value: taskStats.queued,
      total: undefined,
      icon: ListTodo,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Completed",
      value: taskStats.completed,
      total: taskStats.total,
      icon: CheckCircle2,
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                  {stat.total !== undefined && (
                    <span className="text-sm text-zinc-600">/ {stat.total}</span>
                  )}
                </div>
              </div>
              <div className={`${stat.bgColor} p-2.5 rounded-lg`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
