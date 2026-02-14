import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Projects — group agents by project/workspace
  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    createdAt: v.number(),
  }),

  // Agents — each OpenClaw agent/session
  agents: defineTable({
    name: v.string(),
    role: v.string(),
    agentType: v.optional(v.union(
      v.literal("lead"),
      v.literal("coordinator"),
      v.literal("developer"),
      v.literal("qa")
    )),
    sessionKey: v.string(),
    model: v.string(),
    status: v.union(
      v.literal("online"),
      v.literal("idle"),
      v.literal("working"),
      v.literal("offline")
    ),
    emoji: v.optional(v.string()),
    projectId: v.optional(v.id("projects")),
    currentTask: v.optional(v.string()),
    lastHeartbeat: v.optional(v.number()),
    totalTasksCompleted: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_session_key", ["sessionKey"])
    .index("by_project", ["projectId"])
    .index("by_status", ["status"]),

  // Tasks — work items assigned to agents
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("inbox"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    assignedTo: v.optional(v.id("agents")),
    projectId: v.optional(v.id("projects")),
    createdAt: v.number(),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    result: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  })
    .index("by_status", ["status"])
    .index("by_agent", ["assignedTo"])
    .index("by_project", ["projectId"]),

  // Activity feed — real-time log of all agent actions
  activities: defineTable({
    agentId: v.id("agents"),
    agentName: v.string(),
    action: v.string(),
    description: v.string(),
    taskId: v.optional(v.id("tasks")),
    projectId: v.optional(v.id("projects")),
    metadata: v.optional(v.any()),
    timestamp: v.number(),
  })
    .index("by_agent", ["agentId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_project", ["projectId"]),

  // Messages — inter-agent communication
  messages: defineTable({
    fromAgentId: v.id("agents"),
    fromAgentName: v.string(),
    toAgentId: v.optional(v.id("agents")),
    content: v.string(),
    threadId: v.optional(v.string()),
    mentions: v.optional(v.array(v.string())),
    timestamp: v.number(),
  })
    .index("by_thread", ["threadId"])
    .index("by_timestamp", ["timestamp"]),

  // Notifications — important events surfaced to the user
  notifications: defineTable({
    title: v.string(),
    message: v.string(),
    type: v.union(
      v.literal("info"),
      v.literal("success"),
      v.literal("warning"),
      v.literal("error")
    ),
    agentId: v.optional(v.id("agents")),
    read: v.boolean(),
    timestamp: v.number(),
  })
    .index("by_read", ["read"])
    .index("by_timestamp", ["timestamp"]),
});
