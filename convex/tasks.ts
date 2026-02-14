import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List tasks with optional filters
export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("queued"),
        v.literal("in_progress"),
        v.literal("completed"),
        v.literal("failed")
      )
    ),
    projectId: v.optional(v.id("projects")),
    assignedTo: v.optional(v.id("agents")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("tasks");

    if (args.status) {
      const tasks = await q
        .withIndex("by_status", (idx) => idx.eq("status", args.status!))
        .order("desc")
        .collect();
      return args.limit ? tasks.slice(0, args.limit) : tasks;
    }

    if (args.projectId) {
      const tasks = await q
        .withIndex("by_project", (idx) => idx.eq("projectId", args.projectId!))
        .order("desc")
        .collect();
      return args.limit ? tasks.slice(0, args.limit) : tasks;
    }

    if (args.assignedTo) {
      const tasks = await q
        .withIndex("by_agent", (idx) => idx.eq("assignedTo", args.assignedTo!))
        .order("desc")
        .collect();
      return args.limit ? tasks.slice(0, args.limit) : tasks;
    }

    const tasks = await q.order("desc").collect();
    return args.limit ? tasks.slice(0, args.limit) : tasks;
  },
});

// Get task stats
export const stats = query({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").collect();
    return {
      total: tasks.length,
      queued: tasks.filter((t) => t.status === "queued").length,
      inProgress: tasks.filter((t) => t.status === "in_progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
      failed: tasks.filter((t) => t.status === "failed").length,
    };
  },
});

// Create a task
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    assignedTo: v.optional(v.id("agents")),
    projectId: v.optional(v.id("projects")),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      ...args,
      status: "queued",
      createdAt: Date.now(),
    });
  },
});

// Update task status
export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(
      v.literal("queued"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("failed")
    ),
    result: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = { status: args.status };

    if (args.status === "in_progress") {
      updates.startedAt = Date.now();
    } else if (
      args.status === "completed" ||
      args.status === "failed"
    ) {
      updates.completedAt = Date.now();
      if (args.result) updates.result = args.result;
    }

    await ctx.db.patch(args.id, updates);

    // If completed, increment agent's task counter
    if (args.status === "completed") {
      const task = await ctx.db.get(args.id);
      if (task?.assignedTo) {
        const agent = await ctx.db.get(task.assignedTo);
        if (agent) {
          await ctx.db.patch(agent._id, {
            totalTasksCompleted: (agent.totalTasksCompleted || 0) + 1,
          });
        }
      }
    }
  },
});

// Assign task to agent
export const assign = mutation({
  args: {
    id: v.id("tasks"),
    agentId: v.id("agents"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { assignedTo: args.agentId });
  },
});

// Delete a task
export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
