import { mutation } from "./_generated/server";

// Seed the database with our Small Council agents
export const seedAgents = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db.query("agents").first();
    if (existing) return "Already seeded!";

    // Create the SEO Article project
    const projectId = await ctx.db.insert("projects", {
      name: "SEO Articles",
      description: "Automated SEO article writing, publishing, and QA pipeline",
      color: "#8b5cf6",
      icon: "📝",
      createdAt: Date.now(),
    });

    // Create Poonam — Lead / Founder
    const poonamId = await ctx.db.insert("agents", {
      name: "Poonam",
      role: "Founder — oversees everything, final decisions",
      agentType: "lead",
      sessionKey: "human:poonam",
      model: "human",
      emoji: "👑",
      status: "online",
      projectId,
      totalTasksCompleted: 0,
      lastHeartbeat: Date.now(),
      createdAt: Date.now(),
    });

    // Create Sparky (Tyrion) — Lead / Coordinator
    const sparkyId = await ctx.db.insert("agents", {
      name: "Sparky (Tyrion)",
      role: "Coordinator — delegates tasks, reports results",
      agentType: "lead",
      sessionKey: "agent:main:main",
      model: "claude-opus-4",
      emoji: "⚡",
      status: "online",
      projectId,
      totalTasksCompleted: 0,
      lastHeartbeat: Date.now(),
      createdAt: Date.now(),
    });

    // Create Jon Snow — Developer
    const jonId = await ctx.db.insert("agents", {
      name: "Jon Snow",
      role: "Developer — writes articles, runs pipeline, fixes code",
      agentType: "developer",
      sessionKey: "agent:jon-snow:main",
      model: "claude-opus-4",
      emoji: "⚔️",
      status: "offline",
      projectId,
      totalTasksCompleted: 0,
      createdAt: Date.now(),
    });

    // Create Brienne — QA Reviewer
    const brienneId = await ctx.db.insert("agents", {
      name: "Brienne",
      role: "QA Reviewer — reviews in Notion, fixes articles, reports issues",
      agentType: "qa",
      sessionKey: "agent:brienne:main",
      model: "claude-sonnet-4-5",
      emoji: "🛡️",
      status: "offline",
      projectId,
      totalTasksCompleted: 0,
      createdAt: Date.now(),
    });

    // Log initial activity
    await ctx.db.insert("activities", {
      agentId: sparkyId,
      agentName: "Sparky (Tyrion)",
      action: "spawned",
      description: "Mission Control initialized. The Small Council is online.",
      projectId,
      timestamp: Date.now(),
    });

    // Create a welcome notification
    await ctx.db.insert("notifications", {
      title: "Welcome to Mission Control",
      message: "The Small Council has been assembled. Poonam + 3 agents ready for deployment.",
      type: "success",
      read: false,
      timestamp: Date.now(),
    });

    return "Seeded successfully! 4 agents + 1 project created.";
  },
});

// Reseed — clears all data and reseeds fresh
export const reseed = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear all tables
    const tables = ["agents", "tasks", "activities", "messages", "notifications", "projects"] as const;
    for (const table of tables) {
      const docs = await ctx.db.query(table).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
    }

    // Now seed fresh — Create the SEO Article project
    const projectId = await ctx.db.insert("projects", {
      name: "SEO Articles",
      description: "Automated SEO article writing, publishing, and QA pipeline",
      color: "#8b5cf6",
      icon: "📝",
      createdAt: Date.now(),
    });

    // Create Poonam — Lead / Founder
    const poonamId = await ctx.db.insert("agents", {
      name: "Poonam",
      role: "Founder — oversees everything, final decisions",
      agentType: "lead",
      sessionKey: "human:poonam",
      model: "human",
      emoji: "👑",
      status: "online",
      projectId,
      totalTasksCompleted: 0,
      lastHeartbeat: Date.now(),
      createdAt: Date.now(),
    });

    // Create Sparky (Tyrion) — Lead / Coordinator
    const sparkyId = await ctx.db.insert("agents", {
      name: "Sparky (Tyrion)",
      role: "Coordinator — delegates tasks, reports results",
      agentType: "lead",
      sessionKey: "agent:main:main",
      model: "claude-opus-4",
      emoji: "⚡",
      status: "online",
      projectId,
      totalTasksCompleted: 0,
      lastHeartbeat: Date.now(),
      createdAt: Date.now(),
    });

    // Create Jon Snow — Developer
    await ctx.db.insert("agents", {
      name: "Jon Snow",
      role: "Developer — writes articles, runs pipeline, fixes code",
      agentType: "developer",
      sessionKey: "agent:jon-snow:main",
      model: "claude-opus-4",
      emoji: "⚔️",
      status: "offline",
      projectId,
      totalTasksCompleted: 0,
      createdAt: Date.now(),
    });

    // Create Brienne — QA Reviewer
    await ctx.db.insert("agents", {
      name: "Brienne",
      role: "QA Reviewer — reviews in Notion, fixes articles, reports issues",
      agentType: "qa",
      sessionKey: "agent:brienne:main",
      model: "claude-sonnet-4-5",
      emoji: "🛡️",
      status: "offline",
      projectId,
      totalTasksCompleted: 0,
      createdAt: Date.now(),
    });

    // Log activity
    await ctx.db.insert("activities", {
      agentId: sparkyId,
      agentName: "Sparky (Tyrion)",
      action: "spawned",
      description: "Mission Control re-initialized. The Small Council is online.",
      projectId,
      timestamp: Date.now(),
    });

    return "Reseeded successfully! Poonam + 3 agents created.";
  },
});
