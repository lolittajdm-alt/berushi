"use client";

import { motion } from "framer-motion";
import { DoodleIcon } from "@/components/ui/DoodleIcon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";
import { orderSteps } from "@/data/content";

export function Services() {
  return (
    <section id="services" className="section-shell relative py-12 md:py-32">
      <span className="section-number">04</span>

      <div className="section-container">
        <div className="services-layout grid gap-16 lg:grid-cols-2 lg:items-start">
          <div>
            <Reveal>
              <SectionHeading line1="ЯК" line2="ЗАМОВИТИ" />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:mt-6 sm:text-base">
                Три прості кроки — і беруші SE 11 будуть у вас. Оформлення займає лише кілька
                хвилин.
              </p>
            </Reveal>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {orderSteps.map((step, i) => {
              const isLinked = "href" in step && step.href;
              const stepClassName =
                "order-step-card cell-glass group flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 sm:gap-6 sm:rounded-[1.75rem] sm:p-6 hover:opacity-95 active:scale-[0.99]";

              const stepContent = (
                <>
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent font-display text-2xl font-extrabold text-ink shadow-soft ring-2 ring-ink/10 sm:h-16 sm:w-16 sm:text-3xl">
                    {step.id}
                  </div>
                  <h3 className="font-display text-lg font-bold leading-snug sm:text-xl md:text-2xl">
                    {step.title}
                  </h3>
                  {isLinked ? (
                    <div className="cell-glass ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink transition-opacity group-hover:opacity-90 sm:h-11 sm:w-11">
                      <DoodleIcon type="arrow" className="h-4 w-4" />
                    </div>
                  ) : null}
                </>
              );

              return (
                <Reveal key={step.id} delay={i * 0.1}>
                  <TiltCard className="h-full">
                    {isLinked ? (
                      <motion.a
                        href={step.href}
                        whileHover={{ y: -6, scale: 1.02 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className={`${stepClassName} cursor-pointer`}
                      >
                        {stepContent}
                      </motion.a>
                    ) : (
                      <motion.div
                        whileHover={{ y: -6, scale: 1.02 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className={stepClassName}
                      >
                        {stepContent}
                      </motion.div>
                    )}
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
