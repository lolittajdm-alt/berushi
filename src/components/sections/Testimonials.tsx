"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";
import { testimonials } from "@/data/content";

type Testimonial = (typeof testimonials)[number];

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <motion.div
      whileHover={{ y: -6, rotate: -0.25, scale: 1.02 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="testimonial-card cell-glass flex h-full min-h-[210px] min-w-0 flex-col rounded-xl p-2 sm:min-h-[320px] sm:rounded-[2rem] sm:p-6"
    >
      <div className="mb-2 flex shrink-0 flex-wrap items-center gap-1 sm:mb-3 sm:gap-2" role="img" aria-label={`Оцінка: ${item.rating} з 5 зірок`}>
        <span className="flex gap-0.5 sm:gap-1" aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => (
            <svg key={index} viewBox="0 0 24 24" className={`h-2.5 w-2.5 sm:h-5 sm:w-5 ${index < item.rating ? "text-accent" : "text-muted/40"}`} fill={index < item.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
              <path d="m12 3 2.78 5.64L21 9.54l-4.5 4.39 1.06 6.2L12 17.2l-5.56 2.93 1.06-6.2L3 9.54l6.22-.9Z" />
            </svg>
          ))}
        </span>
        <span className="text-[9px] font-semibold sm:text-sm" aria-hidden="true">{item.rating}/5</span>
      </div>
      <p className="flex-1 break-words text-[10px] leading-relaxed sm:text-base">
        {item.quote}
      </p>
      <div className="mt-3 shrink-0 border-t border-border pt-2 sm:mt-5 sm:pt-4">
        <p className="break-words font-display text-[10px] font-bold leading-tight sm:text-lg">{item.author}</p>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="section-shell relative -mt-4 overflow-x-clip pb-12 pt-8 md:-mt-10 md:pb-16 md:pt-12"
    >
      <span className="section-number">02</span>

      <div className="section-container">
        <Reveal>
          <SectionHeading line1="ВІДГУКИ" line2="ПОКУПЦІВ" />

        </Reveal>

        <div aria-label="Відгуки клієнтів" className="mt-6 grid grid-cols-3 items-stretch gap-2 sm:mt-12 sm:gap-4 lg:gap-6">
          {testimonials.map((item) => (
            <div key={item.id} className="min-w-0">
              <TiltCard className="h-full">
                <TestimonialCard item={item} />
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
