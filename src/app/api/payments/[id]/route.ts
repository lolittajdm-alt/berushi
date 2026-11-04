import { syncOrder } from "@/lib/server/order-sync";
import { localOnly, publicOrder, readOrder, saveOrder } from "@/lib/server/payments";
export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, context: Context) {
  try {
    localOnly(request);
    const order = await syncOrder((await context.params).id);
    if (!order) return Response.json({ error: "Замовлення не знайдено." }, { status: 404 });
    return Response.json(publicOrder(order), { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "Не вдалося перевірити платіж. Спробуйте ще раз." }, { status: 503 }); }
}
export async function POST(request: Request, context: Context) {
  try {
    localOnly(request);
    const order = await readOrder((await context.params).id);
    if (!order || order.mode !== "demo") return Response.json({ error: "Демонстрація недоступна." }, { status: 400 });
    const { status } = await request.json();
    if (!["success", "failure"].includes(status)) throw new Error();
    order.status = status;
    await saveOrder(order);
    return Response.json(publicOrder(order));
  } catch { return Response.json({ error: "Не вдалося змінити тестовий статус." }, { status: 400 }); }
}
