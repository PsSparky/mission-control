"use client";

import { useEffect, useState } from "react";
import { Zap, FileText } from "lucide-react";

export function Header({ agentsActive, tasksInQueue }: { agentsActive: number; tasksInQueue: number }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { 
      hour12: false, 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit" 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  return (
    <header className="bg-zinc-900 border-b border-zinc-800 px-3 py-3 md:px-6 md:py-4">
      <div className="flex items-center justify-between">
        {/* Left: Logo + Title + Project */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h1 className="text-sm md:text-lg font-bold tracking-wider text-white">MISSION CONTROL</h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full">
            <FileText className="w-3 h-3 text-violet-400" />
            <span className="text-xs font-medium text-violet-300">SEO Articles</span>
          </div>
        </div>

        {/* Center: Metrics (compact on mobile) */}
        <div className="flex items-center gap-4 md:gap-12">
          <div className="text-center">
            <div className="text-xl md:text-3xl font-bold text-white">{agentsActive}</div>
            <div className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-wide">Active</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-3xl font-bold text-white">{tasksInQueue}</div>
            <div className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-wide">Queue</div>
          </div>
        </div>

        {/* Right: Docs + Clock + Status (hide some on mobile) */}
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => window.open("https://docs.openclaw.ai", "_blank")}
            className="hidden md:block px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-600 rounded-lg transition-colors"
          >
            Docs
          </button>
          <div className="hidden sm:block text-right">
            <div className="text-sm font-mono font-semibold text-white">{formatTime(time)}</div>
            <div className="text-xs text-zinc-500">{formatDate(time)}</div>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] md:text-xs font-semibold text-emerald-400">ONLINE</span>
          </div>
        </div>
      </div>
    </header>
  );
}
