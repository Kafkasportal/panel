---
name: backend-developer
description: Backend API routes, database integrations ve server-side iş mantığı geliştirmek için kullanılır. Supabase, Zod validation, rate limiting ve API security konularında uzman.
---

# Backend Developer Skill

Backend API routes, database integrations ve server-side iş mantığı geliştirir.

## When to Use

- API route oluştururken veya düzenlerken
- Supabase client configuration yaparken
- Input/output validation (Zod) eklerken
- Error handling middleware yazarken
- Rate limiting implementasyonu yaparken
- JWT token validation eklerken
- Database query optimization yaparken
- API security (CORS, XSS, CSRF) implementasyonu yaparken

## Instructions

### Görevler
- Supabase client configuration ve setup
- API route development (auth, members, donations, social-aid, documents, settings)
- Input/output validation using Zod
- Error handling middleware
- Rate limiting implementation
- JWT token validation
- Database query optimization
- API security (CORS, XSS, CSRF protection)

### Kurallar
- Tüm API routes `src/app/api/` dizininde olmalı
- Her endpoint request/response validation kullanmalı
- Error handling consistent olmalı (standardized error responses)
- Rate limiting tüm public endpoints'de olmalı
- Database query'leri güvenli olmalı (SQL injection prevention)
- Environment variables validation yapılmalı

### Kod Kalitesi
- TypeScript strict mode kullan
- JSDoc comments ekle (API documentation için)
- Error messages user-friendly olmalı (Turkish)
- HTTP status codes doğru kullan (200, 201, 400, 401, 403, 404, 500)
- API responses consistent format (success, error)

### Dosya Yapısı

```
src/app/api/
├── auth/
│   ├── login/route.ts
│   ├── logout/route.ts
│   └── refresh/route.ts
├── members/
│   ├── route.ts
│   └── [id]/route.ts
├── donations/
│   ├── route.ts
│   └── [id]/route.ts
├── social-aid/
│   ├── route.ts
│   └── [id]/route.ts
├── documents/
│   ├── route.ts
│   └── [id]/route.ts
└── settings/
    └── route.ts
```

### API Response Format

```typescript
// Success response
{
  data: { ... },
  meta?: { ... }  // Optional metadata (pagination, etc.)
}

// Error response
{
  error: "Kullanıcı dostu hata mesajı",
  message: "Detaylı hata mesajı",
  status: 400
}
```

### Helper Functions

Projede kullanılan API helper fonksiyonları (`src/lib/api-helpers.ts`):

- `withProtectedApi` - Authentication + rate limiting + error handling
- `withProtectedApiParams` - Dynamic routes için protected API wrapper
- `createSuccessResponse` - Standart başarılı response
- `createErrorResponse` - Standart hata response
- `parseJsonBody` - JSON body parsing ve validation
- `validateMethod` - HTTP method validation
- `RateLimitPresets` - Rate limiting preset'leri

### Complete API Route Example

```typescript
import { NextRequest } from "next/server";
import { createMember } from "@/lib/supabase-service";
import { memberSchema } from "@/lib/validations/members";
import {
  withProtectedApi,
  createSuccessResponse,
  parseJsonBody,
  validateMethod,
  RateLimitPresets,
} from "@/lib/api-helpers";

async function handlePost(
  req: NextRequest,
  _user: { id: string; email: string; role: string }
) {
  const methodError = validateMethod(req, ["POST"]);
  if (methodError) return methodError;

  const bodyResult = await parseJsonBody(req);
  if (!bodyResult.success) {
    return bodyResult.error;
  }

  // Zod validation
  const validatedData = memberSchema.parse(bodyResult.data);
  
  // Business logic
  const result = await createMember(validatedData);

  return createSuccessResponse(result, 201);
}

// Export with protection wrapper
export const POST = withProtectedApi(handlePost, {
  defaultErrorMessage: "Üye oluşturulurken bir hata oluştu",
  rateLimit: RateLimitPresets.standard,
});
```

### Validation Schema Example

```typescript
// src/lib/validations/members.ts
import { z } from "zod";

export const memberSchema = z.object({
  tc_kimlik_no: z.string().min(11, "TC Kimlik No 11 haneli olmalı").max(11),
  ad: z.string().min(2, "Ad en az 2 karakter olmalı"),
  soyad: z.string().min(2, "Soyad en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir e-posta adresi girin").optional(),
  telefon: z.string().min(10, "Telefon en az 10 haneli olmalı"),
  uye_turu: z.enum(["onursal", "standart", "fahri"]),
});

export type MemberInput = z.infer<typeof memberSchema>;
```

### Dynamic Route Example ([id])

```typescript
import { NextRequest } from "next/server";
import { updateMember } from "@/lib/supabase-service";
import { memberUpdateSchema } from "@/lib/validations/members";
import {
  withProtectedApiParams,
  createSuccessResponse,
  createErrorResponse,
  parseJsonBody,
  RateLimitPresets,
} from "@/lib/api-helpers";

async function handlePut(
  req: NextRequest,
  _user: { id: string; email: string; role: string },
  params: Promise<{ id: string }>
) {
  const { id: idParam } = await params;
  const id = Number(idParam);

  if (isNaN(id)) {
    return createErrorResponse(
      new Error("Invalid member ID"),
      "Geçersiz üye ID",
      400
    );
  }

  const bodyResult = await parseJsonBody(req);
  if (!bodyResult.success) {
    return bodyResult.error;
  }

  const validatedData = memberUpdateSchema.parse(bodyResult.data);
  const result = await updateMember(id, validatedData);

  return createSuccessResponse(result);
}

export const PUT = withProtectedApiParams(handlePut, {
  defaultErrorMessage: "Üye güncellenirken bir hata oluştu",
  rateLimit: RateLimitPresets.standard,
});
```

### Query Parameters Example

```typescript
async function handleGet(
  req: NextRequest,
  _user: { id: string; email: string; role: string }
) {
  const methodError = validateMethod(req, ["GET"]);
  if (methodError) return methodError;

  const searchParams = req.nextUrl.searchParams;

  // Validate query parameters with Zod
  const query = memberQuerySchema.parse({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
    search: searchParams.get("search"),
  });

  const result = await fetchMembers({
    page: Number(query.page),
    limit: Number(query.limit),
    search: query.search,
  });

  return createSuccessResponse(result);
}
```
