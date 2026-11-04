"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DoodleIcon } from "@/components/ui/DoodleIcon";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { portfolioItems } from "@/data/content";
import { assetPath } from "@/lib/assetPath";
import { getOrderAmountUah } from "@/lib/monobank";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [secondsLeft, setSecondsLeft] = useState(7200);

  useEffect(() => {
    const deadline = Date.now() + 7_200_000;
    const interval = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) window.clearInterval(interval);
    }, 250);
    return () => window.clearInterval(interval);
  }, []);

  const countdown = `${Math.floor(secondsLeft / 3600).toString().padStart(2, "0")}:${Math.floor((secondsLeft % 3600) / 60).toString().padStart(2, "0")}:${(secondsLeft % 60).toString().padStart(2, "0")}`;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const doodles = [
    { type: "camera" as const, top: "18%", left: "42%", delay: 0 },
    { type: "design" as const, top: "28%", left: "55%", delay: 0.2 },
    { type: "video" as const, top: "55%", left: "38%", delay: 0.4 },
    { type: "idea" as const, top: "65%", left: "52%", delay: 0.6 },
    { type: "star" as const, top: "35%", left: "30%", delay: 0.3 },
  ];

  return (
    <section
      ref={ref}
      id="hero"
      className="section-shell relative overflow-x-hidden pb-10 pt-6 sm:pb-14 sm:pt-8 md:pb-16"
    >
      <span className="section-number">01</span>

      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[min(80vw,600px)] w-[min(80vw,600px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/10" />

      <div className="section-container relative z-10 mt-4 sm:mt-8">
        <div className="relative z-10 max-w-4xl">
          <motion.h1
            className="hero-title hero-title-long sm:leading-[0.85]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="relative inline-block">
              <span className="hero-title-mark">Шумопоглинаючі</span>
              <span className="absolute -inset-x-2 bottom-2 top-1 -z-0 rounded-2xl bg-accent md:rounded-3xl" aria-hidden="true" />
            </span>
          </motion.h1>
          <motion.h1
            className="hero-title sm:leading-[0.85]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="relative inline-block">
              <span className="hero-title-mark">Беруші</span>
              <span className="absolute -inset-x-2 bottom-2 top-1 -z-0 rounded-2xl bg-accent md:rounded-3xl" aria-hidden="true" />
            </span>
          </motion.h1>

          <Reveal delay={0.4}>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted sm:mt-6 md:text-base">
              Менше шуму - більше спокою!
            </p>
          </Reveal>
        </div>

        {doodles.map((d, i) => (
          <motion.div
            key={i}
            className="hero-doodle absolute hidden text-ink/30 md:block"
            style={{ top: d.top, left: d.left }}
            animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: d.delay,
            }}
          >
            <DoodleIcon type={d.type} className="h-8 w-8" />
          </motion.div>
        ))}

        <motion.p
          className="hero-side-text vertical-text absolute right-0 top-1/3 hidden text-xs font-medium uppercase tracking-[0.4em] text-muted lg:block"
          style={{ y }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          Беруші SE 11 × 2026
        </motion.p>
      </div>

      <div className="section-container mt-8 rounded-2xl bg-red-500 px-4 py-5 text-black md:rounded-3xl sm:mt-12 sm:px-8 sm:py-6">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-display font-extrabold tracking-tight">
          <p className="text-center text-[clamp(1.25rem,3.5vw,2.75rem)] leading-tight">Акційна пропозиція</p>
          <span role="timer" aria-label={`Залишилось ${countdown}`} className="px-4 py-2 text-3xl tabular-nums sm:text-4xl">
            {countdown}
          </span>
          <p className="flex items-center gap-4 whitespace-nowrap">
            <del aria-label="Попередня ціна 600 гривень" className="text-2xl text-black/60 decoration-2 sm:text-3xl">600 ₴</del>
            <span aria-label={`Акційна ціна ${getOrderAmountUah()} гривень`} className="text-4xl text-black sm:text-5xl">{getOrderAmountUah()} ₴</span>
          </p>
        </div>
      </div>

      <div className="section-container mt-8 sm:mt-12">
        <div className="grid grid-cols-3 gap-1 sm:gap-4 lg:gap-6">
          {portfolioItems.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.08}>
              <TiltCard className="masonry-item h-full">
                <motion.div
                  className="hero-product-card group relative"
                  tabIndex={item.unavailable ? 0 : undefined}
                  aria-label={item.unavailable ? `${item.title}: немає в наявності` : undefined}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <img
                    src={assetPath(item.image)}
                    alt={item.title}
                    width={1440}
                    height={1920}
                    className="hero-product-image aspect-[3/4] w-full object-contain p-0 sm:p-4 lg:aspect-[1124/1613]"
                  />
                  {item.unavailable ? (
                    <div className="hero-stock-label absolute bottom-1 left-0 right-0 sm:bottom-4 sm:left-3 sm:right-3 text-center">
                      <span className="inline-block rounded-full bg-accent px-1 py-1 text-[8px] sm:px-4 sm:py-2 sm:text-sm font-semibold text-black">
                        Немає в наявності
                      </span>
                    </div>
                  ) : null}
                </motion.div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
