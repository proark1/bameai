import { NextResponse } from "next/server";
import { agentPrompts } from "@/lib/ai/prompts";

const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const mockResponse = {
  dialogue:
    "I can draft a mission to accelerate progress. Do you want a focused sprint or a research spike?",
  suggestedChoices: [
    "Draft a focused sprint mission.",
    "Give me a research spike mission.",
    "Summarize priorities instead."
  ],
  missionProposal: {
    title: "Momentum Sprint",
    objective: "Ship a high-impact update aligned with this week's priorities.",
    steps: [
      "Confirm top 3 objectives",
      "Assign owner and timeline",
      "Deliver update and report learnings"
    ],
    eta: "3 days",
    rewards: {
      xp: 120,
      coins: 40,
      focus: 12,
      intel: 18,
      reputation: 15
    }
  }
};

export async function POST(request: Request) {
  const { message, agentName } = await request.json();
  const agentPrompt = agentPrompts.find((agent) => agent.name === agentName);

  if (!OPENAI_API_KEY) {
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(mockResponse)}\n\n`));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
      }
    });
  }

  const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      stream: false,
      messages: [
        { role: "system", content: agentPrompt?.system ?? "" },
        {
          role: "user",
          content:
            `${message}\n\nRespond with JSON: {"dialogue": string, "suggestedChoices": string[], "missionProposal": object|null}.`
        }
      ]
    })
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Upstream error" }, { status: 500 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content ?? "";
      let parsed = mockResponse;
      try {
        parsed = JSON.parse(content);
      } catch (error) {
        parsed = mockResponse;
      }
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(parsed)}\n\n`));
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    }
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    }
  });
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
