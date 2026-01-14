---
description: KafkasDer Panel Supabase veritabanı işlemleri ve yapılandırması
---

# Supabase Veritabanı

Bu proje Supabase (PostgreSQL) kullanır.

## Yapılandırma

### Supabase Client

- `src/lib/supabase/` - Supabase client yapılandırması
- `src/lib/supabase-service.ts` - Supabase servis fonksiyonları

### Ortam Değişkenleri

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Veritabanı Şeması

Ana tablo dosyaları:

- `supabase/schema.sql` - Ana şema tanımları
- `supabase/database_full_backup.sql` - Tam yedek
- `supabase/seed.sql` - Seed data

### Ana Tablolar

- `members` - Üyeler
- `donations` - Bağışlar
- `social_aid_applications` - Sosyal yardım başvuruları
- `social_aid_payments` - Sosyal yardım ödemeleri
- `documents` - Dokümanlar
- `users` - Kullanıcılar
- `audit_logs` - Audit logları

## Migration İşlemleri

Migration dosyaları: `supabase/migrations/`

### Migration Oluşturma

```bash
# Yeni migration oluştur
supabase migration new [migration_name]
```

### Migration Uygulama

```bash
# Migration'ları uygula
supabase db push

# Tüm migration'ları sıfırla ve yeniden uygula
supabase db reset
```

## API Routes

Supabase API routes:

- `src/app/api/members/` - Üye işlemleri
- `src/app/api/donations/` - Bağış işlemleri
- `src/app/api/social-aid/` - Sosyal yardım işlemleri
- `src/app/api/documents/` - Doküman işlemleri
- `src/app/api/auth/` - Kimlik doğrulama
- `src/app/api/settings/` - Ayarlar

## Servis Fonksiyonları

`src/lib/supabase-service.ts` içindeki ana fonksiyonlar:

- `getMembers()` - Üyeleri getir
- `createMember()` - Üye oluştur
- `updateMember()` - Üye güncelle
- `deleteMember()` - Üye sil
- `getDonations()` - Bağışları getir
- `getSocialAidApplications()` - Sosyal yardım başvurularını getir

## Güvenlik

- Row Level Security (RLS) etkin
- Auth middleware: `src/lib/auth-middleware.ts`
- Rate limiting: `src/lib/rate-limit.ts`

## TanStack Query Kullanımı

```typescript
import { useQuery, useMutation } from '@tanstack/react-query'

// Veri çekme
const { data, isLoading } = useQuery({
  queryKey: ['members'],
  queryFn: () => supabaseService.getMembers()
})

// Mutation
const mutation = useMutation({
  mutationFn: (data) => supabaseService.createMember(data),
  onSuccess: () => queryClient.invalidateQueries(['members'])
})
```
