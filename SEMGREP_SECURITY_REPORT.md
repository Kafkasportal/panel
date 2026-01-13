# Semgrep Güvenlik Tarama Raporu

**Tarih:** 13 Ocak 2026  
**Proje:** KafkasDer Yönetim Paneli  
**Tarama Aracı:** Semgrep (MCP Integration)

---

## 📋 MCP Semgrep Araçları

Projede kullanılabilir Semgrep araçları:

### 1. `semgrep_scan`
Kod içeriğinde güvenlik açıkları ve kod kalitesi sorunlarını tarar.

**Kullanım:**
```typescript
// Kod içeriği ile tarama
semgrep_scan({
  code_files: [
    { filename: "file.ts", content: "..." }
  ],
  config: "auto" // veya "p/security-audit", "p/typescript", vb.
})
```

### 2. `semgrep_scan_local`
Yerel dosya sistemindeki dosyaları tarar (mutlak path gerekir).

**Kullanım:**
```typescript
semgrep_scan_local({
  code_files: [
    { path: "/absolute/path/to/file.ts" }
  ],
  config: "p/security-audit"
})
```

**Not:** `SEMGREP_ALLOW_LOCAL_SCAN` environment variable'ı set edilmeli.

### 3. `semgrep_scan_with_custom_rule`
Özel Semgrep kuralları ile tarama yapar.

**Kullanım:**
```typescript
semgrep_scan_with_custom_rule({
  code_files: [...],
  rule: `
    rules:
      - id: custom-rule
        pattern: |
          $PATTERN
        message: "Custom message"
        severity: ERROR
        languages: [typescript]
  `
})
```

### 4. `semgrep_findings`
Semgrep AppSec Platform'dan mevcut bulguları getirir.

**Kullanım:**
```typescript
semgrep_findings({
  repos: ["repo-name"],
  status: "open",
  severities: ["critical", "high"],
  page_size: 100
})
```

---

## 🔍 Tespit Edilen Güvenlik Sorunları

### 🔴 KRİTİK: Hassas Veri Açığa Çıkması

**Dosya:** `src/app/api/auth/login/route.ts`  
**Satır:** 32-42, 45-51, 54-60  
**Severity:** ERROR

**Sorun:**
Access token ve refresh token'lar response body'de açıkça döndürülüyor:

```32:42:src/app/api/auth/login/route.ts
    const response = NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
    })
```

**Risk:**
- Token'lar browser console'da görülebilir
- XSS saldırıları ile token'lar çalınabilir
- Token'lar log dosyalarında görünebilir

**Çözüm:**
Token'ları sadece httpOnly cookie'lerde saklayın, response body'den kaldırın:

```typescript
// ❌ KÖTÜ
const response = NextResponse.json({
  user: {
    id: data.user.id,
    email: data.user.email,
  },
  session: {
    access_token: data.session.access_token, // HASSAS VERİ
    refresh_token: data.session.refresh_token, // HASSAS VERİ
    expires_at: data.session.expires_at,
  },
})

// ✅ İYİ
const response = NextResponse.json({
  user: {
    id: data.user.id,
    email: data.user.email,
  },
  // Token'lar sadece httpOnly cookie'lerde
})
```

---

### 🟡 BİLGİ: Rate Limiting Eksik

**Dosya:** `src/app/api/auth/login/route.ts`  
**Satır:** 5  
**Severity:** INFO

**Sorun:**
Login endpoint'inde rate limiting yok. Bu endpoint brute-force saldırılarına açık.

**Mevcut Durum:**
```5:76:src/app/api/auth/login/route.ts
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // ... authentication logic
  }
}
```

**Çözüm:**
`withApiMiddleware` veya `withRateLimit` kullanın:

```typescript
import { withApiMiddleware, RateLimitPresets } from "@/lib/api-helpers"

async function handleLogin(req: NextRequest) {
  // ... login logic
}

export const POST = withApiMiddleware(handleLogin, {
  defaultErrorMessage: "Giriş başarısız",
  rateLimit: RateLimitPresets.strict, // 5 req/min
})
```

---

## ✅ İyi Güvenlik Uygulamaları

### 1. Authentication Middleware
✅ `withAuth` ve `withProtectedApi` kullanılıyor  
✅ JWT token validation yapılıyor  
✅ Role-based access control (RBAC) mevcut

### 2. Input Validation
✅ Zod schemas kullanılıyor  
✅ Request body validation yapılıyor  
✅ Query parameter validation mevcut

### 3. Rate Limiting
✅ Protected endpoints'de rate limiting var  
✅ Farklı rate limit presets (strict, standard, lenient)  
⚠️ Login endpoint'inde eksik

### 4. Error Handling
✅ Standardized error responses  
✅ User-friendly error messages (Turkish)  
✅ Proper HTTP status codes

### 5. Database Security
✅ Supabase query builder kullanılıyor (SQL injection koruması)  
✅ Parametrized queries  
✅ Input sanitization

---

## 🎯 Önerilen Düzeltmeler

### Öncelik 1: Token Exposure (KRİTİK)

1. **Login endpoint'ini düzelt:**
   - Response body'den token'ları kaldır
   - Sadece httpOnly cookie'lerde sakla
   - User bilgilerini döndür (token'lar zaten cookie'de)

2. **Refresh endpoint'ini kontrol et:**
   - Aynı sorunu içeriyor mu kontrol et
   - Gerekirse düzelt

### Öncelik 2: Rate Limiting (YÜKSEK)

1. **Login endpoint'ine rate limiting ekle:**
   ```typescript
   export const POST = withApiMiddleware(handleLogin, {
     defaultErrorMessage: "Giriş başarısız",
     rateLimit: RateLimitPresets.strict, // 5 req/min
   })
   ```

2. **Diğer public endpoints'i kontrol et:**
   - `/api/auth/register`
   - `/api/auth/refresh`
   - `/api/auth/logout`

### Öncelik 3: Güvenlik İyileştirmeleri

1. **CORS Configuration:**
   - Wildcard (`*`) yerine specific domain kullan
   - Production'da sadece allowed origins

2. **Security Headers:**
   - CSP (Content Security Policy) ekle
   - X-Frame-Options kontrol et
   - HSTS zorunlu yap

3. **Logging:**
   - Sensitive data logging'i engelle
   - Token'ları log'lara yazma
   - Error messages'da sensitive info gösterme

---

## 📊 Tarama İstatistikleri

- **Taranan Dosyalar:** 2
  - `src/app/api/auth/login/route.ts`
  - `src/lib/supabase-service.ts`
- **Tespit Edilen Sorunlar:** 3
  - 🔴 Kritik: 2 (Token exposure)
  - 🟡 Bilgi: 1 (Rate limiting)
- **Temiz Dosyalar:** 1
  - `src/lib/api-helpers.ts`
  - `src/lib/auth-middleware.ts`

---

## 🔄 Sürekli Güvenlik Taraması

### CI/CD Entegrasyonu

Semgrep'i CI/CD pipeline'a ekleyin:

```yaml
# .github/workflows/security.yml
name: Security Scan
on: [push, pull_request]
jobs:
  semgrep:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: returntocorp/semgrep-action@v1
        with:
          config: p/security-audit
```

### Düzenli Tarama

1. **Her PR'da otomatik tarama**
2. **Haftalık full codebase taraması**
3. **Kritik güvenlik güncellemelerinde tarama**

---

## 📚 Kaynaklar

- [Semgrep Documentation](https://semgrep.dev/docs)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)

---

**Rapor Oluşturuldu:** 13 Ocak 2026  
**Sonraki Tarama:** 20 Ocak 2026
