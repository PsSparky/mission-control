#!/bin/bash
# Deploy to Vercel production
# Usage: ./deploy.sh [commit message]
set -e

cd "$(dirname "$0")"

MSG="${1:-deploy}"

git add -A
git commit -m "$MSG" || echo "Nothing to commit"
git push origin main

echo "⚡ Deploying to Vercel..."
npx vercel --prod --yes

echo "✅ Done! Live at https://mission-control-ochre-rho.vercel.app"
