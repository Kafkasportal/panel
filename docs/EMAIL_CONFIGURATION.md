# Email Konfigürasyonu Rehberi

## Sorun

Supabase Auth email template'leri için 403 hatası alınıyor. Bu, email template'lerin Supabase platform API'sinden çekilememesi anlamına gelir.

## Çözüm Adımları

### 1. Supabase Dashboard Kontrolü

1. **Supabase Dashboard'a giriş yapın**
   - Proje: `idsiiayyvygcgegmqcov` (Panel)

2. **Authentication > Email Templates bölümüne gidin**
   - Email template'lerin yüklenip yüklenmediğini kontrol edin
   - Eğer template'ler yoksa, default template'leri yükleyin

3. **Project Settings > API bölümüne gidin**
   - API keys'in doğru olduğundan emin olun
   - Service role key'in güvenli olduğundan emin olun

4. **Project Settings > Auth bölümüne gidin**
   - SMTP settings kontrol edin
   - Email provider ayarlarını kontrol edin
   - Custom SMTP kullanıyorsanız, credentials'ları doğrulayın

### 2. Email Template Permissions

Eğer 403 hatası devam ediyorsa:

1. **Supabase Support'a başvurun**
   - Email template permissions sorununu bildirin
   - Project ID: `idsiiayyvygcgegmqcov`

2. **Alternatif: Custom SMTP kullanın**
   - Project Settings > Auth > SMTP Settings
   - Kendi SMTP provider'ınızı yapılandırın (Gmail, SendGrid, etc.)

### 3. Test Email Gönderimi

#### Password Reset Test
```typescript
// Test için Supabase client kullanın
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { error } = await supabase.auth.resetPasswordForEmail('test@example.com', {
  redirectTo: 'http://localhost:3000/auth/reset-password'
})
```

#### Email Verification Test
```typescript
const { error } = await supabase.auth.resend({
  type: 'signup',
  email: 'test@example.com'
})
```

#### Magic Link Test
```typescript
const { error } = await supabase.auth.signInWithOtp({
  email: 'test@example.com'
})
```

### 4. Email Service Wrapper (Opsiyonel)

Eğer custom email gönderimi gerekiyorsa, `src/lib/email-service.ts` dosyasını kullanabilirsiniz.

## Troubleshooting

### 403 Hatası Devam Ediyorsa

1. **Supabase CLI ile kontrol edin:**
   ```bash
   supabase projects list
   supabase projects api-keys --project-ref idsiiayyvygcgegmqcov
   ```

2. **Logs kontrol edin:**
   - Supabase Dashboard > Logs > Auth
   - 403 hatalarının detaylarını inceleyin

3. **API Key Permissions:**
   - Service role key'in tüm gerekli izinlere sahip olduğundan emin olun

### Email Gönderilmiyor

1. **SMTP Settings kontrol edin**
2. **Email provider limits kontrol edin**
3. **Spam folder kontrol edin**
4. **Email address validation kontrol edin**

## Notlar

- Email template'ler Supabase platform API'sinden çekilir
- 403 hatası genellikle permission sorunudur
- Custom SMTP kullanmak daha güvenilir olabilir
- Production'da mutlaka test edin

## İlgili Dosyalar

- `src/lib/email-service.ts` - Email service wrapper (opsiyonel)
- `src/lib/supabase/client.ts` - Supabase client configuration
