# Vercel Environment Variables - Değerler

Bu dosya, Vercel'e eklenecek environment variable değerlerini içerir.

## Zorunlu Environment Variables

### 1. NEXT_PUBLIC_SUPABASE_URL
```
https://jdrncdqyymlwcyvnnzoj.supabase.co
```
- Type: `plain`
- Environments: Production, Preview, Development

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkcm5jZHF5eW1sd2N5dm5uem9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyOTYwMzcsImV4cCI6MjA4Mzg3MjAzN30.qGV-qoTFMSk2ZGzO7ABn85Sqjhyyoo8imMW43g5wTQQ
```
- Type: `secret`
- Environments: Production, Preview, Development

### 3. NEXT_PUBLIC_APP_URL
```
https://kafkasder-panel-lemon.vercel.app
```
- Type: `plain`
- Environments: Production, Preview, Development

## Opsiyonel Environment Variables

Aşağıdaki değişkenler opsiyoneldir ancak eklenebilir:

### SUPABASE_SERVICE_ROLE_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkcm5jZHF5eW1sd2N5dm5uem9qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI5NjAzNywiZXhwIjoyMDgzODcyMDM3fQ.y2ToAnLb0LXuegse2d8Y9Aa__xaAvTCbajrF1XwFe2g
```
- Type: `secret`
- Not: Server-side işlemler için kullanılır

### POSTGRES_URL (Opsiyonel - Server-side)
```
postgres://postgres.jdrncdqyymlwcyvnnzoj:vDwEqMVdJQUzdhM2@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x
```
- Type: `secret`
- Not: Sadece server-side API route'larında kullanılır

## Vercel'e Ekleme Yöntemleri

### Yöntem 1: PowerShell Script (Windows)

```powershell
# Vercel API token'ınızı alın: https://vercel.com/account/tokens
$env:VERCEL_TOKEN="your_token_here"
.\scripts\add-vercel-env.ps1
```

### Yöntem 2: Vercel Dashboard

1. https://vercel.com/kafkasder/panel/settings/environment-variables adresine gidin
2. Her bir değişken için "Add New" butonuna tıklayın
3. Key, Value ve Environment'ları seçin
4. Save butonuna tıklayın

### Yöntem 3: REST API (curl)

```bash
# Token'ı ayarlayın
export VERCEL_TOKEN="your_token_here"

# NEXT_PUBLIC_SUPABASE_URL
curl -X POST "https://api.vercel.com/v10/projects/prj_NVFK9LvEizFBNDxntRkCznPe08pA/env?teamId=team_3iJKMz7mDaPqR5hfw5q7giOT&upsert=true" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "NEXT_PUBLIC_SUPABASE_URL",
    "value": "https://jdrncdqyymlwcyvnnzoj.supabase.co",
    "type": "plain",
    "target": ["production", "preview", "development"]
  }'

# NEXT_PUBLIC_SUPABASE_ANON_KEY
curl -X POST "https://api.vercel.com/v10/projects/prj_NVFK9LvEizFBNDxntRkCznPe08pA/env?teamId=team_3iJKMz7mDaPqR5hfw5q7giOT&upsert=true" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkcm5jZHF5eW1sd2N5dm5uem9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyOTYwMzcsImV4cCI6MjA4Mzg3MjAzN30.qGV-qoTFMSk2ZGzO7ABn85Sqjhyyoo8imMW43g5wTQQ",
    "type": "secret",
    "target": ["production", "preview", "development"]
  }'

# NEXT_PUBLIC_APP_URL
curl -X POST "https://api.vercel.com/v10/projects/prj_NVFK9LvEizFBNDxntRkCznPe08pA/env?teamId=team_3iJKMz7mDaPqR5hfw5q7giOT&upsert=true" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "NEXT_PUBLIC_APP_URL",
    "value": "https://panel-kafkasder.vercel.app",
    "type": "plain",
    "target": ["production", "preview", "development"]
  }'
```

## Notlar

- `NEXT_PUBLIC_*` prefix'li değişkenler client-side'da kullanılabilir
- `secret` tipindeki değişkenler Vercel Dashboard'da maskelenir
- Environment variable'ları ekledikten sonra yeni bir deployment yapmanız gerekebilir
- Production environment için mutlaka tüm zorunlu değişkenleri ekleyin
