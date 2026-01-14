"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRight } from "lucide-react"

interface NavItem {
  title: string
  url: string
  icon?: React.ComponentType<{ className?: string }>
  items?: NavItem[]
}

interface NavSecondaryProps {
  items: NavItem[]
  className?: string
}

export function NavSecondary({ items, className }: NavSecondaryProps) {
  const pathname = usePathname()

  return (
    <SidebarGroup className={className}>
      <SidebarGroupLabel>Diğer</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavSecondaryItem key={item.title} item={item} pathname={pathname} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavSecondaryItem({
  item,
  pathname,
}: {
  item: NavItem
  pathname: string
}) {
  const isActive = pathname === item.url
  const hasItems = item.items && item.items.length > 0
  const [open, setOpen] = React.useState(false)

  if (hasItems) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => setOpen(!open)}
          className={cn(
            "w-full justify-between",
            isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            {item.icon && <item.icon className="h-4 w-4" />}
            <span>{item.title}</span>
          </div>
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              open && "rotate-90"
            )}
          />
        </SidebarMenuButton>
        {open && (
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={pathname === subItem.url}
                >
                  <Link href={subItem.url}>
                    {subItem.title}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={item.url}>
          {item.icon && <item.icon className="h-4 w-4" />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
