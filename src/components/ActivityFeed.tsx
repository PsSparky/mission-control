"use client";

import { timeAgo } from "@/lib/utils";

interface ActivityItem {
  _id: string;
  agentName: string;
  action: string;
  description: string;
  timestamp: number;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
}

const actionEmojis: Record<string, string> = {
  started: "🚀",
  completed: "✅",
  failed: "❌",
  reviewing: "🔍",
  published: "📤",
  heartbeat: "💓",
  spawned: "⚡",
  message: "💬",
  fix: "🔧",
  research: "🔬",
  writing: "✍️",
};

function getActionEmoji(action: string): string {
  return actionEmojis[action.toLowerCase()] || "📋";
}

export function ActivityFeed({ activities, maxItems = 20 }: ActivityFeedProps) {
  const items = activities.slice(0, maxItems);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Live Activity
        </h2>
      </div>
      <div className="divide-y divide-zinc-800/50 max-h-[500px] overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-8 text-center text-zinc-600 text-sm">
            No activity yet. Agents will appear here when they start working.
          </div>
        ) : (
          items.map((item) => (
            <div key={item._id} className="px-4 py-3 hover:bg-zinc-800/30 transition-colors">
              <div className="flex items-start gap-3">
                <span className="text-base mt-0.5">{getActionEmoji(item.action)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-300">
                    <span className="font-medium text-white">{item.agentName}</span>{" "}
                    {item.description}
                  </p>
                  <p className="text-xs text-zinc-600 mt-0.5">{timeAgo(item.timestamp)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
