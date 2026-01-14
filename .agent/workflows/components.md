---
description: KafkasDer Panel UI bileşenleri ve tasarım rehberi
---

# UI Bileşenleri ve Tasarım Rehberi

## Bileşen Yapısı

```
src/components/
├── ui/                   # shadcn/ui temel bileşenler
├── shared/               # Paylaşılan bileşenler
├── features/             # Özellik bazlı bileşenler
│   ├── audit-logs/       # Audit log bileşenleri
│   ├── charts/           # Grafik bileşenleri
│   ├── documents/        # Doküman bileşenleri
│   ├── donations/        # Bağış bileşenleri
│   ├── kumbara/          # Kumbara bileşenleri
│   ├── members/          # Üye bileşenleri
│   └── social-aid/       # Sosyal yardım bileşenleri
└── layout/               # Layout bileşenleri
```

## shadcn/ui Bileşenleri

Mevcut UI bileşenleri (`src/components/ui/`):

- `button.tsx` - Buton bileşeni
- `input.tsx` - Giriş alanı
- `select.tsx` - Seçim kutusu
- `dialog.tsx` - Modal dialog
- `dropdown-menu.tsx` - Açılır menü
- `tabs.tsx` - Sekme bileşeni
- `table.tsx` - Tablo bileşeni
- `card.tsx` - Kart bileşeni
- `avatar.tsx` - Avatar
- `badge.tsx` - Rozet
- `tooltip.tsx` - Tooltip
- `alert-dialog.tsx` - Uyarı dialog
- `accordion.tsx` - Accordion
- `checkbox.tsx` - Checkbox
- `switch.tsx` - Toggle switch
- `popover.tsx` - Popover
- `separator.tsx` - Ayırıcı
- `scroll-area.tsx` - Scroll alanı

## Yeni shadcn/ui Bileşen Ekleme

// turbo

```bash
npx shadcn@latest add [component-name]
```

Örnek:

```bash
npx shadcn@latest add calendar
npx shadcn@latest add progress
```

## Tasarım Sabitleri

`src/lib/design-constants.ts` dosyası tasarım sabitlerini içerir:

- Renk paleti
- Spacing değerleri
- Typography ayarları
- Shadow değerleri

## Bileşen Yazma Kuralları

1. **TypeScript ile Yazın**

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
  onClick?: () => void
}

export function Button({ variant = 'primary', children, onClick }: ButtonProps) {
  return (
    <button onClick={onClick} className={...}>
      {children}
    </button>
  )
}
```

1. **Tailwind CSS v4 Kullanın**

- Modern class isimleri kullanın
- `cn()` utility fonksiyonu ile class birleştirme

1. **Radix UI Kullanın**

- Accessibility için Radix primitives
- `@radix-ui/react-*` paketleri

1. **Klasör Yapısı**

```
components/features/[feature]/
├── [feature]-form.tsx
├── [feature]-list.tsx
├── [feature]-card.tsx
└── [feature]-dialog.tsx
```

## Form Yönetimi

React Hook Form + Zod kullanın:

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email()
})

const form = useForm({
  resolver: zodResolver(schema)
})
```

Validasyon şemaları: `src/lib/validations/`
