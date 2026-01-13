# Error Response Handling Guide

## Overview

KafkasDer Panel uses a standardized error response pattern across all API routes. This ensures consistent error handling and user-friendly error messages.

## Core Function

### `createErrorResponse`

Located in `src/lib/api-helpers.ts`

```typescript
export function createErrorResponse(
  error: unknown,
  message: string,        // Turkish user-friendly message
  status: number = 500
): NextResponse {
  const errorMessage = error instanceof Error ? error.message : String(error)

  return NextResponse.json(
    {
      error: message,      // User sees this
      message: errorMessage, // Technical details
      status,
    },
    { status }
  )
}
```

## Response Format

All error responses follow this JSON structure:

```json
{
  "error": "Turkish user-friendly message",
  "message": "Technical error details",
  "status": 404
}
```

## HTTP Status Codes

| Status | Use Case | Turkish Message Example |
|--------|----------|------------------------|
| **400** | Bad Request / Validation Error | "Geçersiz üye ID", "İstek gövdesi geçersiz" |
| **401** | Unauthorized | "Giriş başarısız", "Oturum açmanız gerekiyor" |
| **403** | Forbidden | "Bu işlem için yetkiniz yok" |
| **404** | Not Found | "Üye bulunamadı", "Kayıt bulunamadı" |
| **405** | Method Not Allowed | "Bu endpoint sadece GET metodlarını destekler" |
| **429** | Too Many Requests | "Rate limit exceeded. Try again in X seconds." |
| **500** | Internal Server Error | "Beklenmeyen bir hata oluştu" |

## Usage Examples

### 1. Validation Error (400)

```typescript
// Invalid ID
if (isNaN(id)) {
  return createErrorResponse(
    new Error("Invalid member ID"),
    "Geçersiz üye ID",
    400
  )
}

// Invalid JSON body
const bodyResult = await parseJsonBody(req)
if (!bodyResult.success) {
  return bodyResult.error // Already formatted as error response
}
```

### 2. Not Found (404)

```typescript
const result = await fetchMember(id)
if (!result) {
  return createErrorResponse(
    new Error("Member not found"),
    "Üye bulunamadı",
    404
  )
}
```

### 3. Authentication Error (401)

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: validatedData.email,
  password: validatedData.password,
})

if (error) {
  return createErrorResponse(
    error,
    "Giriş başarısız",
    401
  )
}
```

### 4. Method Not Allowed (405)

```typescript
const methodError = validateMethod(req, ["GET", "POST"])
if (methodError) return methodError
```

### 5. Rate Limit Error (429)

Rate limiting is handled automatically by `withRateLimit` middleware:

```typescript
// Automatically returns 429 with headers:
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Try again in 30 seconds.",
  "status": 429
}
// Headers: X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After
```

### 6. Server Error (500)

```typescript
try {
  // Business logic
} catch (error) {
  if (error instanceof Error) {
    return createErrorResponse(
      error,
      "Geçersiz istek",
      400
    )
  }
  
  return createErrorResponse(
    new Error("Unknown error"),
    "Beklenmeyen bir hata oluştu",
    500
  )
}
```

## Error Handling Middleware

### Automatic Error Catching

```typescript
export function withErrorHandling(
  handler: (req: NextRequest) => Promise<NextResponse>,
  defaultErrorMessage: string
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req)
    } catch (error) {
      return createErrorResponse(error, defaultErrorMessage)
    }
  }
}
```

### Combined Middleware

```typescript
// Rate limiting + Error handling
export const POST = withApiMiddleware(handleLogin, {
  defaultErrorMessage: "Giriş başarısız",
  rateLimit: RateLimitPresets.strict,
})

// Auth + Rate limiting + Error handling
export const GET = withProtectedApi(handleGet, {
  defaultErrorMessage: "Üye getirilemedi",
  rateLimit: RateLimitPresets.lenient,
  requiredPermissions: ["members.view"],
})
```

## Helper Functions

### `parseJsonBody`

Safely parses JSON body and returns error response if invalid:

```typescript
const bodyResult = await parseJsonBody<MemberInput>(req)
if (!bodyResult.success) {
  return bodyResult.error // Already formatted error response
}
const data = bodyResult.data
```

### `validateMethod`

Validates HTTP method and returns error if invalid:

```typescript
const methodError = validateMethod(req, ["GET", "POST"])
if (methodError) return methodError
```

## Best Practices

### ✅ DO

1. **Always use `createErrorResponse`** for consistency
2. **Provide Turkish user messages** in the `error` field
3. **Include technical details** in the `message` field
4. **Use appropriate HTTP status codes**
5. **Wrap handlers with middleware** for automatic error catching
6. **Validate input early** before processing

### ❌ DON'T

1. **Don't expose sensitive information** in error messages
2. **Don't use generic error messages** - be specific
3. **Don't forget to handle edge cases** (null, undefined, NaN)
4. **Don't skip validation** - validate before processing
5. **Don't use console.error in production** - use proper logging

## Complete Example

```typescript
import {
  withProtectedApi,
  createErrorResponse,
  createSuccessResponse,
  parseJsonBody,
  validateMethod,
  RateLimitPresets,
} from "@/lib/api-helpers"
import { memberUpdateSchema } from "@/lib/validations/members"

async function handlePut(
  req: NextRequest,
  user: { id: string; email: string; role: string },
  params: Promise<{ id: string }>
) {
  // 1. Validate method
  const methodError = validateMethod(req, ["PUT"])
  if (methodError) return methodError

  // 2. Validate params
  const { id: idParam } = await params
  const id = Number(idParam)
  if (isNaN(id)) {
    return createErrorResponse(
      new Error("Invalid member ID"),
      "Geçersiz üye ID",
      400
    )
  }

  // 3. Parse and validate body
  const bodyResult = await parseJsonBody(req)
  if (!bodyResult.success) {
    return bodyResult.error
  }

  // 4. Validate schema
  try {
    const validatedData = memberUpdateSchema.parse(bodyResult.data)
    
    // 5. Business logic
    const result = await updateMember(id, validatedData)
    
    if (!result) {
      return createErrorResponse(
        new Error("Member not found"),
        "Üye bulunamadı",
        404
      )
    }

    // 6. Success response
    return createSuccessResponse(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse(
        error,
        "Girilen bilgiler geçersiz",
        400
      )
    }
    throw error // Let middleware handle unexpected errors
  }
}

export const PUT = withProtectedApiParams(handlePut, {
  defaultErrorMessage: "Üye güncellenemedi",
  rateLimit: RateLimitPresets.standard,
  requiredPermissions: ["members.edit"],
})
```

## Success Response Format

For comparison, success responses use:

```typescript
export function createSuccessResponse<T>(
  data: T,
  status: number = 200,
  meta?: Record<string, unknown>
): NextResponse {
  return NextResponse.json(
    {
      data,
      ...(meta && { meta }),
    },
    { status }
  )
}
```

Response format:
```json
{
  "data": { ... },
  "meta": { ... } // Optional
}
```

## Related Files

- `src/lib/api-helpers.ts` - Core error handling functions
- `src/lib/auth-middleware.ts` - Authentication error handling
- `src/lib/rate-limit.ts` - Rate limiting error responses
- `src/app/api/**/route.ts` - API route examples

---

**Last Updated:** January 2026  
**Maintained by:** Development Team
