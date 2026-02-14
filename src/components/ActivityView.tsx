"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ActivityFeed } from "./ActivityFeed";

export function ActivityView() {
  const activities = useQuery(api.activities.list, { limit: 100 }) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Activity Feed</h1>
        <span className="text-xs text-zinc-500">{activities.length} events</span>
      </div>

      <ActivityFeed activities={activities} maxItems={100} />
    </div>
  );
}
