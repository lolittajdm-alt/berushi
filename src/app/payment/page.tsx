"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { MonobankPaymentEmbed } from "@/components/ui/MonobankPaymentEmbed";
type Payment = { id: string; mode: "demo" | "sandbox"; status: string; amount: number; color: string; pageUrl?: string; contactRequested: boolean };
export default function PaymentPage() {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const checking = useRef(false);
  const successDialog = useRef<HTMLDialogElement>(null);
  const shownOrder = useRef<string | null>(null);
  const check = useCallback(async (status?: string) => {
    if (checking.current) return;
    const id = new URLSearchParams(window.location.search).get("order");
    if (!id) { setError("Замовлення не вказано."); return; }
    checking.current = true;
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/payments/${encodeURIComponent(id)}`, status ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) } : { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setPayment(data);
    } catch (e) { setError(e instanceof Error ? e.message : "Помилка перевірки."); }
    finally { checking.current = false; setBusy(false); }
  }, []);
  useEffect(() => { void check(); }, [check]);
  useEffect(() => {
    if (!payment || !["created", "processing", "hold"].includes(payment.status)) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void check();
    }, 5000);
    const onVisible = () => { if (document.visibilityState === "visible") void check(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", onVisible); };
  }, [payment?.id, payment?.status, check]);
  useEffect(() => {
    if (payment?.status !== "success" || shownOrder.current === payment.id) return;
    shownOrder.current = payment.id;
    successDialog.current?.showModal();
  }, [payment]);
  const success = payment?.status === "success";
  const failed = payment && ["failure", "expired", "reversed"].includes(payment.status);
  return (
    <main className="flex h-[100dvh] min-h-[360px] items-center justify-center p-2 sm:p-4">
      <section className="cell-glass flex h-full max-h-[920px] w-full max-w-[640px] flex-col gap-2 rounded-3xl p-3 sm:p-4">
        <header className="flex shrink-0 items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-lg font-bold sm:text-xl">Оплата замовлення</h1>
            {payment ? <p className="text-xs text-muted sm:text-sm">Беруші SE 11 · {payment.color} · {(payment.amount / 100).toLocaleString("uk-UA")} ₴</p> : null}
          </div>
          <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-bold text-black">Тест mono</span>
        </header>
        {success || failed ? (
          <div role="status" className="shrink-0 text-sm">{success ? "Тестову оплату завершено. Гроші не списувалися." : "Тестова оплата не пройшла."}</div>
        ) : null}
        {payment?.mode === "sandbox" && payment.pageUrl && !success ? (
          <MonobankPaymentEmbed pageUrl={payment.pageUrl} onClose={() => void check()} />
        ) : (
          <div className="flex min-h-0 flex-1 items-center justify-center rounded-2xl bg-white/60 p-4 text-center text-sm text-neutral-600">
            {success ? "Це тестовий результат. Відправлення товару не виконувалося." : payment ? "Форму банку ще не підключено. Дані картки зараз не потрібні." : error ? "Не вдалося завантажити форму." : "Завантажуємо форму mono…"}
          </div>
        )}
        {error ? <p role="alert" className="shrink-0 text-xs text-red-600">{error}</p> : null}
        <footer className="flex shrink-0 items-center justify-between gap-2 text-xs sm:text-sm">
          <a href="/" className="rounded-full px-2 py-2 underline">До магазину</a>
          <button disabled={busy} onClick={() => void check()} className="rounded-full border border-border px-3 py-2 disabled:opacity-50">{busy ? "Перевіряємо…" : "Перевірити оплату"}</button>
        </footer>
      </section>
      <dialog ref={successDialog} aria-labelledby="payment-success-title" aria-describedby="payment-success-description" className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border border-border bg-surface p-6 text-ink shadow-xl backdrop:bg-black/35 backdrop:backdrop-blur-sm sm:p-8">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-3xl text-black" aria-hidden="true">✓</div>
        <h2 id="payment-success-title" className="text-center font-display text-2xl font-bold">Оплата успішна!</h2>
        <div id="payment-success-description" className="mt-4 space-y-3 text-center text-sm text-muted">
          <p>Тестову оплату підтверджено. Реальні кошти не списувалися.</p>
          <p>{payment?.contactRequested ? "Ваше побажання «Зв’язатися зі мною» збережено в замовленні." : "Замовлення збережено."}</p>
        </div>
        <button type="button" autoFocus onClick={() => window.location.replace("/")} className="mt-6 w-full rounded-full bg-ink px-5 py-3 font-semibold text-surface">Зрозуміло</button>
        <a href="/" className="mt-4 block text-center text-sm underline">Повернутися до магазину</a>
      </dialog>
    </main>
  );
}
