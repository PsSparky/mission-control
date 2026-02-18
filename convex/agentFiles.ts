import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listForAgent = query({
  args: { agentSessionKey: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("agentFiles")
      .withIndex("by_agent", q => q.eq("agentSessionKey", args.agentSessionKey))
      .collect();
  },
});

export const upsert = mutation({
  args: {
    agentSessionKey: v.string(),
    fileName: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("agentFiles")
      .withIndex("by_agent_file", q =>
        q.eq("agentSessionKey", args.agentSessionKey).eq("fileName", args.fileName)
      )
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { content: args.content, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("agentFiles", { ...args, updatedAt: Date.now() });
    }
  },
});
