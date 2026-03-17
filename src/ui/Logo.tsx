import React from "react";
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
}) => (
  <img
    src="/brand/logo.png"
    alt={alt}
    height={height}
    className={cx("shrink-0 select-none object-contain", className)}
    style={{ height, width: "auto", maxWidth }}
    draggable={false}
  />
);
