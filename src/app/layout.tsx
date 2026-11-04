import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { ScrollToTopOnLoad } from "@/components/ui/ScrollToTopOnLoad";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { FloatingShapes } from "@/components/layout/FloatingShapes";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Беруші SE 11 — Менше шуму - більше спокою!",
  description:
    "Шумопоглинаючі беруші SE 11 з м’якого силікону для сну, роботи та подорожей. Змінні насадки XS / S / M / L та футляр у комплекті.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${display.variable} ${body.variable}`}>
      <body>
        <ScrollToTopOnLoad />
        <ScrollProgress />
        <ScrollToTop />
        <GrainOverlay />
        <FloatingShapes />
        {children}
      </body>
    </html>
  );
}
