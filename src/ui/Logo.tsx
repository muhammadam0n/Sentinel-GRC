import React, { useState } from "react";
import { cx } from "../lib/utils";

export const Logo = ({
  className,
  height = 44,
  maxWidth = 280,
  alt = "Sentinel GRC"
}: {
  className?: string;
  height?: number;
  maxWidth?: number;
  alt?: string;
}) => {
  const [src, setSrc] = useState("/logo.svg");

  return (
    <img
      src={src}
      alt={alt}
      height={height}
      className={cx("shrink-0 select-none object-contain", className)}
      style={{ height, width: "auto", maxWidth }}
      onError={() => {
        setSrc((prev) => (prev === "/logo.svg" ? "/brand/logo.png" : "/favicon.png"));
      }}
      draggable={false}
    />
  );
};
