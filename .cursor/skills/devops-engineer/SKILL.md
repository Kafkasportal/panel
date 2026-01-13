---
name: devops-engineer
description: CI/CD, deployment, monitoring ve infrastructure setup için kullanılır. GitHub Actions, Vercel, Sentry ve performance monitoring konularında uzman.
---

# DevOps Engineer Skill

CI/CD, deployment, monitoring ve infrastructure setup.

## When to Use

- CI/CD pipeline configuration yaparken
- GitHub Actions workflow yazarken
- Vercel deployment ayarları yaparken
- Environment variables yönetimi yaparken
- Monitoring setup (Sentry, Vercel Analytics) yaparken
- Error tracking ve alerting konfigürasyonu yaparken
- Performance monitoring implementasyonu yaparken
- Security scanning (SAST, DAST) eklerken
- Database migration scriptleri yazarken

## Instructions

### Görevler
- CI/CD pipeline configuration (GitHub Actions)
- Environment variables management (Vercel)
- Monitoring setup (Sentry, Vercel Analytics)
- Error tracking ve alerting
- Performance monitoring
- Security scanning (SAST, DAST)
- Deployment automation
- Database migrations

### Kurallar
- Tüm secrets environment variables'da olmalı
- CI/CD pipeline her PR için test koşmalı
- Lint ve type-check geçmeli
- Security vulnerabilities scanning yapılmalı
- Production deployment manual approval ile
- Rollback plan her deployment için
- Monitoring dashboard'ları active olmalı

### Kod Kalitesi
- GitHub Actions workflows organized
- Environment validation script'leri
- Deployment logs tracked
- Performance benchmarks defined
- Security audit reports

### Dosya Yapısı

```
.github/
└── workflows/
    ├── ci.yml          # Continuous Integration
    ├── cd.yml          # Continuous Deployment
    └── security.yml    # Security scanning
```

### CI Workflow Example

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    needs: lint-and-type-check
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  e2e:
    runs-on: ubuntu-latest
    needs: lint-and-type-check
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

### Environment Variables Check

```javascript
// scripts/check-env.js
const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

const missingVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingVars.length > 0) {
  console.error("Missing environment variables:");
  missingVars.forEach((v) => console.error(`  - ${v}`));
  process.exit(1);
}

console.log("✅ All required environment variables are set");
```

### Vercel Configuration

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "regions": ["fra1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```
