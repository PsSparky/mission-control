import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List messages
export const list = query({
  args: {
    limit: v.optional(v.number()),
    threadId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    if (args.threadId) {
      return await ctx.db
        .query("messages")
        .withIndex("by_thread", (q) => q.eq("threadId", args.threadId!))
        .order("desc")
        .take(limit);
    }

    return await ctx.db
      .query("messages")
      .order("desc")
      .take(limit);
  },
});

// Send a message
export const send = mutation({
  args: {
    fromAgentId: v.id("agents"),
    fromAgentName: v.string(),
    toAgentId: v.optional(v.id("agents")),
    content: v.string(),
    threadId: v.optional(v.string()),
    mentions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      ...args,
      timestamp: Date.now(),
    });
  },
});
