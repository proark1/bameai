"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Castle,
  Flame,
  Globe,
  Layers,
  Menu,
  ScrollText,
  Settings,
  Swords,
  Trophy,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMetaStore } from "@/lib/state/metaStore";
import { Tooltip } from "@/components/ui/tooltip";

const links = [
  { href: "/map", label: "Map", icon: Castle },
  { href: "/missions", label: "Missions", icon: ScrollText },
  { href: "/skills", label: "Skills", icon: Swords },
  { href: "/inventory", label: "Inventory", icon: Layers },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/login", label: "Login", icon: Globe }
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const streak = useMetaStore((state) => state.streakDays);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold sm:text-lg"
        >
          <Globe className="h-5 w-5 text-primary" />
          Agent Kingdom
        </Link>

        <div className="flex items-center gap-2">
          <Tooltip content={`${streak}-day streak — come back tomorrow to keep it alive`}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
              <Flame className="h-3.5 w-3.5" />
              {streak}
            </span>
          </Tooltip>

          <nav className="hidden gap-2 text-sm text-muted lg:flex">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    active
                      ? "border-primary/60 bg-primary/15 text-foreground"
                      : "border-white/10 text-foreground hover:border-primary/60 hover:bg-primary/10"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-3.5 w-3.5 transition",
                      active ? "text-primary" : "text-primary/70 group-hover:text-primary"
                    )}
                  />
                  {label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-card text-foreground transition hover:border-primary/60 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-background/95 lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-2">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition",
                    active
                      ? "bg-primary/15 text-foreground"
                      : "text-foreground hover:bg-white/5"
                  )}
                >
                  <Icon className="h-4 w-4 text-primary/80" />
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
