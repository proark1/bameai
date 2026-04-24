"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { playSound } from "@/lib/fx/sound";
import { vibrate } from "@/lib/fx/haptics";

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
  const [lastAttempt, setLastAttempt] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isStreaming]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;
    setError(null);
    setLastAttempt(content);
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      speaker: "user",
      content
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsStreaming(true);
    playSound("click");
    vibrate("light");

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
          } catch {
            setError("Couldn't parse the response. Showing a fallback reply.");
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
    } catch {
      setError("We lost the signal reaching the agent. Give it another try.");
      playSound("error");
      vibrate("error");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(input);
    }
  };

  const retry = () => {
    if (lastAttempt) sendMessage(lastAttempt);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
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

      <div
        ref={scrollRef}
        className="mt-6 flex h-[50vh] min-h-[260px] flex-col gap-4 overflow-y-auto pr-2 scrollbar-hide sm:h-[360px]"
      >
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
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
            <p className="whitespace-pre-wrap">{message.content}</p>
          </motion.div>
        ))}
        {isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[85%] self-start rounded-2xl bg-white/10 px-4 py-3 text-sm"
          >
            <div className="mb-2 flex items-center gap-2 text-xs text-muted">
              <Bot className="h-3 w-3" />
              {agentName}
            </div>
            <span className="inline-flex items-center gap-1" aria-label="Agent is typing">
              <Dot delay={0} />
              <Dot delay={0.15} />
              <Dot delay={0.3} />
            </span>
          </motion.div>
        )}
      </div>

      {error && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs text-rose-200">
          <span>{error}</span>
          {lastAttempt && (
            <Button
              size="sm"
              variant="outline"
              className="border-rose-500/40 text-rose-100 hover:bg-rose-500/10"
              onClick={retry}
            >
              <RefreshCw className="mr-1 h-3 w-3" /> Retry
            </Button>
          )}
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
          disabled={isStreaming}
        >
          Regenerate Choices
        </Button>
      </div>

      <div className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your directive..."
          aria-label="Message the agent"
          className="flex-1 rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/60"
        />
        <Button onClick={() => sendMessage(input)} disabled={isStreaming}>
          {isStreaming ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0.3, y: 0 }}
      animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
      transition={{ duration: 0.9, repeat: Infinity, delay }}
      className="inline-block h-1.5 w-1.5 rounded-full bg-primary"
    />
  );
}
