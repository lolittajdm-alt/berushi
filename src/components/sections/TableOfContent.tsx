"use client";

import { assetPath } from "@/lib/assetPath";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useOrderFlow, type EarplugColor } from "@/context/OrderFlowContext";

const colors: { name: EarplugColor; image: string }[] = [
  { name: "Зелений", image: "images/earplugs/green.png" },
  { name: "Чорний", image: "images/earplugs/black.png" },
];

export function TableOfContent() {
  const { selectedColor, proceedToCheckout } = useOrderFlow();

  return (
    <section id="toc" className="section-shell relative py-16 md:py-32">
      <span className="section-number">05</span>
      <div className="section-container">
        <Reveal>
          <SectionHeading line1="ВИБІР" line2="КОЛЬОРУ" />
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-8 lg:mt-16">
          {colors.map((color) => (
            <button
              key={color.name}
              type="button"
              aria-label={`Обрати колір: ${color.name}`}
              aria-pressed={selectedColor === color.name}
              onClick={() => proceedToCheckout(color.name)}
              className="flex min-h-64 flex-col items-center justify-center gap-6 bg-transparent p-5 transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:min-h-80 sm:p-8"
            >
              <img src={assetPath(color.image)} alt={`Беруші SE 11 — ${color.name.toLowerCase()} колір, насадки та футляр`} width={1440} height={1920} className="aspect-[3/4] w-full max-w-sm object-contain" loading="lazy" />
              <span className="font-display text-xl font-bold sm:text-2xl">{color.name}</span>
              <span className="text-sm text-muted">Беруші SE 11</span>
              <span className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white dark:text-black">
                {selectedColor === color.name ? "ОБРАНО" : "ОБРАТИ"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
