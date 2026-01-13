#!/bin/bash
# Vercel Environment Variables Ekleme Scripti
# Kullanım: VERCEL_TOKEN=your_token bash scripts/add-vercel-env.sh

PROJECT_ID="prj_LGzTLh1jrXsNFm3DOBEsQCfePiee"
TEAM_ID="team_3iJKMz7mDaPqR5hfw5q7giOT"
API_URL="https://api.vercel.com"

if [ -z "$VERCEL_TOKEN" ]; then
  echo "❌ VERCEL_TOKEN environment variable bulunamadı!"
  echo "Vercel API token'ınızı almak için: https://vercel.com/account/tokens"
  exit 1
fi

echo "🚀 Vercel Environment Variables ekleniyor..."
echo ""

# Zorunlu değişkenler
echo "📝 Zorunlu değişkenler ekleniyor..."

# NEXT_PUBLIC_SUPABASE_URL
curl -X POST "${API_URL}/v10/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}&upsert=true" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "NEXT_PUBLIC_SUPABASE_URL",
    "value": "https://jdrncdqyymlwcyvnnzoj.supabase.co",
    "type": "plain",
    "target": ["production", "preview", "development"]
  }' && echo " ✓ NEXT_PUBLIC_SUPABASE_URL eklendi"

# NEXT_PUBLIC_SUPABASE_ANON_KEY
curl -X POST "${API_URL}/v10/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}&upsert=true" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkcm5jZHF5eW1sd2N5dm5uem9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyOTYwMzcsImV4cCI6MjA4Mzg3MjAzN30.qGV-qoTFMSk2ZGzO7ABn85Sqjhyyoo8imMW43g5wTQQ",
    "type": "secret",
    "target": ["production", "preview", "development"]
  }' && echo " ✓ NEXT_PUBLIC_SUPABASE_ANON_KEY eklendi"

# NEXT_PUBLIC_APP_URL
curl -X POST "${API_URL}/v10/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}&upsert=true" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "NEXT_PUBLIC_APP_URL",
    "value": "https://kafkasder-panel-lemon.vercel.app",
    "type": "plain",
    "target": ["production", "preview", "development"]
  }' && echo " ✓ NEXT_PUBLIC_APP_URL eklendi"

echo ""
echo "✅ Tüm zorunlu environment variable'lar eklendi!"
echo ""
echo "📋 Opsiyonel değişkenler için VERCEL_ENV_SETUP.md dosyasına bakın."
