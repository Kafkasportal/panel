---
description: KafkasDer Panel geliştirme ortamını başlatma ve yönetme
---

# Geliştirme Ortamı

Bu proje KafkasDer (Türk sivil toplum kuruluşu) için Next.js 16, TypeScript ve Tailwind CSS ile geliştirilmiş admin panelidir.

## Teknoloji Stack
- **Framework**: Next.js 16.1.1 (App Router)
- **Dil**: TypeScript 5.9.3 (strict mode)
- **Stil**: Tailwind CSS v4
- **State Management**: Zustand, TanStack Query
- **Form**: React Hook Form + Zod
- **UI**: Radix UI + shadcn/ui
- **Veritabanı**: Supabase (PostgreSQL)

## Geliştirme Sunucusunu Başlatma

// turbo
1. Bağımlılıkları yükle:
```bash
npm install
```

// turbo
2. Geliştirme sunucusunu başlat:
```bash
npm run dev
```

3. Uygulama http://localhost:3000 adresinde çalışacaktır.

## Ortam Değişkenleri

`.env.local` dosyası gerekli değişkenleri içermelidir:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Proje Yapısı

```
src/
├── app/                  # Next.js App Router sayfaları
│   ├── (auth)/           # Kimlik doğrulama sayfaları
│   ├── (dashboard)/      # Dashboard sayfaları
│   │   ├── uyeler/       # Üye yönetimi
│   │   ├── bagis/        # Bağış yönetimi
│   │   ├── sosyal-yardim/# Sosyal yardım
│   │   ├── kullanicilar/ # Kullanıcı yönetimi
│   │   └── ayarlar/      # Ayarlar
│   └── api/              # API routes
├── components/           # React bileşenleri
│   ├── ui/               # Temel UI bileşenleri (shadcn/ui)
│   ├── shared/           # Paylaşılan bileşenler
│   └── features/         # Özellik bazlı bileşenler
├── hooks/                # Custom React hooks
├── lib/                  # Yardımcı fonksiyonlar ve servisler
├── stores/               # Zustand store'ları
├── types/                # TypeScript tip tanımları
└── providers/            # React context provider'ları
```
