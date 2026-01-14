---
description: KafkasDer Panel ana özellikler ve modüller
---

# Ana Özellikler ve Modüller

## 1. Üye Yönetimi (Uyeler)

**Route:** `/uyeler`
**Bileşenler:** `src/components/features/members/`

### Özellikler

- Üye kayıt ve güncelleme
- Üye listesi ve arama
- Üye detay görüntüleme
- Üyelik durumu takibi

### Dosyalar

- `src/app/(dashboard)/uyeler/` - Sayfa dosyaları
- `src/components/features/members/` - Bileşenler
- `src/app/api/members/` - API routes

---

## 2. Bağış Yönetimi (Bagis)

**Route:** `/bagis`
**Bileşenler:** `src/components/features/donations/`

### Özellikler

- Bağış kayıt ve takibi
- Gelir-gider yönetimi
- Kumbara yönetimi
- Bağış raporlama

### Alt Modüller

- `/bagis/liste` - Bağış listesi
- `/bagis/ekle` - Yeni bağış
- `/bagis/kumbaralar` - Kumbara yönetimi
- `/bagis/raporlar` - Raporlar

---

## 3. Sosyal Yardım (Sosyal-Yardim)

**Route:** `/sosyal-yardim`
**Bileşenler:** `src/components/features/social-aid/`

### Özellikler

- Başvuru yönetimi
- İhtiyaç sahipleri takibi
- Ödeme işlemleri
- Onay iş akışı

### Alt Modüller

- `/sosyal-yardim/basvurular` - Başvurular
- `/sosyal-yardim/odemeler` - Ödemeler
- `/sosyal-yardim/ihtiyac-sahipleri` - İhtiyaç sahipleri

---

## 4. Doküman Yönetimi (Dokumanlar)

**Route:** `/dokumanlar`
**Bileşenler:** `src/components/features/documents/`

### Özellikler

- Dosya yükleme
- Dosya kategorilendirme
- Dosya arama
- Dosya indirme

---

## 5. Kullanıcı Yönetimi (Kullanicilar)

**Route:** `/kullanicilar`

### Özellikler

- Kullanıcı oluşturma
- Rol tabanlı erişim kontrolü
- Kullanıcı yetkilendirme

---

## 6. Audit Logs

**Bileşenler:** `src/components/features/audit-logs/`

### Özellikler

- Tüm işlemlerin kaydı
- Aktivite takibi
- Log filtreleme

---

## 7. Dashboard (Genel)

**Route:** `/genel`

### Özellikler

- İstatistik kartları
- Grafikler (Recharts)
- Özet raporlar

---

## 8. Ayarlar

**Route:** `/ayarlar`

### Özellikler

- Uygulama ayarları
- Tema ayarları
- Bildirim ayarları

---

## Yeni Özellik Ekleme Adımları

1. **Route Oluştur**

   ```
   src/app/(dashboard)/[feature-name]/
   ├── page.tsx
   ├── loading.tsx
   └── error.tsx
   ```

2. **Bileşenler Oluştur**

   ```
   src/components/features/[feature-name]/
   ├── [feature]-form.tsx
   ├── [feature]-list.tsx
   └── [feature]-card.tsx
   ```

3. **API Route Oluştur**

   ```
   src/app/api/[feature-name]/
   ├── route.ts (GET, POST)
   └── [id]/route.ts (GET, PUT, DELETE)
   ```

4. **Supabase Tablosu Ekle**
   - Migration dosyası oluştur
   - Servis fonksiyonları ekle

5. **Navigasyona Ekle**
   - `src/components/app-sidebar.tsx` güncelle
