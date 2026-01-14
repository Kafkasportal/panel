"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileDescription,
  IconFolder,
  IconInnerShadowTop,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Admin",
    email: "admin@kafkasder.org",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Genel Bakış",
      url: "/genel",
      icon: IconDashboard,
    },
    {
      title: "Üyeler",
      url: "/uyeler",
      icon: IconUsers,
      items: [
        {
          title: "Tüm Üyeler",
          url: "/uyeler",
        },
        {
          title: "Üye Listesi",
          url: "/uyeler/liste",
        },
        {
          title: "Yeni Üye Ekle",
          url: "/uyeler/yeni",
        },
      ],
    },
    {
      title: "Sosyal Yardım",
      url: "/sosyal-yardim",
      icon: IconChartBar,
      items: [
        {
          title: "Yardım Başvuruları",
          url: "/sosyal-yardim/basvurular",
        },
        {
          title: "İhtiyaç Sahipleri",
          url: "/sosyal-yardim/ihtiyac-sahipleri",
        },
        {
          title: "Nakdi Yardım Veznesi",
          url: "/sosyal-yardim/vezne",
        },
        {
          title: "Banka Ödeme Emirleri",
          url: "/sosyal-yardim/odemeler",
        },
        {
          title: "İstatistikler",
          url: "/sosyal-yardim/istatistikler",
        },
      ],
    },
    {
      title: "Bağışlar",
      url: "/bagis",
      icon: IconFileDescription,
      items: [
        {
          title: "Bağış Listesi",
          url: "/bagis/liste",
        },
        {
          title: "Kumbara Yönetimi",
          url: "/bagis/kumbara",
        },
        {
          title: "Gelir-Gider",
          url: "/bagis/gelir-gider",
        },
        {
          title: "Raporlar",
          url: "/bagis/raporlar",
        },
      ],
    },
    {
      title: "Etkinlikler",
      url: "/etkinlikler",
      icon: IconCamera,
    },
    {
      title: "Dokümanlar",
      url: "/dokumanlar",
      icon: IconFolder,
    },
  ],
  navSecondary: [
    {
      title: "Ayarlar",
      url: "/ayarlar",
      icon: IconSettings,
      items: [
        {
          title: "Genel Ayarlar",
          url: "/ayarlar",
        },
        {
          title: "Audit Logs",
          url: "/ayarlar/audit-logs",
        },
      ],
    },
    {
      title: "Kullanıcılar",
      url: "/kullanicilar",
      icon: IconUsers,
    },
    {
      title: "Yedekleme",
      url: "/yedekleme",
      icon: IconDatabase,
    },
  ],
  documents: [
    {
      name: "Bağış Raporları",
      url: "/bagis/raporlar",
      icon: IconFileDescription,
    },
    {
      name: "Dokümanlar",
      url: "/dokumanlar",
      icon: IconFolder,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Kafkasder Panel</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
