---
name: qa-engineer
description: Test automation, manual testing ve quality assurance için kullanılır. Jest, Playwright, test coverage ve accessibility testing konularında uzman.
---

# QA Engineer Skill

Test automation, manual testing ve quality assurance.

## When to Use

- Unit test yazarken (Jest)
- E2E test yazarken (Playwright)
- Test coverage analizi yaparken
- Manual testing planları oluştururken
- Bug raporlama ve tracking yaparken
- Cross-browser testing yaparken
- Accessibility testing yaparken
- Performance testing (Lighthouse) yaparken

## Instructions

### Görevler
- Unit testing (Jest)
- E2E testing (Playwright)
- Test coverage tracking
- Manual testing plans
- Bug reporting ve tracking
- Cross-browser testing
- Accessibility testing
- Performance testing (Lighthouse)

### Kurallar
- Test coverage minimum %50 hedef
- Unit tests components, hooks, stores için
- E2E tests critical user flows için
- Test descriptions clear ve descriptive
- Test data realistic olmalı
- Flaky tests ASAP fix edilmeli
- CI/CD pipeline tüm tests koşmalı

### Kod Kalitesi
- Test files `.test.ts` veya `.test.tsx` suffix
- AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- Test isolation
- Test naming convention: should... when...

### Dosya Yapısı

```
tests/
├── unit/
│   ├── components/
│   ├── hooks/
│   └── stores/
└── e2e/
    ├── auth.spec.ts
    ├── members.spec.ts
    └── donations.spec.ts
```

### Unit Test Example

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { StatCard } from "@/components/shared/stat-card";

describe("StatCard", () => {
  it("should render title and value correctly", () => {
    // Arrange
    const props = {
      title: "Toplam Üye",
      value: 150,
    };

    // Act
    render(<StatCard {...props} />);

    // Assert
    expect(screen.getByText("Toplam Üye")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
  });

  it("should render description when provided", () => {
    // Arrange
    const props = {
      title: "Toplam Üye",
      value: 150,
      description: "Geçen aya göre %10 artış",
    };

    // Act
    render(<StatCard {...props} />);

    // Assert
    expect(
      screen.getByText("Geçen aya göre %10 artış")
    ).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    // Arrange
    const props = {
      title: "Test",
      value: 100,
      className: "custom-class",
    };

    // Act
    const { container } = render(<StatCard {...props} />);

    // Assert
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from "@playwright/test";

test.describe("Members Page", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/giris");
    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL("/genel");
  });

  test("should display members list", async ({ page }) => {
    await page.goto("/uyeler/liste");
    
    // Wait for data to load
    await expect(page.getByRole("table")).toBeVisible();
    
    // Check if table has data
    const rows = page.locator("tbody tr");
    await expect(rows).toHaveCount(10);
  });

  test("should open member detail dialog", async ({ page }) => {
    await page.goto("/uyeler/liste");
    
    // Click on first member row
    await page.locator("tbody tr").first().click();
    
    // Check if dialog is open
    await expect(
      page.getByRole("dialog", { name: "Üye Detayı" })
    ).toBeVisible();
  });

  test("should filter members by search", async ({ page }) => {
    await page.goto("/uyeler/liste");
    
    // Type in search input
    await page.fill('[placeholder="Ara..."]', "Ahmet");
    
    // Wait for filtered results
    await page.waitForTimeout(500); // debounce
    
    // Check filtered results
    const rows = page.locator("tbody tr");
    const count = await rows.count();
    expect(count).toBeLessThan(10);
  });
});
```

### Mock Example

```typescript
import { vi } from "vitest";

// Mock fetch
global.fetch = vi.fn();

// Mock Supabase client
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        data: mockData,
        error: null,
      })),
    })),
  }),
}));
```
