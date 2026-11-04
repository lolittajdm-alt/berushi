import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { getOrderAmountKopiykas } from "@/lib/monobank";

export type Order = {
  id: string; mode: "demo" | "sandbox"; status: string; amount: number;
  color: string; name: string; phone: string; city: string; warehouse: string;
  deliveryMethod: string; comment: string; contactRequested: boolean; createdAt: string; invoiceId?: string; pageUrl?: string;
};
const dir = path.join(process.cwd(), ".local-orders");
export async function saveOrder(order: Order) {
  await mkdir(dir, { recursive: true, mode: 0o700 });
  const file = path.join(dir, `${order.id}.json`);
  const temp = `${file}.${randomUUID()}.tmp`;
  await writeFile(temp, JSON.stringify(order), { mode: 0o600 });
  await rename(temp, file);
}
export async function readOrder(id: string): Promise<Order | null> {
  if (!/^[a-f0-9-]{36}$/.test(id)) return null;
  try { return JSON.parse(await readFile(path.join(dir, `${id}.json`), "utf8")); }
  catch { return null; }
}
export function localOnly(request: Request) {
  const url = new URL(request.url);
  if (!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) throw new Error("Лише локальний тестовий режим.");
  const origin = request.headers.get("origin");
  if (origin) {
    const source = new URL(origin);
    if (!["localhost", "127.0.0.1", "[::1]"].includes(source.hostname) || source.host !== request.headers.get("host")) throw new Error("Недозволений запит.");
  }
}
export function newOrder(input: Record<string, unknown>): Order {
  const text = (key: string, max = 200) => typeof input[key] === "string" ? (input[key] as string).trim().slice(0, max) : "";
  const color = text("color"); const name = text("name", 100); const phone = text("phone", 20);
  const city = text("city"); const warehouse = text("warehouse"); const deliveryMethod = text("deliveryMethod");
  if (!["Зелений", "Чорний"].includes(color) || !name || !/^\+380\d{9}$/.test(phone) || !city || !warehouse || !["warehouse", "postomat"].includes(deliveryMethod)) throw new Error("Перевірте колір, контактні дані та доставку.");
  const mode = process.env.PAYMENT_MODE || "demo";
  if (mode !== "demo" && mode !== "sandbox") throw new Error("Доступні лише demo та sandbox.");
  return { id: randomUUID(), mode, status: "created", amount: getOrderAmountKopiykas(), color, name, phone, city, warehouse, deliveryMethod, comment: text("comment", 500), contactRequested: input.contactRequested === true, createdAt: new Date().toISOString() };
}
export async function mono(endpoint: string, body?: unknown) {
  const token = process.env.MONOBANK_TEST_TOKEN;
  if (!token) throw new Error("Тестову оплату mono ще не підключено. Доступний демонстраційний режим.");
  const response = await fetch(`https://api.monobank.ua/api/merchant/${endpoint}`, {
    method: body ? "POST" : "GET", cache: "no-store", signal: AbortSignal.timeout(15000),
    headers: { "X-Token": token, "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!response.ok) throw new Error("Банк не підтвердив запит. Спробуйте пізніше.");
  return response.json();
}
export function publicOrder(order: Order) {
  return { id: order.id, mode: order.mode, status: order.status, amount: order.amount, color: order.color, pageUrl: order.pageUrl, contactRequested: order.contactRequested === true };
}
