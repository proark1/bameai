"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ChatMessage = {
  id: string;
  speaker: "agent" | "user";
  content: string;
};

export type ChatResponse = {
  dialogue: string;
  suggestedChoices: string[];
  missionProposal: null | {
    title: string;
    objective: string;
    steps: string[];
    eta?: string | null;
    rewards: {
      xp: number;
      coins: number;
      focus: number;
      intel: number;
      reputation: number;
    };
  };
};

type RPGChatProps = {
  agentName: string;
  agentMood: string;
  onMissionProposal: (proposal: ChatResponse["missionProposal"]) => void;
};

export function RPGChat({ agentName, agentMood, onMissionProposal }: RPGChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "seed",
      speaker: "agent",
      content: `Greetings Commander. I have new intelligence ready for you.`
    }
  ]);
  const [choices, setChoices] = useState<string[]>([
    "Share the latest intel.",
    "What should we prioritize today?",
    "Any mission proposals?"
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fallbackResponse = useMemo<ChatResponse>(
    () => ({
      dialogue:
        "I recommend we advance a focused mission to secure momentum. Would you like a proposal?",
      suggestedChoices: [
        "Yes, craft a mission.",
        "Not now, summarize priorities.",
        "Switch to resource updates."
      ],
      missionProposal: null
    }),
    []
  );

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    setError(null);
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      speaker: "user",
      content
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, agentName })
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to fetch response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let lastParsed: ChatResponse | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n");
        buffer = chunks.pop() ?? "";
        for (const chunk of chunks) {
          if (!chunk.startsWith("data:")) continue;
          const payload = chunk.replace("data:", "").trim();
          if (payload === "[DONE]") continue;
          try {
            lastParsed = JSON.parse(payload) as ChatResponse;
          } catch (err) {
            setError("Parsing failed. Showing fallback response.");
          }
        }
      }

      const parsed = lastParsed ?? fallbackResponse;
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          speaker: "agent",
          content: parsed.dialogue
        }
      ]);
      setChoices(parsed.suggestedChoices ?? []);
      onMissionProposal(parsed.missionProposal ?? null);
    } catch (err) {
      setError("We hit a signal disruption. Retry or regenerate choices.");
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          speaker: "agent",
          content: fallbackResponse.dialogue
        }
      ]);
      setChoices(fallbackResponse.suggestedChoices);
      onMissionProposal(null);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Dialogue</p>
          <h2 className="text-2xl font-semibold text-foreground">{agentName}</h2>
          <p className="text-sm text-muted">Mood: {agentMood}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <Sparkles className="h-4 w-4 text-primary" />
          Streamed response
        </div>
      </div>

      <div className="mt-6 flex h-[320px] flex-col gap-4 overflow-y-auto pr-2 scrollbar-hide">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
              message.speaker === "agent"
                ? "self-start bg-white/10"
                : "self-end bg-primary/20"
            )}
          >
            {message.speaker === "agent" && (
              <div className="mb-2 flex items-center gap-2 text-xs text-muted">
                <Bot className="h-3 w-3" />
                {agentName}
              </div>
            )}
            {message.content}
          </motion.div>
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs text-rose-200">
          {error}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {choices.map((choice) => (
          <Button
            key={choice}
            size="sm"
            variant="outline"
            onClick={() => sendMessage(choice)}
            disabled={isStreaming}
          >
            {choice}
          </Button>
        ))}
        <Button
          size="sm"
          variant="outline"
          onClick={() => setChoices(fallbackResponse.suggestedChoices)}
        >
          Regenerate Choices
        </Button>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type your directive..."
          className="flex-1 rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary/60"
        />
        <Button onClick={() => sendMessage(input)} disabled={isStreaming}>
          {isStreaming ? "Streaming..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
