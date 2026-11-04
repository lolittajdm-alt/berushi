"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type EarplugColor = "Зелений" | "Чорний";

type OrderFlowContextValue = {
  isOpen: boolean;
  showCheckout: boolean;
  selectedColor: EarplugColor | null;
  openOrderFlow: (scrollToId?: string) => void;
  proceedToCheckout: (color: EarplugColor) => void;
};

const OrderFlowContext = createContext<OrderFlowContextValue | null>(null);

export function OrderFlowProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedColor, setSelectedColor] = useState<EarplugColor | null>(null);
  const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);

  const openOrderFlow = useCallback((scrollToId = "services") => {
    setIsOpen(true);
    setShowCheckout(false);
    setSelectedColor(null);
    setPendingScrollId(scrollToId);
  }, []);

  const proceedToCheckout = useCallback((color: EarplugColor) => {
    setSelectedColor(color);
    setShowCheckout(true);
    setPendingScrollId("contact");
  }, []);

  useEffect(() => {
    if (!isOpen || !pendingScrollId) return;

    const delay = pendingScrollId === "contact" ? 420 : 180;

    const timer = window.setTimeout(() => {
      document.getElementById(pendingScrollId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setPendingScrollId(null);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [isOpen, pendingScrollId, showCheckout]);

  return (
    <OrderFlowContext.Provider
      value={{
        isOpen,
        showCheckout,
        selectedColor,
        openOrderFlow,
        proceedToCheckout,
      }}
    >
      {children}
    </OrderFlowContext.Provider>
  );
}

export function useOrderFlow() {
  const ctx = useContext(OrderFlowContext);
  if (!ctx) {
    throw new Error("useOrderFlow must be used within OrderFlowProvider");
  }
  return ctx;
}
