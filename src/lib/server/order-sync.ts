import { readdir } from "node:fs/promises";
import path from "node:path";
import { mono, readOrder, saveOrder } from "./payments";
import { notifyPaidOrder } from "./telegram";

export async function syncOrder(id: string, retryNotification = false) {
  const order = await readOrder(id);
  if (!order) return null;
  if (order.mode === "sandbox" && order.invoiceId && ["created", "processing", "hold"].includes(order.status)) {
    const status = await mono(`invoice/status?invoiceId=${encodeURIComponent(order.invoiceId)}`);
    if (status.invoiceId !== order.invoiceId || status.amount !== order.amount || status.ccy !== 980) throw new Error("Payment details mismatch");
    order.status = status.status;
    await saveOrder(order);
  }
  try { await notifyPaidOrder(order); }
  catch {
    if (retryNotification) throw new Error("Notification delivery pending");
    console.warn("Telegram notification pending; retry on next payment check.");
  }
  return order;
}

export function startLocalOrderWorker() {
  let running = false;
  const tick = async () => {
    if (running) return;
    running = true;
    try {
      const files = await readdir(path.join(process.cwd(), ".local-orders"));
      for (const file of files) {
        if (!/^[a-f0-9-]{36}\.json$/.test(file)) continue;
        const id = file.slice(0, -5);
        const order = await readOrder(id);
        if (!order) continue;
        // Local fixtures remain local; only bank invoices are sent automatically.
        if (order.mode !== "sandbox" || !order.invoiceId) continue;
        if (order.status === "success" || (Date.now() - Date.parse(order.createdAt) < 86400000 && ["created", "processing", "hold"].includes(order.status))) {
          try { await syncOrder(id); } catch { /* Retry on the next tick. */ }
        }
      }
    } catch { /* No local orders yet. */ }
    finally { running = false; }
  };
  const timer = setInterval(() => void tick(), 15000);
  timer.unref();
  void tick();
}
