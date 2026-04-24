"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase, isSupabaseConfigured } from "@/lib/db/client";
import { toast } from "@/lib/state/toastStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("Enter a valid email first.");
      toast({ tone: "error", title: "Enter a valid email" });
      return;
    }
    if (!isSupabaseConfigured || !supabase) {
      setStatus("Supabase not configured. Mock mode enabled.");
      toast({
        tone: "info",
        title: "Mock mode",
        description: "Supabase isn't set up — explore using seed data."
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    const msg = error ? error.message : "Magic link sent. Check your email.";
    setStatus(msg);
    toast({
      tone: error ? "error" : "success",
      title: error ? "Couldn't send link" : "Magic link sent",
      description: msg
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleLogin();
  };

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-card p-6 sm:p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
        <Globe className="h-5 w-5" />
      </div>
      <h1 className="mt-4 text-3xl font-semibold">Sign In</h1>
      <p className="mt-2 text-sm text-muted">
        Use your email to access your company realm. No password needed.
      </p>
      <div className="mt-6 grid gap-4 text-sm">
        <label className="grid gap-2">
          <span className="text-xs uppercase tracking-[0.25em] text-muted">
            Email
          </span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="you@company.com"
            className="rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm outline-none focus:border-primary/60"
          />
        </label>
        <Button onClick={handleLogin} disabled={loading}>
          {loading ? "Sending..." : "Send Magic Link"}
        </Button>
        {status && <p className="text-xs text-muted">{status}</p>}
      </div>
    </div>
  );
}
