"use client";

import type { MouseEventHandler, ReactNode } from "react";

type TileActionButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  selected?: boolean;
  ariaPressed?: boolean;
};

export function TileActionButton({
  children,
  href,
  onClick,
  selected = false,
  ariaPressed,
}: TileActionButtonProps) {
  const className = `inline-flex min-w-[5.5rem] items-center justify-center rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-wider transition-all duration-300 sm:min-w-[6.5rem] sm:px-5 sm:py-2.5 sm:text-xs ${
    selected
      ? "bg-ink text-surface shadow-soft"
      : "bg-ink text-surface hover:scale-105 active:scale-95"
  }`;

  if (href) {
    return (
      <a href={href} onClick={onClick} className={className}>
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ariaPressed}
      className={className}
    >
      {children}
    </button>
  );
}
