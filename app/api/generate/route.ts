import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Stable, reusable instructions — cached so repeat calls only pay for the variable input.
const SYSTEM_PROMPT = `You are a proposal writer for service businesses. Given a few details,
produce a clean, professional, ready-to-send client proposal in Markdown.

Structure:
1. A short, warm intro addressed to the client.
2. "Scope of Work" — turn the provided scope into clear bullet points.
3. "Investment" — present the budget/price plainly and confidently.
4. "Next Steps" — a simple call to action.

Tone: plain, confident, outcome-focused. Use Canadian English. No fluff, no AI jargon.
Keep it under ~350 words. Do not invent services that weren't described.`;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "ANTHROPIC_API_KEY is not set" }, { status: 500 });
  }

  const { businessName, clientName, projectType, scope, budget } = await req.json();

  if (!businessName || !clientName || !projectType || !scope || !budget) {
    return Response.json({ error: "All fields are required" }, { status: 400 });
  }

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `From: ${businessName}
To (client): ${clientName}
Project type: ${projectType}
Scope: ${scope}
Budget: ${budget}

Write the proposal.`,
      },
    ],
  });

  const proposal = message.content
    .filter((block) => block.type === "text")
    .map((block) => (block as { text: string }).text)
    .join("\n");

  return Response.json({ proposal });
}
