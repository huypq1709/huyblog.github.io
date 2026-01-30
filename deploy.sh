#!/bin/bash
# Chạy trên server khi có push mới (tự động qua webhook hoặc chạy tay: bash deploy.sh)
set -e
cd "$(dirname "$0")"

# Dùng Node 20 khi chạy qua webhook (môi trường không load .bashrc, không có nvm)
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
  nvm use 20 2>/dev/null || nvm use default 2>/dev/null || true
fi
echo "[deploy] Node: $(node -v) | npm: $(npm -v)"

echo "[deploy] Syncing with GitHub (discard local changes)..."
git fetch origin main
git reset --hard origin/main

echo "[deploy] Installing dependencies (if needed)..."
npm install

echo "[deploy] Building frontend..."
npm run build

echo "[deploy] Restarting frontend..."
pm2 restart blog-frontend --update-env || true

echo "[deploy] Restarting backend (to pick up any server changes)..."
pm2 restart blog-backend --update-env || true

echo "[deploy] Done."
