"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { DoodleIcon } from "@/components/ui/DoodleIcon";

type HorizontalScrollStripProps = {
  children: ReactNode;
  ariaLabel: string;
  className?: string;
  showNav?: boolean;
  showHint?: boolean;
};

export function HorizontalScrollStrip({
  children,
  ariaLabel,
  className = "",
  showNav = true,
  showHint = true,
}: HorizontalScrollStripProps) {
  const stripRef = useRef<HTMLDivElement>(null);

  const scrollByStep = useCallback((direction: -1 | 1) => {
    const strip = stripRef.current;
    if (!strip) return;
    const firstItem = strip.querySelector<HTMLElement>("[data-strip-item]");
    const gap = parseFloat(getComputedStyle(strip).gap) || 12;
    const step = (firstItem?.offsetWidth ?? strip.clientWidth / 3) + gap;
    strip.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  return (
    <div className={className}>
      {showNav ? (
        <div className="mb-4 flex justify-end gap-2 sm:mb-5">
          <button
            type="button"
            onClick={() => scrollByStep(-1)}
            aria-label={`${ariaLabel}: попередні`}
            className="cell-glass flex h-9 w-9 items-center justify-center rounded-full transition-colors active:bg-accent sm:h-10 sm:w-10 sm:hover:opacity-90"
          >
            <DoodleIcon type="arrow" className="h-4 w-4 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => scrollByStep(1)}
            aria-label={`${ariaLabel}: наступні`}
            className="cell-glass flex h-9 w-9 items-center justify-center rounded-full transition-colors active:bg-accent sm:h-10 sm:w-10 sm:hover:opacity-90"
          >
            <DoodleIcon type="arrow" className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="card-strip-lane">
        <div
          ref={stripRef}
          role="region"
          aria-label={ariaLabel}
          tabIndex={0}
          className="card-strip -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-visible overscroll-x-contain scroll-smooth px-4 py-3 touch-pan-x sm:-mx-6 sm:gap-4 sm:px-6 sm:py-4 lg:gap-5 lg:py-5"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              scrollByStep(-1);
            }
            if (e.key === "ArrowRight") {
              e.preventDefault();
              scrollByStep(1);
            }
          }}
        >
          {children}
        </div>
      </div>

      {showHint ? (
        <p className="mt-3 text-center text-[10px] uppercase tracking-[0.2em] text-muted sm:text-xs">
          Гортайте вліво або вправо
        </p>
      ) : null}
    </div>
  );
}

type StripItemProps = {
  children: ReactNode;
  className?: string;
  /** 2 = two cards visible (testimonials mobile), 3 = three cards (flavors) */
  columns?: 2 | 3;
};

export function StripItem({ children, className = "", columns = 3 }: StripItemProps) {
  const colClass = columns === 2 ? "card-strip-item-2" : "card-strip-item-3";

  return (
    <div
      data-strip-item
      className={`${colClass} h-full shrink-0 snap-start p-1.5 sm:p-2 ${className}`}
    >
      {children}
    </div>
  );
}
