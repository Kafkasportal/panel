"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface DocumentItem {
  name: string
  url: string
  icon?: React.ComponentType<{ className?: string }>
}

interface NavDocumentsProps {
  items: DocumentItem[]
}

export function NavDocuments({ items }: NavDocumentsProps) {
  const pathname = usePathname()

  if (!items || items.length === 0) {
    return null
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Dokümanlar</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={isActive}>
                <Link href={item.url}>
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
