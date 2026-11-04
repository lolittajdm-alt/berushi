"use client";

import { motion } from "framer-motion";
import { DoodleIcon } from "@/components/ui/DoodleIcon";

export function FloatingShapes() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 hidden overflow-hidden md:block"
      aria-hidden="true"
    >
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] left-[8%] h-16 w-16 rounded-full border border-ink/10"
      />
      <motion.div
        animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] right-[12%] h-8 w-8 rounded-full bg-accent/30"
      />
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[25%] left-[15%] h-24 w-24 rounded-full border border-dashed border-ink/8"
      />
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[60%] right-[25%] text-ink/20"
      >
        <DoodleIcon type="star" className="h-10 w-10" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[40%] right-[8%] h-3 w-3 rounded-full bg-ink/10"
      />
    </div>
  );
}
