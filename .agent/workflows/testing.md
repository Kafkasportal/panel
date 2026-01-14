---
description: KafkasDer Panel test komutları ve stratejileri
---

# Test Stratejisi

Bu proje Jest ile unit testler ve Playwright ile E2E testler kullanır.

## Unit Testler (Jest)

// turbo

1. Tüm unit testleri çalıştır:

```bash
npm run test
```

// turbo
2. Watch modunda test çalıştır:

```bash
npm run test:watch
```

// turbo
3. Coverage raporu ile test çalıştır:

```bash
npm run test:coverage
```

### Test Dosyaları Konumu

- `src/components/**/*.test.tsx` - Bileşen testleri
- `src/hooks/*.test.ts` - Hook testleri
- `src/stores/*.test.ts` - Store testleri
- `src/lib/*.test.ts` - Utility testleri

### Test Yazma Kuralları

```typescript
import { render, screen } from '@testing-library/react'
import { ComponentName } from './component-name'

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />)
    expect(screen.getByText('text')).toBeInTheDocument()
  })
})
```

## E2E Testler (Playwright)

// turbo

1. E2E testleri çalıştır:

```bash
npm run test:e2e
```

1. E2E testleri UI modunda çalıştır:

```bash
npm run test:e2e:ui
```

### Mevcut E2E Test Dosyaları

- `tests/auth.spec.ts` - Kimlik doğrulama testleri
- `tests/dashboard.spec.ts` - Dashboard testleri
- `tests/donations.spec.ts` - Bağış yönetimi testleri
- `tests/members.spec.ts` - Üye yönetimi testleri
- `tests/social-aid.spec.ts` - Sosyal yardım testleri
- `tests/responsive.spec.ts` - Responsive tasarım testleri

### E2E Test Yazma Kuralları

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should perform action', async ({ page }) => {
    await page.goto('/path')
    await expect(page.locator('selector')).toBeVisible()
  })
})
```

## Kod Kalitesi Kontrolleri

// turbo

1. ESLint kontrolü:

```bash
npm run lint
```

// turbo
2. ESLint otomatik düzeltme:

```bash
npm run lint:fix
```

// turbo
3. TypeScript tip kontrolü:

```bash
npm run type-check
```

// turbo
4. Prettier formatlama:

```bash
npm run format
```
