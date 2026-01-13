# Vercel Environment Variables Ekleme Scripti (PowerShell)
# Kullanım: $env:VERCEL_TOKEN="your_token"; .\scripts\add-vercel-env.ps1

$PROJECT_ID = "prj_NVFK9LvEizFBNDxntRkCznPe08pA"
$TEAM_ID = "team_3iJKMz7mDaPqR5hfw5q7giOT"
$API_URL = "https://api.vercel.com"

if (-not $env:VERCEL_TOKEN) {
    Write-Host "❌ VERCEL_TOKEN environment variable bulunamadı!" -ForegroundColor Red
    Write-Host "Vercel API token'ınızı almak için: https://vercel.com/account/tokens" -ForegroundColor Yellow
    exit 1
}

Write-Host "🚀 Vercel Environment Variables ekleniyor..." -ForegroundColor Green
Write-Host ""

# Zorunlu değişkenler
Write-Host "📝 Zorunlu değişkenler ekleniyor..." -ForegroundColor Cyan

# NEXT_PUBLIC_SUPABASE_URL
$body1 = @{
    key = "NEXT_PUBLIC_SUPABASE_URL"
    value = "https://jdrncdqyymlwcyvnnzoj.supabase.co"
    type = "plain"
    target = @("production", "preview", "development")
} | ConvertTo-Json

$response1 = Invoke-RestMethod -Uri "${API_URL}/v10/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}&upsert=true" `
    -Method POST `
    -Headers @{
        "Authorization" = "Bearer $env:VERCEL_TOKEN"
        "Content-Type" = "application/json"
    } `
    -Body $body1

Write-Host " ✓ NEXT_PUBLIC_SUPABASE_URL eklendi" -ForegroundColor Green

# NEXT_PUBLIC_SUPABASE_ANON_KEY
$body2 = @{
    key = "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    value = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkcm5jZHF5eW1sd2N5dm5uem9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyOTYwMzcsImV4cCI6MjA4Mzg3MjAzN30.qGV-qoTFMSk2ZGzO7ABn85Sqjhyyoo8imMW43g5wTQQ"
    type = "secret"
    target = @("production", "preview", "development")
} | ConvertTo-Json

$response2 = Invoke-RestMethod -Uri "${API_URL}/v10/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}&upsert=true" `
    -Method POST `
    -Headers @{
        "Authorization" = "Bearer $env:VERCEL_TOKEN"
        "Content-Type" = "application/json"
    } `
    -Body $body2

Write-Host " ✓ NEXT_PUBLIC_SUPABASE_ANON_KEY eklendi" -ForegroundColor Green

# NEXT_PUBLIC_APP_URL
$body3 = @{
    key = "NEXT_PUBLIC_APP_URL"
    value = "https://panel-kafkasder.vercel.app"
    type = "plain"
    target = @("production", "preview", "development")
} | ConvertTo-Json

$response3 = Invoke-RestMethod -Uri "${API_URL}/v10/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}&upsert=true" `
    -Method POST `
    -Headers @{
        "Authorization" = "Bearer $env:VERCEL_TOKEN"
        "Content-Type" = "application/json"
    } `
    -Body $body3

Write-Host " ✓ NEXT_PUBLIC_APP_URL eklendi" -ForegroundColor Green

Write-Host ""
Write-Host "✅ Tüm zorunlu environment variable'lar eklendi!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Opsiyonel değişkenler için VERCEL_ENV_SETUP.md dosyasına bakın." -ForegroundColor Yellow
