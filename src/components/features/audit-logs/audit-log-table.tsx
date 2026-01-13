"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryError } from "@/components/shared/query-error";
import { EmptyState } from "@/components/shared/empty-state";
import { AuditLogDetailDialog } from "./audit-log-detail-dialog";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { RefreshCw, Download, Eye } from "lucide-react";
import type { AuditLog, PaginatedResponse } from "@/types";

interface AuditLogTableProps {
  data?: PaginatedResponse<AuditLog>;
  isLoading: boolean;
  isError: boolean;
  onRefresh: () => void;
  onPageChange: (page: number) => void;
}

const ACTION_COLORS = {
  INSERT: "bg-green-500/10 text-green-700 dark:text-green-400",
  UPDATE: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  DELETE: "bg-red-500/10 text-red-700 dark:text-red-400",
} as const;

export function AuditLogTable({
  data,
  isLoading,
  isError,
  onRefresh,
  onPageChange,
}: AuditLogTableProps) {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  if (isError) {
    return <QueryError title="Audit loglar yüklenemedi" onRetry={onRefresh} />;
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <EmptyState
        title="Audit log bulunamadı"
        description="Henüz hiçbir değişiklik kaydı yok"
      />
    );
  }

  const exportToCSV = () => {
    if (!data?.data) return;

    const headers = [
      "ID",
      "Tarih",
      "Kullanıcı",
      "İşlem",
      "Tablo",
      "Kayıt ID",
      "IP Adresi",
    ];
    const rows = data.data.map((log) => [
      log.id,
      format(log.createdAt, "yyyy-MM-dd HH:mm:ss", { locale: tr }),
      log.user?.name || log.userId || "Bilinmiyor",
      log.action,
      log.tableName,
      log.recordId,
      log.ipAddress || "-",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `audit-logs-${format(new Date(), "yyyy-MM-dd")}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Audit Logs</h3>
            <p className="text-sm text-muted-foreground">
              Toplam {data.total} kayıt
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Dışa Aktar
            </Button>
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Yenile
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarih</TableHead>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>İşlem</TableHead>
                <TableHead>Tablo</TableHead>
                <TableHead>Kayıt ID</TableHead>
                <TableHead>IP Adresi</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {format(log.createdAt, "dd MMM yyyy HH:mm", {
                      locale: tr,
                    })}
                  </TableCell>
                  <TableCell>
                    {log.user ? (
                      <div>
                        <div className="font-medium">{log.user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {log.user.email}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        {log.userId || "Bilinmiyor"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={ACTION_COLORS[log.action]}
                      variant="outline"
                    >
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {log.tableName}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {log.recordId}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {log.ipAddress || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                      aria-label={`${log.action} işlem detaylarını görüntüle`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {data.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Sayfa {data.page} / {data.totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={data.page === 1}
                onClick={() => onPageChange(data.page - 1)}
              >
                Önceki
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={data.page === data.totalPages}
                onClick={() => onPageChange(data.page + 1)}
              >
                Sonraki
              </Button>
            </div>
          </div>
        )}
      </Card>

      {selectedLog && (
        <AuditLogDetailDialog
          log={selectedLog}
          open={!!selectedLog}
          onOpenChange={(open) => !open && setSelectedLog(null)}
        />
      )}
    </>
  );
}
