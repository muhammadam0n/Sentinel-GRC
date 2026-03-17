import React from "react";
import { cx } from "../lib/utils";

type Tone = "slate" | "blue" | "amber" | "rose" | "emerald";

const tones: Record<Tone, string> = {
  slate: "bg-slate-900/60 text-slate-200 border-slate-800",
  blue: "bg-blue-950/60 text-blue-200 border-blue-900/60",
  amber: "bg-amber-950/60 text-amber-200 border-amber-900/60",
  rose: "bg-rose-950/60 text-rose-200 border-rose-900/60",
  emerald: "bg-emerald-950/60 text-emerald-200 border-emerald-900/60"
};

export const Badge = ({
  tone = "slate",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) => (
  <span
    className={cx(
      "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
      tones[tone],
      className
    )}
    {...props}
  />
);

