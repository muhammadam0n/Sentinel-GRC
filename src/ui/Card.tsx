import React from "react";
import { cx } from "../lib/utils";

export const Card = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cx(
      "rounded-2xl border border-slate-800/80 bg-slate-950/60 shadow-[0_0_0_1px_rgba(15,23,42,0.5)]",
      className
    )}
    {...props}
  />
);

export const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cx("border-b border-slate-800/70 px-5 py-4", className)} {...props} />
);

export const CardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cx("text-sm font-semibold text-slate-100", className)} {...props} />
);

export const CardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cx("px-5 py-4", className)} {...props} />
);

