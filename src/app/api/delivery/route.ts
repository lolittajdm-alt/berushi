import { localOnly } from "@/lib/server/payments";
export async function POST(request: Request) {
  try {
    localOnly(request);
    const { modelName, calledMethod, methodProperties } = await request.json();
    if (!(["Address", "AddressGeneral"].includes(modelName)) || !["searchSettlements", "getWarehouses", "getCities"].includes(calledMethod)) {
      return Response.json({ success: false, data: [] }, { status: 400 });
    }
    const apiKey = process.env.NOVA_POSHTA_API_KEY;
    if (!apiKey) throw new Error("Delivery not configured");
    const response = await fetch("https://api.novaposhta.ua/v2.0/json/", {
      method: "POST", signal: AbortSignal.timeout(15000),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey, modelName, calledMethod, methodProperties }),
    });
    return Response.json(await response.json());
  } catch {
    return Response.json({ success: false, data: [], errors: ["Спробуйте пошук пізніше."] }, { status: 503 });
  }
}
