import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import * as React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        outline: "border border-white/10 bg-transparent text-foreground hover:bg-white/5"
      },
      size: {
        default: "px-4 py-2",
        sm: "px-3 py-1.5 text-xs",
        lg: "px-6 py-3 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);

Button.displayName = "Button";
