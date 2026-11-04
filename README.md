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

Payments currently support local demo/sandbox use only. Orders and notification receipts are stored in `.local-orders/` (excluded from Git). The local notification worker runs in development. Production hosting needs persistent storage, verified payment callbacks, production acquiring credentials, and access controls. GitHub Pages cannot run these server routes.

No API secrets or customer/order records are included in this repository.
