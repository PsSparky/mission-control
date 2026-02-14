import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List all agents (optionally filter by project)
export const list = query({
  args: { projectId: v.optional(v.id("projects")) },
  handler: async (ctx, args) => {
    if (args.projectId) {
      return await ctx.db
        .query("agents")
        .withIndex("by_project", (q) => q.eq("projectId", args.projectId!))
        .collect();
    }
    return await ctx.db.query("agents").collect();
  },
});

// Get a single agent
export const get = query({
  args: { id: v.id("agents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get agent by session key
export const getBySessionKey = query({
  args: { sessionKey: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("agents")
      .withIndex("by_session_key", (q) => q.eq("sessionKey", args.sessionKey))
      .first();
  },
});

// Get agent stats
export const stats = query({
  args: {},
  handler: async (ctx) => {
    const agents = await ctx.db.query("agents").collect();
    return {
      total: agents.length,
      online: agents.filter((a) => a.status === "online").length,
      working: agents.filter((a) => a.status === "working").length,
      idle: agents.filter((a) => a.status === "idle").length,
      offline: agents.filter((a) => a.status === "offline").length,
    };
  },
});

// Create a new agent
export const create = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    sessionKey: v.string(),
    model: v.string(),
    emoji: v.optional(v.string()),
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("agents", {
      ...args,
      status: "offline",
      totalTasksCompleted: 0,
      createdAt: Date.now(),
    });
  },
});

// Update agent status (called by agents via heartbeat)
export const updateStatus = mutation({
  args: {
    sessionKey: v.string(),
    status: v.union(
      v.literal("online"),
      v.literal("idle"),
      v.literal("working"),
      v.literal("offline")
    ),
    currentTask: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const agent = await ctx.db
      .query("agents")
      .withIndex("by_session_key", (q) => q.eq("sessionKey", args.sessionKey))
      .first();
    if (!agent) throw new Error(`Agent not found: ${args.sessionKey}`);

    await ctx.db.patch(agent._id, {
      status: args.status,
      currentTask: args.currentTask,
      lastHeartbeat: Date.now(),
    });
    return agent._id;
  },
});

// Heartbeat — agents call this periodically
export const heartbeat = mutation({
  args: {
    sessionKey: v.string(),
    currentTask: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const agent = await ctx.db
      .query("agents")
      .withIndex("by_session_key", (q) => q.eq("sessionKey", args.sessionKey))
      .first();
    if (!agent) throw new Error(`Agent not found: ${args.sessionKey}`);

    await ctx.db.patch(agent._id, {
      lastHeartbeat: Date.now(),
      currentTask: args.currentTask,
    });
  },
});

// Update agent details
export const update = mutation({
  args: {
    id: v.id("agents"),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    model: v.optional(v.string()),
    emoji: v.optional(v.string()),
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    // Filter undefined values
    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) updates[key] = value;
    }
    await ctx.db.patch(id, updates);
  },
});

// Delete an agent
export const remove = mutation({
  args: { id: v.id("agents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
