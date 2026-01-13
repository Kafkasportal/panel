# MCP (Model Context Protocol) Rehberi

## 📖 MCP Nedir?

MCP (Model Context Protocol), AI asistanlarının harici araçlara ve veri kaynaklarına erişmesini sağlayan bir protokoldür. Cursor IDE'de MCP server'lar sayesinde AI, GitHub, Vercel, veritabanları ve diğer servislere bağlanabilir.

---

## 🔧 Mevcut MCP Server'lar

Projenizde şu MCP server'lar aktif:

### 1. **newradar** - GitHub & Tool Discovery
- GitHub repository yönetimi
- Pull request ve issue yönetimi
- Yeni araçlar keşfetme (radar_search)
- Dosya oluşturma/güncelleme/silme

**Kullanım Örnekleri:**
- GitHub repository'lerde değişiklik yapma
- Pull request oluşturma/merge etme
- Yeni araçlar keşfetme

### 2. **byterover** - Knowledge Management
- Bilgi depolama (store-knowledge)
- Bilgi erişimi (retrieve-knowledge)
- Proje hafızası yönetimi

**Kullanım Örnekleri:**
- Önemli kod pattern'lerini kaydetme
- Hata çözümlerini saklama
- Proje bilgilerini organize etme

### 3. **vercel** - Deployment Management
- Vercel projelerini yönetme
- Deployment oluşturma/izleme
- Environment variable yönetimi
- Domain kontrolü

**Kullanım Örnekleri:**
- Projeyi Vercel'e deploy etme
- Deployment loglarını görüntüleme
- Environment variable'ları kontrol etme

### 4. **cursor-ide-browser** - Web Browsing
- Web sayfalarını tarama
- Sayfa etkileşimleri (click, type, hover)
- Screenshot alma
- Network request'leri izleme

**Detaylı Rehber:** [CURSOR_BROWSER_MCP_GUIDE.md](./CURSOR_BROWSER_MCP_GUIDE.md)

**Kullanım Örnekleri:**
- Frontend geliştirme testleri
- E2E test senaryoları
- Web sayfası analizi
- Responsive tasarım testleri

**Kullanım Örnekleri:**
- Web uygulamasını test etme
- Frontend geliştirme sırasında test
- Web sayfalarını analiz etme

---

## 🆕 Yeni MCP Server Oluşturma

### Adım 1: MCP Server Yapısı

Yeni bir MCP server oluşturmak için:

```typescript
// mcp-server-example/src/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  {
    name: "my-custom-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Tool tanımlama
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "my-tool",
      description: "My custom tool description",
      inputSchema: {
        type: "object",
        properties: {
          input: {
            type: "string",
            description: "Input parameter",
          },
        },
        required: ["input"],
      },
    },
  ],
}));

// Tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "my-tool") {
    const { input } = request.params.arguments as { input: string };
    return {
      content: [
        {
          type: "text",
          text: `Processed: ${input}`,
        },
      ],
    };
  }
  throw new Error(`Unknown tool: ${request.params.name}`);
});

// Server başlatma
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP server running on stdio");
}

main().catch(console.error);
```

### Adım 2: Package.json Oluşturma

```json
{
  "name": "my-custom-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

### Adım 3: Cursor'da Yapılandırma

Cursor Settings'de (`Ctrl + ,`) MCP bölümüne gidin ve yeni server'ı ekleyin:

```json
{
  "mcpServers": {
    "my-custom-server": {
      "command": "node",
      "args": ["path/to/mcp-server-example/dist/index.js"],
      "env": {
        "API_KEY": "your-api-key"
      }
    }
  }
}
```

---

## 🎯 MCP Server Kullanım Senaryoları

### Senaryo 1: Supabase MCP Server
Supabase veritabanı işlemlerini MCP üzerinden yönetmek için:

```typescript
// Supabase MCP Server örneği
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "query-database") {
    const { table, filters } = request.params.arguments;
    // Supabase query logic
    const result = await supabase.from(table).select("*").match(filters);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
});
```

### Senaryo 2: Email Service MCP Server
Email gönderme işlemleri için:

```typescript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "send-email") {
    const { to, subject, body } = request.params.arguments;
    await emailService.send({ to, subject, body });
    return { content: [{ type: "text", text: "Email sent successfully" }] };
  }
});
```

### Senaryo 3: File System MCP Server
Dosya sistemi işlemleri için:

```typescript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "read-file") {
    const { path } = request.params.arguments;
    const content = await fs.readFile(path, "utf-8");
    return { content: [{ type: "text", text: content }] };
  }
});
```

---

## 🔍 Mevcut MCP Araçlarını Kullanma

### GitHub İşlemleri (newradar)

GitHub işlemleri için `newradar` MCP server'ı kullanılır. Tool'lar `radar_search` ile keşfedilir ve `radar_execute_tool` ile çalıştırılır.

#### 1. Repository İşlemleri

```typescript
// Yeni repository oluşturma
await mcp_newradar_radar_execute_tool({
  tool_name: "create_repository",
  arguments: {
    name: "my-new-repo",
    description: "Repository açıklaması",
    private: false,
    autoInit: true, // README ile başlat
  },
});
```

#### 2. Dosya İşlemleri

```typescript
// Dosya oluşturma veya güncelleme
await mcp_newradar_radar_execute_tool({
  tool_name: "create_or_update_file",
  arguments: {
    owner: "Kafkasportal",
    repo: "panel",
    path: "src/components/new-component.tsx",
    content: Buffer.from("// Component code").toString("base64"), // Base64 encoded
    message: "Add new component",
    branch: "main",
    // sha: "file-sha-for-updates" // Güncelleme için gerekli
  },
});

// Dosya silme
await mcp_newradar_radar_execute_tool({
  tool_name: "delete_file",
  arguments: {
    owner: "Kafkasportal",
    repo: "panel",
    path: "src/components/old-component.tsx",
    message: "Remove old component",
    branch: "main",
  },
});
```

#### 3. Pull Request İşlemleri

```typescript
// Pull request listeleme
await mcp_newradar_radar_execute_tool({
  tool_name: "list_pull_requests",
  arguments: {
    owner: "Kafkasportal",
    repo: "panel",
    state: "open", // "open" | "closed" | "all"
    sort: "created", // "created" | "updated" | "popularity" | "long-running"
    direction: "desc",
    base: "main",
    head: "feature-branch",
    page: 1,
    perPage: 10,
  },
});

// Pull request detayları
await mcp_newradar_radar_execute_tool({
  tool_name: "get_pull_request",
  arguments: {
    owner: "Kafkasportal",
    repo: "panel",
    pullNumber: 123,
  },
});

// Pull request güncelleme
await mcp_newradar_radar_execute_tool({
  tool_name: "update_pull_request",
  arguments: {
    owner: "Kafkasportal",
    repo: "panel",
    pullNumber: 123,
    title: "Updated PR title",
    body: "Updated description",
    state: "open", // "open" | "closed"
    base: "main",
    maintainer_can_modify: true,
  },
});

// Pull request branch güncelleme (base branch ile sync)
await mcp_newradar_radar_execute_tool({
  tool_name: "update_pull_request_branch",
  arguments: {
    owner: "Kafkasportal",
    repo: "panel",
    pullNumber: 123,
    expectedHeadSha: "commit-sha",
  },
});

// Pull request'teki değişen dosyalar
await mcp_newradar_radar_execute_tool({
  tool_name: "get_pull_request_files",
  arguments: {
    owner: "Kafkasportal",
    repo: "panel",
    pullNumber: 123,
  },
});
```

#### 4. Tool Keşfetme

```typescript
// Yeni GitHub tool'ları keşfetme
await mcp_newradar_radar_search({
  query: "GitHub create issue comment review",
  max_results: 10,
  min_relevance: 0.5,
});

// Keşfedilen tool'u çalıştırma
await mcp_newradar_radar_execute_tool({
  tool_name: "discovered_tool_name",
  arguments: {
    // Tool'a özel parametreler
  },
});
```

#### Önemli Notlar

1. **Base64 Encoding**: Dosya içeriği Base64 formatında gönderilmelidir
2. **SHA Gereksinimi**: Dosya güncellemeleri için mevcut dosyanın SHA'sı gerekir
3. **Authentication**: GitHub token'ı MCP server yapılandırmasında olmalıdır
4. **Rate Limiting**: GitHub API rate limit'lerine dikkat edin

### Vercel Deployment (vercel)

```typescript
// Deployment oluşturma
await mcp_vercel_deploy_to_vercel();

// Deployment loglarını görüntüleme
await mcp_vercel_get_deployment_build_logs({
  idOrUrl: "deployment-url",
  teamId: "team-id",
});
```

### Knowledge Management (byterover)

```typescript
// Bilgi kaydetme
await mcp_byterover_store_knowledge({
  messages: "Important pattern: Use Zustand for state management",
});

// Bilgi erişimi
await mcp_byterover_retrieve_knowledge({
  query: "state management patterns",
  limit: 5,
});
```

---

## 🛠️ MCP Server Geliştirme Best Practices

### 1. Error Handling
```typescript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    // Tool logic
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});
```

### 2. Input Validation
```typescript
import { z } from "zod";

const toolInputSchema = z.object({
  input: z.string().min(1),
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const validation = toolInputSchema.safeParse(request.params.arguments);
  if (!validation.success) {
    throw new Error(`Invalid input: ${validation.error.message}`);
  }
  // Process validated input
});
```

### 3. Logging
```typescript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  console.error(`[MCP] Tool called: ${request.params.name}`);
  const startTime = Date.now();
  
  // Tool logic
  
  console.error(`[MCP] Tool completed in ${Date.now() - startTime}ms`);
});
```

### 4. Resource Management
```typescript
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: "file:///path/to/resource",
      name: "Resource Name",
      description: "Resource description",
      mimeType: "text/plain",
    },
  ],
}));
```

---

## 📚 Örnek MCP Server Projeleri

### 1. Database MCP Server
- Veritabanı sorguları
- Migration yönetimi
- Backup/restore işlemleri

### 2. API Testing MCP Server
- API endpoint testleri
- Request/response validation
- Performance monitoring

### 3. Code Analysis MCP Server
- Code quality checks
- Security scanning
- Dependency analysis

---

## 🔗 Faydalı Kaynaklar

- [MCP Documentation](https://modelcontextprotocol.io)
- [MCP SDK GitHub](https://github.com/modelcontextprotocol/servers)
- [Cursor MCP Guide](https://docs.cursor.com/mcp)

---

## ❓ Sık Sorulan Sorular

### MCP Server neden çalışmıyor?
- Cursor'ı yeniden başlatın
- MCP configuration'ı kontrol edin
- Log dosyalarını inceleyin (`%APPDATA%\Cursor\logs\`)

### Yeni bir tool nasıl eklerim?
- MCP server kodunda yeni tool tanımlayın
- `ListToolsRequestSchema` handler'ına ekleyin
- `CallToolRequestSchema` handler'ında implement edin

### MCP Server'ı nasıl test ederim?
- Cursor'da MCP tools'u kullanarak test edin
- Console log'ları kontrol edin
- Error handling'i test edin

---

**Son Güncelleme:** 13 Ocak 2026  
**Durum:** Active Guide
