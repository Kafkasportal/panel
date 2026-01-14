---
description: KafkasDer Panel proje yapısı ve konvansiyonları
---

# Proje Konvansiyonları

## Dosya İsimlendirme

- **Bileşenler**: `kebab-case.tsx` (örn: `member-form.tsx`)
- **Hooks**: `use-[name].ts` (örn: `use-debounce.ts`)
- **Tipler**: `[name].types.ts` veya `types/` klasörü
- **Sabitler**: `constants.ts` veya `[name]-constants.ts`
- **Utility**: `[name].ts` (örn: `utils.ts`)

## TypeScript

### Strict Mode

Proje strict TypeScript modunda çalışır (`tsconfig.json`).

### Tip Tanımları

```typescript
// Temel tipler - src/types/
import type { Member, Donation, SocialAidApplication } from '@/types'

// Bileşen props
interface ComponentProps {
  prop: string
}

// API response
interface ApiResponse<T> {
  data: T
  error?: string
}
```

## Import Sırası

```typescript
// 1. React/Next
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 2. External packages
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

// 3. Internal - lib/hooks/stores
import { cn } from '@/lib/utils'
import { useMyStore } from '@/stores/my-store'

// 4. Internal - components
import { Button } from '@/components/ui/button'
import { MemberCard } from '@/components/features/members'

// 5. Types
import type { Member } from '@/types'
```

## Path Aliases

```typescript
// Kullanın
import { Button } from '@/components/ui/button'

// Kullanmayın
import { Button } from '../../components/ui/button'
```

Mevcut aliaslar (`tsconfig.json`):

- `@/*` → `./src/*`

## CSS / Styling

### Tailwind CSS v4

- Modern class isimleri kullanın
- `cn()` ile class birleştirme

```typescript
import { cn } from '@/lib/utils'

<div className={cn(
  'p-4 rounded-lg',
  isActive && 'bg-primary text-white'
)} />
```

### Global Stiller

- `src/app/globals.css` - Global CSS
- `src/lib/design-constants.ts` - Tasarım sabitleri

## Git Commit Conventions

```bash
# Prefix'ler
feat:     # Yeni özellik
fix:      # Bug düzeltme
docs:     # Dokümentasyon
style:    # Stil değişiklikleri
refactor: # Refactoring
test:     # Test ekleme/düzeltme
chore:    # Build/config değişiklikleri

# Örnekler
git commit -m "feat: üye kayıt formu eklendi"
git commit -m "fix: bağış listesi sayfalama hatası düzeltildi"
```

## Klasör Yapısı Kuralları

1. **App Router sayfaları** route-based organize edilir
2. **Bileşenler** feature-based organize edilir
3. **Shared bileşenler** birden fazla feature'da kullanılır
4. **UI bileşenleri** shadcn/ui bileşenleridir

## Error Handling

```typescript
// Try-catch kullanın
try {
  await operation()
} catch (error) {
  console.error('Operation failed:', error)
  toast.error('İşlem başarısız oldu')
}

// API'de standart error format
return NextResponse.json(
  { error: 'Error message' },
  { status: 500 }
)
```

## Yorum Kuralları

```typescript
// Tek satır yorumlar için

/**
 * Çok satırlı yorumlar veya
 * JSDoc için kullanın
 */

// TODO: Yapılacak işler
// FIXME: Düzeltilmesi gereken
// NOTE: Önemli notlar
```
