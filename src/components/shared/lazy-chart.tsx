'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
// Type assertions are necessary for recharts components with next/dynamic
// due to incompatible defaultProps types between recharts and next/dynamic

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import { ComponentType } from 'react'

// Recharts componentlerini lazy load et
export const ResponsiveContainer = dynamic(
    () => import('recharts').then(mod => mod.ResponsiveContainer),
    {
        ssr: false,
        loading: () => (
            <div className="h-full w-full flex items-center justify-center">
                <Skeleton className="h-full w-full" />
            </div>
        )
    }
)

export const PieChart = dynamic(
    () => import('recharts').then(mod => mod.PieChart),
    { ssr: false }
)

export const Pie = dynamic(
    () => import('recharts').then(mod => mod.Pie as unknown as ComponentType<Record<string, unknown>>),
    { ssr: false }
)

export const Cell = dynamic(
    () => import('recharts').then(mod => mod.Cell),
    { ssr: false }
)

export const Tooltip = dynamic(
    () => import('recharts').then(mod => mod.Tooltip as unknown as ComponentType<Record<string, unknown>>),
    { ssr: false }
)

export const BarChart = dynamic(
    () => import('recharts').then(mod => mod.BarChart),
    { ssr: false }
)

export const Bar = dynamic(
    () => import('recharts').then(mod => mod.Bar as any),
    { ssr: false }
)

export const XAxis = dynamic(
    () => import('recharts').then(mod => mod.XAxis as any),
    { ssr: false }
)

export const YAxis = dynamic(
    () => import('recharts').then(mod => mod.YAxis as any),
    { ssr: false }
)

export const CartesianGrid = dynamic(
    () => import('recharts').then(mod => mod.CartesianGrid),
    { ssr: false }
)

export const LineChart = dynamic(
    () => import('recharts').then(mod => mod.LineChart),
    { ssr: false }
)

export const Line = dynamic(
    () => import('recharts').then(mod => mod.Line as any),
    { ssr: false }
)

export const Legend = dynamic(
    () => import('recharts').then(mod => mod.Legend as any),
    { ssr: false }
)

export const AreaChart = dynamic(
    () => import('recharts').then(mod => mod.AreaChart),
    { ssr: false }
)

export const Area = dynamic(
    () => import('recharts').then(mod => mod.Area as any),
    { ssr: false }
)
