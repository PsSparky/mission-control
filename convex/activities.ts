import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List recent activities
export const list = query({
  args: {
    limit: v.optional(v.number()),
    agentId: v.optional(v.id("agents")),
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    if (args.agentId) {
      return await ctx.db
        .query("activities")
        .withIndex("by_agent", (q) => q.eq("agentId", args.agentId!))
        .order("desc")
        .take(limit);
    }

    if (args.projectId) {
      return await ctx.db
        .query("activities")
        .withIndex("by_project", (q) => q.eq("projectId", args.projectId!))
        .order("desc")
        .take(limit);
    }

    return await ctx.db
      .query("activities")
      .order("desc")
      .take(limit);
  },
});

// Log an activity
export const log = mutation({
  args: {
    agentId: v.id("agents"),
    agentName: v.string(),
    action: v.string(),
    description: v.string(),
    taskId: v.optional(v.id("tasks")),
    projectId: v.optional(v.id("projects")),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activities", {
      ...args,
      timestamp: Date.now(),
    });
  },
});
