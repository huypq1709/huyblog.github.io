#!/bin/bash
# Chạy trên server khi có push mới (tự động qua webhook hoặc chạy tay: bash deploy.sh)
set -e
cd "$(dirname "$0")"

echo "[deploy] Pulling from GitHub..."
git pull origin main

echo "[deploy] Installing dependencies (if needed)..."
npm install

echo "[deploy] Building frontend..."
npm run build

echo "[deploy] Restarting frontend..."
pm2 restart blog-frontend --update-env || true

echo "[deploy] Restarting backend (to pick up any server changes)..."
pm2 restart blog-backend --update-env || true

echo "[deploy] Done."
