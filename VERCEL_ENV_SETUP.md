# Vercel Environment Variables Yapılandırma (CLI Olmadan)

Vercel MCP server'da doğrudan environment variable yönetimi için bir araç bulunmamaktadır. Ancak aşağıdaki yöntemlerle environment variable'ları yapılandırabilirsiniz:

## Yöntem 1: Vercel Dashboard (Önerilen - En Kolay)

1. **Vercel Dashboard'a gidin:**
   ```
   https://vercel.com/kafkasders-projects/kafkasder-panel/settings/environment-variables
   ```

2. **"Add New" butonuna tıklayın**

3. **Her bir environment variable için:**
   - **Key:** Environment variable adı (örn: `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value:** Değer
   - **Environment:** Production, Preview, Development (hepsini seçin)
   - **Save** butonuna tıklayın

## Yöntem 2: Vercel REST API (Programatik)

Vercel REST API'sini kullanarak environment variable'ları ekleyebilirsiniz:

### API Token Alma

1. https://vercel.com/account/tokens adresine gidin
2. "Create Token" butonuna tıklayın
3. Token'a bir isim verin ve oluşturun
4. Token'ı kopyalayın (bir daha gösterilmeyecek!)

### Environment Variable Ekleme

```bash
# API Token'ı environment variable olarak ayarlayın
export VERCEL_TOKEN=your_token_here

# Environment variable ekleme
curl -X POST "https://api.vercel.com/v10/projects/prj_LGzTLh1jrXsNFm3DOBEsQCfePiee/env?teamId=team_3iJKMz7mDaPqR5hfw5q7giOT&upsert=true" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "NEXT_PUBLIC_SUPABASE_URL",
    "value": "https://your-project.supabase.co",
    "type": "plain",
    "target": ["production", "preview", "development"]
  }'
```

### Tüm Gerekli Değişkenleri Eklemek İçin Script

`scripts/setup-vercel-env.js` dosyasını kullanabilirsiniz (değerleri manuel olarak girmeniz gerekir).

## Gerekli Environment Variables

### Zorunlu

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Supabase proje URL'iniz
   - Örnek: `https://xxxxx.supabase.co`
   - Type: `plain`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Supabase anon/public key
   - Supabase Dashboard > Settings > API'den alabilirsiniz
   - Type: `secret`

3. **NEXT_PUBLIC_APP_URL**
   - Production URL'iniz
   - Örnek: `https://kafkasder-panel-lemon.vercel.app`
   - Type: `plain`

### Opsiyonel

4. **NEXT_PUBLIC_SENTRY_DSN** (Opsiyonel)
   - Sentry DSN adresi
   - Type: `plain`

5. **SENTRY_AUTH_TOKEN** (Opsiyonel)
   - Sentry auth token
   - Type: `secret`

6. **NEXT_PUBLIC_API_URL** (Opsiyonel)
   - Özel API URL'i
   - Type: `plain`

7. **NEXT_PUBLIC_API_TIMEOUT** (Opsiyonel)
   - API timeout süresi (ms)
   - Type: `plain`

8. **NEXT_PUBLIC_USE_MOCK_API** (Opsiyonel)
   - Mock API kullanımı (`true` veya `false`)
   - Type: `plain`

## Environment Variable Tipleri

- **plain**: Normal metin değeri
- **secret**: Hassas bilgi (şifre, API key vb.) - Vercel'de maskelenir
- **encrypted**: Şifrelenmiş değer
- **system**: Sistem değişkeni

## Notlar

- `NEXT_PUBLIC_*` prefix'li değişkenler client-side'da kullanılabilir
- Environment variable'ları ekledikten sonra yeni bir deployment yapmanız gerekebilir
- Production environment için mutlaka tüm zorunlu değişkenleri ekleyin
- Secret tipindeki değişkenler Vercel Dashboard'da maskelenir

## Hızlı Başlangıç

En hızlı yöntem Vercel Dashboard kullanmaktır:

1. https://vercel.com/kafkasders-projects/kafkasder-panel/settings/environment-variables
2. Her bir zorunlu değişkeni ekleyin
3. Production, Preview ve Development için hepsini seçin
4. Deploy edin
