"use client";

import { usePathname } from "next/navigation";
import { DoodleIcon } from "@/components/ui/DoodleIcon";

export function ScrollToTop() {
  const pathname = usePathname();
  if (pathname === "/payment") return null;
  return (
    <button
      type="button"
      aria-label="На початок сторінки"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="cell-glass fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full transition-colors active:bg-accent sm:bottom-8 sm:right-8 sm:h-14 sm:w-14 sm:hover:opacity-90"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <DoodleIcon type="arrow" className="h-5 w-5 -rotate-90" />
    </button>
  );
}
