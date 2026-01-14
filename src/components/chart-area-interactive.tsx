'use client'

import { useEffect, useState } from 'react'
import type { ComponentType } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from '@/components/shared/lazy-chart'
import { formatCurrency } from '@/lib/utils'
import { useDashboardStats } from '@/hooks/use-api'
import { Skeleton } from '@/components/ui/skeleton'

export function ChartAreaInteractive() {
  const [isMounted, setIsMounted] = useState(false)
  const { data: stats, isLoading } = useDashboardStats()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true)
    }, 300)

    const handleResize = () => {
      setIsMounted(true)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Monthly donations data from stats
  const monthlyData = stats?.monthlyDonations || []

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aylık Bağış Trendi</CardTitle>
          <CardDescription>
            Aylık bağış miktarlarının zaman içindeki değişimi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aylık Bağış Trendi</CardTitle>
        <CardDescription>
          Aylık bağış miktarlarının zaman içindeki değişimi
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {!isMounted ? (
          <Skeleton className="h-[350px] w-full rounded-lg" />
        ) : monthlyData.length > 0 ? (
          <div className="w-full" style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient
                    id="colorDonations"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.5}
                />
                {(() => {
                  const TypedXAxis = XAxis as ComponentType<Record<string, unknown>>
                  return (
                    <TypedXAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      fontWeight={500}
                    />
                  )
                })()}
                {(() => {
                  const TypedYAxis = YAxis as ComponentType<Record<string, unknown>>
                  return (
                    <TypedYAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      fontWeight={500}
                      tickFormatter={(value: number) =>
                        `₺${(value / 1000).toFixed(0)}K`
                      }
                    />
                  )
                })()}
                {(() => {
                  const TypedTooltip = Tooltip as ComponentType<Record<string, unknown>>
                  return (
                    <TypedTooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'calc(var(--radius) - 2px)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        padding: '8px 12px',
                      }}
                      labelStyle={{
                        color: 'hsl(var(--foreground))',
                        fontWeight: 500,
                        marginBottom: '4px',
                      }}
                      itemStyle={{
                        color: 'hsl(var(--foreground))',
                      }}
                      formatter={(value: unknown) => {
                        const numValue = typeof value === 'number' ? value : 0
                        return [formatCurrency(numValue), 'Tutar'] as const
                      }}
                    />
                  )
                })()}
                {(() => {
                  const TypedArea = Area as ComponentType<Record<string, unknown>>
                  return (
                    <TypedArea
                      type="monotone"
                      dataKey="amount"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorDonations)"
                    />
                  )
                })()}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[350px] items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Henüz veri yok
              </p>
              <p className="text-xs mt-1 text-muted-foreground/80">
                Bağış kayıtları eklendikçe grafik burada görünecek
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
