"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase, isSupabaseConfigured } from "@/lib/db/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setStatus("Supabase not configured. Mock mode enabled.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({ email });
    setStatus(error ? error.message : "Magic link sent. Check your email.");
  };

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-card p-8">
      <h1 className="text-3xl font-semibold">Sign In</h1>
      <p className="mt-2 text-sm text-muted">
        Use your email to access your company realm.
      </p>
      <div className="mt-6 grid gap-4 text-sm">
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          className="rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm"
        />
        <Button onClick={handleLogin}>Send Magic Link</Button>
        {status && <p className="text-xs text-muted">{status}</p>}
      </div>
    </div>
  );
}
