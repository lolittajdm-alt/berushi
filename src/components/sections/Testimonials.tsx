"use client";

import { motion } from "framer-motion";
import { HorizontalScrollStrip, StripItem } from "@/components/ui/HorizontalScrollStrip";
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
      className="testimonial-card cell-glass flex min-h-[280px] flex-col rounded-[1.5rem] p-5 sm:min-h-[320px] sm:rounded-[2rem] sm:p-6"
    >
      <div className="mb-3 flex shrink-0 items-center gap-2" role="img" aria-label={`Оцінка: ${item.rating} з 5 зірок`}>
        <span className="flex gap-1" aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => (
            <svg key={index} viewBox="0 0 24 24" className={`h-5 w-5 ${index < item.rating ? "text-accent" : "text-muted/40"}`} fill={index < item.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
              <path d="m12 3 2.78 5.64L21 9.54l-4.5 4.39 1.06 6.2L12 17.2l-5.56 2.93 1.06-6.2L3 9.54l6.22-.9Z" />
            </svg>
          ))}
        </span>
        <span className="text-sm font-semibold" aria-hidden="true">{item.rating}/5</span>
      </div>
      <p className="flex-1 text-xs leading-relaxed sm:text-base">
        {item.quote}
      </p>
      <div className="mt-4 shrink-0 border-t border-border pt-3 sm:mt-5 sm:pt-4">
        <p className="truncate font-display text-sm font-bold sm:text-lg">{item.author}</p>
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

        <HorizontalScrollStrip ariaLabel="Відгуки клієнтів" className="mt-8 sm:mt-12">
          {testimonials.map((item) => (
            <StripItem key={item.id} columns={2}>
              <TiltCard className="h-full">
                <TestimonialCard item={item} />
              </TiltCard>
            </StripItem>
          ))}
        </HorizontalScrollStrip>
      </div>
    </section>
  );
}
