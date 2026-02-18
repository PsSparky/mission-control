import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const WORKSPACE = "/home/molty/.openclaw/workspace";

// Files every agent shares
const COMMON_FILES = [
  "SOUL.md",
  "MEMORY.md",
  "AGENTS.md",
  "USER.md",
  "TOOLS.md",
  "IDENTITY.md",
  "HEARTBEAT.md",
];

// Agent-specific extra files
const AGENT_EXTRA_FILES: Record<string, string[]> = {
  sparky: [],
  jon: ["agents/jon-snow-task.md"],
  brienne: ["agents/brienne-task.md"],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const agent = searchParams.get("agent");

  if (!agent || !["sparky", "jon", "brienne"].includes(agent)) {
    return NextResponse.json(
      { error: "Invalid agent. Must be sparky, jon, or brienne." },
      { status: 400 }
    );
  }

  const filesToRead = [
    ...COMMON_FILES,
    ...(AGENT_EXTRA_FILES[agent] || []),
  ];

  const files = filesToRead
    .map((relPath) => {
      const fullPath = path.join(WORKSPACE, relPath);
      const name = path.basename(relPath);
      try {
        const content = fs.readFileSync(fullPath, "utf-8");
        return { name, path: relPath, content, exists: true };
      } catch {
        return null; // skip missing files
      }
    })
    .filter(Boolean) as { name: string; path: string; content: string; exists: boolean }[];

  return NextResponse.json({ files });
}
