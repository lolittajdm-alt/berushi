"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
};

type MotionState = "hidden" | "visible" | "exitTop" | "exitBottom";

export function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [motionState, setMotionState] = useState<MotionState>("hidden");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMotionState("visible");
          return;
        }

        setMotionState(entry.boundingClientRect.top < 0 ? "exitTop" : "exitBottom");
      },
      { rootMargin: "-60px 0px -60px 0px", threshold: [0, 0.12, 0.35] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const variants = {
    up: {
      hidden: { opacity: 0, y: 48 },
      visible: { opacity: 1, y: 0 },
      exitTop: { opacity: 0, y: -40 },
      exitBottom: { opacity: 0, y: 40 },
    },
    left: {
      hidden: { opacity: 0, x: -48 },
      visible: { opacity: 1, x: 0 },
      exitTop: { opacity: 0, x: -32 },
      exitBottom: { opacity: 0, x: 32 },
    },
    right: {
      hidden: { opacity: 0, x: 48 },
      visible: { opacity: 1, x: 0 },
      exitTop: { opacity: 0, x: 32 },
      exitBottom: { opacity: 0, x: -32 },
    },
  };

  const v = variants[direction];

  return (
    <motion.div
      ref={ref}
      initial={v.hidden}
      animate={v[motionState]}
      transition={{
        duration: motionState === "visible" ? 0.6 : 0.45,
        delay: motionState === "visible" ? delay : 0,
        ease: motionState === "visible" ? [0.22, 1, 0.36, 1] : [0.4, 0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
