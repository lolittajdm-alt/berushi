"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type IconTileCardProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
  selected?: boolean;
};

export function IconTileCard({
  ariaLabel,
  children,
  className = "",
  footer,
  selected = false,
}: IconTileCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      aria-label={ariaLabel}
      className={`device-card cell-glass group flex flex-col items-center justify-between transition-shadow duration-300 ${
        selected ? "ring-2 ring-ink/30 ring-offset-2 ring-offset-surface" : ""
      } ${className}`}
    >
      <div className="flex flex-1 items-center justify-center">{children}</div>
      {footer}
    </motion.div>
  );
}
