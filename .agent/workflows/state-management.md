---
description: KafkasDer Panel state yönetimi (Zustand ve TanStack Query)
---

# State Yönetimi

Bu proje Zustand ile client state ve TanStack Query ile server state yönetir.

## Zustand Stores

Store dosyaları: `src/stores/`

### Mevcut Stores

```
src/stores/
├── user-store.ts     # Kullanıcı state
├── settings-store.ts # Ayarlar state
└── modal-store.ts    # Modal state
```

### Store Oluşturma

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MyStore {
  value: string
  setValue: (value: string) => void
}

export const useMyStore = create<MyStore>()(
  persist(
    (set) => ({
      value: '',
      setValue: (value) => set({ value }),
    }),
    {
      name: 'my-store',
    }
  )
)
```

### Store Kullanma

```typescript
import { useMyStore } from '@/stores/my-store'

function MyComponent() {
  const { value, setValue } = useMyStore()
  
  return (
    <input value={value} onChange={(e) => setValue(e.target.value)} />
  )
}
```

## TanStack Query

Server state için TanStack Query kullanın.

### Provider

`src/providers/query-provider.tsx` - QueryClientProvider

### Query Kullanımı

```typescript
import { useQuery } from '@tanstack/react-query'

function MembersList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const res = await fetch('/api/members')
      return res.json()
    }
  })

  if (isLoading) return <Loading />
  if (error) return <Error />

  return <MembersTable data={data} />
}
```

### Mutation Kullanımı

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

function CreateMemberForm() {
  const queryClient = useQueryClient()
  
  const mutation = useMutation({
    mutationFn: async (data: MemberData) => {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
    }
  })

  const onSubmit = (data: MemberData) => {
    mutation.mutate(data)
  }

  return <form onSubmit={...}>...</form>
}
```

### Query Key Conventions

```typescript
// Liste
queryKey: ['members']
queryKey: ['donations', { year: 2024 }]

// Tek kayıt
queryKey: ['members', id]

// İlişkili veri
queryKey: ['members', id, 'donations']
```

## Custom Hooks

Hook dosyaları: `src/hooks/`

### useApi Hook

```typescript
import { useApi } from '@/hooks/use-api'

const { data, loading, error, fetch } = useApi<Member[]>('/api/members')
```

### Mevcut Hooks

- `use-debounce.ts` - Debounce hook
- `use-local-storage.ts` - LocalStorage hook
- `use-media-query.ts` - Media query hook
- `use-mobile.ts` - Mobile detection hook

## State Organizasyonu

1. **Client State (Zustand)**
   - UI state (modals, sidebars)
   - User preferences
   - Form drafts
   - Local filters

2. **Server State (TanStack Query)**
   - API data
   - Server mutations
   - Cache management
   - Background refetching
