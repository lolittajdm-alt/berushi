import { mkdir, readFile, writeFile, rm, stat } from "node:fs/promises";
import path from "node:path";
import type { Order } from "./payments";

export function formatOrderMessage(order: Order) {
  return [
    "🧪 ТЕСТОВЕ ЗАМОВЛЕННЯ — оплата успішна",
    "Реальні кошти не списувалися.",
    "",
    `Замовлення: ${order.id}`,
    "Товар: Беруші SE 11",
    `Колір: ${order.color}`,
    `Сума: ${(order.amount / 100).toFixed(2)} грн`,
    "Призначення платежу: Оплата за беруші",
    `Ім’я: ${order.name}`,
    `Телефон: ${order.phone}`,
    `Доставка: ${order.deliveryMethod === "postomat" ? "Поштомат" : "Відділення"} Нової Пошти`,
    `Місто: ${order.city}`,
    `Пункт отримання: ${order.warehouse}`,
    `Зв’язатися з клієнтом: ${order.contactRequested ? "ТАК" : "Ні"}`,
    `Коментар: ${order.comment || "—"}`,
    `Створено: ${order.createdAt}`,
    `Платіж mono: ${order.invoiceId || "локальна демонстрація"}`,
  ].join("\n");
}

// Receipt is separate from the order so concurrent payment checks cannot erase it.
export async function notifyPaidOrder(order: Order) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = [...new Set([process.env.TELEGRAM_CHAT_ID, ...(process.env.TELEGRAM_CHAT_IDS || "").split(",")].map(id => id?.trim()).filter((id): id is string => Boolean(id)))];
  if (order.status !== "success" || order.mode !== "sandbox" || !order.invoiceId || !token || !chatIds.length) return;
  const dir = path.join(process.cwd(), ".local-orders", "telegram");
  await mkdir(dir, { recursive: true, mode: 0o700 });
  const receipt = path.join(dir, `${order.id}.json`);

  const lock = `${receipt}.lock`;
  try { await mkdir(lock); } catch {
    // Recover a lock left behind by a stopped local server.
    try { if (Date.now() - (await stat(lock)).mtimeMs > 120000) await rm(lock, { recursive: true, force: true }); } catch { /* Another check owns it. */ }
    return;
  }
  try {
    let sent: Record<string, { sentAt: string; messageId: number }> = {};
    try {
      const previous = JSON.parse(await readFile(receipt, "utf8"));
      // Completed orders from the single-recipient version are not resent.
      if (previous.messageId) return;
      sent = previous.deliveries || {};
    } catch { /* First delivery. */ }
    let failed = false;
    for (const chatId of chatIds) {
      if (sent[chatId]) continue;
      try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST", signal: AbortSignal.timeout(15000),
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: formatOrderMessage(order) }),
        });
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error("Telegram delivery failed");
        sent[chatId] = { sentAt: new Date().toISOString(), messageId: result.result.message_id };
        await writeFile(receipt, JSON.stringify({ deliveries: sent }), { mode: 0o600 });
      } catch { failed = true; }
    }
    if (failed) throw new Error("Telegram delivery pending for one or more recipients");
  } finally { await rm(lock, { recursive: true, force: true }); }
}
