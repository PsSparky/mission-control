import { mutation } from "./_generated/server";

// Migration: Add agentType to existing agents
export const addAgentTypes = mutation({
  args: {},
  handler: async (ctx) => {
    const agents = await ctx.db.query("agents").collect();
    
    for (const agent of agents) {
      // Skip if already has agentType
      if (agent.agentType) continue;
      
      // Infer type from name
      let agentType: "coordinator" | "developer" | "qa" = "developer";
      
      if (agent.name.includes("Sparky") || agent.name.includes("Tyrion")) {
        agentType = "coordinator";
      } else if (agent.name.includes("Brienne")) {
        agentType = "qa";
      }
      
      await ctx.db.patch(agent._id, { agentType });
    }
    
    return `Updated ${agents.length} agents with agentType`;
  },
});
