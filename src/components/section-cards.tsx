"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"

export function SectionCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="text-xs">Total Revenue</CardDescription>
          <CardTitle className="text-xl">$45,231.89</CardTitle>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <IconTrendingUp className="h-3 w-3" />
            <span>+20.1% from last month</span>
          </div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="text-xs">Subscriptions</CardDescription>
          <CardTitle className="text-xl">+2350</CardTitle>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <IconTrendingUp className="h-3 w-3" />
            <span>+180.1% from last month</span>
          </div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="text-xs">Sales</CardDescription>
          <CardTitle className="text-xl">+12,234</CardTitle>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <IconTrendingUp className="h-3 w-3" />
            <span>+19% from last month</span>
          </div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="text-xs">Active Now</CardDescription>
          <CardTitle className="text-xl">+573</CardTitle>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <IconTrendingDown className="h-3 w-3" />
            <span>+201 since last hour</span>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
