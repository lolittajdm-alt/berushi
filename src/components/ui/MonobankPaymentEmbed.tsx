"use client";
import { useEffect, useRef, useState } from "react";

type MonobankPaymentEmbedProps = { pageUrl: string; onClose: () => void };
export function MonobankPaymentEmbed({ pageUrl, onClose }: MonobankPaymentEmbedProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / 600, entry.contentRect.height / 760));
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== new URL(pageUrl).origin || event.source !== frameRef.current?.contentWindow) return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.message === "close-button") onClose();
      } catch { /* Ignore messages outside the bank's documented format. */ }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onClose, pageUrl]);
  return (
    <div ref={containerRef} id="monobank-payment" className="flex min-h-0 w-full flex-1 items-center justify-center">
      <div className="relative shrink-0 overflow-hidden rounded-3xl bg-white" style={{ width: 600 * scale, height: 760 * scale }}>
        <iframe ref={frameRef} id="payFrame" title="monopay" src={pageUrl} allow="payment *"
          className="absolute left-0 top-0 h-[760px] w-[600px] origin-top-left border-0"
          style={{ transform: `scale(${scale})` }} />
      </div>
    </div>
  );
}
