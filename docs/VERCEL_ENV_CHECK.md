# Vercel Environment Variables Kontrol ve Ayarlama

Bu doküman, Vercel'de environment variables'ların kontrol edilmesi ve ayarlanması için yöntemleri açıklar.

## 🔍 Environment Variables Kontrol Etme

### Yöntem 1: Script ile Kontrol (Önerilen)

```bash
# Vercel API token'ınızı alın: https://vercel.com/account/tokens
export VERCEL_TOKEN="your_token_here"

# Kontrol scriptini çalıştırın
node scripts/check-vercel-env.js
```

### Yöntem 2: Vercel Dashboard

1. https://vercel.com/kafkasder/panel/settings/environment-variables adresine gidin
2. Ayarlı tüm environment variable'ları görüntüleyin

### Yöntem 3: Vercel CLI

```bash
# Vercel CLI'yi yükleyin (eğer yoksa)
npm i -g vercel

# Login olun
vercel login

# Environment variable'ları listeleyin
vercel env ls
```

## ⚙️ Environment Variables Ayarlama

### Yöntem 1: PowerShell Script (Windows - Önerilen)

```powershell
# Vercel API token'ınızı alın: https://vercel.com/account/tokens
$env:VERCEL_TOKEN="your_token_here"

# Script'i çalıştırın
.\scripts\add-vercel-env.ps1
```

Bu script şu değişkenleri ekler:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

### Yöntem 2: Vercel Dashboard (En Kolay)

1. https://vercel.com/kafkasder/panel/settings/environment-variables adresine gidin
2. "Add New" butonuna tıklayın
3. Her değişken için:
   - **Key**: Değişken adı (örn: `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value**: Değer
   - **Environment**: Production, Preview, Development (hepsini seçin)
   - **Type**: Plain veya Secret
4. "Save" butonuna tıklayın

### Yöntem 3: Vercel CLI

```bash
# Vercel CLI ile interaktif olarak ekleyin
vercel env add NEXT_PUBLIC_SUPABASE_URL production preview development
```

## 📋 Gerekli Environment Variables

### Zorunlu Değişkenler

| Key | Value | Type | Açıklama |
|-----|-------|------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://jdrncdqyymlwcyvnnzoj.supabase.co` | Plain | Supabase proje URL'i |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | Secret | Supabase anon key |
| `NEXT_PUBLIC_APP_URL` | `https://panel-kafkasder.vercel.app` | Plain | Production URL |

### Opsiyonel Değişkenler

| Key | Type | Açıklama |
|-----|------|----------|
| `NEXT_PUBLIC_SENTRY_DSN` | Plain | Sentry hata takibi |
| `SENTRY_AUTH_TOKEN` | Secret | Sentry auth token |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | Server-side işlemler için |

## 🔄 Deployment Sonrası

Environment variable'ları ekledikten sonra:

1. **Yeni bir deployment tetikleyin:**
   - Vercel Dashboard'dan "Redeploy" yapın
   - Veya yeni bir commit push edin

2. **Deployment log'larını kontrol edin:**
   - Environment variable'ların doğru yüklendiğini doğrulayın

## ⚠️ Önemli Notlar

- `NEXT_PUBLIC_*` prefix'li değişkenler client-side'da kullanılabilir
- `secret` tipindeki değişkenler Vercel Dashboard'da maskelenir
- Environment variable'ları değiştirdikten sonra yeni deployment gerekir
- Production environment için mutlaka tüm zorunlu değişkenleri ekleyin

## 🐛 Sorun Giderme

### Environment variable'lar görünmüyor

1. Vercel Dashboard'da kontrol edin
2. Deployment log'larını inceleyin
3. Yeni bir deployment yapın

### Build hatası alıyorum

1. Tüm zorunlu değişkenlerin eklendiğini kontrol edin
2. Değerlerin doğru olduğunu doğrulayın
3. Environment variable'ların doğru environment'larda aktif olduğunu kontrol edin

## 📚 İlgili Dosyalar

- `scripts/check-vercel-env.js` - Kontrol scripti
- `scripts/add-vercel-env.ps1` - PowerShell ekleme scripti
- `VERCEL_ENV_VALUES.md` - Değerler listesi
- `src/lib/env.ts` - Environment validation
