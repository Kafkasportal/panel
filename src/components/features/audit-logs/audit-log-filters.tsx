"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { AuditLogFilters, AuditAction } from "@/types"
import { Search, X } from "lucide-react"

interface AuditLogFiltersProps {
  filters: AuditLogFilters
  onFiltersChange: (filters: AuditLogFilters) => void
}

const TABLE_NAMES = [
  "members",
  "donations",
  "beneficiaries",
  "social_aid_applications",
  "payments",
  "kumbaras",
  "documents",
  "users",
] as const

const ACTIONS: AuditAction[] = ["INSERT", "UPDATE", "DELETE"]

export function AuditLogFilters({
  filters,
  onFiltersChange,
}: AuditLogFiltersProps) {
  const handleFilterChange = (
    key: keyof AuditLogFilters,
    value: string | undefined
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
      page: 1, // Reset to first page when filters change
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      page: 1,
      limit: 20,
    })
  }

  const hasActiveFilters =
    filters.userId ||
    filters.tableName ||
    filters.action ||
    filters.startDate ||
    filters.endDate ||
    filters.search

  return (
    <Card className="p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="search">Ara</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Tablo, kayıt ID..."
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tableName">Tablo</Label>
          <Select
            value={filters.tableName || ""}
            onValueChange={(value) =>
              handleFilterChange("tableName", value || undefined)
            }
          >
            <SelectTrigger id="tableName">
              <SelectValue placeholder="Tüm tablolar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tüm tablolar</SelectItem>
              {TABLE_NAMES.map((table) => (
                <SelectItem key={table} value={table}>
                  {table}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="action">İşlem</Label>
          <Select
            value={filters.action || ""}
            onValueChange={(value) =>
              handleFilterChange("action", value as AuditAction | undefined)
            }
          >
            <SelectTrigger id="action">
              <SelectValue placeholder="Tüm işlemler" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tüm işlemler</SelectItem>
              {ACTIONS.map((action) => (
                <SelectItem key={action} value={action}>
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="userId">Kullanıcı ID</Label>
          <Input
            id="userId"
            placeholder="Kullanıcı ID..."
            value={filters.userId || ""}
            onChange={(e) => handleFilterChange("userId", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Başlangıç Tarihi</Label>
          <Input
            id="startDate"
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Bitiş Tarihi</Label>
          <Input
            id="endDate"
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
          />
        </div>

        {hasActiveFilters && (
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full"
            >
              <X className="mr-2 h-4 w-4" />
              Filtreleri Temizle
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
