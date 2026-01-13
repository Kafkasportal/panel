"use client"

import { useState } from "react"
import { useAuditLogs } from "@/hooks/use-api"
import { AuditLogTable } from "@/components/features/audit-logs/audit-log-table"
import { AuditLogFilters } from "@/components/features/audit-logs/audit-log-filters"
import { PageHeader } from "@/components/shared/page-header"
import type { AuditLogFilters as AuditLogFiltersType } from "@/types"

export default function AuditLogsPage() {
  const [filters, setFilters] = useState<AuditLogFiltersType>({
    page: 1,
    limit: 20,
  })

  const { data, isLoading, isError, refetch } = useAuditLogs(filters)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Sistemdeki tüm değişikliklerin kayıtları"
      />

      <AuditLogFilters filters={filters} onFiltersChange={setFilters} />

      <AuditLogTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        onRefresh={refetch}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
      />
    </div>
  )
}
