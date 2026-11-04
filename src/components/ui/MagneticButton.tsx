"use client";

import { motion } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export function MagneticButton({
  children,
  className = "",
  onClick,
  href,
  type = "button",
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  };

  const sharedProps = {
    onMouseMove: disabled ? undefined : handleMouseMove,
    onMouseLeave: disabled ? undefined : handleMouseLeave,
    whileHover: disabled ? undefined : { scale: 1.05 },
    whileTap: disabled ? undefined : { scale: 0.95 },
    transition: { type: "spring" as const, stiffness: 400, damping: 17 },
    className: `inline-flex items-center justify-center transition-transform duration-300 ${
      disabled ? "cursor-not-allowed" : "cursor-pointer"
    } ${className}`,
    onClick: disabled ? undefined : onClick,
    "aria-disabled": disabled,
  };

  if (href) {
    return (
      <motion.a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} {...sharedProps}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      {...sharedProps}
    >
      {children}
    </motion.button>
  );
}
