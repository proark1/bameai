"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
  disabled?: boolean;
};

export function Tooltip({
  content,
  children,
  side = "top",
  className,
  disabled = false
}: TooltipProps) {
  const [open, setOpen] = React.useState(false);

  if (disabled || !content) {
    return <>{children}</>;
  }

  const position: Record<NonNullable<TooltipProps["side"]>, string> = {
    top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
    bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
    left: "right-full top-1/2 mr-2 -translate-y-1/2",
    right: "left-full top-1/2 ml-2 -translate-y-1/2"
  };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-50 whitespace-nowrap rounded-lg border border-white/10 bg-background/95 px-3 py-1.5 text-xs text-foreground shadow-xl backdrop-blur",
            position[side],
            className
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
