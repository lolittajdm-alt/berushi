"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { useOrderFlow } from "@/context/OrderFlowContext";

export function OrderCta() {
  const { openOrderFlow } = useOrderFlow();

  return (
    <section className="section-shell relative pb-8 pt-4 md:pb-12 md:pt-6">
      <div className="section-container flex justify-center">
        <Reveal>
          <motion.button
            type="button"
            onClick={() => openOrderFlow("services")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="hero-title text-center sm:leading-[0.85]"
          >
            <span className="relative inline-block">
              <span className="hero-title-mark playful-tilt">З</span>
              <span className="hero-title-mark">А</span>
              <span className="hero-title-mark playful-tilt-alt">М</span>
              <span className="hero-title-mark">О</span>
              <span className="hero-title-mark">В</span>
              <span className="hero-title-mark playful-tilt">И</span>
              <span className="hero-title-mark">Т</span>
              <span className="hero-title-mark">И</span>
              <span className="hero-title-dot">.</span>
              <span
                className="absolute -inset-x-2 bottom-2 top-1 -z-0 rounded-2xl bg-accent md:rounded-3xl"
                aria-hidden="true"
              />
            </span>
          </motion.button>
        </Reveal>
      </div>
    </section>
  );
}
