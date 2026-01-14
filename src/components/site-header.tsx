"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Map route segments to Turkish page titles
const routeTitles: Record<string, string> = {
  genel: "Genel Bakış",
  bagis: "Bağışlar",
  kumbara: "Kumbara Yönetimi",
  "gelir-gider": "Gelir-Gider",
  raporlar: "Raporlar",
  uyeler: "Üyeler",
  yeni: "Yeni Ekle",
  "sosyal-yardim": "Sosyal Yardım",
  basvurular: "Başvurular",
  odemeler: "Ödemeler",
  istatistikler: "İstatistikler",
  etkinlikler: "Etkinlikler",
  dokumanlar: "Dokümanlar",
  kullanicilar: "Kullanıcılar",
  ayarlar: "Ayarlar",
  yedekleme: "Yedekleme",
  "ihtiyac-sahipleri": "İhtiyaç Sahipleri",
  vezne: "Nakdi Yardım Veznesi",
  "audit-logs": "Audit Logs",
}

// Context-aware list titles based on parent segment
const contextualListTitles: Record<string, string> = {
  uyeler: "Üye Listesi",
  bagis: "Bağış Listesi",
  "sosyal-yardim": "Yardım Listesi",
}

export function SiteHeader() {
  const pathname = usePathname()
  
  // Get page title from pathname
  const getPageTitle = () => {
    if (pathname === "/" || pathname === "/genel") {
      return "Genel Bakış"
    }
    
    const segments = pathname.split("/").filter(Boolean)
    const lastSegment = segments[segments.length - 1]
    
    // Check if last segment is an ID (UUID or numeric)
    const isId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lastSegment) || 
                 /^\d+$/.test(lastSegment) ||
                 lastSegment.length > 20
    
    if (isId && segments.length > 1) {
      // If last segment is an ID, use the previous segment
      const parentSegment = segments[segments.length - 2]
      return routeTitles[parentSegment] || "Detay"
    }
    
    // Handle "liste" segment based on parent context
    if (lastSegment === "liste" && segments.length > 1) {
      const parentSegment = segments[segments.length - 2]
      return contextualListTitles[parentSegment] || "Liste"
    }
    
    return routeTitles[lastSegment] || "Panel"
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{getPageTitle()}</h1>
      </div>
    </header>
  )
}
