import { Redis } from "@upstash/redis";

let client: Redis | undefined;
export function orderStore(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return client ??= new Redis({ url, token });
  if (process.env.VERCEL) throw new Error("Сховище замовлень ще не налаштовано.");
  return null;
}
export const ORDER_TTL = 7 * 24 * 60 * 60;
