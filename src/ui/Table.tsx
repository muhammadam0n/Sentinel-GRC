import React from "react";
import { cx } from "../lib/utils";

export const Table = ({
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-x-auto">
    <table
      className={cx(
        "w-full border-separate border-spacing-0 text-left text-sm",
        className
      )}
      {...props}
    />
  </div>
);

export const Th = ({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cx(
      "border-b border-slate-800/70 bg-slate-950/40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400",
      className
    )}
    {...props}
  />
);

export const Td = ({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cx("border-b border-slate-900/70 px-4 py-3", className)} {...props} />
);

