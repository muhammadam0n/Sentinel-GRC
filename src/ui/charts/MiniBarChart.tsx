import React from "react";

export const MiniBarChart = ({
  values,
  height = 56
}: {
  values: number[];
  height?: number;
}) => {
  const max = Math.max(1, ...values);
  return (
    <div className="flex h-[56px] items-end gap-1">
      {values.map((v, idx) => {
        const h = Math.round((v / max) * height);
        return (
          <div
            key={idx}
            className="w-3 rounded-t-md bg-gradient-to-t from-blue-700/80 to-blue-400/80"
            style={{ height: `${h}px` }}
            aria-label={`bar-${idx}`}
          />
        );
      })}
    </div>
  );
};

