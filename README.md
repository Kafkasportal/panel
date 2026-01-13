# KafkasDer Panel

Modern yönetim paneli - KafkasDer (Türk sivil toplum kuruluşu) için Next.js 16, TypeScript ve Tailwind CSS ile geliştirilmiş admin paneli.

## 🚀 Özellikler

- **Üye Yönetimi**: Üyelerin kayıt, güncelleme ve takibi
- **Bağış Yönetimi**: Gelir-gider takibi, kumbara yönetimi ve raporlama
- **Sosyal Yardım**: Başvuru yönetimi, ihtiyaç sahipleri takibi ve ödeme işlemleri
- **Doküman Yönetimi**: Dosya yükleme ve organizasyon
- **Kullanıcı Yönetimi**: Rol tabanlı erişim kontrolü
- **Audit Logs**: Tüm işlemlerin kayıt altına alınması

## 🛠️ Teknoloji Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Dil**: TypeScript 5.9.3 (strict mode)
- **Stil**: Tailwind CSS v4
- **State Management**: Zustand, TanStack Query
- **Form Yönetimi**: React Hook Form + Zod
- **UI Bileşenleri**: Radix UI + shadcn/ui
- **Veritabanı**: Supabase (PostgreSQL)
- **Test**: Playwright (E2E), Jest (unit)

## 📋 Gereksinimler

- Node.js >= 20.0.0
- npm >= 10.0.0
- Supabase hesabı ve projesi

## 🏃 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## 📜 Komutlar

```bash
# Geliştirme
npm run dev              # Turbopack ile dev sunucusu

# Build & Production
npm run build            # Production build
npm run start            # Production sunucusu
npm run preview          # Build + start

# Kod Kalitesi
npm run lint             # ESLint kontrolü
npm run lint:fix         # ESLint otomatik düzeltme
npm run format           # Prettier formatlama
npm run type-check       # TypeScript kontrolü

# Test
npx playwright test      # E2E testler
npx jest                 # Unit testler
```

## 🔧 Yapılandırma

Proje yapılandırması için `.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📁 Proje Yapısı

```
src/
├── app/                  # Next.js App Router sayfaları
├── components/           # React bileşenleri
│   ├── ui/              # Temel UI bileşenleri
│   ├── shared/          # Paylaşılan bileşenler
│   └── features/        # Özellik bazlı bileşenler
├── hooks/               # Custom React hooks
├── lib/                 # Yardımcı fonksiyonlar ve servisler
├── stores/              # Zustand store'ları
├── types/               # TypeScript tip tanımları
└── providers/           # React context provider'ları
```

## 📝 Lisans

Bu proje özel bir projedir.

## 👥 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen önce bir issue açın veya pull request gönderin.

## 📞 İletişim

KafkasDer - [info@kafkasder.org](mailto:info@kafkasder.org)
