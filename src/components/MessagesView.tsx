"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { MessagePanel } from "./MessagePanel";

export function MessagesView() {
  const messages = useQuery(api.messages.list, { limit: 100 }) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Messages</h1>
        <span className="text-xs text-zinc-500">{messages.length} messages</span>
      </div>

      <MessagePanel messages={messages} />
    </div>
  );
}
