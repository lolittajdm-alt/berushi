"use client";

import { About } from "@/components/sections/About";
import { ContactForm } from "@/components/sections/ContactForm";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { TableOfContent } from "@/components/sections/TableOfContent";
import { Testimonials } from "@/components/sections/Testimonials";
import { OrderCta } from "@/components/ui/OrderCta";
import { useOrderFlow } from "@/context/OrderFlowContext";

export function HomePage() {
  const { isOpen } = useOrderFlow();

  return (
    <main className="relative">
      <Hero />
      <Testimonials />
      <About />
      {!isOpen ? <OrderCta /> : null}
      {isOpen ? (
        <>
          <Services />
          <TableOfContent />
          <ContactForm />
        </>
      ) : null}
      <Footer />
    </main>
  );
}
