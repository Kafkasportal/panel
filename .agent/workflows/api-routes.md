---
description: KafkasDer Panel API routes yapısı ve kullanımı
---

# API Routes

Bu proje Next.js App Router API routes kullanır.

## API Yapısı

```
src/app/api/
├── auth/
│   ├── login/route.ts
│   ├── logout/route.ts
│   └── callback/route.ts
├── members/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── donations/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── social-aid/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── documents/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, DELETE)
├── settings/
│   ├── route.ts (GET, PUT)
│   └── options/route.ts
└── options/
    └── route.ts
```

## API Route Yazma

### Temel Yapı

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('table_name')
      .insert(body)
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
```

### Dinamik Route

```typescript
// src/app/api/[resource]/[id]/route.ts
import { type NextRequest, NextResponse } from 'next/server'

type RouteParams = Promise<{ id: string }>

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  const { id } = await params
  // ...
}

export async function PUT(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  const { id } = await params
  // ...
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  const { id } = await params
  // ...
}
```

## API Yardımcıları

### `src/lib/api-helpers.ts`

- Response oluşturma fonksiyonları
- Error handling
- Request validation

### `src/lib/auth-middleware.ts`

- JWT doğrulama
- Oturum kontrolü
- Yetkilendirme

### `src/lib/rate-limit.ts`

- Rate limiting middleware
- Abuse koruması

## Validasyon

Zod şemalarını kullanın (`src/lib/validations/`):

```typescript
import { memberSchema } from '@/lib/validations/member'

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const validatedData = memberSchema.parse(body)
  // ...
}
```

## Error Handling

Detaylı bilgi için: `docs/ERROR_RESPONSE_HANDLING.md`

```typescript
import { 
  successResponse,
  errorResponse,
  validationErrorResponse 
} from '@/lib/api-helpers'

// Başarılı yanıt
return successResponse(data)

// Hata yanıtı
return errorResponse('Error message', 500)

// Validasyon hatası
return validationErrorResponse(errors)
```
