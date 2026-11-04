import { readOrder } from "@/lib/server/payments";
import { syncOrder } from "@/lib/server/order-sync";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("order") || "";
    const order = await readOrder(id);
    const payload = await request.json();
    if (!order || !order.invoiceId || payload?.invoiceId !== order.invoiceId) {
      return Response.json({ error: "Unknown invoice" }, { status: 400 });
    }
    // Never trust the callback's payment status: syncOrder queries mono directly
    // and checks invoice ID, currency and amount before sending any notification.
    await syncOrder(id, true);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Retry later" }, { status: 503 });
  }
}
