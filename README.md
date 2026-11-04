# Беруші SE 11

Independent snapshot of the earplug store, based on BREATHWOOD.

## Local development

```sh
npm ci
cp .env.example .env.local
npm run dev -- --hostname 127.0.0.1
```

Set API keys only in `.env.local`. Never commit this file.

Includes two product colours, Nova Poshta delivery fields, mono sandbox checkout, payment confirmation, and Telegram notifications to multiple recipients.

Payments support demo/sandbox only. On Vercel, orders and Telegram receipts use managed Redis with a seven-day test retention period. Bank callbacks trigger an independent invoice status check before notifications. Local development can still use `.local-orders/` (excluded from Git). Nova Poshta credentials are server-only. GitHub Pages cannot run these server routes. Live sales still require production acquiring setup.

No API secrets or customer/order records are included in this repository.
