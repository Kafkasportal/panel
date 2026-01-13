# MCP Server Kırmızı Hata Işığı - Sorun Giderme Rehberi

## 🔴 Sorun: MCP Server Açıkken Bir Süre Sonra Kırmızı Hata Işığı Yanıyor

### Olası Nedenler ve Çözümler

---

## 1. Connection Timeout (Bağlantı Zaman Aşımı)

### Belirtiler:
- Server bir süre sonra bağlantıyı kesiyor
- Kırmızı ışık yanıyor
- Yeniden bağlanma gerekiyor

### Çözüm:

**MCP Server Timeout Ayarları:**
```json
{
  "mcpServers": {
    "newradar": {
      "command": "node",
      "args": ["path/to/server.js"],
      "env": {
        "MCP_TIMEOUT": "300000",  // 5 dakika (ms)
        "MCP_KEEP_ALIVE": "true"
      }
    }
  }
}
```

**Cursor Settings:**
1. `Ctrl + ,` (Settings)
2. "MCP" ara
3. Timeout değerini artır (varsayılan: 30s → 300s)

---

## 2. Memory Leak (Bellek Sızıntısı)

### Belirtiler:
- Node process'leri çok fazla memory kullanıyor
- CPU kullanımı yüksek
- Sistem yavaşlıyor

### Tespit:
```powershell
# Memory kullanımını kontrol et
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | 
  Select-Object ProcessName, @{Name="Memory(MB)";Expression={[math]::Round($_.WorkingSet/1MB,2)}} | 
  Sort-Object "Memory(MB)" -Descending
```

### Çözüm:

**1. MCP Server Restart:**
- Cursor'ı kapat ve yeniden aç
- MCP server'ları yeniden başlat

**2. Node Process Temizleme:**
```powershell
# Tüm Node process'lerini kapat (dikkatli!)
Get-Process node | Stop-Process -Force
```

**3. Memory Limit Ayarla:**
```json
{
  "mcpServers": {
    "newradar": {
      "command": "node",
      "args": ["--max-old-space-size=4096", "path/to/server.js"]
    }
  }
}
```

---

## 3. Rate Limiting / Too Many Requests

### Belirtiler:
- Çok fazla istek gönderiliyor
- API rate limit aşılıyor
- 429 (Too Many Requests) hatası

### Çözüm:

**1. Request Throttling:**
```typescript
// MCP server'da rate limiting ekle
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 1000 // 1 saniye

function throttleRequest() {
  const now = Date.now()
  if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
    throw new Error("Rate limit: Please wait before next request")
  }
  lastRequestTime = now
}
```

**2. Batch Requests:**
- Birden fazla isteği tek seferde gönder
- Sequential thinking'i daha az kullan

---

## 4. Authentication Token Expiry

### Belirtiler:
- Token süresi doluyor
- "Unauthorized" hatası
- Belirli bir süre sonra hata

### Çözüm:

**1. Token Refresh:**
```typescript
// Token'ı otomatik yenile
let tokenExpiry = Date.now() + (60 * 60 * 1000) // 1 saat

function refreshTokenIfNeeded() {
  if (Date.now() >= tokenExpiry - 60000) { // 1 dakika önce
    // Token'ı yenile
    refreshToken()
  }
}
```

**2. Long-Lived Tokens:**
- MCP server için long-lived token kullan
- Token expiry süresini artır

---

## 5. Network Issues (Ağ Sorunları)

### Belirtiler:
- İnternet bağlantısı kopuyor
- DNS çözümleme hatası
- Timeout errors

### Çözüm:

**1. Connection Retry Logic:**
```typescript
async function connectWithRetry(maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await connect()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await sleep(1000 * (i + 1)) // Exponential backoff
    }
  }
}
```

**2. Health Check:**
```typescript
// Periyodik health check
setInterval(async () => {
  try {
    await pingServer()
  } catch (error) {
    console.error("MCP Server health check failed:", error)
    // Reconnect logic
  }
}, 30000) // Her 30 saniyede bir
```

---

## 6. MCP Server Crash

### Belirtiler:
- Server aniden kapanıyor
- Error logs'da exception'lar
- Process ölüyor

### Çözüm:

**1. Error Handling:**
```typescript
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  // Graceful shutdown
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason)
  // Log and continue
})
```

**2. Auto-Restart:**
```json
{
  "mcpServers": {
    "newradar": {
      "command": "node",
      "args": ["path/to/server.js"],
      "restart": true,
      "restartDelay": 5000
    }
  }
}
```

---

## 7. NewRadar MCP Specific Issues

### Deprecation Notice:
NewRadar MCP'de bazı araçlar deprecated olabilir:
```
⚠️ DEPRECATION NOTICE: This service will be shut down on January 31, 2026
```

### Çözüm:

**1. Alternative Tools:**
- Deprecated araçları kullanmayı bırak
- Alternatif MCP server'ları kullan

**2. Update MCP Server:**
```bash
npm update @modelcontextprotocol/server-newradar
```

---

## 🔧 Genel Sorun Giderme Adımları

### Adım 1: Log Kontrolü
```powershell
# Cursor log dosyalarını kontrol et
Get-Content "$env:APPDATA\Cursor\logs\*.log" -Tail 50
```

### Adım 2: MCP Server Status
1. Cursor Settings → MCP
2. Server status'u kontrol et
3. "Restart Server" butonuna tıkla

### Adım 3: Connection Test
```typescript
// Basit connection test
try {
  const result = await mcpServer.ping()
  console.log("MCP Server is alive:", result)
} catch (error) {
  console.error("MCP Server connection failed:", error)
}
```

### Adım 4: Resource Cleanup
```powershell
# Kullanılmayan Node process'lerini temizle
Get-Process node | Where-Object {$_.CPU -eq 0} | Stop-Process
```

---

## 📊 Monitoring ve Debugging

### Health Check Script:
```typescript
// mcp-health-check.ts
async function checkMCPHealth() {
  const checks = {
    connection: false,
    memory: process.memoryUsage().heapUsed < 500 * 1024 * 1024, // < 500MB
    cpu: process.cpuUsage().user < 1000000, // < 1s
    uptime: process.uptime() > 60, // > 1 minute
  }
  
  return {
    healthy: Object.values(checks).every(v => v),
    checks,
    timestamp: new Date().toISOString()
  }
}
```

### Logging:
```typescript
// Detaylı logging ekle
console.log('[MCP]', {
  timestamp: new Date().toISOString(),
  action: 'request',
  tool: toolName,
  duration: Date.now() - startTime
})
```

---

## ✅ Hızlı Çözümler

### 1. Cursor'ı Yeniden Başlat
- En basit çözüm
- MCP server'ları otomatik yeniden başlar

### 2. MCP Server'ı Manuel Restart
- Settings → MCP → Restart Server

### 3. Node Process'lerini Temizle
```powershell
Get-Process node | Stop-Process -Force
# Sonra Cursor'ı yeniden başlat
```

### 4. MCP Configuration Kontrol
- `~/.cursor/mcp.json` dosyasını kontrol et
- Syntax hatalarını düzelt

---

## 🎯 Önleyici Tedbirler

1. **Regular Restarts:** Cursor'ı günde bir kez yeniden başlat
2. **Memory Monitoring:** Yüksek memory kullanımını izle
3. **Error Logging:** Hataları logla ve analiz et
4. **Connection Pooling:** MCP server için connection pool kullan
5. **Timeout Configuration:** Uygun timeout değerleri ayarla

---

## 📞 Destek

Eğer sorun devam ediyorsa:

1. **Cursor Logs:** `%APPDATA%\Cursor\logs\`
2. **MCP Server Logs:** MCP server'ın kendi log dosyaları
3. **GitHub Issues:** Cursor veya MCP server GitHub repo'larına issue aç

---

**Son Güncelleme:** 13 Ocak 2026  
**Durum:** Active Troubleshooting Guide
