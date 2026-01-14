---
description: KafkasDer Panel build ve deployment işlemleri
---

# Build ve Deployment

## Production Build

// turbo

1. Production build oluştur:

```bash
npm run build
```

// turbo
2. Production sunucusunu başlat:

```bash
npm run start
```

1. Build ve start birlikte (preview):

```bash
npm run preview
```

## Cache Temizleme

// turbo

1. Build cache'i temizle:

```bash
npm run clean
```

Bu komut şunları siler:

- `.next` klasörü
- `out` klasörü
- `node_modules/.cache`

## Vercel Deployment

Proje Vercel ile deploy edilmek üzere yapılandırılmıştır.

### Ortam Değişkenleri (Vercel)

Vercel dashboard'da ayarlanması gereken değişkenler:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Detaylı bilgi için: `docs/VERCEL_ENV_SETUP.md`

## Supabase Migrations

### Migration Dosyaları

- `supabase/migrations/` - Migration dosyaları
- `supabase/schema.sql` - Ana şema
- `supabase/seed.sql` - Seed data

### Migration Çalıştırma

```bash
# Supabase CLI ile
supabase db push
```

## Deployment Checklist

- [ ] Environment değişkenleri ayarlandı
- [ ] Build başarılı çalışıyor
- [ ] Tüm testler geçiyor
- [ ] Type-check hatası yok
- [ ] Lint hatası yok
- [ ] Supabase bağlantısı test edildi
