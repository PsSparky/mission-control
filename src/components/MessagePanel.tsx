"use client";

import { formatTime, timeAgo } from "@/lib/utils";

interface Message {
  _id: string;
  fromAgentName: string;
  content: string;
  timestamp: number;
  mentions?: string[];
}

interface MessagePanelProps {
  messages: Message[];
}

export function MessagePanel({ messages }: MessagePanelProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          💬 Agent Messages
        </h2>
      </div>
      <div className="divide-y divide-zinc-800/50 max-h-[500px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-zinc-600 text-sm">
            No messages yet. Agent conversations will appear here.
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className="px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-violet-400">{msg.fromAgentName}</span>
                <span className="text-[10px] text-zinc-600">{formatTime(msg.timestamp)}</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{msg.content}</p>
              {msg.mentions && msg.mentions.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {msg.mentions.map((m) => (
                    <span key={m} className="text-xs text-blue-400">@{m}</span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
