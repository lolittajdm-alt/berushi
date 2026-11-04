"use client";

import { motion } from "framer-motion";
import { useOrderFlow } from "@/context/OrderFlowContext";

const links = [
  { label: "Про продукт", href: "#about", sectionId: "about" },
  { label: "Замовити", href: "#services", sectionId: "services" },
  { label: "Контакти", href: "#contact", sectionId: "contact" },
];

export function Footer() {
  const { isOpen, openOrderFlow } = useOrderFlow();

  const handleNavClick = (sectionId: string) => {
    if (sectionId === "about") {
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (!isOpen) {
      openOrderFlow(sectionId);
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="section-shell relative border-t border-border py-10 pb-[max(5rem,env(safe-area-inset-bottom))] md:py-16 md:pb-[max(6rem,env(safe-area-inset-bottom))]">
      <div className="section-container">
        <div className="footer-layout flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.h2
              className="font-display text-[clamp(1.375rem,6.5vw,4rem)] font-extrabold leading-none"
              whileHover={{ scale: 1.02 }}
            >
              Беруші
              <br />
              <span className="playful-tilt text-accent">SE 11</span>
              <span className="text-ink/30">.</span>
            </motion.h2>
            <p className="mt-4 text-xs text-muted sm:text-sm">
              © 2026 Беруші SE 11. Усі права захищено.
            </p>
          </div>

          <nav className="footer-nav flex flex-nowrap items-center justify-between gap-3 sm:justify-start sm:gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.sectionId);
                }}
                className="animated-underline whitespace-nowrap py-2 text-[10px] font-medium uppercase tracking-wide min-[360px]:text-xs sm:text-sm"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 sm:mt-16 sm:gap-4">
          <div className="h-px flex-1 bg-border" />
          <p className="text-center text-[10px] uppercase tracking-[0.2em] text-muted sm:text-xs sm:tracking-[0.3em]">
            Створено з любов’ю у 2026
          </p>
          <div className="h-px flex-1 bg-border" />
        </div>
      </div>
    </footer>
  );
}
