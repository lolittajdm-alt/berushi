import { localOnly, mono, newOrder, publicOrder, saveOrder } from "@/lib/server/payments";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    localOnly(request);
    const input = await request.json();
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Некоректне замовлення.");
    const order = newOrder(input);
    await saveOrder(order);
    if (order.mode === "sandbox") {
      const invoice = await mono("invoice/create", {
        amount: order.amount, ccy: 980, validity: 3600, displayType: "iframe",
        merchantPaymInfo: { reference: order.id, destination: "Оплата за беруші" },
        redirectUrl: `${new URL(request.url).origin}/payment?order=${order.id}`,
      });
      if (!invoice.invoiceId || !invoice.pageUrl || new URL(invoice.pageUrl).protocol !== "https:") throw new Error("Не вдалося створити платіж.");
      order.invoiceId = invoice.invoiceId; order.pageUrl = invoice.pageUrl;
      await saveOrder(order);
    }
    return Response.json(publicOrder(order), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Не вдалося створити замовлення." }, { status: 400 });
  }
}
