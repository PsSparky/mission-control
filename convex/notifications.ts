import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List notifications
export const list = query({
  args: {
    unreadOnly: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;

    if (args.unreadOnly) {
      return await ctx.db
        .query("notifications")
        .withIndex("by_read", (q) => q.eq("read", false))
        .order("desc")
        .take(limit);
    }

    return await ctx.db
      .query("notifications")
      .order("desc")
      .take(limit);
  },
});

// Count unread notifications
export const unreadCount = query({
  args: {},
  handler: async (ctx) => {
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_read", (q) => q.eq("read", false))
      .collect();
    return unread.length;
  },
});

// Create a notification
export const create = mutation({
  args: {
    title: v.string(),
    message: v.string(),
    type: v.union(
      v.literal("info"),
      v.literal("success"),
      v.literal("warning"),
      v.literal("error")
    ),
    agentId: v.optional(v.id("agents")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      ...args,
      read: false,
      timestamp: Date.now(),
    });
  },
});

// Mark notification as read
export const markRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { read: true });
  },
});

// Mark all as read
export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_read", (q) => q.eq("read", false))
      .collect();
    for (const n of unread) {
      await ctx.db.patch(n._id, { read: true });
    }
  },
});
