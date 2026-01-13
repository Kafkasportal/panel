# cursor-ide-browser MCP Server Rehberi

## 📖 Genel Bakış

`cursor-ide-browser` MCP server'ı, AI asistanlarının web sayfalarını taramasına, etkileşimde bulunmasına ve test etmesine olanak sağlar. Bu, frontend geliştirme, web uygulaması testleri ve web sayfalarını analiz etme için idealdir.

---

## 🎯 Kullanım Senaryoları

### 1. **Frontend Geliştirme Testleri**
- Geliştirdiğiniz web uygulamasını test etme
- UI component'lerinin doğru çalıştığını doğrulama
- Responsive tasarım kontrolü
- Form validasyon testleri

### 2. **Web Sayfası Analizi**
- Sayfa içeriğini inceleme
- Network request'lerini izleme
- Console hatalarını kontrol etme
- Performance analizi

### 3. **E2E Test Senaryoları**
- Kullanıcı akışlarını test etme
- Authentication flow testleri
- Form submission testleri
- Navigation testleri

---

## 🛠️ Mevcut Araçlar

### 1. **Sayfa Navigasyonu**

#### `browser_navigate`
Bir URL'ye gitmek için kullanılır.

**Parametreler:**
- `url` (string, zorunlu): Gidilecek URL
- `viewId` (string, opsiyonel): Hedef browser tab ID
- `position` (string, opsiyonel): "active" veya "side" (yan panel için)

**Örnek Kullanım:**
```typescript
// Ana tab'da sayfa aç
await mcp_cursor-ide-browser_browser_navigate({
  url: "http://localhost:3000/giris",
});

// Yan panelde sayfa aç
await mcp_cursor-ide-browser_browser_navigate({
  url: "http://localhost:3000/genel",
  position: "side",
});
```

#### `browser_navigate_back`
Önceki sayfaya geri dönmek için.

**Örnek:**
```typescript
await mcp_cursor-ide-browser_browser_navigate_back();
```

---

### 2. **Sayfa İçeriği Analizi**

#### `browser_snapshot`
Sayfanın accessibility snapshot'ını alır. Screenshot'tan daha iyidir çünkü etkileşim için element referansları sağlar.

**Örnek:**
```typescript
const snapshot = await mcp_cursor-ide-browser_browser_snapshot();
// snapshot içinde tüm sayfa elementleri ve referansları var
```

**Dönen Veri Yapısı:**
```json
{
  "url": "http://localhost:3000/giris",
  "title": "Kafkasder Panel - Giriş",
  "elements": [
    {
      "ref": "element-ref-123",
      "type": "button",
      "text": "Giriş Yap",
      "attributes": { "aria-label": "Giriş yap butonu" }
    }
  ]
}
```

#### `browser_take_screenshot`
Sayfanın screenshot'ını alır.

**Parametreler:**
- `type` (string, opsiyonel): "png" veya "jpeg" (varsayılan: "png")
- `filename` (string, opsiyonel): Kayıt edilecek dosya adı
- `fullPage` (boolean, opsiyonel): Tüm sayfayı mı yoksa sadece viewport'u mu
- `element` (string, opsiyonel): Element açıklaması
- `ref` (string, opsiyonel): CSS selector

**Örnek:**
```typescript
// Tüm sayfanın screenshot'ı
await mcp_cursor-ide-browser_browser_take_screenshot({
  fullPage: true,
  filename: "login-page.png",
});

// Belirli bir element'in screenshot'ı
await mcp_cursor-ide-browser_browser_take_screenshot({
  element: "Login form",
  ref: "form.login-form",
  filename: "login-form.png",
});
```

---

### 3. **Sayfa Etkileşimleri**

#### `browser_click`
Bir elemente tıklamak için.

**Parametreler:**
- `element` (string, zorunlu): Element açıklaması (insan okunabilir)
- `ref` (string, zorunlu): Element referansı (snapshot'tan alınır)
- `doubleClick` (boolean, opsiyonel): Çift tıklama
- `button` (string, opsiyonel): "left", "right", "middle"
- `modifiers` (array, opsiyonel): ["Control", "Shift", "Alt", "Meta"]

**Örnek:**
```typescript
// Önce snapshot al
const snapshot = await mcp_cursor-ide-browser_browser_snapshot();

// "Giriş Yap" butonunu bul ve tıkla
const loginButton = snapshot.elements.find(
  el => el.text === "Giriş Yap" && el.type === "button"
);

await mcp_cursor-ide-browser_browser_click({
  element: "Giriş Yap butonu",
  ref: loginButton.ref,
});
```

#### `browser_type`
Bir input alanına metin yazmak için.

**Parametreler:**
- `element` (string, zorunlu): Element açıklaması
- `ref` (string, zorunlu): Element referansı
- `text` (string, zorunlu): Yazılacak metin
- `submit` (boolean, opsiyonel): Enter'a bas (varsayılan: false)
- `slowly` (boolean, opsiyonel): Karakter karakter yaz (varsayılan: false)

**Örnek:**
```typescript
// Email input'una yaz
await mcp_cursor-ide-browser_browser_type({
  element: "Email input",
  ref: "input[type='email']",
  text: "admin@kafkasder.org",
});

// Şifre input'una yaz ve Enter'a bas
await mcp_cursor-ide-browser_browser_type({
  element: "Password input",
  ref: "input[type='password']",
  text: "password123",
  submit: true,
});
```

#### `browser_hover`
Bir elementin üzerine gelmek için.

**Örnek:**
```typescript
await mcp_cursor-ide-browser_browser_hover({
  element: "Dropdown menu",
  ref: "button.dropdown-trigger",
});
```

#### `browser_press_key`
Klavye tuşuna basmak için.

**Parametreler:**
- `key` (string, zorunlu): Tuş adı (örn: "Enter", "Escape", "ArrowLeft", "a")

**Örnek:**
```typescript
// Enter tuşuna bas
await mcp_cursor-ide-browser_browser_press_key({
  key: "Enter",
});

// Escape tuşuna bas
await mcp_cursor-ide-browser_browser_press_key({
  key: "Escape",
});

// Ctrl+S (kaydet)
await mcp_cursor-ide-browser_browser_press_key({
  key: "s",
  modifiers: ["Control"],
});
```

#### `browser_select_option`
Dropdown'dan seçenek seçmek için.

**Parametreler:**
- `element` (string, zorunlu): Dropdown açıklaması
- `ref` (string, zorunlu): Element referansı
- `values` (array, zorunlu): Seçilecek değer(ler)

**Örnek:**
```typescript
await mcp_cursor-ide-browser_browser_select_option({
  element: "Role dropdown",
  ref: "select[name='role']",
  values: ["admin"],
});
```

---

### 4. **Bekleme ve Zamanlama**

#### `browser_wait_for`
Belirli bir koşul gerçekleşene kadar beklemek için.

**Parametreler:**
- `text` (string, opsiyonel): Bu metin görünene kadar bekle
- `textGone` (string, opsiyonel): Bu metin kaybolana kadar bekle
- `time` (number, opsiyonel): Belirli süre bekle (saniye cinsinden)

**Örnek:**
```typescript
// "Başarılı" mesajı görünene kadar bekle
await mcp_cursor-ide-browser_browser_wait_for({
  text: "Başarılı",
});

// Loading spinner kaybolana kadar bekle
await mcp_cursor-ide-browser_browser_wait_for({
  textGone: "Yükleniyor...",
});

// 2 saniye bekle
await mcp_cursor-ide-browser_browser_wait_for({
  time: 2,
});
```

---

### 5. **Browser Yönetimi**

#### `browser_tabs`
Tab yönetimi için.

**Parametreler:**
- `action` (string, zorunlu): "list", "new", "close", "select"
- `index` (number, opsiyonel): Tab index (select/close için)
- `position` (string, opsiyonel): "active" veya "side" (new için)

**Örnek:**
```typescript
// Yeni tab oluştur
await mcp_cursor-ide-browser_browser_tabs({
  action: "new",
  position: "side",
});

// Tüm tab'ları listele
const tabs = await mcp_cursor-ide-browser_browser_tabs({
  action: "list",
});

// Belirli bir tab'ı seç
await mcp_cursor-ide-browser_browser_tabs({
  action: "select",
  index: 1,
});

// Tab'ı kapat
await mcp_cursor-ide-browser_browser_tabs({
  action: "close",
  index: 0,
});
```

#### `browser_resize`
Browser penceresini yeniden boyutlandırmak için.

**Parametreler:**
- `width` (number, zorunlu): Genişlik (piksel)
- `height` (number, zorunlu): Yükseklik (piksel)

**Örnek:**
```typescript
// Mobile görünüm için
await mcp_cursor-ide-browser_browser_resize({
  width: 375,
  height: 667,
});

// Desktop görünüm için
await mcp_cursor-ide-browser_browser_resize({
  width: 1920,
  height: 1080,
});
```

---

### 6. **Debugging ve Analiz**

#### `browser_console_messages`
Console mesajlarını almak için.

**Örnek:**
```typescript
const messages = await mcp_cursor-ide-browser_browser_console_messages();
// messages içinde console.log, console.error, console.warn mesajları var
```

**Dönen Veri Yapısı:**
```json
{
  "messages": [
    {
      "type": "log",
      "text": "User logged in",
      "timestamp": "2026-01-13T10:00:00Z"
    },
    {
      "type": "error",
      "text": "Failed to fetch data",
      "timestamp": "2026-01-13T10:00:01Z"
    }
  ]
}
```

#### `browser_network_requests`
Network request'lerini izlemek için.

**Örnek:**
```typescript
const requests = await mcp_cursor-ide-browser_browser_network_requests();
// requests içinde tüm HTTP istekleri ve yanıtları var
```

**Dönen Veri Yapısı:**
```json
{
  "requests": [
    {
      "url": "http://localhost:3000/api/members",
      "method": "GET",
      "status": 200,
      "duration": 150,
      "timestamp": "2026-01-13T10:00:00Z"
    }
  ]
}
```

---

## 📝 Pratik Örnekler

### Örnek 1: Login Test Senaryosu

```typescript
// 1. Login sayfasına git
await mcp_cursor-ide-browser_browser_navigate({
  url: "http://localhost:3000/giris",
});

// 2. Sayfa snapshot'ı al
const snapshot = await mcp_cursor-ide-browser_browser_snapshot();

// 3. Email input'unu bul ve doldur
const emailInput = snapshot.elements.find(
  el => el.type === "textbox" && el.attributes?.name === "email"
);
await mcp_cursor-ide-browser_browser_type({
  element: "Email input",
  ref: emailInput.ref,
  text: "admin@kafkasder.org",
});

// 4. Password input'unu bul ve doldur
const passwordInput = snapshot.elements.find(
  el => el.type === "textbox" && el.attributes?.type === "password"
);
await mcp_cursor-ide-browser_browser_type({
  element: "Password input",
  ref: passwordInput.ref,
  text: "password123",
});

// 5. Login butonuna tıkla
const loginButton = snapshot.elements.find(
  el => el.text === "Giriş Yap" && el.type === "button"
);
await mcp_cursor-ide-browser_browser_click({
  element: "Login button",
  ref: loginButton.ref,
});

// 6. Dashboard'a yönlendirilmeyi bekle
await mcp_cursor-ide-browser_browser_wait_for({
  text: "Genel Bakış",
});

// 7. Başarılı login'i doğrula
const newSnapshot = await mcp_cursor-ide-browser_browser_snapshot();
const dashboardHeading = newSnapshot.elements.find(
  el => el.text === "Genel Bakış"
);
// Dashboard görünür olmalı
```

### Örnek 2: Form Doldurma ve Gönderme

```typescript
// 1. Üye ekleme sayfasına git
await mcp_cursor-ide-browser_browser_navigate({
  url: "http://localhost:3000/uyeler/yeni",
});

// 2. Form alanlarını doldur
const snapshot = await mcp_cursor-ide-browser_browser_snapshot();

// Ad Soyad
const nameInput = snapshot.elements.find(
  el => el.attributes?.name === "name"
);
await mcp_cursor-ide-browser_browser_type({
  element: "Name input",
  ref: nameInput.ref,
  text: "Ahmet Yılmaz",
});

// TC Kimlik No
const tcInput = snapshot.elements.find(
  el => el.attributes?.name === "tcKimlikNo"
);
await mcp_cursor-ide-browser_browser_type({
  element: "TC Kimlik No input",
  ref: tcInput.ref,
  text: "12345678901",
});

// Telefon
const phoneInput = snapshot.elements.find(
  el => el.attributes?.name === "phone"
);
await mcp_cursor-ide-browser_browser_type({
  element: "Phone input",
  ref: phoneInput.ref,
  text: "05551234567",
});

// 3. Formu gönder
const submitButton = snapshot.elements.find(
  el => el.text === "Kaydet" && el.type === "button"
);
await mcp_cursor-ide-browser_browser_click({
  element: "Submit button",
  ref: submitButton.ref,
});

// 4. Başarı mesajını bekle
await mcp_cursor-ide-browser_browser_wait_for({
  text: "Başarılı",
});
```

### Örnek 3: Responsive Tasarım Testi

```typescript
// Mobile görünüm testi
await mcp_cursor-ide-browser_browser_resize({
  width: 375,
  height: 667,
});

await mcp_cursor-ide-browser_browser_navigate({
  url: "http://localhost:3000/genel",
});

// Mobile menüyü kontrol et
const snapshot = await mcp_cursor-ide-browser_browser_snapshot();
const hamburgerMenu = snapshot.elements.find(
  el => el.type === "button" && el.attributes?.ariaLabel?.includes("menu")
);

if (hamburgerMenu) {
  await mcp_cursor-ide-browser_browser_click({
    element: "Hamburger menu",
    ref: hamburgerMenu.ref,
  });
  
  // Menü açıldı mı kontrol et
  await mcp_cursor-ide-browser_browser_wait_for({
    text: "Üyeler",
  });
}

// Desktop görünüm testi
await mcp_cursor-ide-browser_browser_resize({
  width: 1920,
  height: 1080,
});

// Sayfayı yenile
await mcp_cursor-ide-browser_browser_navigate({
  url: "http://localhost:3000/genel",
});

// Sidebar görünür olmalı
const desktopSnapshot = await mcp_cursor-ide-browser_browser_snapshot();
const sidebar = desktopSnapshot.elements.find(
  el => el.type === "navigation" || el.attributes?.role === "navigation"
);
// Sidebar görünür olmalı
```

### Örnek 4: Network Request İzleme

```typescript
// Sayfaya git
await mcp_cursor-ide-browser_browser_navigate({
  url: "http://localhost:3000/uyeler",
});

// Bir işlem yap (örneğin arama)
const snapshot = await mcp_cursor-ide-browser_browser_snapshot();
const searchInput = snapshot.elements.find(
  el => el.attributes?.placeholder?.includes("ara")
);

await mcp_cursor-ide-browser_browser_type({
  element: "Search input",
  ref: searchInput.ref,
  text: "Ahmet",
  submit: true,
});

// Network request'lerini kontrol et
const requests = await mcp_cursor-ide-browser_browser_network_requests();
const apiRequest = requests.requests.find(
  req => req.url.includes("/api/members") && req.method === "GET"
);

// API isteği yapılmış mı kontrol et
if (apiRequest) {
  console.log(`API Request Status: ${apiRequest.status}`);
  console.log(`Response Time: ${apiRequest.duration}ms`);
}
```

### Örnek 5: Console Hatalarını Kontrol Etme

```typescript
// Sayfaya git
await mcp_cursor-ide-browser_browser_navigate({
  url: "http://localhost:3000/genel",
});

// Sayfa yüklenene kadar bekle
await mcp_cursor-ide-browser_browser_wait_for({
  time: 2,
});

// Console mesajlarını kontrol et
const messages = await mcp_cursor-ide-browser_browser_console_messages();
const errors = messages.messages.filter(msg => msg.type === "error");

if (errors.length > 0) {
  console.error("Console hataları bulundu:");
  errors.forEach(error => {
    console.error(`- ${error.text}`);
  });
} else {
  console.log("Console'da hata yok!");
}
```

---

## 🎨 Best Practices

### 1. **Snapshot Kullanımı**
- Her etkileşimden önce snapshot alın
- Element referanslarını snapshot'tan alın
- Snapshot'lar sayfa durumunu yansıtır

### 2. **Bekleme Stratejileri**
- `wait_for` kullanarak dinamik içerik için bekleme yapın
- Sabit `time` kullanımından kaçının
- Text veya element görünürlüğüne göre bekleme yapın

### 3. **Error Handling**
- Her adımda snapshot kontrolü yapın
- Element bulunamazsa alternatif selector'lar deneyin
- Network request'lerini kontrol edin

### 4. **Performance**
- Gereksiz screenshot'lardan kaçının
- Sadece gerekli network request'lerini izleyin
- Tab yönetimini dikkatli yapın (kullanılmayan tab'ları kapatın)

---

## 🔧 Troubleshooting

### Problem: Element bulunamıyor
**Çözüm:**
- Snapshot'ı tekrar alın
- Element'in yüklenmesini bekleyin (`wait_for` kullanın)
- Alternatif selector'lar deneyin

### Problem: Click çalışmıyor
**Çözüm:**
- Element'in görünür olduğundan emin olun
- Element'in tıklanabilir olduğundan emin olun
- Hover yapıp sonra click deneyin

### Problem: Type çalışmıyor
**Çözüm:**
- Input'un focus olduğundan emin olun
- Önce input'a click yapın
- `slowly: true` parametresini deneyin

---

## 📚 İlgili Dokümantasyon

- [Playwright Test Documentation](https://playwright.dev)
- [MCP Protocol Documentation](https://modelcontextprotocol.io)
- [Cursor IDE Browser Extension](https://docs.cursor.com)

---

**Son Güncelleme:** 13 Ocak 2026  
**Durum:** Active Guide
