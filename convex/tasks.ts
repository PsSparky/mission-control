import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List tasks with optional filters
export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("inbox"),
        v.literal("assigned"),
        v.literal("in_progress"),
        v.literal("review"),
        v.literal("done")
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
      inbox: tasks.filter((t) => t.status === "inbox").length,
      assigned: tasks.filter((t) => t.status === "assigned").length,
      inProgress: tasks.filter((t) => t.status === "in_progress").length,
      review: tasks.filter((t) => t.status === "review").length,
      done: tasks.filter((t) => t.status === "done").length,
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
      status: "inbox",
      createdAt: Date.now(),
    });
  },
});

// Update task status
export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(
      v.literal("inbox"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done")
    ),
    result: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = { status: args.status };

    if (args.status === "in_progress") {
      updates.startedAt = Date.now();
    } else if (args.status === "done") {
      updates.completedAt = Date.now();
      if (args.result) updates.result = args.result;
    }

    await ctx.db.patch(args.id, updates);

    // If done, increment agent's task counter
    if (args.status === "done") {
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

// Add a note to a task's progress log
export const addNote = mutation({
  args: {
    id: v.id("tasks"),
    agentName: v.string(),
    note: v.string(),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");
    const existing = task.progressLog ?? [];
    await ctx.db.patch(args.id, {
      progressLog: [...existing, {
        agentName: args.agentName,
        note: args.note,
        timestamp: Date.now(),
      }],
    });
  },
});

// Delete a task
export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
