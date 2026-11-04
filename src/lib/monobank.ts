export function getOrderAmountKopiykas(): number {
  const uah = Number(process.env.NEXT_PUBLIC_ORDER_AMOUNT_UAH ?? "400");
  const safe = Number.isFinite(uah) && uah > 0 ? uah : 400;
  return Math.round(safe * 100);
}

export function getOrderAmountUah(): number {
  return getOrderAmountKopiykas() / 100;
}
