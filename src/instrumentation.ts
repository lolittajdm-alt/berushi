export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.NODE_ENV === "development") {
    const { startLocalOrderWorker } = await import("./lib/server/order-sync");
    startLocalOrderWorker();
  }
}
