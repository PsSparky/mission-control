# ⚡ Mission Control — The Small Council

Real-time AI agent dashboard for OpenClaw multi-agent systems.

Inspired by [Bhanu Teja's Mission Control](https://x.com/pbteja1998/status/2017662163540971756) — built with Next.js, Convex, and Tailwind CSS.

![Mission Control](https://img.shields.io/badge/Status-Active-emerald) ![Agents](https://img.shields.io/badge/Agents-3-violet)

## Features

- 🟢 **Real-time agent status** — See which agents are online, working, idle, or offline
- 📋 **Task board** — Kanban-style view of all tasks (queued → in progress → done)
- 📡 **Live activity feed** — Watch agent actions stream in real-time
- 💬 **Agent messages** — Inter-agent communication and @mentions
- 🔔 **Notifications** — Important events surfaced instantly
- 📁 **Projects** — Group agents and tasks by workspace
- 📈 **Scalable** — Add agents and projects as you grow

## Tech Stack

- **Frontend:** Next.js 15 + React + Tailwind CSS
- **Backend:** Convex (real-time database + serverless functions)
- **Hosting:** Vercel
- **Agents:** OpenClaw sessions

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Convex

```bash
npx convex dev
```

This will:
- Create a Convex project (sign up if needed)
- Give you a deployment URL
- Start the Convex dev server

### 3. Configure environment

Create `.env.local`:

```bash
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### 4. Seed the database

In the Convex dashboard, run the `seed:seedAgents` mutation to populate initial agents.

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see Mission Control.

## Agent Integration

Agents update their status by calling Convex mutations. Example from an OpenClaw agent:

```typescript
// Update agent status
await convex.mutation(api.agents.updateStatus, {
  sessionKey: "agent:jon-snow:main",
  status: "working",
  currentTask: "Writing article: Best Hirevire Alternatives",
});

// Log activity
await convex.mutation(api.activities.log, {
  agentId: agentId,
  agentName: "Jon Snow",
  action: "writing",
  description: "started writing 'Best Hirevire Alternatives'",
});
```

## Deployment

### Deploy to Vercel

```bash
npx vercel
```

### Deploy Convex to production

```bash
npx convex deploy
```

Set `NEXT_PUBLIC_CONVEX_URL` in your Vercel environment variables.

## Project Structure

```
mission-control/
├── convex/              # Convex backend
│   ├── schema.ts        # Database schema
│   ├── agents.ts        # Agent queries & mutations
│   ├── tasks.ts         # Task management
│   ├── activities.ts    # Activity feed
│   ├── messages.ts      # Inter-agent messages
│   ├── notifications.ts # Notifications
│   ├── projects.ts      # Project management
│   └── seed.ts          # Database seeder
├── src/
│   ├── app/             # Next.js app
│   ├── components/      # React components
│   └── lib/             # Utilities
└── README.md
```

## License

MIT
