# Vercel Environment Variables Yapılandırma Rehberi

## Gerekli Environment Variables

Aşağıdaki environment variable'ları Vercel'de yapılandırmanız gerekiyor:

### Zorunlu Variables

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Supabase projenizin URL'i
   - Örnek: `https://xxxxx.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Supabase anon/public key
   - Supabase dashboard'dan alabilirsiniz

3. **NEXT_PUBLIC_APP_URL**
   - Uygulamanızın production URL'i
   - Örnek: `https://kafkasder-panel-lemon.vercel.app`

### Opsiyonel Variables

4. **NEXT_PUBLIC_SENTRY_DSN** (Opsiyonel)
   - Sentry DSN adresi (hata takibi için)

5. **SENTRY_AUTH_TOKEN** (Opsiyonel)
   - Sentry auth token

6. **NEXT_PUBLIC_API_URL** (Opsiyonel)
   - Özel API URL'i

7. **NEXT_PUBLIC_API_TIMEOUT** (Opsiyonel)
   - API timeout süresi (ms)

8. **NEXT_PUBLIC_USE_MOCK_API** (Opsiyonel)
   - Mock API kullanımı için (true/false)

## Vercel CLI ile Ekleme

Her bir environment variable'ı eklemek için:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add NEXT_PUBLIC_APP_URL production
```

Veya tüm environment'lar için (production, preview, development):

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production preview development
```

## Vercel Dashboard'dan Ekleme

1. https://vercel.com/kafkasders-projects/kafkasder-panel/settings/environment-variables adresine gidin
2. "Add New" butonuna tıklayın
3. Key ve Value'yu girin
4. Environment'ları seçin (Production, Preview, Development)
5. "Save" butonuna tıklayın

## Notlar

- `NEXT_PUBLIC_*` prefix'li değişkenler client-side'da kullanılabilir
- Environment variable'ları ekledikten sonra yeni bir deployment yapmanız gerekebilir
- Production environment'ı için mutlaka tüm zorunlu değişkenleri ekleyin
