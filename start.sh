#!/bin/bash
cd "$(dirname "$0")"
NODE_BIN="$(pwd)/.tools/node-v22.16.0-darwin-arm64/bin"

if [ ! -x "$NODE_BIN/npm" ]; then
  echo "Node.js не найден. Установите Node.js с https://nodejs.org"
  echo "Или запустите: curl -fsSL https://nodejs.org/dist/v22.16.0/node-v22.16.0-darwin-arm64.tar.gz | tar -xz -C .tools"
  exit 1
fi

export PATH="$NODE_BIN:$PATH"

if [ ! -d "node_modules" ]; then
  echo "Устанавливаю зависимости..."
  npm install
fi

# Зупиняємо старий процес і очищаємо кеш (уникає Internal Server Error)
if lsof -ti:3000 >/dev/null 2>&1; then
  echo "Зупиняю попередній сервер на порту 3000..."
  lsof -ti:3000 | xargs kill -9 2>/dev/null || true
fi
if [ -d ".next" ]; then
  echo "Очищаю кеш збірки..."
  rm -rf .next
fi

echo "Запускаю сайт: http://localhost:3000"
npm run dev -- -p 3000
