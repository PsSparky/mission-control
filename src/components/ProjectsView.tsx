"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { FolderKanban } from "lucide-react";

export function ProjectsView() {
  const projects = useQuery(api.projects.list, {}) ?? [];
  const agents = useQuery(api.agents.list, {}) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Projects</h1>
        <span className="text-xs text-zinc-500">{projects.length} projects</span>
      </div>

      {projects.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <FolderKanban className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-600 text-sm">No projects yet.</p>
          <p className="text-zinc-700 text-xs mt-1">Projects group agents and tasks by workspace.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const projectAgents = agents.filter((a) => a.projectId === project._id);
            return (
              <div
                key={project._id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                    style={{ backgroundColor: (project.color || "#6d28d9") + "20" }}
                  >
                    {project.icon || "📁"}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{project.name}</h3>
                    {project.description && (
                      <p className="text-xs text-zinc-500">{project.description}</p>
                    )}
                  </div>
                </div>
                <div className="text-xs text-zinc-500">
                  {projectAgents.length} agent{projectAgents.length !== 1 ? "s" : ""}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
