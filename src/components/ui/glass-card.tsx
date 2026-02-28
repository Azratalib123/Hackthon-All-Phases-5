import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: boolean;
}

export function GlassCard({ children, className, glow = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card p-6 flex flex-col hover:-translate-y-1.5 hover:scale-[1.015]",
        glow && "purple-glow-hover border-primary/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}